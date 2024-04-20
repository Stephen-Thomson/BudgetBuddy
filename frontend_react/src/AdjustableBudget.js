import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Apis from './Apis';
import { CircularProgress } from '@mui/material';

const AdjustableBudget = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [navigateValue] = useState('');
  const [viewEditValue] = useState('');
  const [reportsValue] = useState('');
  const [createValue] = useState('');
  const [helpValue] = useState('');
  const [logoutValue] = useState('');   
  const [accountList, setAccountList] = useState([]); // State to hold the list of accounts
  const [loading, setLoading] = useState(true); // State to indicate if the page is loading
  const [expenseColumn, setExpenseColumn] = useState([]); // State to hold the list of expense accounts
  const [expenseTotalColumn, setExpenseTotalColumn] = useState([]); // State to hold the list of expense totals
  const [incomeDebtColumn, setIncomeDebtColumn] = useState([]); // State to hold the list of income/debt accounts
  const [incomeDebtTotalColumn, setIncomeDebtTotalColumn] = useState([]); // State to hold the list of income/debt totals
  const [assetColumn, setAssetColumn] = useState([]); // State to hold the list of asset accounts
  const [assetTotalColumn, setAssetTotalColumn] = useState([]); // State to hold the list of asset totals
  const [expenseTotal, setExpenseTotal] = useState(0); // State to hold the total expense
  const [assetTotal, setAssetTotal] = useState(0); // State to hold the total asset
  const [incomeTotal, setIncomeTotal] = useState(0); // State to hold the total income
  const [expenseColor, setExpenseColor] = useState([]); // State to hold the color for each expense category
  const [remainingTotal, setRemainingTotal] = useState(0); // State to hold the remaining total
  const [startingTotal, setStartingTotal] = useState(0); // State to hold the starting total
  const [currentMonth] = useState(new Date().getMonth()); // Get the current month [0-11]
  const [bColumn1] = useState(['Starting Balance', 'Total Expenses', 'Total Remaining']); // Array to hold the first column values
  const [bColumn2, setBColumn2] = useState([]); // State to hold the second column values
  const [bColumn3, setBColumn3] = useState([]); // State to hold the third column values
  const [bColumn4, setBColumn4] = useState([]); // State to hold the fourth column values
  const [bColumn5, setBColumn5] = useState([]); // State to hold the fifth column values
  const [bColumn6, setBColumn6] = useState([]); // State to hold the sixth column values
  const [bColumn7, setBColumn7] = useState([]); // State to hold the seventh column values
  const [budgetRows] = useState([0, 1, 2]); // Array to hold the row indices

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

        // Initialize total variables
        let eTotal = 0;
        let aTotal = 0;
        let iTotal = 0;
        let stTotal = 0;
        let rTotal = 0;
    
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

        // Add the total row
        assetColumnData.push('Total:');
        assetTotalColumnData.push(renderCurrency(aTotal));

        // Calculate the starting total and remaining total
        stTotal = aTotal + iTotal;
        rTotal = stTotal - eTotal;

        //console.log('Expense Column Data Length:', expenseColumnData.length);
        //console.log('Expense Total Column Data Length:', expenseTotalColumnData.length);

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
        
        //console.log('Expense Column Data Length:', expenseColumn.length);
        //console.log('Expense Total Column Data Length:', expenseTotalColumn.length);

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

  // Call the startBudget function when the incomeTotal state changes
  useEffect(() => {
    startBudget(); // Calculate the budget
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

  // Helper function to render currency values
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
        return '#CC00CC'; // Purple for category 2 - Fixed Monthly
      case 3:
        return '#50D092'; // Green for category 3 - Variable
      case 4:
        return '#00C0FF'; // Orange for category 4 - Temporary
      // Add more cases as needed
      default:
        return '#FFFFFF'; // Default to white
    }
  };

  // Get the month name based on the month index
  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex % 12];
  };  

  // Function to start calculating the budget
  const startBudget = () => {
    // Array to hold calculated values
    let calcedValues; // Array to hold calculated values
    let stVal = 0; // Starting total
    let expVal = expenseTotal; // Expense total
    let asVal = assetTotal; // Asset total
    let inVal = incomeTotal; // Income total
    let remVal = 0; // Remaining total

    // console.log('startingTotal:', startingTotal);
    // console.log('expenseTotal:', expenseTotal);
    // console.log('remainingTotal:', remainingTotal);
    // console.log('assetTotal:', assetTotal);
    // console.log('incomeTotal:', incomeTotal);
    // console.log('expenseTotal:', expenseTotal);

    // Calculate the budget for first month
    stVal = asVal + inVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn2(calcedValues);

    // Calculate the budget for the second month
    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn3(calcedValues);

    // Calculate the budget for the third month
    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn4(calcedValues);

    // Calculate the budget for the fourth month
    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn5(calcedValues);

    // Calculate the budget for the fifth month
    stVal = inVal + remVal;
    remVal = stVal - expVal;
    calcedValues = [];
    setStartingTotal(stVal);
    calcedValues.push(stVal);
    calcedValues.push(expVal);
    setRemainingTotal(remVal);
    calcedValues.push(remVal);
    setBColumn6(calcedValues);

    // Calculate the budget for the sixth month
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

  // Function to handle expense value changes
  const setBudgetExpense = () => {
    // Calculate the new total expense
    let newTotalExpense = expenseTotal;
    
    //console.log ('Expense Total: ', newTotalExpense);
    
    //make a copy of const [bColumn2, setBColumn2] = useState([]); and update the second value with the new total expense
    const updatedBColum2Copy = [...bColumn2]; // Make a copy of the bColumn2 state
    updatedBColum2Copy[1] = newTotalExpense; // Update the second value with the new total expense
    setBColumn2(updatedBColum2Copy); // Update the bColumn2 state with the new copy
    
    //make a copy of const [bColumn3, setBColumn3] = useState([]); and update the second value with the new total expense
    const updatedBColum3Copy = [...bColumn3]; // Make a copy of the bColumn3 state
    updatedBColum3Copy[1] = newTotalExpense; // Update the second value with the new total expense
    setBColumn3(updatedBColum3Copy); // Update the bColumn3 state with the new copy
    
    //make a copy of const [bColumn4, setBColumn4] = useState([]); and update the second value with the new total expense
    const updatedBColum4Copy = [...bColumn4]; // Make a copy of the bColumn4 state
    updatedBColum4Copy[1] = newTotalExpense; // Update the second value with the new total expense
    setBColumn4(updatedBColum4Copy); // Update the bColumn4 state with the new copy

    //make a copy of const [bColumn5, setBColumn5] = useState([]); and update the second value with the new total expense
    const updatedBColum5Copy = [...bColumn5]; // Make a copy of the bColumn5 state
    updatedBColum5Copy[1] = newTotalExpense; // Update the second value with the new total expense
    setBColumn5(updatedBColum5Copy); // Update the bColumn5 state with the new copy

    //make a copy of const [bColumn6, setBColumn6] = useState([]); and update the second value with the new total expense
    const updatedBColum6Copy = [...bColumn6]; // Make a copy of the bColumn6 state
    updatedBColum6Copy[1] = newTotalExpense; // Update the second value with the new total expense
    setBColumn6(updatedBColum6Copy); // Update the bColumn6 state with the new copy

    //make a copy of const [bColumn7, setBColumn7] = useState([]); and update the second value with the new total expense
    const updatedBColum7Copy = [...bColumn7]; // Make a copy of the bColumn7 state
    updatedBColum7Copy[1] = newTotalExpense; // Update the second value with the new total expense
    setBColumn7(updatedBColum7Copy); // Update the bColumn7 state with the new copy
  };

  // Function to validate the input
  const isValidInput = (input) => {
    const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(input); // Check if the input is a valid dollar amount
    return isValid ? '' : 'Invalid input. Please enter a valid dollar amount.'; // Return an error message if the input is invalid
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

  // Function to handle expense value formatting
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

    // Recalculate and update the total expense
    startBudget();
    
    // Recalculate and update the budget section
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
                  <td>----------</td>
                  <td>----------</td>
                  <td></td> {/* Empty cells for other columns */}
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Total</td>
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

        {/* If there's no data available, display message */}
        {!loading && (expenseColumn.length === 0 && incomeDebtColumn.length === 0 && assetColumn.length === 0) && (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default AdjustableBudget;