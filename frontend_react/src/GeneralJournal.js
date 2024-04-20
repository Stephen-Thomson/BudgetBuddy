import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Select,
  MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Apis from './Apis';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles for the date picker


const GeneralJournal = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue] = useState(''); // State to hold the selected value for "Navigate"
    const [viewEditValue] = useState(''); // State to hold the selected value for "View/Edit"
    const [reportsValue] = useState(''); // State to hold the selected value for "Reports"
    const [createValue] = useState(''); // State to hold the selected value for "Create"
    const [helpValue] = useState(''); // State to hold the selected value for "Help"
    const [logoutValue] = useState(''); // State to hold the selected value for "Logout"
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
    const [rows, setRows] = useState(Array(10).fill(null).map((_, index) => ({ id: index, color: index % 2 === 0 ? '#E1DDE8' : '#C3CBC0' }))); // Rows for the journal entries
    const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date
    const [accounts, setAccounts] = useState([]); // State to hold the accounts
    const [descriptions, setDescriptions] = useState(['']); // State to hold the descriptions
    const [debits, setDebits] = useState([]); // State to hold the debits
    const [credits, setCredits] = useState([]); // State to hold the credits
    const [debitErrors, setDebitErrors] = useState(Array(10).fill('')); // State to hold the debit errors
    const [creditErrors, setCreditErrors] = useState(Array(10).fill('')); // State to hold the credit errors
    const [validationErrors, setValidationErrors] = useState([]); // State to hold the validation errors
    const [postButtonClicked, setPostButtonClicked] = useState(false); // State to track if the post button was clicked

    useEffect(() => {
        // Fetch the list of accounts from the backend using the getAccounts API
        const fetchAccounts = async () => {
          try {
            const accounts = await Apis.getAccounts();
            //console.log('API Response:', accounts);
            setAccountList(accounts);
          } catch (error) {
            // Error code
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
     
    // Function to add more rows to the journal entries table
    const addRows = () => {
      const newRows = Array(10).fill(null).map((_, index) => ({ id: rows.length + index, color: (rows.length + index) % 2 === 0 ? '#E1DDE8' : '#C3CBC0' }));
      setRows([...rows, ...newRows]);
    };
    
    {/* Function to handle key press (e.g., "Tab" key) */}
    const handleKeyPress = (event) => {
        // Check if the "Tab" key was pressed on the last row
        const currentId = event.target.id; // Get the id of the current element

      if (event.key === 'Tab') {
        // Add more rows when the "Tab" key is pressed
        // if (currentId !== '') {
        //   console.log(accounts);
        //   console.log(descriptions);
        //   console.log(debits);
        //   console.log(credits);
        // }
        if (currentId === `credit-${rows.length - 1}`) {
          addRows();
        }
      }
    };

    // Function to handle date changes
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    // Function to validate the input in the Debit and Credit columns
    const isValidInput = (input) => {
      const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(input);
      return isValid ? '' : 'Invalid input. Please enter a valid dollar amount.';
    };
  
    // Function to handle selecting an account for the Account column
    const handleAccountSelect = (event, rowIndex) => {
      const selectedAccount = event.target.value;

      // Update the accounts array with the selected account at the specified rowIndex
      const updatedAccounts = [...accounts];
      updatedAccounts[rowIndex] = selectedAccount;
      setAccounts(updatedAccounts);
    };

    // Function to handle changing the Description in a specific row
    const handleDescriptionChange = (event, rowIndex) => {
      const { value } = event.target;
      const newDescriptions = [...descriptions];
      newDescriptions[rowIndex] = value;
      setDescriptions(newDescriptions);
    };

    // Function to handle changes in the Debit column
    const handleDebitChange = (event, rowIndex) => {
      const { value } = event.target;
      // Validate the input
      const errorMessage = isValidInput(value);
      
      const newDebitErrors = [...debitErrors];
      newDebitErrors[rowIndex] = errorMessage;
      setDebitErrors(newDebitErrors);

      // Update the debits array with the new value at the specified rowIndex
      if (errorMessage === '') {
        const newDebit = [...debits];
        newDebit[rowIndex] = value;
        setDebits(newDebit);

        // Clear the credit value for the same row
        const newCredits = [...credits];
        newCredits[rowIndex] = '0.00';
        setCredits(newCredits);
      }
    };

    // Function to handle changes in the Credit column
    const handleCreditChange = (event, rowIndex) => {
      const { value } = event.target;
      const errorMessage = isValidInput(value);

      const newCreditErrors = [...creditErrors];
      newCreditErrors[rowIndex] = errorMessage;
      setCreditErrors(newCreditErrors);

      // Update the credits array with the new value at the specified rowIndex
      if (errorMessage === '') {
        const newCredit = [...credits];
        newCredit[rowIndex] = value;
        setCredits(newCredit);

        // Clear the debit value for the same row
        const newDebits = [...debits];
        newDebits[rowIndex] = '0.00';
        setDebits(newDebits);
      }
    };


    // Function to handle blur in the Debit column
    const handleDebitBlur = (event, rowIndex) => {
      const numericValue = parseFloat(event.target.value);
      const formattedValue = isNaN(numericValue) ? '' : `$${numericValue.toFixed(2)}`;

      const newDebits = [...debits];
      newDebits[rowIndex] = formattedValue;
      setDebits(newDebits);
    };

    // Function to handle blur in the Credit column
    const handleCreditBlur = (event, rowIndex) => {
      const numericValue = parseFloat(event.target.value);
      const formattedValue = isNaN(numericValue) ? '' : `$${numericValue.toFixed(2)}`;

      const newCredits = [...credits];
      newCredits[rowIndex] = formattedValue;
      setCredits(newCredits);
    };

    // Function to validate the rows in the journal entries table
    const validateRows = () => {
      const errors = [];

      // Iterate over each row in the table
      rows.forEach((row, rowIndex) => {
        const account = accounts[rowIndex];
        const debit = debits[rowIndex] ? parseFloat((debits[rowIndex] || '').replace('$', '')) : 0;
        const credit = credits[rowIndex] ? parseFloat((credits[rowIndex] || '').replace('$', '')) : 0;

        // Check if the row has input in at least one column
        if (account || debit !== 0 || credit !== 0) {
          // Check individual columns for errors
          if (!account) {
            errors.push(`Please select an account for row ${rowIndex + 1}.`);
          }

          // Check if both debit and credit columns have values
          if (debit === 0 && credit === 0) {
            errors.push(`Please enter a value in either debit or credit for row ${rowIndex + 1}.`);
          }
        }
      });

      // Check if the debit and credit totals match
      const debitTotal = debits.reduce((total, value) => total + (parseFloat((value || '').replace('$', '')) || 0), 0).toFixed(2);
      const creditTotal = credits.reduce((total, value) => total + (parseFloat((value || '').replace('$', '')) || 0), 0).toFixed(2);

      if (debitTotal !== creditTotal) {
        errors.push('Debit and credit totals do not match.');
      }

      setValidationErrors(errors); // Set errors in state
      return errors;
    };

    // Function to handle posting the journal entries
    const handlePostEntries = async () => {
      // Set postButtonClicked to true
      setPostButtonClicked(true);

      // Validate the rows and get the errors
      const errors = validateRows();

      // Set the validation errors in state
      setValidationErrors(errors);

      // If there are no errors, proceed with posting entries
      if (errors.length === 0) {
        try {
          // Call the API to post entries
          const response = await Apis.postGJ(
            selectedDate,
            accounts,
            descriptions,
            debits,
            credits
          );

          // Optional: Clear validation errors after successful submission
          setValidationErrors([]);

          // Navigate to the GeneralJournal page after successful submission
          navigate('/postSuccess');
        } catch (error) {
          // Error code
          console.error('PostGJ API error:', error);
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>General Journal</h1>
      </div>

      {/* Journal Entries Table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table className="journal-table">
          <TableHead>
            {/* Table Header */}
            <TableRow style={{ backgroundColor: '#C3CBC0' }}>
              <TableCell style={{ width: '20%' }}>Date</TableCell>
              <TableCell style={{ width: '20%' }}>Account</TableCell>
              <TableCell style={{ width: '25%' }}>Description</TableCell>
              <TableCell style={{ width: '17%' }}>Debit</TableCell>
              <TableCell style={{ width: '18%' }}>Credit</TableCell>
            </TableRow>
          </TableHead>
          {/* Rest of the table */}
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                style={{ backgroundColor: row.color }}
                onKeyDown={handleKeyPress}
                tabIndex={0}
              >
                {/* Date Column */}
                <TableCell>
                  {rowIndex === 0 ? (
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="M/dd/yyyy"
                      todayButton="Today"
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                    />

                  ) : null}
                </TableCell>

                {/* Account column (Select menu) */}
                <TableCell>
                    <Select
                      value={accounts[rowIndex] || 'Select Account'}
                      onChange={(event) => handleAccountSelect(event, rowIndex) }
                    >
                      <MenuItem value={"Select Account"}>Select Account</MenuItem>
                      {accountList.map((account) => (
                        <MenuItem key={account} value={account}>
                          {account}
                        </MenuItem>
                      ))}
                    </Select>
                </TableCell>

                {/* Description Column */}
                <TableCell style={{ padding: '16px' }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={descriptions[rowIndex] || ''}
                    onChange={(e) => handleDescriptionChange(e, rowIndex)}
                  />
                </TableCell>

                {/* Debit Column */}
                <TableCell>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={debits[rowIndex] || ''}
                    onChange={(event) => handleDebitChange(event, rowIndex)}
                    onBlur={(event) => handleDebitBlur(event, rowIndex, 4)}
                    error={Boolean(debitErrors[rowIndex])}
                    helperText={debitErrors[rowIndex]}
                  />
                </TableCell>
                      
                {/* Credit Column */}
                <TableCell>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={credits[rowIndex] || ''}
                    onChange={(event) => handleCreditChange(event, rowIndex)}
                    onBlur={(event) => handleCreditBlur(event, rowIndex)}
                    error={Boolean(creditErrors[rowIndex])}
                    helperText={creditErrors[rowIndex]}
                    inputProps={{ id: `credit-${rowIndex}` }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <div className="page-footer" style={{ backgroundColor: '#E1DDE8', textAlign: 'center' }}>
        <Button 
          onClick={handlePostEntries} 
          variant="contained"
          style={{ fontWeight: 'bold', color: 'black', backgroundColor: '#848484' }}>
          Post
        </Button>

        {/* Display validation errors to the user for debit and credit */}
        {postButtonClicked && validationErrors.length > 0 && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {validationErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralJournal;