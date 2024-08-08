import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './pages/context/AuthContext';

const PublicRoute = ({ element: Element, ...rest }) => {
  const { currentUser } = useAuth();

  if(currentUser===null){
    console.log(111)
  }else console.log(222);

  return currentUser===null ? <Element {...rest} />:  <Navigate to="*" replace />;

// currentUser&&{(
//   if (currentUser === null) {
//     // Ensure it checks for null properly
//     return <Element {...rest} />;
//   })}
//   return <Navigate to="*" replace />;

};

export default PublicRoute;
