// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'; // Import Link
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ActivateApi from './components/Ewb/ActivateApi';
import GenerateEwbForm from './components/Ewb/GenerateEwbForm';
import UpdateEwbForm from './components/Ewb/UpdateEwbForm';
import CancelEwbForm from './components/Ewb/CancelEwbForm';
import FetchEwbDetails from './components/Ewb/FetchEwbDetails';
import Navbar from './components/Layout/Navbar';
import { auth, onAuthStateChanged } from './firebase';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return <div>Loading app...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar />} {/* Only show Navbar if user is authenticated */}
        <div className="container">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route
              path="/activate-api"
              element={user ? <ActivateApi /> : <Navigate to="/login" />}
            />
            <Route
              path="/generate-ewb"
              element={user ? <GenerateEwbForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/update-ewb"
              element={user ? <UpdateEwbForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/cancel-ewb"
              element={user ? <CancelEwbForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/fetch-details"
              element={user ? <FetchEwbDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={
                user ? (
                  <div style={{ textAlign: 'center' }}>Welcome to the E-way Bill System!</div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.
                  </div>
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;