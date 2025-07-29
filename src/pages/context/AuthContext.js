import React, { useContext, useState, useEffect } from "react";
import { getAuth,signOut, sendPasswordResetEmail } from 'firebase/auth';
import LoadingModal from '../LoadingModal'; // Adjust the path as needed
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase"

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const history = useNavigate();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [userlogindetails, setUserLoginDetails] = useState(JSON.parse(localStorage.getItem('userLoginDetails')));
  const [loading, setLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [authOperation, setAuthOperation] = useState(null); // Track auth operation

  const auth = getAuth();

   const signup = async (email, password) => {
    // Create a new user without affecting the current user state
    setAuthOperation('signup');
    setAuthOperation(null);
   }
  

  const login = async (email, password) => {
    try {
      setIsModalLoading(true);
      setAuthOperation('login');
  
      // Send login request to the server
      const response = await fetch(`${SERVERSIDEURL}/MoDumbels/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { user, userDetails } = data;
        setCurrentUser(user);
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
  
        setUserLoginDetails(userDetails);
        localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
      } else {
        console.log(data.message); // Handle server-side errors
      }
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsModalLoading(false);
      setAuthOperation(null);
    }
  };

  const logout = async () => {
    setAuthOperation('logout');
    
    try {
      await signOut(auth);
      // Clear state and local storage
      setUserLoginDetails(null);
      setCurrentUser(null);
      localStorage.removeItem('userLoginDetails');
      localStorage.removeItem('currentUser');
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Log the role if needed
      if (!userlogindetails) {
        console.log('User details cleared.');
      } else {
        console.log('User role after logout:', userlogindetails.role);
      }
      
      // Redirect to login
      history('/');
      setAuthOperation(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };


  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       if (authOperation === 'login' || authOperation === 'logout') {
  //         setCurrentUser(user);
  //         console.log(user);
  //         const email = user.email;
  //         const db = getFirestore();
  //         localStorage.setItem('currentUser', JSON.stringify(user));

  //         const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
  //         const querySnapshot = await getDocs(userDetailsQuery);

  //         const customerDetailsQuery = query(collection(db, 'customers'), where('email', '==', email));
  //         const querySnapshot1 = await getDocs(customerDetailsQuery);

  //         if (!querySnapshot.empty) {
  //           const userDetails = querySnapshot.docs[0].data();
  //           setUserLoginDetails(userDetails);
  //           localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
  //         } else if (!querySnapshot1.empty) {
  //           const customerDetails = querySnapshot1.docs[0].data();
  //           setUserLoginDetails(customerDetails);
  //           localStorage.setItem('userLoginDetails', JSON.stringify(customerDetails));
  //         } else {
  //           console.log('No user details found for email:', email);
  //           return null;
  //         }
  //       }
  //     } else {
  //       if (authOperation === 'logout') {
  //         setCurrentUser(null);
  //         setUserLoginDetails(null);
  //         localStorage.removeItem('currentUser');
  //         localStorage.removeItem('userLoginDetails');
  //       }
  //     }
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, [authOperation,auth]);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user && (authOperation === 'login' || authOperation === 'logout')) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));

      try {
        const res = await fetch(`${SERVERSIDEURL}/MoDumbels/getUserDetails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });

        const userDetails = await res.json();
        setUserLoginDetails(userDetails);
        localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
      } catch (err) {
        console.error("Failed to fetch user details from server:", err);
      }

    } else if (!user && authOperation === 'logout') {
      setCurrentUser(null);
      setUserLoginDetails(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userLoginDetails');
    }

    setLoading(false);
  });

  return unsubscribe;
}, [authOperation]);

  const value = {
    signup,
    currentUser,
    userlogindetails,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      <LoadingModal show={isModalLoading} />
      {!loading && children}
    </AuthContext.Provider>
  );
}


