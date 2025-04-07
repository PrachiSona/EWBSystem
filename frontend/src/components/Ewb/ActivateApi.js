// src/components/Ewb/ActivateApi.js
import React, { useState } from 'react';
import { auth, getIdToken } from '../../firebase';
import axios from 'axios';
import './ActivateApi.css';

const ActivateApi = () => {
  const [ewbUserId, setEwbUserId] = useState('');
  const [ewbPassword, setEwbPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleActivateApi = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const idToken = await getIdToken(auth.currentUser);
      const response = await axios.post('http://localhost:5000/api/activate-ewb', { // Replace with your backend URL
        ewbPortalUserId: ewbUserId,
        ewbPortalPassword: ewbPassword
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div className="activate-api-container">
      <h2 className="activate-api-title">Activate EWB API</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form className="activate-form" onSubmit={handleActivateApi}>
        <div className="activate-form-group">
          <label className="activate-label">EWB Portal User ID:</label>
          <input
            type="text"
            className="activate-input"
            value={ewbUserId}
            onChange={(e) => setEwbUserId(e.target.value)}
            required
          />
        </div>
        <div className="activate-form-group">
          <label className="activate-label">EWB Portal Password:</label>
          <input
            type="password"
            className="activate-input"
            value={ewbPassword}
            onChange={(e) => setEwbPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="activate-button">Activate</button>
      </form>
    </div>
  );
};

export default ActivateApi;