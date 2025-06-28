import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function RequireUser({ children }) {
  const { user } = useUser();

  if (user === undefined) {
    return <p>Loading...</p>; // hoặc spinner UI
  }

  return user ? children : <Navigate to="/login" replace />;
}
