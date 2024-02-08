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

const Totals = () => {
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
    const [expenseColor, setExpenseColor] = useState([]);



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

        // Fetch the totals from the backend using the getTotals API
        const fetchTotals = async () => {
          try {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Months are zero-based
            const currentYear = currentDate.getFullYear();
            const totalsData = await Apis.getTotals(currentMonth, currentYear);
        
            // Log the received data
            console.log('Totals Data:', totalsData.value.totalsList);
            //setTotals(totalsData.value.totalsList); // Update the state with the fetched totals
        
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
        
            //calculation problems
            // Populate the arrays based on the category
            totalsData.value.totalsList.forEach(account => {
              if (account) {
                switch (account.type) {
                  case 1:
                    incomeDebtColumnData.push(account.accountName);
                    incomeDebtTotalColumnData.push(renderCurrency(account.total));
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
            expenseTotalColumnData.push('----------');

            assetColumnData.push('Total:');
            assetTotalColumnData.push(renderCurrency(aTotal));
            expenseColumnData.push('Total:');
            expenseTotalColumnData.push(renderCurrency(eTotal));

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
            
            console.log('Expense Column:', expenseColumn);
            console.log('Expense Total Column:', expenseTotalColumn);
            console.log('Income/Debt Column:', incomeDebtColumn);
            console.log('Income/Debt Total Column:', incomeDebtTotalColumn);
            console.log('Asset Column:', assetColumn);
            console.log('Asset Total Column:', assetTotalColumn);

            setLoading(false); // Set loading to false once data is fetched
          } catch (error) {
            // Handle errors
            console.error('Fetch totals error:', error);
          }
        };
        

        fetchTotals(); // Call the fetchTotals function to get the totals

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
            {accountList.map((account, index) => (
              <tr key={index}>
                {/* Expense Column */}
                <td style={{ backgroundColor: getExpenseColor(expenseColor[index]) }}>{expenseColumn[index]}</td>
                <td>{expenseTotalColumn[index]}</td>
                <td>{incomeDebtColumn[index]}</td>
                <td>{incomeDebtTotalColumn[index]}</td>
                <td>{assetColumn[index]}</td>
                <td>{assetTotalColumn[index]}</td>
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


export default Totals;