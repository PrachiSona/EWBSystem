// src/utils/api.js
import axios from 'axios';
import { auth } from '../../firebase';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const getAuthHeader = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${idToken}` };
  } catch (error) {
    console.error('Error getting ID token:', error);
    return {};
  }
};

export const activateEwbApi = async (ewbPortalUserId, ewbPortalPassword) => {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE_URL}/activate-ewb`, { ewbPortalUserId, ewbPortalPassword }, { headers });
};

export const generateEwb = async (ewbData) => {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE_URL}/generate-ewb`, ewbData, { headers });
};

export const updateEwb = async (ewbNo, updateData) => {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE_URL}/update-ewb`, { ewbNo, updateData }, { headers });
};

export const cancelEwb = async (ewbNo, cancelReason) => {
  const headers = await getAuthHeader();
  return axios.post(`${API_BASE_URL}/cancel-ewb`, { ewbNo, cancelReason }, { headers });
};

export const fetchEwbDetails = async (ewbNo) => {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE_URL}/fetch-ewb-details?ewbNo=${ewbNo}`, { headers });
};

// You can add more API functions here for other endpoints

export default {
  activateEwbApi,
  generateEwb,
  updateEwb,
  cancelEwb,
  fetchEwbDetails,
};