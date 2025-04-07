// src/components/Ewb/UpdateEwbForm.js
import React, { useState } from 'react';
import { auth, getIdToken } from '../../firebase';
import axios from 'axios';
import './EwbForms.css';

const UpdateEwbForm = () => {
  const [ewbNo, setEwbNo] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [transporterID, setTransporterID] = useState('');
  const [transporterName, setTransporterName] = useState('');
  const [vehicleType, setVehicleType] = useState('R'); // Default to Road
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateEwb = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');
    if (!ewbNo) {
      setError('EWB Number is required for update.');
      return;
    }
    try {
      const idToken = await getIdToken(auth.currentUser);
      const updateData = {
        vehicleNo: vehicleNumber,
        transporterId: transporterID,
        transporterName: transporterName,
        vehicleType,
      };
      const response = await axios.post('http://localhost:5000/api/update-ewb', { ewbNo, updateData }, { // Replace with your backend URL
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
      <h2 className="ewb-title">Update E-way Bill</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="ewb-form" onSubmit={handleUpdateEwb}>
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
        
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Vehicle Number:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={vehicleNumber} 
                onChange={(e) => setVehicleNumber(e.target.value)} 
                placeholder="Enter vehicle number"
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Vehicle Type:</label>
              <select 
                className="ewb-select" 
                value={vehicleType} 
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="R">Road</option>
                <option value="T">Train</option>
                <option value="A">Air</option>
                <option value="O">Others</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Transporter ID:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={transporterID} 
                onChange={(e) => setTransporterID(e.target.value)} 
                placeholder="Enter transporter ID"
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Transporter Name:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={transporterName} 
                onChange={(e) => setTransporterName(e.target.value)} 
                placeholder="Enter transporter name"
              />
            </div>
          </div>
        </div>
        
        <button type="submit" className="ewb-button">Update EWB</button>
      </form>
      
      {responseMessage && (
        <div className="response-container">
          <pre>{responseMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default UpdateEwbForm;