import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
   updateEmail,updatePassword,signOut ,sendPasswordResetEmail} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
/*
the cod in get hub is before starting users role!
const admin = require('firebase-admin');

const serviceAccount = require("C:\Users\PC\Desktop\work\modumbels\privatekeyadminsdk");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const admin = require('firebase-admin');

function setAdminRole(userId) {
  admin.auth().setCustomUserClaims(userId, { role: 'admin' });
}
*/



const AuthContext = React.createContext()
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const history =useNavigate()
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const auth = getAuth();

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth).then(val=>
      history('/login')
      );
  };

  const resetPassword=(email)=>{
    return sendPasswordResetEmail(auth,email);
  };

  const updateprofileEmail = (email)=>{
    return updateEmail(auth,email);
  };
  const updateprofilePassword = (password)=>{
    return updatePassword(auth,password);
  };



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateprofileEmail,
    updateprofilePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
