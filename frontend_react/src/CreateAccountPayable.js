import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Apis from './Apis';
import { Tab, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Paper } from '@mui/material';

const CreateAccountPayable = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue, setNavigateValue] = useState('');
    const [viewEditValue, setViewEditValue] = useState('');
    const [reportsValue, setReportsValue] = useState('');
    const [createValue, setCreateValue] = useState('');
    const [helpValue, setHelpValue] = useState('');
    const [logoutValue, setLogoutValue] = useState('');   
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
    const [type, setType] = useState(4); // Replace 0 with your initial value
    const [category, setCategory] = useState(1); // Replace 0 with your initial value
    const [accountName, setAccountName] = useState('');
    const [dvalue, setDvalue] = useState('0.00'); // This will hold the value
    const [cvalue, setCvalue] = useState('0.00'); // This will hold the value
    const [description, setDescription] = useState('Beginning Balance');
    const [debitError, setDebitError] = useState('');
    const [creditError, setCreditError] = useState('');
    const [rows, setRows] = useState(Array(10).fill(null).map((_, index) => ({ id: index, color: index % 2 === 0 ? '#E1DDE8' : '#C3CBC0' })));
    const [accountNameError, setAccountNameError] = useState('');



    useEffect(() => {
        // Fetch the list of accounts from the backend using the getAccounts API
        const fetchAccounts = async () => {
          try {
            const accounts = await Apis.getAccounts();
            setAccountList(accounts);
          } catch (error) {
            // Handle errors
            console.error('Fetch accounts error:', error);
          }
        };
      
        fetchAccounts(); // Call the fetchAccounts function to get the accounts
      }, []);

    // Function to handle menu item selection for "Navigate"
    const handleNavigate = (event) => {
        const value = event.target.value; // Get the selected value
        // Navigate based on the value
        switch (value) {
            case 'todo':
                navigate('/todo'); // Navigate to the ToDo.js page
                break;
            case 'generalJournal':
                navigate('/generalJournal'); // Navigate to the GeneralJournal.js page
                break;
            default:
                break;
        }
    };

    // Function to handle menu item selection for "View/Edit"
    const handleViewEdit = (event) => {
        const selectedAccount = event.target.value;
        if (selectedAccount === 'generalJournal') {
          navigate('/generalJournalView'); // Navigate to GeneralJournalView.js
        } else {
          // Navigate to EditAccount.js with the selected account information
          navigate(`/editAccount/${selectedAccount}`);
        }
      };

    // Function to handle menu item selection for "Reports"
    const handleReports = (event) => {
        const value = event.target.value;
        switch (value) {
            case 'adjustableBudget':
                navigate('/adjustableBudget'); // Navigate to AdjustableBudget.js
                break;
            case 'currentBudget':
                navigate('/currentBudget'); // Navigate to CurrentBudget.js
                break;
            case 'totals':
                navigate('/totals'); // Navigate to Totals.js
                break;
        // Add more cases for other "Reports" options if needed
            default:
                break;
        }
    };

    // Function to handle menu item selection for "Create"
    const handleCreate = (event) => {
        const value = event.target.value;
        switch (value) {
            case 'income':
                navigate('/createIncome'); // Navigate to CreateIncome.js
                break;
            case 'asset':
                navigate('/createAsset'); // Navigate to CreateAsset.js
                break;
            case 'expense':
                navigate('/createExpense'); // Navigate to CreateExpense.js
                break;
            case 'payable':
                navigate('/createAccountPayable') // Navigate to CreateAccountPayable.js
                break;
            default:
                break;
        }
    };

    // Function to handle menu item selection for "Help"
    const handleHelp = () => {
        navigate('/help'); // Navigate to Help.js
    };
  
    // Function to handle menu item selection for "Logout"
    const handleLogout = () => {
        navigate('/'); // Navigate to LoginPage.js
    };

    const isValidInput = (input) => {
      const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(input);
      return isValid ? '' : 'Invalid input. Please enter a valid dollar amount.';
    };
  
    const validateAccountName = () => {
      // Trim accountName to remove leading and trailing whitespaces
      const trimmedAccountName = accountName.trim();
  
      // Check if the trimmed accountName is empty
      if (trimmedAccountName === '') {
        setAccountNameError('Please enter a name for the account');
        return false;
      }
  
      // Check if the accountName already exists in the accountList
      if (accountList.includes(trimmedAccountName)) {
        setAccountNameError('Account Name already exists');
        return false;
      }
  
      // If all checks pass, clear any previous errors
      setAccountNameError('');
      return true;
    };
    
    const handleDebitChange = (event) => {
      const { value } = event.target;
      const errorMessage = isValidInput(value);
    
      setDebitError(errorMessage);
    
      if (errorMessage === '') {
        setDvalue(value);
        setCvalue('0.00');
      }
    };
  
    const handleCreditChange = (event) => {
      const { value } = event.target;
      const errorMessage = isValidInput(value);
    
      setCreditError(errorMessage);
    
      if (errorMessage === '') {
        setCvalue(value);
        setDvalue('0.00');
      }
    };
  
    const handleDebitBlur = () => {
      const numericValue = parseFloat(dvalue);
      const formattedValue = isNaN(numericValue) ? '' : `$${numericValue.toFixed(2)}`;
      setDvalue(formattedValue);
    };
  
    const handleCreditBlur = () => {
      const numericValue = parseFloat(cvalue);
      const formattedValue = isNaN(numericValue) ? '' : `$${numericValue.toFixed(2)}`;
      setCvalue(formattedValue);
    };
  
    const handleCreateAccountClick = async () => {
    // Validate the account name
    const isAccountNameValid = validateAccountName();

    // If the account name is valid, proceed with API call
    if (isAccountNameValid) {
      try {
        // Call the API to create the account table
        const response = await Apis.createAccountTable(type, category, accountName, description, dvalue, cvalue);

        // Handle the response as needed
        console.log('Create Account response:', response);

      // Reset form fields after successful submission
      setAccountName('');
      setDvalue('0.00');
      setCvalue('0.00');
      setAccountNameError('');
      } 
      catch (error) {
        // Handle API call errors
        console.error('Create Account API error:', error);
      }
    }
  };

    return (
      <div>
        {/* Top App Bar */}
        <AppBar position="static" style={{ backgroundColor: '#C7C7C7'}}>
          <Toolbar>
            {/* Drop-Down Menus */}
  
            <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  Navigate
                </Typography>
                <Select label="Navigate" onChange={handleNavigate} value={navigateValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="todo">To-Do List</MenuItem>
                  <MenuItem value="generalJournal">General Journal</MenuItem>
                </Select>
              </div>
            </div>
  
            <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  View/Edit
                </Typography>
                <Select label="View/Edit" onChange={handleViewEdit} value={viewEditValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="generalJournal">General Journal</MenuItem>
                  {/* Populate the dropdown menu with accounts from state */}
                  {accountList.map((account) => (
                    <MenuItem key={account} value={account}>
                      {account}
                    </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
  
            <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  Reports
                </Typography>
                <Select label="Reports" onChange={handleReports} value={reportsValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="adjustableBudget">Adjustable Budget</MenuItem>
                  <MenuItem value="currentBudget">Current Budget</MenuItem>
                  <MenuItem value="totals">Totals</MenuItem>
                  {/* Add more report options */}
                </Select>
              </div>
            </div>
  
            <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  Create
                </Typography>
                <Select label="Create" onChange={handleCreate} value={createValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="income">Income Account</MenuItem>
                  <MenuItem value="asset">Asset Account</MenuItem>
                  <MenuItem value="expense">Expense Account</MenuItem>
                  <MenuItem value="payable">Payable(Credit) Account</MenuItem>
                </Select>
              </div>
            </div>
  
            <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  Help
                </Typography>
                <Select label="Help" onChange={handleHelp} value={helpValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="documentation">Documentation</MenuItem>
                </Select>
              </div>
            </div>
  
            <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  Logout
                </Typography>
                <Select label="Logout" onChange={handleLogout} value={logoutValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="logout">Logout</MenuItem>
                </Select>
              </div>
            </div>
          </Toolbar>
        </AppBar>
  
      {/* Page Header */}
      <div className="page-header" style={{ backgroundColor: '#E1DDE8', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>Create Account Payable 'Credit'</h1>
      </div>

      {/* Displayed Rows Table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table className="journal-table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#C3CBC0' }}>
              <TableCell style={{ width: '20%' }}>Date</TableCell>
              <TableCell style={{ width: '20%' }}>Account Name</TableCell>
              <TableCell style={{ width: '25%' }}>Description</TableCell>
              <TableCell style={{ width: '17%' }}>Debit -</TableCell>
              <TableCell style={{ width: '18%' }}>Credit +</TableCell>
            </TableRow>
          </TableHead>
          {/* Rest of the table */}
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={row.id} style={{ backgroundColor: row.color }}>
                {rowIndex === 0 ? (
                  // Render content for the first row with information and input
                  <React.Fragment>
                    <TableCell>
                      {/* Date column with current date MM/DD/YYYY */}
                      {new Date().toLocaleDateString('en-US')}
                    </TableCell>

                    <TableCell>
                      {/* Textfield for Account Name with error display */}
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={accountName}
                        onChange={(event) => setAccountName(event.target.value)}
                        error={Boolean(accountNameError)}
                        helperText={accountNameError}
                      />
                    </TableCell>

                    <TableCell>
                      {/* Description column with "Beginning Balance" */}
                      Beginning Balance
                    </TableCell>

                    <TableCell>
                      {/* Debit column */}
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={dvalue}
                        onChange={handleDebitChange}
                        onBlur={handleDebitBlur}
                        error={Boolean(debitError)}
                        helperText={debitError}
                      />
                    </TableCell>

                    <TableCell>
                      {/* Credit column */}
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={cvalue}
                        onChange={handleCreditChange}
                        onBlur={handleCreditBlur}
                        error={Boolean(creditError)}
                        helperText={creditError}
                        inputProps={{ id: `credit-${rowIndex}` }}
                      />
                    </TableCell>
                  </React.Fragment>
                  ) : (
                  // Render content for other rows (blank)
                  <React.Fragment>
                    {/* ... other cells */}
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </React.Fragment>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <div className="page-footer" style={{ backgroundColor: '#E1DDE8', textAlign: 'center' }}>
        <Button
          onClick={handleCreateAccountClick}
          variant="contained"
          style={{ fontWeight: 'bold', color: 'black', backgroundColor: '#848484' }}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateAccountPayable;