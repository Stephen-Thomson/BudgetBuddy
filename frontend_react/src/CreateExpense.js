import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Apis from './Apis';
import {
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
} from '@mui/material';

const CreateExpense = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [navigateValue] = useState(''); // State to hold the selected value for "Navigate"
  const [viewEditValue] = useState(''); // State to hold the selected value for "View/Edit"
  const [reportsValue] = useState(''); // State to hold the selected value for "Reports"
  const [createValue] = useState(''); // State to hold the selected value for "Create"
  const [helpValue] = useState(''); // State to hold the selected value for "Help"
  const [logoutValue] = useState(''); // State to hold the selected value for "Logout"
  const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
  const [type] = useState(3); // Replace 0 with your initial value
  const [category, setCategory] = useState(0); // Replace 0 with your initial value
  const [accountName, setAccountName] = useState(''); // State to hold the account name
  const [dvalue, setDvalue] = useState('0.00'); // This will hold the value
  const [cvalue, setCvalue] = useState('0.00'); // This will hold the value
  const [description] = useState('Created'); // State to hold the description
  const [rows] = useState(Array(10).fill(null).map((_, index) => ({ id: index, color: index % 2 === 0 ? '#E1DDE8' : '#C3CBC0' }))); // Rows for the table
  const [accountNameError, setAccountNameError] = useState(''); // State to hold the account name error
  const [categoryError, setCategoryError] = useState(''); // State to hold the category error
  const [fixedMonthlyChecked, setFixedMonthlyChecked] = useState(false); // State to hold the checked status for Fixed Monthly
  const [variableChecked, setVariableChecked] = useState(false); // State to hold the checked status for Variable
  const [temporaryChecked, setTemporaryChecked] = useState(false); // State to hold the checked status for Temporary

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
  
    // Function to validate the account name
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
    
    // Function to handle the checkbox for Fixed Monthly
    const handleFixedMonthlyChange = () => {
      setFixedMonthlyChecked(true);
      setVariableChecked(false);
      setTemporaryChecked(false);
      setCategory(2);
    };
  
    // Function to handle the checkbox for Variable
    const handleVariableChange = () => {
      setFixedMonthlyChecked(false);
      setVariableChecked(true);
      setTemporaryChecked(false);
      setCategory(3);
    };
  
    // Function to handle the checkbox for Temporary
    const handleTemporaryChange = () => {
      setFixedMonthlyChecked(false);
      setVariableChecked(false);
      setTemporaryChecked(true);
      setCategory(4);
    };
  
    // Function to handle the Create button click
    const handleCreateAccountClick = async () => {
      // Validate the account name
      const isAccountNameValid = validateAccountName();
    
      // Validate the expense category
      let categoryError = '';
      if (![2, 3, 4].includes(category)) {
        categoryError = 'Select a Type of Expense';
      }
    
      // If the account name is valid and the category is selected, proceed with API call
      if (isAccountNameValid && !categoryError) {
        try {
          // Call the API to create the account table
          const response = await Apis.createAccountTable(type, category, accountName, description, dvalue, cvalue);
    
          // Reset form fields after successful submission
          setAccountName('');
          setDvalue('0.00');
          setCvalue('0.00');
          setAccountNameError('');
          setFixedMonthlyChecked(false);
          setVariableChecked(false);
          setTemporaryChecked(false);
          setCategoryError('');
        } catch (error) {
          // Error code
          console.error('Create Account API error:', error);
        }
      } else {
        // Set category error in state
        setCategoryError(categoryError);
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>Create Expense Account</h1>
      </div>

      {/* Displayed Rows Table */}
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

            {/* Header row */}
            <TableRow style={{ backgroundColor: '#C3CBC0' }}>
              <TableCell style={{ width: '20%' }}>Date</TableCell>
              <TableCell style={{ width: '20%' }}>Account Name</TableCell>
              <TableCell style={{ width: '25%' }}>Description</TableCell>
              <TableCell style={{ width: '17%' }}>Debit +</TableCell>
              <TableCell style={{ width: '18%' }}>Credit -</TableCell>
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
                      {/* Description column indicating it's creation */}
                      Created
                    </TableCell>

                    <TableCell>
                      {/* Debit Column" */}
                      $0.00
                    </TableCell>


                    <TableCell>
                      {/* Credit Column" */}
                      $0.00
                    </TableCell>

                  </React.Fragment>
                  ) : (
                  // Render content for other rows (blank)
                  <React.Fragment>
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

export default CreateExpense;