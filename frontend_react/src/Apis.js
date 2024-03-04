import axios from 'axios';

const BASE_URL = 'http://localhost:5044';

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

  // API call to create table in the backend
  createAccountTable: async (type, category, accountName, description, dvalue, cvalue) => {
    try {
      console.log('Data before sending:', { type, category, accountName, description, dvalue, cvalue });
      const response = await axios.post(`${BASE_URL}/api/createTable`, {
        type,
        category,
        accountName,
        description,
        dvalue,
        cvalue
      });

      return response.data; // Return the data received
    } catch (error) {
      // Handle errors
      console.error('CreateTable error:', error);
      throw error;
    }
  },

  // API call to get Account Entries
  getAccountEntries: async (accountName) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getAccountEntries`, {
        params: { accountName } // Include accountName as a query parameter
      });

      return response.data; // Return the data received from the backend
    } catch (error) {
      // Handle errors
      console.error('Get Account Entries error:', error);
      throw error;
    }
  },

  // API call to save account changes
  saveAccountChanges: async (selectedAccountName, editedAccountName, category) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/editAccount`, {
        selectedAccountName,
        editedAccountName,
        category
      });

      return response.data; // Return the data received from the backend if needed
    } catch (error) {
      // Handle errors
      console.error('Save Account Changes error:', error);
      throw error;
    }
  },

  // API call to get totals
  getTotals: async (month, year) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getTotals?month=${month}&year=${year}`);

      return response.data; // Return the data received from the backend
    } catch (error) {
      // Handle errors
      console.error('Get Totals error:', error);
      throw error;
    }
  },

  getAverages: async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/getAverages`);
        return response.data;
    } catch (error) {
        console.error('Get Averages error: ', error);
        throw error;
    }
  },

  // API call to get Tasks
  getTasks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getTasks`);
      return response.data;
    } catch (error) {
      console.error('Get Tasks error: ', error);
      throw error;
    }
  },

  // API call to create a task
  createTask: async (newTaskData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/createTask`, newTaskData);
      return response.data; // Return the data received from the backend
    } catch (error) {
      console.error('CreateTask error:', error);
      throw error; // Throw the error to be handled by the caller
    }
  },

// API call to create a task
updateTask: async (newTaskData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/updateTask`, newTaskData);
    return response.data; // Return the data received from the backend
  } catch (error) {
    console.error('UpdateTask error:', error);
    throw error; // Throw the error to be handled by the caller
  }
},

// API call to get task
getTask: async (taskId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/getTask`, {
      params: { taskId },
    });

    return response.data; // Return the data received from the backend
  } catch (error) {
    // Handle errors
    console.error('Get task error:', error);
    throw error;
  }
},

// API call to delete tasks
deleteTasks: async (selectedTasks) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/deleteTasks`, selectedTasks);
    return response.data; // Return the data received from the backend
  } catch (error) {
    console.error('DeleteTasks error:', error);
    throw error; // Throw the error to be handled by the caller
  }
},



};

export default Apis;