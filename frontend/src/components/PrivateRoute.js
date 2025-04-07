// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading authentication state...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

// In your App.js or routing configuration:
// <Route path="/protected" element={<PrivateRoute />}>
//   <Route path="dashboard" element={<Dashboard />} />
//   <Route path="generate-ewb" element={<GenerateEwbForm />} />
//   {/* ... other protected routes ... */}
// </Route>