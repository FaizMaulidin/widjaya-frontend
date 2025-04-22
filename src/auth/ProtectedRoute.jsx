import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { jwtDecode } from 'jwt-decode';

const isExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

function ProtectedRoute({ children }) {
  const { token, logout } = useAuth()

  useEffect(() => {
    if (isExpired(token)) logout()
  })

  if (!token) return <Navigate to='/login' replace/>

  return children;
}

export default ProtectedRoute;