import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
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

const AdjustableBudget = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue, setNavigateValue] = useState('');
    const [viewEditValue, setViewEditValue] = useState('');
    const [reportsValue, setReportsValue] = useState('');
    const [createValue, setCreateValue] = useState('');
    const [helpValue, setHelpValue] = useState('');
    const [logoutValue, setLogoutValue] = useState('');   
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
    const [loading, setLoading] = useState(true); // State to indicate if the page is loading
    const [totals, setTotals] = useState({ totalsList: [] }); // State to hold the totals
    const [expenseColumn, setExpenseColumn] = useState([]);
    const [expenseTotalColumn, setExpenseTotalColumn] = useState([]);
    const [incomeDebtColumn, setIncomeDebtColumn] = useState([]);
    const [incomeDebtTotalColumn, setIncomeDebtTotalColumn] = useState([]);
    const [assetColumn, setAssetColumn] = useState([]);
    const [assetTotalColumn, setAssetTotalColumn] = useState([]);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [assetTotal, setAssetTotal] = useState(0);
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseColor, setExpenseColor] = useState([]);
    const [remainingTotal, setRemainingTotal] = useState(0);
    const [startingTotal, setStartingTotal] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Get the current month [0-11
    const [bColumn1, setBColumn1] = useState(['Starting Balance', 'Total Expenses', 'Total Remaining']);
    const [bColumn2, setBColumn2] = useState([]);
    const [bColumn3, setBColumn3] = useState([]);
    const [bColumn4, setBColumn4] = useState([]);
    const [bColumn5, setBColumn5] = useState([]);
    const [bColumn6, setBColumn6] = useState([]);
    const [bColumn7, setBColumn7] = useState([]);
    const [budgetRows, setBudgetRows] = useState([0, 1, 2]);

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

      // Fetch the averages from the backend using the getAverages API
      const fetchAverages = async () => {
        try
        {
          // Call the getAverages API
          const averagesData = await Apis.getAverages();
  
          // Log the received data
          console.log('Averages Data:', averagesData.value.averagesList);
    
          // Initialize separate arrays for each column
          const expenseColumnData = [];
          const expenseTotalColumnData = [];
          const incomeDebtColumnData = [];
          const incomeDebtTotalColumnData = [];
          const assetColumnData = [];
          const assetTotalColumnData = [];
          const colorData = [];

          let eTotal = 0;
          let aTotal = 0;
          let iTotal = 0;
          let stTotal = 0;
          let rTotal = 0;
      
          //calculation problems
          // Populate the arrays based on the category
          averagesData.value.averagesList.forEach(account => {
            if (account) {
              switch (account.type) {
                case 1:
                  incomeDebtColumnData.push(account.accountName);
                  incomeDebtTotalColumnData.push(renderCurrency(account.total));
                  iTotal += account.total;
                  break;
                case 4:
                  incomeDebtColumnData.push(account.accountName);
                  incomeDebtTotalColumnData.push(renderCurrency(account.total));
                  break;
                case 2:
                  assetColumnData.push(account.accountName);
                  assetTotalColumnData.push(renderCurrency(account.total));
                  aTotal += account.total;
                  break;
                case 3:
                  expenseColumnData.push(account.accountName);
                  expenseTotalColumnData.push(renderCurrency(account.total));
                  eTotal += account.total;
                  colorData.push(account.category);
                  break;
                default:
                  break;
              }
            }
          });

          // Add a separator row
          assetColumnData.push('----------');
          assetTotalColumnData.push('----------');
          expenseColumnData.push('----------');

          assetColumnData.push('Total:');
          assetTotalColumnData.push(renderCurrency(aTotal));
          expenseColumnData.push('Total:');

          stTotal = aTotal + iTotal;
          rTotal = stTotal - eTotal;

          console.log('Expense Column Data Length:', expenseColumnData.length);
          console.log('Expense Total Column Data Length:', expenseTotalColumnData.length);

          // Update the state with the populated arrays
          setIncomeDebtColumn(incomeDebtColumnData);
          setIncomeDebtTotalColumn(incomeDebtTotalColumnData);
          setAssetColumn(assetColumnData);
          setAssetTotalColumn(assetTotalColumnData);
          setExpenseColumn(expenseColumnData);
          setExpenseTotalColumn(expenseTotalColumnData);
          setExpenseColor(colorData);
          setExpenseTotal(eTotal);
          setAssetTotal(aTotal);
          setIncomeTotal(iTotal);
          setStartingTotal(stTotal);
          setRemainingTotal(rTotal);
          
          console.log('Expense Column Data Length:', expenseColumn.length);
          console.log('Expense Total Column Data Length:', expenseTotalColumn.length);

          setLoading(false); // Set loading to false once data is fetched
          
        }
        catch (error)
        {
          // Handle errors
          console.error('Fetch totals error:', error);
        }
      };

      
      fetchAverages(); // Call the fetchTotals function to get the totals

    }, []);

    useEffect(() => {
      startBudget(); // Call startBudget when this component mounts or when certain dependencies change
    }, [incomeTotal]);

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

  const renderCurrency = (value) => {
    // Check if the value is greater than 0
    if (value > 0) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else {
      // If the value is 0, display '0.00'
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(0);
    }
  };

  // Helper function to get background color based on category
  const getExpenseColor = (category) => {
    switch (category) {
      case 2:
        return '#CC00CC'; // Yellow for category 1
      case 3:
        return '#50D092'; // Orange-Red for category 2
      case 4:
        return '#00C0FF'; // Blue-Violet for category 3
      // Add more cases as needed
      default:
        return '#FFFFFF'; // Default to white
    }
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex % 12];
  };  

  const startBudget = () => {
    // Array to hold calculated values
    let calcedValues;
    let stVal = 0;
    let expVal = expenseTotal;
    let asVal = assetTotal;
    let inVal = incomeTotal;
    let remVal = 0;

    console.log('startingTotal:', startingTotal);
    console.log('expenseTotal:', expenseTotal);
    console.log('remainingTotal:', remainingTotal);
    console.log('assetTotal:', assetTotal);
    console.log('incomeTotal:', incomeTotal);
    console.log('expenseTotal:', expenseTotal);

    stVal = asVal + inVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn2(calcedValues);

    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn3(calcedValues);

    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn4(calcedValues);

    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn5(calcedValues);

    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn6(calcedValues);

    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn7(calcedValues);
};

const setBudgetExpense = () => {

  let newTotalExpense = expenseTotal;
  let stVal = 0;
  let asVal = assetTotal;
  let inVal = incomeTotal;
  let remVal = 0;
  
  console.log ('Expense Total: ', newTotalExpense);
  
  {/*make a copy of const [bColumn2, setBColumn2] = useState([]); and update the second value with the new total expense*/}
  
  const updatedBColum2Copy = [...bColumn2]; // Make a copy of the bColumn2 state
  updatedBColum2Copy[1] = newTotalExpense; // Update the second value with the new total expense
  setBColumn2(updatedBColum2Copy); // Update the bColumn2 state with the new copy
  
  {/*make a copy of const [bColumn3, setBColumn3] = useState([]); and update the second value with the new total expense*/}
  const updatedBColum3Copy = [...bColumn3];
  updatedBColum3Copy[1] = newTotalExpense;
  setBColumn3(updatedBColum3Copy);
  
  {/*make a copy of const [bColumn4, setBColumn4] = useState([]); and update the second value with the new total expense*/}
  const updatedBColum4Copy = [...bColumn4];
  updatedBColum4Copy[1] = newTotalExpense;
  setBColumn4(updatedBColum4Copy);

  {/*make a copy of const [bColumn5, setBColumn5] = useState([]); and update the second value with the new total expense*/}
  const updatedBColum5Copy = [...bColumn5];
  updatedBColum5Copy[1] = newTotalExpense;
  setBColumn5(updatedBColum5Copy);

  {/*make a copy of const [bColumn6, setBColumn6] = useState([]); and update the second value with the new total expense*/}
  const updatedBColum6Copy = [...bColumn6];
  updatedBColum6Copy[1] = newTotalExpense;
  setBColumn6(updatedBColum6Copy);

  {/*make a copy of const [bColumn7, setBColumn7] = useState([]); and update the second value with the new total expense*/}
  const updatedBColum7Copy = [...bColumn7];
  updatedBColum7Copy[1] = newTotalExpense;
  setBColumn7(updatedBColum7Copy); 
  
  };

const isValidInput = (input) => {
  const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(input);
  return isValid ? '' : 'Invalid input. Please enter a valid dollar amount.';
};

// Function to handle expense value changes
const handleExpenseChange = (event, index) => {
  const newValue = event.target.value; // Get the new value from the input box
  if (!isValidInput(newValue)) {
    // If the input is not a valid dollar value, return
    console.error('Invalid input. Please enter a valid dollar amount.');
    return;
  }
  
  // Update the expenseTotalColumn state with the new value
  const updatedExpenseTotalColumn = [...expenseTotalColumn];
  updatedExpenseTotalColumn[index] = newValue;
  setExpenseTotalColumn(updatedExpenseTotalColumn);

  // Recalculate and update the total expense
  const newTotalExpense = calculateTotalExpense(updatedExpenseTotalColumn);
  setExpenseTotal(newTotalExpense);

    // Recalculate and update the remaining total
    const newRemainingTotal = startingTotal - newTotalExpense;
    setRemainingTotal(newRemainingTotal);
  
    // Recalculate and update the budget section
    startBudget();

    setBudgetExpense();
};

// Function to calculate the total expense based on the updated expense values
const calculateTotalExpense = (updatedExpenseTotalColumn) => {
  // Iterate through the updated expense values and sum them up
  let totalExpense = 0;
  updatedExpenseTotalColumn.forEach((value) => {
    totalExpense += parseFloat(value.replace(/\$|,/g, '')); // Convert string value to number
  });
  return totalExpense;
};

const handleExpenseBlur = (event, index) => {
  // Extract numeric value (remove dollar sign and commas)
  const newValue = event.target.value.replace(/\$|,/g, '');
  const numericValue = parseFloat(newValue);

  // Format the numeric value as currency
  const formattedValue = renderCurrency(numericValue);

  // Update the expense value
  const updatedExpenseTotalColumnCopy = [...expenseTotalColumn];
  updatedExpenseTotalColumnCopy[index] = formattedValue;
  setExpenseTotalColumn(updatedExpenseTotalColumnCopy);

  startBudget();
  
  setBudgetExpense();

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
          {`Report: Totals for current month and year`}
        </h1>
      </div>


    {/* Totals Section */}
    <div style={{ margin: '20px' }}>
    {/* Legend */}
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#E1DDE8' }}>
      <thead>
        <tr>
          <th style={{ padding: '10px', backgroundColor: '#FFFFFF' }}>Color Legend</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ width: '20%', backgroundColor: '#CC00CC', padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Fixed Monthly</td>
          <td style={{ width: '20%', backgroundColor: '#FFFFFF', padding: '10px' }}></td>
          <td style={{ width: '20%', backgroundColor: '#50D092', padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Variable</td>
          <td style={{ width: '20%', backgroundColor: '#FFFFFF', padding: '10px' }}></td>
          <td style={{ width: '20%', backgroundColor: '#00C0FF', padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Temporary</td>
        </tr>
      </tbody>
    </table>

    {/* Totals Table */}
    {!loading && (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Expenses</th>
            <th style={{ textAlign: 'left' }}>Expense Totals</th>
            <th style={{ textAlign: 'left' }}>Income/Debt</th>
            <th style={{ textAlign: 'left' }}>Income/Debt Totals</th>
            <th style={{ textAlign: 'left' }}>Assets</th>
            <th style={{ textAlign: 'left' }}>Asset Totals</th>
          </tr>
        </thead>
        <tbody>
          {/* Render rows based on the totals */}
          {accountList.map((_, index) => (
    <tr key={index}>
        {/* Expense Column */}
        <td style={{ backgroundColor: getExpenseColor(expenseColor[index]) }}>
            {index < expenseColumn.length ? expenseColumn[index] : null}
        </td>
        {/* Input box for expense totals */}
        <td>
            {index < expenseTotalColumn.length && (
                <input
                    type="text"
                    value={expenseTotalColumn[index]} // Populate with initial expense values
                    onChange={(event) => handleExpenseChange(event, index)} // Handle value changes
                    onBlur={(event) => handleExpenseBlur(event, index)} // Handle blur event for formatting
                />
            )}
        </td>
        {/* Render other columns */}
        <td>{index < incomeDebtColumn.length ? incomeDebtColumn[index] : null}</td>
        <td>{index < incomeDebtTotalColumn.length ? incomeDebtTotalColumn[index] : null}</td>
        <td>{index < assetColumn.length ? assetColumn[index] : null}</td>
        <td>{index < assetTotalColumn.length ? assetTotalColumn[index] : null}</td>
    </tr>
))}
            <tr>
              <td></td> {/* Empty cell for alignment */}
              <td>----------</td>
              <td></td> {/* Empty cells for other columns */}
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td> {/* Empty cell for alignment */}
              <td>{renderCurrency(expenseTotal)}</td>
            </tr>

        </tbody>
      </table>
    )}

    {/* Blank white space */}
    <div style={{ height: '20px' }}></div>

    {/* Budget table */}
    {!loading && (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', backgroundColor: 'white' }}>
      <thead>
        {/* Header row */}
        <tr>
          {/* Empty cell */}
          <th></th>
          {/* Column headers for the next 6 months */}
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <th key={index} style={{ textAlign: 'left' }}>
              {/* Calculate the month name for each column header */}
              {getMonthName(currentMonth + index)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Map through each row index */}
        {budgetRows.map((rowIndex, index) => (
          <tr key={index}>
            {/* Render label for the first column */}
            <td>{bColumn1[index]}</td>
            <td>{renderCurrency(bColumn2[index])}</td>
            <td>{renderCurrency(bColumn3[index])}</td>
            <td>{renderCurrency(bColumn4[index])}</td>
            <td>{renderCurrency(bColumn5[index])}</td>
            <td>{renderCurrency(bColumn6[index])}</td>
            <td>{renderCurrency(bColumn7[index])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

    {!loading && (expenseColumn.length === 0 && incomeDebtColumn.length === 0 && assetColumn.length === 0) && (
      <p>No data available.</p>
    )}

  </div>
  </div>



);
};

export default AdjustableBudget;