// src/components/Ewb/CancelEwbForm.js
import React, { useState } from 'react';
import { auth, getIdToken } from '../../firebase';
import axios from 'axios';
import './EwbForms.css';

const CancelEwbForm = () => {
  const [ewbNo, setEwbNo] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleCancelEwb = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');
    if (!ewbNo) {
      setError('EWB Number is required for cancellation.');
      return;
    }
    if (!cancelReason) {
      setError('Reason for cancellation is required.');
      return;
    }
    try {
      const idToken = await getIdToken(auth.currentUser);
      const response = await axios.post('http://localhost:5000/api/cancel-ewb', { ewbNo, cancelReason }, { // Replace with your backend URL
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      setResponseMessage(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div className="ewb-form-container">
      <h2 className="ewb-title">Cancel E-way Bill</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="ewb-form" onSubmit={handleCancelEwb}>
        <div className="ewb-form-group">
          <label className="ewb-label">EWB Number:</label>
          <input 
            type="text" 
            className="ewb-input" 
            value={ewbNo} 
            onChange={(e) => setEwbNo(e.target.value)} 
            required 
            placeholder="Enter E-way Bill number"
          />
        </div>
        
        <div className="ewb-form-group">
          <label className="ewb-label">Reason for Cancellation:</label>
          <textarea 
            className="ewb-textarea" 
            value={cancelReason} 
            onChange={(e) => setCancelReason(e.target.value)} 
            required 
            placeholder="Please provide a reason for cancellation"
          />
        </div>
        
        <button type="submit" className="ewb-button">Cancel EWB</button>
      </form>
      
      {responseMessage && (
        <div className="response-container">
          <pre>{responseMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default CancelEwbForm;