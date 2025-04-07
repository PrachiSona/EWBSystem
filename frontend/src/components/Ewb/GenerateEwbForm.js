// src/components/Ewb/GenerateEwbForm.js
import React, { useState } from 'react';
import { auth, getIdToken } from '../../firebase';
import axios from 'axios';
import './EwbForms.css';

const GenerateEwbForm = () => {
  const [supplyType, setSupplyType] = useState('O'); // O: Outward, I: Inward
  const [subSupplyType, setSubSupplyType] = useState('1'); // Based on EWB API codes
  const [documentType, setDocumentType] = useState('INV'); // Invoice, Bill of Supply, etc.
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentDate, setDocumentDate] = useState('');
  const [fromGSTIN, setFromGSTIN] = useState('');
  const [toGSTIN, setToGSTIN] = useState('');
  const [transactionType, setTransactionType] = useState('Regular'); // Or 'Bill To - Ship To', etc.
  const [dispatchFromAddress, setDispatchFromAddress] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [cgstValue, setCgstValue] = useState('');
  const [sgstValue, setSgstValue] = useState('');
  const [igstValue, setIgstValue] = useState('');
  const [cessValue, setCessValue] = useState('');
  const [transporterName, setTransporterName] = useState('');
  const [transporterID, setTransporterID] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('R'); // R: Road, T: Train, A: Air, O: Others
  const [distance, setDistance] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleGenerateEwb = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');
    try {
      const idToken = await getIdToken(auth.currentUser);
      const ewbData = {
        supplyType,
        subSupplyType,
        documentType,
        documentNumber,
        documentDate,
        fromGSTIN,
        toGSTIN,
        transactionType,
        fromPlace: dispatchFromAddress, // Adjust based on API field names
        toPlace: shipToAddress,       // Adjust based on API field names
        totalValue,
        cgstValue,
        sgstValue,
        igstValue,
        cessValue,
        transporterName,
        transporterId: transporterID, // Adjust based on API field names
        vehicleNo: vehicleNumber,     // Adjust based on API field names
        vehicleType,
        distance,
        itemList: [
          // Example item - you'll likely need a way to add multiple items
          {
            serialNo: '1',
            hsnCode: 'XXXX',
            quantity: 1,
            unit: 'PCS',
            taxableValue: totalValue, // Or calculate based on item value
            cgstRate: cgstValue ? (parseFloat(cgstValue) / parseFloat(totalValue) * 100) : 0,
            sgstRate: sgstValue ? (parseFloat(sgstValue) / parseFloat(totalValue) * 100) : 0,
            igstRate: igstValue ? (parseFloat(igstValue) / parseFloat(totalValue) * 100) : 0,
            cessRate: cessValue ? (parseFloat(cessValue) / parseFloat(totalValue) * 100) : 0,
          },
        ],
      };
      const response = await axios.post('http://localhost:5000/api/generate-ewb', ewbData, { // Replace with your backend URL
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
      <h2 className="ewb-title">Generate E-way Bill</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="ewb-form" onSubmit={handleGenerateEwb}>

        {/* Basic Document Information */}
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Supply Type:</label>
              <select className="ewb-select" value={supplyType} onChange={(e) => setSupplyType(e.target.value)}>
                <option value="O">Outward</option>
                <option value="I">Inward</option>
              </select>
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Sub Supply Type:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={subSupplyType} 
                onChange={(e) => setSubSupplyType(e.target.value)}
                placeholder="Enter sub supply type code" 
              />
            </div>
          </div>
        </div>
        
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Document Type:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={documentType} 
                onChange={(e) => setDocumentType(e.target.value)}
                placeholder="INV, CHL, etc." 
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Transaction Type:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={transactionType} 
                onChange={(e) => setTransactionType(e.target.value)}
                placeholder="Regular, Bill To - Ship To, etc." 
              />
            </div>
          </div>
        </div>
        
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Document Number:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={documentNumber} 
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Enter invoice/document number" 
                required 
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Document Date:</label>
              <input 
                type="date" 
                className="ewb-input" 
                value={documentDate} 
                onChange={(e) => setDocumentDate(e.target.value)} 
                required 
              />
            </div>
          </div>
        </div>
        
        {/* GSTIN Information */}
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">From GSTIN:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={fromGSTIN} 
                onChange={(e) => setFromGSTIN(e.target.value)}
                placeholder="Enter from GSTIN" 
                required 
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">To GSTIN:</label>
              <input 
                type="text" 
                className="ewb-input" 
                value={toGSTIN} 
                onChange={(e) => setToGSTIN(e.target.value)}
                placeholder="Enter to GSTIN" 
                required 
              />
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div className="ewb-form-group">
          <label className="ewb-label">Dispatch From Address:</label>
          <textarea 
            className="ewb-textarea" 
            value={dispatchFromAddress} 
            onChange={(e) => setDispatchFromAddress(e.target.value)}
            placeholder="Enter complete dispatch address" 
          />
        </div>
        
        <div className="ewb-form-group">
          <label className="ewb-label">Ship To Address:</label>
          <textarea 
            className="ewb-textarea" 
            value={shipToAddress} 
            onChange={(e) => setShipToAddress(e.target.value)}
            placeholder="Enter complete shipping address" 
          />
        </div>
        
        {/* Value Information */}
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Total Value:</label>
              <input 
                type="number" 
                className="ewb-input" 
                value={totalValue} 
                onChange={(e) => setTotalValue(e.target.value)}
                placeholder="Enter total invoice value" 
                required 
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Distance (in km):</label>
              <input 
                type="number" 
                className="ewb-input" 
                value={distance} 
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter transport distance" 
              />
            </div>
          </div>
        </div>
        
        {/* Tax Information */}
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">CGST Value:</label>
              <input 
                type="number" 
                className="ewb-input" 
                value={cgstValue} 
                onChange={(e) => setCgstValue(e.target.value)}
                placeholder="Enter CGST amount" 
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">SGST Value:</label>
              <input 
                type="number" 
                className="ewb-input" 
                value={sgstValue} 
                onChange={(e) => setSgstValue(e.target.value)}
                placeholder="Enter SGST amount" 
              />
            </div>
          </div>
        </div>
        
        <div className="ewb-form-row">
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">IGST Value:</label>
              <input 
                type="number" 
                className="ewb-input" 
                value={igstValue} 
                onChange={(e) => setIgstValue(e.target.value)}
                placeholder="Enter IGST amount" 
              />
            </div>
          </div>
          
          <div className="ewb-form-col">
            <div className="ewb-form-group">
              <label className="ewb-label">Cess Value:</label>
              <input 
                type="number" 
                className="ewb-input" 
                value={cessValue} 
                onChange={(e) => setCessValue(e.target.value)}
                placeholder="Enter Cess amount" 
              />
            </div>
          </div>
        </div>
        
        {/* Transport Information */}
        <div className="ewb-form-row">
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
        
        <button type="submit" className="ewb-button">Generate EWB</button>
      </form>
      
      {responseMessage && (
        <div className="response-container">
          <pre>{responseMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default GenerateEwbForm;