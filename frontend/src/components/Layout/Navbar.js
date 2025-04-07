// src/components/Layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signOut } from '../../firebase';
import './Navbar.css'; // Import the CSS

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">E-way Bill System</Link>
      <div className="navbar-links">
        <Link to="/activate-api" className="nav-link">Activate API</Link>
        <Link to="/generate-ewb" className="nav-link">Generate EWB</Link>
        <Link to="/update-ewb" className="nav-link">Update EWB</Link>
        <Link to="/cancel-ewb" className="nav-link">Cancel EWB</Link>
        <Link to="/fetch-details" className="nav-link">Fetch Details</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};
export default Navbar;