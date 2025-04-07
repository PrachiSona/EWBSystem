// src/components/Ewb/FetchEwbDetails.js
import React, { useState } from 'react';
import { auth, getIdToken } from '../../firebase';
import axios from 'axios';
import './EwbForms.css';

const FetchEwbDetails = () => {
  const [ewbNo, setEwbNo] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const handleFetchDetails = async (e) => {
    e.preventDefault();
    setDetails('');
    setError('');
    if (!ewbNo) {
      setError('EWB Number is required to fetch details.');
      return;
    }
    try {
      const idToken = await getIdToken(auth.currentUser);
      const response = await axios.get(`http://localhost:5000/api/fetch-ewb-details?ewbNo=${ewbNo}`, { // Replace with your backend URL
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      setDetails(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div className="ewb-form-container">
      <h2 className="ewb-title">Fetch EWB Details</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="ewb-form" onSubmit={handleFetchDetails}>
        <div className="ewb-form-group">
          <label className="ewb-label">EWB Number:</label>
          <input 
            type="text" 
            className="ewb-input" 
            value={ewbNo} 
            onChange={(e) => setEwbNo(e.target.value)} 
            placeholder="Enter E-way Bill number" 
            required 
          />
        </div>
        
        <button type="submit" className="ewb-button">Fetch Details</button>
      </form>
      
      {details && (
        <div className="response-container">
          <pre>{details}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchEwbDetails;