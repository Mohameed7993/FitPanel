import React from 'react';
import { Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();


  return currentUser ? children : <Navigate to="/login" state={{ from: location }} replace />;

};

export default PrivateRoute;


