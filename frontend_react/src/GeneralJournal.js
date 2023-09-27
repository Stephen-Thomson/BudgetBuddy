import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  Container,
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
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import Apis from './Apis';

const GeneralJournalCell = ({ value, onChange, activeCell, cellType }) => {
  const [formattedValue, setFormattedValue] = useState(value);

  const handleBlur = () => {
    // Format the value as a dollar amount and set it to the formattedValue state
    const numericValue = parseFloat(formattedValue);
    const newValue = isNaN(numericValue) ? '' : `$${numericValue.toFixed(2)}`;
    setFormattedValue(newValue);

    // Call the onChange function to update the value in the array
    onChange(newValue); // Pass the formatted value to update the array
  };

  const handleChange = (event) => {
    // Handle changes in the input field, but don't update the state
    // until blur, so that formatting is applied only after editing
    setFormattedValue(event.target.value);
  };

  return (
    <TextField
      value={(activeCell === cellType || activeCell === '') ? formattedValue : ''}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

const GeneralJournal = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
    const [rows, setRows] = useState(Array(26).fill(null).map((_, index) => ({ id: index, color: index % 2 === 0 ? '#E1DDE8' : '#C3CBC0' })));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [accounts, setAccounts] = useState(['']); // Account column
    const [descriptions, setDescriptions] = useState(['']); // Description column
    const [debits, setDebits] = useState(['']); // Debit column
    const [credits, setCredits] = useState(['']); // Credit column
    const [activeCell, setActiveCell] = useState(''); // Initialize the activeCell state

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
     
    {/* Function to add more rows */}
    const addRows = () => {
      const newRows = Array(26).fill(null).map((_, index) => ({ id: rows.length + index, color: (rows.length + index) % 2 === 0 ? '#E1DDE8' : '#C3CBC0' }));
      setRows([...rows, ...newRows]);
    };
    
    {/* Function to handle key press (e.g., "Tab" key) */}
    const handleKeyPress = (event) => {
      // Check if the "Tab" key was pressed on the last row
      if (event.key === 'Tab' && event.target.tagName.toLowerCase() === 'td') {
        // Add more rows when the "Tab" key is pressed
        addRows();
      }
    };

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

      // Function to handle adding a new row
  const addRow = () => {
    // Add empty entries to each column
    setAccounts([...accounts, null]);
    setDescriptions([...descriptions, null]);
    setDebits([...debits, null]);
    setCredits([...credits, null]);
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
  const handleDebitChange = (inputValue, rowIndex) => {
    // Update the Debit value in the array
    const newDebits = [...debits];
    newDebits[rowIndex] = inputValue;
    setDebits(newDebits);

    // Clear the Credit cell visually by setting it to an empty string
    const newCredits = [...credits];
    newCredits[rowIndex] = ''; // Clear the visual representation of the Credit cell
    setCredits(newCredits);

    // Set the active cell to 'Debit' to ensure that the Debit cell is visually cleared
    setActiveCell('Debit');
  };

  // Function to handle changes in the Credit column
  const handleCreditChange = (inputValue, rowIndex) => {
    // Update the Credit value in the array
    const newCredits = [...credits];
    newCredits[rowIndex] = inputValue;
    setCredits(newCredits);

    // Clear the Debit cell visually by setting it to an empty string
    const newDebits = [...debits];
    newDebits[rowIndex] = ''; // Clear the visual representation of the Debit cell
    setDebits(newDebits);

    // Set the active cell to 'Credit' to ensure that the Credit cell is visually cleared
    setActiveCell('Credit');
  };


    const handlePostEntries = () => {
      // This is a placeholder function that currently does nothing.
      // You can add your implementation here when you are ready.
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
              <Select label="Navigate" onChange={handleNavigate}>
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
              <Select label="View/Edit" onChange={handleViewEdit}>
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
              <Select label="Reports" onChange={handleReports}>
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
              <Select label="Create" onChange={handleCreate}>
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
              <Select label="Help" onChange={handleHelp}>
                <MenuItem value="documentation">Documentation</MenuItem>
              </Select>
            </div>
          </div>

          <div style={{ marginRight: '16px', marginLeft: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                Logout
              </Typography>
              <Select label="Logout" onChange={handleLogout}>
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
                {/* Render cells for each column here */}
                {/* Date Column */}
                <TableCell>
                  {rowIndex === 0 ? (
                    <DatePicker value={selectedDate} onChange={handleDateChange} />
                  ) : null}
                </TableCell>

                {/* Account column (Select menu) */}
                <TableCell>
                    <Select
                      value={accounts[rowIndex]}
                      onChange={(event) => handleAccountSelect(event, rowIndex)}
                    >
                      <MenuItem value={null}>Select Account</MenuItem>
                      {accountList.map((account) => (
                        <MenuItem key={account} value={account}>
                          {account}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell style={{ padding: '16px' }}>
                    <input
                      type="text"
                      value={descriptions[rowIndex] || ''}
                      onChange={(e) => handleDescriptionChange(e, rowIndex)}
                      style={{ width: '100%', border: 'none' }} // Optionally, you can adjust the input's width and border styles
                    />
                  </TableCell>

                  <TableCell>
  <GeneralJournalCell
    value={debits[rowIndex]}
    onChange={(value) => handleDebitChange(value, rowIndex)}
    activeCell={activeCell}
    cellType="Debit"
  />
</TableCell>

<TableCell>
  <GeneralJournalCell
    value={credits[rowIndex]}
    onChange={(value) => handleCreditChange(value, rowIndex)}
    activeCell={activeCell}
    cellType="Credit"
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
      </div>
    </div>
  );
};

export default GeneralJournal;