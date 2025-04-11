const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');

// Replace with the path to your Firebase Admin SDK credentials JSON file
const serviceAccount = require('./ewaybillsystem-79be2-firebase-adminsdk-fbsvc-46b373b5a0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ewaybillsystem-79be2' 
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- Authentication Middleware ---
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const idToken = authHeader.split('Bearer ')[1];
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken; // Attach user info to the request object
      next();
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
  
  // --- API Endpoints ---
  app.post('/api/activate-ewb', authenticate, async (req, res) => {
    try {
      const { ewbPortalUserId, ewbPortalPassword } = req.body;
      const userId = req.user.uid;
  
      // Hash the EWB portal password before storing it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(ewbPortalPassword, saltRounds);
  
      // Store the encrypted credentials in Firestore under the user's company
      const userDocRef = db.collection('users').doc(userId);
      const companySnapshot = await userDocRef.collection('companies').limit(1).get(); 
  
      if (companySnapshot.empty) {
        return res.status(400).json({ error: 'No company profile found for this user.' });
      }
  
      const companyDoc = companySnapshot.docs[0];
      await companyDoc.ref.update({
        ewbPortalUserId: ewbPortalUserId, // You might want to encrypt this as well
        ewbPortalPassword: hashedPassword
      });
  
      res.json({ message: 'EWB API credentials activated successfully.' });
  
    } catch (error) {
      console.error('Error activating EWB API:', error);
      res.status(500).json({ error: 'Failed to activate EWB API.' });
    }
  });
  
  app.post('/api/generate-ewb', authenticate, async (req, res) => {
    try {
      const userId = req.user.uid;
      const ewbData = req.body; // Data required for EWB generation from the frontend
  
      // Retrieve the encrypted EWB portal credentials from Firestore
      const userDocRef = db.collection('users').doc(userId);
      const companySnapshot = await userDocRef.collection('companies').limit(1).get();
  
      if (companySnapshot.empty) {
        return res.status(400).json({ error: 'No company profile found.' });
      }
  
      const companyDoc = companySnapshot.docs[0];
      const companyData = companyDoc.data();
      const ewbPortalUserId = companyData.ewbPortalUserId; // Decrypt if you encrypted it
      const ewbPortalPasswordHash = companyData.ewbPortalPassword;
  
      // **Crucial Step: Authenticate with the EWB Portal API**
      // This will involve making a POST request to the EWB portal's login API
      // using ewbPortalUserId and the *plain text* version of the password
      // (you'll need to compare the provided password with the stored hash).
  
      // Example (Conceptual - Replace with actual EWB API authentication):
      // const isPasswordMatch = await bcrypt.compare(providedPassword, ewbPortalPasswordHash);
      // if (!isPasswordMatch) {
      //   return res.status(401).json({ error: 'Invalid EWB portal credentials.' });
      // }
  
      // **After successful EWB portal authentication, you'll typically receive an access token or session ID.**
      // You'll need to store and manage this token for subsequent EWB API calls.
  
      const ewbAuthResponse = await axios.post('EWB_PORTAL_LOGIN_API_URL', {
        userid: ewbPortalUserId,
        password: 'THE_ACTUAL_PASSWORD_SENT_BY_USER_DURING_ACTIVATION' 
      });
  
      const ewbAccessToken = ewbAuthResponse.data.authToken; 
  
      // **Make the EWB generation API call**
      const ewbApiResponse = await axios.post('EWB_PORTAL_GENERATE_API_URL', ewbData, {
        headers: {
          'Authorization': `Bearer ${ewbAccessToken}`, // Or however the EWB API requires authentication
          'Content-Type': 'application/json'
        }
      });
  
      // Handle the EWB API response
      res.json(ewbApiResponse.data);
  
    } catch (error) {
      console.error('Error generating EWB:', error);
      res.status(500).json({ error: 'Failed to generate EWB.' });
    }
  });
  
  app.post('/api/update-ewb', authenticate, async (req, res) => {
    try {
      const userId = req.user.uid;
      const { ewbNo, updateData } = req.body; // EWB number and data to update
  
      // Retrieve EWB portal authentication details from Firestore 32/
      const userDocRef = db.collection('users').doc(userId);
      const companySnapshot = await userDocRef.collection('companies').limit(1).get();
  
      if (companySnapshot.empty) {
        return res.status(400).json({ error: 'No company profile found.' });
      }
  
      const companyDoc = companySnapshot.docs[0];
      const companyData = companyDoc.data();
      const ewbAccessToken = companyData.ewbAccessToken; // Assuming you stored the access token
  
      if (!ewbAccessToken) {
        return res.status(401).json({ error: 'EWB API access token not found. Please activate the API again.' });
      }
  
      // **Make the EWB update API call**
      const ewbApiResponse = await axios.post(
        'EWB_PORTAL_UPDATE_API_URL', // Replace with the actual EWB update API URL
        { ...updateData, ewbNo: ewbNo }, // Include EWB number and the update data
        {
          headers: {
            'Authorization': `Bearer ${ewbAccessToken}`, // Or the appropriate authorization header
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Handle the EWB API response
      res.json(ewbApiResponse.data);
  
    } catch (error) {
      console.error('Error updating EWB:', error);
      res.status(500).json({ error: 'Failed to update EWB.' });
    }
  });
  
  app.post('/api/cancel-ewb', authenticate, async (req, res) => {
    try {
      const userId = req.user.uid;
      const { ewbNo, cancelReason } = req.body; // EWB number and reason for cancellation
  
      // Retrieve EWB portal authentication details from Firestore (assuming you stored an access token)
      const userDocRef = db.collection('users').doc(userId);
      const companySnapshot = await userDocRef.collection('companies').limit(1).get();
  
      if (companySnapshot.empty) {
        return res.status(400).json({ error: 'No company profile found.' });
      }
  
      const companyDoc = companySnapshot.docs[0];
      const companyData = companyDoc.data();
      const ewbAccessToken = companyData.ewbAccessToken; // Assuming you stored the access token
  
      if (!ewbAccessToken) {
        return res.status(401).json({ error: 'EWB API access token not found. Please activate the API again.' });
      }
  
      // **Make the EWB cancel API call**
      const ewbApiResponse = await axios.post(
        'EWB_PORTAL_CANCEL_API_URL', // Replace with the actual EWB cancel API URL
        { ewbNo: ewbNo, reason: cancelReason }, // Include EWB number and cancellation reason
        {
          headers: {
            'Authorization': `Bearer ${ewbAccessToken}`, // Or the appropriate authorization header
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Handle the EWB API response
      res.json(ewbApiResponse.data);
  
    } catch (error) {
      console.error('Error canceling EWB:', error);
      res.status(500).json({ error: 'Failed to cancel EWB.' });
    }
  });

  app.get('/api/fetch-ewb-details', authenticate, async (req, res) => {
    try {
      const userId = req.user.uid;
      const { ewbNo } = req.query; // Get EWB number from the query parameters
  
      if (!ewbNo) {
        return res.status(400).json({ error: 'EWB number is required.' });
      }
  
      // Retrieve EWB portal authentication details from Firestore (assuming you stored an access token)
      const userDocRef = db.collection('users').doc(userId);
      const companySnapshot = await userDocRef.collection('companies').limit(1).get();
  
      if (companySnapshot.empty) {
        return res.status(400).json({ error: 'No company profile found.' });
      }
  
      const companyDoc = companySnapshot.docs[0];
      const companyData = companyDoc.data();
      const ewbAccessToken = companyData.ewbAccessToken; // Assuming you stored the access token
  
      if (!ewbAccessToken) {
        return res.status(401).json({ error: 'EWB API access token not found. Please activate the API again.' });
      }
  
      // **Make the EWB fetch details API call**
      const ewbApiResponse = await axios.get(
        `EWB_PORTAL_GET_DETAILS_API_URL?ewbNo=${ewbNo}`, // Replace with the actual EWB get details API URL
        {
          headers: {
            'Authorization': `Bearer ${ewbAccessToken}`, // Or the appropriate authorization header
          },
        }
      );
  
      // Handle the EWB API response
      res.json(ewbApiResponse.data);
  
    } catch (error) {
      console.error('Error fetching EWB details:', error);
      res.status(500).json({ error: 'Failed to fetch EWB details.' });
    }
  });
  
  // --- Start the server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
