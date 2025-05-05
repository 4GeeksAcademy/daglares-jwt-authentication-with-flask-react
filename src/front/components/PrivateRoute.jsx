import React from 'react';
import { Navigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

const PrivateRoute = ({ children }) => {
  const {store} = useGlobalReducer();

  if (!store.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" replace />;
// };

export default PrivateRoute;