// import React, { useContext, useState, useEffect } from "react"
// import { auth,firestore } from "../firebase"

// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
//    updateEmail,updatePassword,signOut ,sendPasswordResetEmail} from 'firebase/auth';
//    import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
//    import LoadingModal from '../pages/LoadingModal'; // Adjust the path as needed


// import { useNavigate } from "react-router-dom";


// //the cod in get hub is before starting users role!



// const AuthContext = React.createContext()
// export function useAuth() {
//   return useContext(AuthContext)
// }

// export function AuthProvider({ children }) {
//   const history =useNavigate()
//   const [currentUser, setCurrentUser] = useState()
//   const [userlogindetails,setUserLoginDetails]=useState()
//   const [loading, setLoading] = useState(true)
//   const [isModalLoading, setIsModalLoading] = useState(false);
//   const auth = getAuth();

//   const signup = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);

//   };

//   async function login(email, password) {
//     const db = getFirestore();
//     try {
//       // Start the loading state
//       setIsModalLoading(true);
  
//       // Sign in the user
//       await signInWithEmailAndPassword(auth, email, password);

//       // After successful login, retrieve additional user details based on their email
//       const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
//       const querySnapshot = await getDocs(userDetailsQuery);
  
//       if (!querySnapshot.empty) {
//         // Extract user details from the first document in the query snapshot
//         const userDetails = querySnapshot.docs[0].data();
//         setUserLoginDetails(userDetails);
//         localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
//       } else {
//         console.log('No user details found for email:', email);
//         return null;
//       }
//     } catch (error) {
//       console.error('Error signing in:', error);
//       throw error; // Re-throw the error for handling in the component
//     } finally {
//       // Ensure loading state is stopped in both success and error cases
//       setIsModalLoading(false);
//     }
//   }

//   const logout = () => {
//     return signOut(auth).then(() => {
//       setUserLoginDetails(null);
//       localStorage.removeItem('userLoginDetails');
//       history('/login');
//     });
//   };

//   const resetPassword=(email)=>{
//     return sendPasswordResetEmail(auth,email);
//   };

//   const updateprofileEmail = (email)=>{
//     return updateEmail(auth,email);
//   };
//   const updateprofilePassword = (user, password) => {
//     return updatePassword(user, password);
//   };
  


//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         // Check if the user is already logged in and not signing up
//         //console.log(user.uid)
//        // console.log(currentUser.uid)
//         if (user.uid !== currentUser?.uid) {
//           // User is logging in
//           setCurrentUser(user);
//           setIsModalLoading(true);
          
//           const email = user.email;
//           const db = getFirestore();
//           const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
//           const querySnapshot = await getDocs(userDetailsQuery);
  
//           if (!querySnapshot.empty) {
//             const userDetails = querySnapshot.docs[0].data();
//             setUserLoginDetails(userDetails);
//             localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
//           }
          
//           setIsModalLoading(false);
//         }
//       }
//       setLoading(false);
//     });
  
//     return unsubscribe;
//   }, [auth, currentUser]);
  

//   const value = {
//     currentUser,
//     userlogindetails,
//     signup,
//     login,
//     logout,
//     resetPassword,
//     updateprofileEmail,
//     updateprofilePassword,

//   }

//   return (
//     <AuthContext.Provider value={value}>
//     <LoadingModal show={isModalLoading} />
//     {!loading && children}
//   </AuthContext.Provider>
// );
// }


// import React, { useContext, useState, useEffect } from "react";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import LoadingModal from '../pages/LoadingModal'; // Adjust the path as needed
// import { useNavigate } from "react-router-dom";
// import { auth,firestore } from "../firebase"


// const AuthContext = React.createContext();
// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const history = useNavigate();
//   const [currentUser, setCurrentUser] = useState();
//   const [userlogindetails, setUserLoginDetails] = useState();
//   const [loading, setLoading] = useState(true);
//   const [isModalLoading, setIsModalLoading] = useState(false);
//   const auth = getAuth();

//   const signup = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   };

//   async function login(email, password) {
//     const db = getFirestore();
//     try {
//       setIsModalLoading(true);

//       // Sign in the user
//       await signInWithEmailAndPassword(auth, email, password);

//       // Retrieve additional user details
//       const user = auth.currentUser; // Get the currently authenticated user
//       if (user) {
//         setCurrentUser(user);
//         const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
//         const querySnapshot = await getDocs(userDetailsQuery);

//         if (!querySnapshot.empty) {
//           const userDetails = querySnapshot.docs[0].data();
//           setUserLoginDetails(userDetails);
//           localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
//         } else {
//           console.log('No user details found for email:', email);
//           return null;
//         }
//       }
//     } catch (error) {
//       console.error('Error signing in:', error);
//       throw error; // Re-throw the error for handling in the component
//     } finally {
//       setIsModalLoading(false);
//     }
//   }

//   const logout = () => {
//     return signOut(auth).then(() => {
//       setUserLoginDetails(null);
//       localStorage.removeItem('userLoginDetails');
//       history('/login');
//     });
//   };

//   const resetPassword = (email) => {
//     return sendPasswordResetEmail(auth, email);
//   };

//   const updateprofileEmail = (email) => {
//     return updateEmail(auth.currentUser, email);
//   };

//   const updateprofilePassword = (password) => {
//     return updatePassword(auth.currentUser, password);
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (!user) {
//         setCurrentUser();
//         setUserLoginDetails();
//         localStorage.removeItem('userLoginDetails');
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, [auth]);

//   const value = {
//     currentUser,
//     userlogindetails,
//     signup,
//     login,
//     logout,
//     resetPassword,
//     updateprofileEmail,
//     updateprofilePassword,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       <LoadingModal show={isModalLoading} />
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// import React, { useContext, useState, useEffect } from "react";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import LoadingModal from '../LoadingModal'; // Adjust the path as needed
// import { useNavigate } from "react-router-dom";
// import { auth,firestore } from "../../firebase"


// const AuthContext = React.createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const history = useNavigate();
//   const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
//   const [userlogindetails, setUserLoginDetails] = useState(JSON.parse(localStorage.getItem('userLoginDetails')));
//   const [loading, setLoading] = useState(true);
//   const [isModalLoading, setIsModalLoading] = useState(false);

//   const auth = getAuth();

//   const signup = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   };


//   async function login(email, password) {
//     const db = getFirestore();
//     try {
//       setIsModalLoading(true);

//       // Sign in the user
//       await signInWithEmailAndPassword(auth, email, password);

//       // Retrieve additional user details
//       const user = auth.currentUser; // Get the currently authenticated user
//       if (user) {
//         setCurrentUser(user);
//         localStorage.setItem('currentUser', JSON.stringify(user));

//         const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
//         const querySnapshot = await getDocs(userDetailsQuery);

//         const customerDetailsQuery = query(collection(db, 'customers'), where('email', '==', email));
//         const querySnapshot1 = await getDocs(customerDetailsQuery);

//         if (!querySnapshot.empty) {
//           const userDetails = querySnapshot.docs[0].data();
//           setUserLoginDetails(userDetails);
//           localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
//         } else{
//              if(!querySnapshot1.empty) {
//                 const customerDetails = querySnapshot1.docs[0].data();
//                 setUserLoginDetails(customerDetails);
//                 localStorage.setItem('userLoginDetails', JSON.stringify(customerDetails));      
//         }
//         else { console.log('No user details found for email:', email);
//         return null;}
//       }
//       }
//     } catch (error) {
//       console.error('Error signing in:', error);
//       throw error; // Re-throw the error for handling in the component
//     } finally {
//       setIsModalLoading(false);
//     }
//   }


//   const logout = () => {
//     return signOut(auth).then(() => {
//       setUserLoginDetails(null);
//       setCurrentUser(null);
//       localStorage.removeItem('userLoginDetails');
//       localStorage.removeItem('currentUser');
//       history('/login');
//     });
//   };

//   const resetPassword = (email) => {
//     return sendPasswordResetEmail(auth, email);
//   };

//   const updateprofileEmail = (email) => {
//     return updateEmail(auth.currentUser, email);
//   };

//   const updateprofilePassword = (password) => {
//     return updatePassword(auth.currentUser, password);
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         setCurrentUser(user);
//         console.log(user)
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
//         } else{
//              if(!querySnapshot1.empty) {
//                 const customerDetails = querySnapshot1.docs[0].data();
//                 setUserLoginDetails(customerDetails);
//                 localStorage.setItem('userLoginDetails', JSON.stringify(customerDetails));      
//         }
//         else { console.log('No user details found for email:', email);
//         return null;}
//       }
//       } else {
//         setCurrentUser(null);
//         setUserLoginDetails(null);
//         localStorage.removeItem('currentUser');
//         localStorage.removeItem('userLoginDetails');
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, [auth]);



//   const value = {
//     currentUser,
//     userlogindetails,
//     signup,
//     login,
//     logout,
//     resetPassword,
//     updateprofileEmail,
//     updateprofilePassword,
  
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       <LoadingModal show={isModalLoading} />
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

import React, { useContext, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import LoadingModal from '../LoadingModal'; // Adjust the path as needed
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase"

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
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
    await createUserWithEmailAndPassword(auth, email, password);
    setAuthOperation(null);
  }

  const login = async (email, password) => {
    const db = getFirestore();
    try {
      setIsModalLoading(true);
      setAuthOperation('login');

      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);

      // Retrieve additional user details
      const user = auth.currentUser; // Get the currently authenticated user
      if (user) {
        setCurrentUser(user);
        console.log(user)
        localStorage.setItem('currentUser', JSON.stringify(user));

        const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
        const querySnapshot = await getDocs(userDetailsQuery);

        const customerDetailsQuery = query(collection(db, 'customers'), where('email', '==', email));
        const querySnapshot1 = await getDocs(customerDetailsQuery);

        if (!querySnapshot.empty) {
          const userDetails = querySnapshot.docs[0].data();
          setUserLoginDetails(userDetails);
          localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
        } else if (!querySnapshot1.empty) {
          const customerDetails = querySnapshot1.docs[0].data();
          setUserLoginDetails(customerDetails);
          localStorage.setItem('userLoginDetails', JSON.stringify(customerDetails));
        } else {
          console.log('No user details found for email:', email);
          return null;
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Re-throw the error for handling in the component
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
      history('/login');
      setAuthOperation(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateProfileEmail = (email) => {
    return updateEmail(auth.currentUser, email);
  };

  const updateProfilePassword = (password) => {
    return updatePassword(auth.currentUser, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (authOperation === 'login' || authOperation === 'logout') {
          setCurrentUser(user);
          console.log(user);
          const email = user.email;
          const db = getFirestore();
          localStorage.setItem('currentUser', JSON.stringify(user));

          const userDetailsQuery = query(collection(db, 'Users'), where('EmailAddress', '==', email));
          const querySnapshot = await getDocs(userDetailsQuery);

          const customerDetailsQuery = query(collection(db, 'customers'), where('email', '==', email));
          const querySnapshot1 = await getDocs(customerDetailsQuery);

          if (!querySnapshot.empty) {
            const userDetails = querySnapshot.docs[0].data();
            setUserLoginDetails(userDetails);
            localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
          } else if (!querySnapshot1.empty) {
            const customerDetails = querySnapshot1.docs[0].data();
            setUserLoginDetails(customerDetails);
            localStorage.setItem('userLoginDetails', JSON.stringify(customerDetails));
          } else {
            console.log('No user details found for email:', email);
            return null;
          }
        }
      } else {
        if (authOperation === 'logout') {
          setCurrentUser(null);
          setUserLoginDetails(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userLoginDetails');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [authOperation,auth]);

  const value = {
    currentUser,
    userlogindetails,
    signup,
    login,
    logout,
    resetPassword,
    updateProfileEmail,
    updateProfilePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      <LoadingModal show={isModalLoading} />
      {!loading && children}
    </AuthContext.Provider>
  );
}


