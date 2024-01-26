import axios from 'axios';

const BASE_URL = 'http://localhost:5044'; // Backend URL

const Apis = {
  // Login api call
  login: async (username, password) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/handlelogin`, {
        params: { username, password },
      });

      return response.data; // Return the data received from the backend
    } catch (error) {
      // Handle errors
      console.error('Login error:', error);
      throw error;
    }
  },

  createAccount: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/createaccount`, null, {
        params: { username, password },
      });
  
      return response.data; // Return the data received
    } catch (error) {
      // Handle errors
      console.error('Create account error:', error);
      throw error;
    }
  },

  // API call to get account names
  getAccounts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getAccounts`);
  
      return response.data; // Return the data received from the backend
    } catch (error) {
      // Handle errors
      console.error('Get accounts error:', error);
      throw error;
    }
  },

  // API call to post GJ to database
  postGJ: async (date, accounts, descriptions, debits, credits) => {
    try {
      console.log('Data before sending:', { date, accounts, descriptions, debits, credits });
      const response = await axios.post(`${BASE_URL}/api/postGJ`, {
        date: date.toISOString(), // Convert date to ISO string format
        accounts,
        descriptions,
        debits,
        credits,
      });

      return response.data; // Return the data received
    } catch (error) {
      // Handle errors
      console.error('PostGJ error:', error);
      throw error;
    }
  },

  // API call to get General Journal entries
  getGJ: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getGJ`);

      return response.data; // Return the data received from the backend
    } catch (error) {
      // Handle errors
      console.error('GetGJ error:', error);
      throw error;
    }
  },


};

export default Apis;