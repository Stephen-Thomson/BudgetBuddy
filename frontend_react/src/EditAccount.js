import React, { useEffect, useState, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useParams } from 'react-router-dom';
import Apis from './Apis';
import {
  Tab,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';

const EditAccount = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue, setNavigateValue] = useState('');
    const [viewEditValue, setViewEditValue] = useState('');
    const [reportsValue, setReportsValue] = useState('');
    const [createValue, setCreateValue] = useState('');
    const [helpValue, setHelpValue] = useState('');
    const [logoutValue, setLogoutValue] = useState('');   
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
    // Retrieve the account name from the URL
    const { accountName } = useParams();
    const [selectedAccountName, setSelectedAccountName] = useState('');
    const [accountEntries, setAccountEntries] = useState([]); // State to hold General Journal entries
    const [loading, setLoading] = useState(true); // State to indicate if the page is loading
    const [category, setCategory] = useState(0); // Default to 0 initially
    const [nonExpenseChecked, setNonExpenseChecked] = useState(false);
    const [fixedMonthlyChecked, setFixedMonthlyChecked] = useState(false);
    const [variableChecked, setVariableChecked] = useState(false);
    const [temporaryChecked, setTemporaryChecked] = useState(false);
    const [editedAccountName, setEditedAccountName] = useState('');
    const [accountNameError, setAccountNameError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const isMounted = useRef(true); // Use a ref to check if the component is mounted
    const [headerName, setHeaderName] = useState(''); // State to hold the header name



    useEffect(() => {
      // Fetch the list of accounts from the backend using the getAccounts API
      const fetchAccounts = async () => {
        try {
          const accounts = await Apis.getAccounts();
          setAccountList(accounts);
    
          // Update the selected account name and fetch account entries
          setSelectedAccountName(accountName);
    
          // Fetch account entries only if the component is mounted
          if (isMounted.current) {
            fetchAccountEntries(accountName); // Pass accountName to fetchAccountEntries
            // Set isMounted to false after the first render
            isMounted.current = false;
          }
        } catch (error) {
          // Handle errors
          console.error('Fetch accounts error:', error);
        }
      };
    
      // Fetch Account entries when the component mounts
      const fetchAccountEntries = async (accountName) => { // Accept accountName as a parameter
        try {
          const entries = await Apis.getAccountEntries(accountName); // Use accountName here
          setAccountEntries(entries.value.rows);
    
          // Set category based on the first entry's category value
          if (entries.value.rows.length > 0) {
            const initialCategory = entries.value.rows[0].category;
            setCategory(initialCategory);
      
            // Enable checkboxes based on the initial category
            setNonExpenseChecked(initialCategory === 1);
            setFixedMonthlyChecked(initialCategory === 2);
            setVariableChecked(initialCategory === 3);
            setTemporaryChecked(initialCategory === 4);
          }
      
        } catch (error) {
          console.error('Fetch account entries error:', error);
        } finally {
          setLoading(false);
        }
      };
    
      // Fetch accounts and account entries when the component mounts
      fetchAccounts();

      setEditedAccountName(accountName); // Set editedAccountName to the selected account name
    
    }, [accountName, selectedAccountName]);
    
    useEffect(() => {
      setHeaderName(editedAccountName);
    }, [editedAccountName]);
  
    
  
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
  
    // Render the Debit and Credit columns with currency formatting
    const renderCurrency = (value) => {
      // Check if the value is greater than 0
      if (value > 0) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      } else {
        // If the value is 0, display '0.00'
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(0);
      }
    };

    const handleNonExpenseChange = () => {
      setNonExpenseChecked(true);
      setFixedMonthlyChecked(false);
      setVariableChecked(false);
      setTemporaryChecked(false);
      setCategory(1);
      setCategoryError(''); // Reset category error
    };
    
    const handleFixedMonthlyChange = () => {
      setNonExpenseChecked(false);
      setFixedMonthlyChecked(true);
      setVariableChecked(false);
      setTemporaryChecked(false);
      setCategory(2);
      setCategoryError(''); // Reset category error
    };
    
    const handleVariableChange = () => {
      setNonExpenseChecked(false);
      setFixedMonthlyChecked(false);
      setVariableChecked(true);
      setTemporaryChecked(false);
      setCategory(3);
      setCategoryError(''); // Reset category error
    };
    
    const handleTemporaryChange = () => {
      setNonExpenseChecked(false);
      setFixedMonthlyChecked(false);
      setVariableChecked(false);
      setTemporaryChecked(true);
      setCategory(4);
      setCategoryError(''); // Reset category error 
    };

    const validateAccountName = () => {
      // Trim editedAccountName to remove leading and trailing whitespaces
      const trimmedEditedAccountName = editedAccountName.trim();
    
      // Check if the trimmed editedAccountName is empty
      if (trimmedEditedAccountName === '') {
        setAccountNameError('Please enter a name for the account');
        return false;
      }
    
      // Check if the editedAccountName is the same as the original selectedAccountName
      if (trimmedEditedAccountName === selectedAccountName) {
        // No need to check further if it's the same as the original name
        setAccountNameError('');
        return true;
      }
    
      // Check if the editedAccountName already exists in the accountList
      if (accountList.includes(trimmedEditedAccountName)) {
        setAccountNameError('Account Name already exists');
        return false;
      }
    
      // If all checks pass, clear any previous errors
      setAccountNameError('');
      return true;
    };

    const handleSaveChanges = async () => {
      // Validate account name
      const isAccountNameValid = validateAccountName();
    
      // Check if at least one checkbox is checked
      const isCategorySelected = fixedMonthlyChecked || variableChecked || temporaryChecked || nonExpenseChecked;
    
      if (!isCategorySelected) {
        // Display error for no category selected
        setCategoryError('Please select a category for this account');
        return;
      } else {
        // Clear category error if category is selected
        setCategoryError('');
      }
    
      // If the account name is valid and at least one checkbox is checked, proceed with save changes logic
      if (isAccountNameValid) {
        try {
          const response = await Apis.saveAccountChanges(selectedAccountName, editedAccountName, category);

          // If the API call is successful, update selectedAccountName
      if (response.success) {
        setSelectedAccountName(editedAccountName);
      }

        } catch (error) {
          // Handle errors if any
          console.error('Save changes error:', error);
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
  
        {/* Loading Indicator */}
        {loading && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
                <p>Loading...</p>
              </div>
        )}
      {/* Page Header */}
      <div className="page-header" style={{ backgroundColor: '#E1DDE8', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>
          {`Edit/View Account: ${headerName}`}
        </h1>
      </div>

      {/* Account Entries Table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table className="journal-table">
          <TableHead>
            {/* Additional row for expense type selection */}
            <TableRow style={{ backgroundColor: '#C3CBC0' }}>
              <TableCell colSpan={5}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select Type of Expense</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox checked={nonExpenseChecked} onChange={handleNonExpenseChange} />}
                      label="Non-Expense"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={fixedMonthlyChecked} onChange={handleFixedMonthlyChange} />}
                      label="Fixed Monthly"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={variableChecked} onChange={handleVariableChange} />}
                      label="Variable"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={temporaryChecked} onChange={handleTemporaryChange} />}
                      label="Temporary"
                    />
                  </FormGroup>
                  {/* Display the category error, if any */}
                  {Boolean(categoryError) && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {categoryError}
                    </div>
                  )}
                </FormControl>
              </TableCell>
            </TableRow>

            {/* Additional row for editing Account Name */}
            <TableRow style={{ backgroundColor: '#C3CBC0' }}>
              <TableCell colSpan={5}>
                <TextField
                  fullWidth
                  label="Account Name"
                  value={editedAccountName}
                  onChange={(e) => setEditedAccountName(e.target.value)}
                  error={Boolean(accountNameError)}
                  helperText={accountNameError}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                  style={{ marginLeft: '10px' }}
                >
                  Save Changes
                </Button>
              </TableCell>
            </TableRow>

            <TableRow style={{ backgroundColor: '#C3CBC0' }}>
              <TableCell style={{ width: '20%' }}>Date</TableCell>
              <TableCell style={{ width: '25%' }}>Description</TableCell>
              <TableCell style={{ width: '17%' }}>Debit +</TableCell>
              <TableCell style={{ width: '18%' }}>Credit -</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountEntries.map((entry, index) => (
              <TableRow
                key={index}
                style={{ backgroundColor: index % 2 === 0 ? '#E1DDE8' : '#C3CBC0' }}
                >
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.debit > 0 ? renderCurrency(entry.debit) : renderCurrency(0)}</TableCell>
                <TableCell>{entry.credit > 0 ? renderCurrency(entry.credit) : renderCurrency(0)}</TableCell>
              </TableRow>
              ))}
            </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EditAccount;