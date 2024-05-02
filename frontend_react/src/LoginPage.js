import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Apis from './Apis'; // Import the Apis object

const LoginPage = (props) => {
    const [username, setUsername] = useState(''); // State to store username input
    const [password, setPassword] = useState(''); // State to store password input
    const [rememberMe, setRememberMe] = useState(false); // State for the checkbox: initially unchecked (false)
    const [accountNotExist, setAccountNotExist] = useState(false); // State to track if the account does not exist

    const navigate = useNavigate(); // Initialize the navigate object

    useEffect(() => {
      // Check if rememberMe is set and if there are remembered credentials
      const rememberedUsername = localStorage.getItem('rememberedUsername');
      const rememberedPassword = localStorage.getItem('rememberedPassword');
    
      if (rememberedUsername && rememberedPassword) {
        setUsername(rememberedUsername);
        setPassword(rememberedPassword);
        setRememberMe(true);
      }
    }, []);

    // Handle setting useState: Username
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
  
    // Handle setting useState: Password
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    // Handle Login API call
    const handleLogin = async () => {
      try {
            // Check if the username and password fields are not empty
      if (username.trim().length === 0 || password.length === 0) {
        alert('Username and Password must be 1 to 24 characters long.');
        return; // Prevent API call if fields are empty
      }

      // Check if the username and password fields have more than 24 characters
      if (username.length > 24 || password.length > 24) {
        alert('Username and Password must be 1 to 24 characters long.');
        return; // Prevent API call if fields have more than 24 characters
      }
  
      // Make the API call to the backend's HandleLogin endpoint
      const response = await Apis.login(username, password);

      // Handle the response from the backend
      if (response.userExists === false) {
        // If the account does not exist, set accountNotExist to true
        setAccountNotExist(true);
      } else if (response.passwordMatches === false) {
        // If the password does not match, display the error message and clear the input fields
        alert('Incorrect password. Please re-enter username and password.');
      } else {
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', true);
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }        
        // If the login is successful (username and password match), navigate to SelectFunction.js
        navigate('/selectFunction');

        // Call the onLoginSuccess function to inform the parent component
        props.onLoginSuccess();

      }
    } catch (error) {
      // Handle errors
      console.error('Login error:', error);
    }
  };
  
    // Handle Create Account API call
    const handleCreateAccount = async () => {
      try {
        // Call the backend's CreateAccount endpoint to create the account with the entered username and password
        const response = await Apis.createAccount(username, password);
  
        // After successfully creating the account, proceed to navigate to the next page (SelectFunction.js)
        navigate('/selectFunction'); // Navigate to the SelectFunction.js page

        // Call the onLoginSuccess function to inform the parent component
        props.onLoginSuccess();

      } catch (error) {
        console.error('Error creating account:', error);
      }
    };

  // Function to handle cancelling the creation of a new account when the user clicks "No" in the pop-up window
  const handleCancelCreateAccount = () => {
    // Close the pop-up window and clear the input fields if needed
    setAccountNotExist(false);
    setUsername('');
    setPassword('');
  };
  
    // JSX for the pop-up window to ask the user if they want to create an account
    const createAccountDialog = (
      <Dialog open={accountNotExist} onClose={handleCancelCreateAccount}>
        <DialogTitle>Account Does Not Exist</DialogTitle>
        <DialogContent>
          <p>This account does not exist. Do you wish to create it?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateAccount} variant="contained" color="primary">
            Yes
          </Button>
          <Button onClick={handleCancelCreateAccount} variant="contained" color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  
    return (
        <div
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'black',
            color: '#1E90FF',
            textAlign: 'center',
        }}
        >
          <h1>Enter Username and Password to Login or Create a New Account</h1>
          <div>
            {/* This div contains the username input field */}
            <label htmlFor="username" style={{ fontSize: '48px' }}>
              Username:
            </label>
            <TextField
              id="username"
              variant="outlined"
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                margin: '5px',
                color: 'black',
              }}
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            {/* This div contains the password input field */}
            <label htmlFor="password" style={{ fontSize: '48px' }}>
              Password:
            </label>
            <TextField
              id="password"
              type="password"
              variant="outlined"
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                margin: '5px',
                color: 'black',
              }}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {/* This div contains the Remember Me Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                style={{
                  color: 'white',
                }}
                checkedIcon={
                  <span
                    style={{
                      color: 'purple',
                    }}
                  >
                    &#x2714; {/* Custom check icon */}
                  </span>
                }
              />
            }
            label="Remember Me"
            style={{ color: '#1E90FF' }}
          />
    
          {/* This div contains the submit button */}
          <div>
            <Button
              onClick={handleLogin}
              variant="contained"
              style={{
                backgroundColor: '#D7AD00',
                color: 'black',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
              disabled={
                username.trim().length === 0 ||
                password.length === 0 ||
                username.length > 24 ||
                password.length > 24
              } // Disable the button if any field is empty or has more than 24 characters            
            >
              SUBMIT
            </Button>
          </div>

      {/* Render the pop-up window */}
      {createAccountDialog}
    </div>
      );
    };



  export default LoginPage;