import React, { children, useContext, useEffect, useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext=React.createContext()


export function useAuth(){
    return useContext(AuthContext)
}



export  function AuthProvider({children}) {
   const [currentUser,setCurrentUser]=useState()

   

   const auth = getAuth();
const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};



    useEffect(()=>{
        const unsubscribe= auth.onAuthStateChanged(user=>{
            setCurrentUser(user)
       
         
    })
    return unsubscribe
    },[])
    
    const value ={currentUser,signup}
  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}
