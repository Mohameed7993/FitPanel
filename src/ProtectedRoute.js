// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './pages/context/AuthContext';

const ProtectedRoute = ({ element: Element, requiredRole, ...rest }) => {
  const { currentUser,userlogindetails } = useAuth();

  const isAuthorized =userlogindetails && currentUser && (requiredRole === undefined || userlogindetails.role === requiredRole);

  return isAuthorized ? <Element {...rest} /> :<Navigate to="*" replace />;
};

export default ProtectedRoute;
