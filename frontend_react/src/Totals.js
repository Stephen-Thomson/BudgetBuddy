import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Apis from './Apis';
import { CircularProgress } from '@mui/material';

const Totals = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue] = useState(''); // State to hold the value of the "Navigate" dropdown menu
    const [viewEditValue] = useState(''); // State to hold the value of the "View/Edit" dropdown menu
    const [reportsValue] = useState(''); // State to hold the value of the "Reports" dropdown menu
    const [createValue] = useState(''); // State to hold the value of the "Create" dropdown menu
    const [helpValue] = useState(''); // State to hold the value of the "Help" dropdown menu
    const [logoutValue] = useState(''); // State to hold the value of the "Logout" dropdown menu
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
    const [loading, setLoading] = useState(true); // State to indicate if the page is loading
    const [expenseColumn, setExpenseColumn] = useState([]); // State to hold the list of expenses
    const [expenseTotalColumn, setExpenseTotalColumn] = useState([]); // State to hold the total expenses
    const [incomeDebtColumn, setIncomeDebtColumn] = useState([]); // State to hold the list of income/debt accounts
    const [incomeDebtTotalColumn, setIncomeDebtTotalColumn] = useState([]); // State to hold the total income/debt accounts
    const [assetColumn, setAssetColumn] = useState([]); // State to hold the list of assets
    const [assetTotalColumn, setAssetTotalColumn] = useState([]); // State to hold the total assets
    const [expenseColor, setExpenseColor] = useState([]); // State to hold the color of expenses
    //const [expenseTotal, setExpenseTotal] = useState(0); // State to hold the total expenses
    //const [assetTotal, setAssetTotal] = useState(0); // State to hold the total assets

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
        
            // Initialize separate arrays for each column
            const expenseColumnData = [];
            const expenseTotalColumnData = [];
            const incomeDebtColumnData = [];
            const incomeDebtTotalColumnData = [];
            const assetColumnData = [];
            const assetTotalColumnData = [];
            const colorData = [];

            // Initialize total variables
            let eTotal = 0;
            let aTotal = 0;
        
            // Populate the arrays based on the category
            totalsData.value.totalsList.forEach(account => {
              if (account) {
                switch (account.type) {
                  case 1: // Income
                    incomeDebtColumnData.push(account.accountName);
                    incomeDebtTotalColumnData.push(renderCurrency(account.total));
                    break;
                  case 4: // Debt
                    incomeDebtColumnData.push(account.accountName);
                    incomeDebtTotalColumnData.push(renderCurrency(account.total));
                    break;
                  case 2: // Asset
                    assetColumnData.push(account.accountName);
                    assetTotalColumnData.push(renderCurrency(account.total));
                    aTotal += account.total;
                    break;
                  case 3: // Expense
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

            // Add the total row
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

            setLoading(false); // Set loading to false once data is fetched
          } catch (error) {
            // Error code
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
  

    // Helper function to render currency in USD format
    const renderCurrency = (value) => {
      // Check if the value is greater than 0
      if (value > 0) {
        // Return the value in currency format
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
          return '#CC00CC'; // Purple for category 2 - Fixed Monthly
        case 3:
          return '#50D092'; // Green for category 3 - Variable
        case 4:
          return '#00C0FF'; // Orange for category 4 - Temporary
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
            {/* Table Header */}
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
                {/* Expense Total Column */}
                <td>{expenseTotalColumn[index]}</td>
                {/* Income/Debt Column */}
                <td>{incomeDebtColumn[index]}</td>
                {/* Income/Debt Total Column */}
                <td>{incomeDebtTotalColumn[index]}</td>
                {/* Asset Column */}
                <td>{assetColumn[index]}</td>
                {/* Asset Total Column */}
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