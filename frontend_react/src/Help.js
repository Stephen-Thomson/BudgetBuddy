import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Apis from './Apis';
import ToDoDropDown from './img/ToDoDropDown.png';
import FAdjustB from './img/FAdjustB.png';
import FCreateAccount from './img/FCreateAccount.png';
import FCurrentB from './img/FCurrentB.png';
import FDropDown from './img/FDropDown.png';
import FGJEntry from './img/FGJEntry.png';
import FGJView from './img/FGJView.png';
import FTotalsR from './img/FTotalsR.png';
import FViewEditAccount from './img/FViewEditAccount.png';
import ToDoCreateTask from './img/ToDoCreateTask.png';
import ToDoDeleteTask from './img/ToDoDeleteTask.png';
import ToDoEditTask from './img/ToDoEditTask.png';
import ToDoExplainTasks from './img/ToDoExplainTasks.png';

const Help = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue, setNavigateValue] = useState('');
    const [viewEditValue, setViewEditValue] = useState('');
    const [reportsValue, setReportsValue] = useState('');
    const [createValue, setCreateValue] = useState('');
    const [helpValue, setHelpValue] = useState('');
    const [logoutValue, setLogoutValue] = useState('');   
    const [accountList, setAccountList] = useState([]); // State to hold the list of accounts

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
  
            {/* <div style={{ marginRight: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                  View/Edit
                </Typography>
                <Select label="View/Edit" onChange={handleViewEdit} value={viewEditValue}>
                  <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                  <MenuItem value="generalJournal">General Journal</MenuItem>
                  {/* Populate the dropdown menu with accounts from state */}
                  {/*{accountList.map((account) => (
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
                {/*</Select>
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
            </div> */}
  
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
  
        <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px', zIndex: 1000, position: 'sticky', top: 0 }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                <a href="#todoSection" style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}>
                  <Typography variant="body1">
                    To Do List
                  </Typography>
                </a>
              </td>
              <td style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                <a href="#financialSection" style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}>
                  <Typography variant="body1">
                    Financial
                  </Typography>
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* To Do List Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr id="todoSection">
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  To Do List
                </td>
              </tr>
              <tr>
                <td>
                  {/* Description of To Do List */}
                  <Typography variant="body1" style={{ marginBottom: '20px' }}>
                    At the top of every To Do List page, there is a bar with drop-down menus designed to facilitate navigation within the function.
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '20px' }}>
                    <strong>Navigate:</strong> This drop-down menu allows you to access essential pages, including:
                  </Typography>
                  <ul>
                    <li>To Do List: Opens the main page displaying all existing tasks.</li>
                    <li>General Journal: Directs you to the opening page of the Financial Function.</li>
                    <li>Create/Delete: This menu provides options to navigate to:
                      <ul>
                        <li>Create Task Page: Takes you to the page where you can add new tasks.</li>
                        <li>Delete Tasks Page: Allows you to navigate to the page for removing tasks.</li>
                        <li>Edit Task: Displays a list of all existing tasks, enabling you to select and edit a specific task on the Edit Task Page.</li>
                      </ul>
                    </li>
                    <li>Help: Clicking on this option will display the Help Page, offering assistance and guidance on using the function.</li>
                    <li>Logout: Selecting this option provides the ability to log out of the program, redirecting you to the login page.</li>
                  </ul>
                  <Typography variant="body1">
                    These drop-down menus enhance user experience by offering quick access to various functionalities within the To Do List function.
                  </Typography>
                </td>
                <td>
                  {/* Insert image related to To Do List here */}
                  <img src={ToDoDropDown} alt="To Do List Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>

        <Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Task Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Tasks
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="body1" style={{ marginBottom: '20px' }}>
    		    In the To Do List function, each task comprises several key components:
  		  </Typography>
  		  <ul>
    		    <li>
      <strong>Title/Description:</strong> This is the name or description assigned to the task, providing a brief overview of its purpose or content.
    </li>
    <li>
      <strong>Date:</strong> The date associated with the task signifies its due date, indicating when it should be completed.
    </li>
    <li>
      <strong>Time:</strong> Alongside the date, the time specifies the exact hour and minute by which the task is due.
    </li>
    <li>
      <strong>Repeat:</strong> This feature determines if the task recurs at regular intervals. Tasks can repeat daily, weekly, monthly, or not at all, depending on the user's preference.
    </li>
    <li>
      <strong>Notification:</strong> Users have the option to set notifications for tasks. These notifications alert users when the due date and time for a task are approaching, ensuring timely completion.
    </li>
  </ul>
  <Typography variant="body1">
    By organizing tasks with these components, users can effectively manage their schedules and stay on top of their responsibilities within the To Do List function.
  </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={ToDoExplainTasks} alt="Tasks Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>




<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Create Task Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Create Task
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
              When creating a new task, follow these steps:
            </Typography>
            <ol>
              <li>Enter Task Description: Provide a brief description or name for the task in the designated field.</li>
              <li>Set Due Date: Click on the current date field and select the desired date from the date picker. This sets the date by which the task should be completed.</li>
              <li>Specify Due Time: Click on the current time field and adjust the hour and minutes to set the desired time by which the task is due.</li>
              <li>Select Repeat Option: Use the repeat dropdown menu to specify if the task should repeat daily, weekly, monthly, or not at all.</li>
              <li>Enable Notifications (Optional): Check the box next to "notification" if you want to receive alerts when the due date and time for the task approach.</li>
              <li>Click Create: Once you've entered all necessary details, click the "Create" button to add the task to your list.</li>
            </ol>
            <Typography variant="body1">
              By following these steps, you can efficiently create tasks with specific details and preferences tailored to your needs.
            </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={ToDoCreateTask} alt="Create Task Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Edit Task Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Edit Task
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
              When editing a task, follow these steps:
            </Typography>
            <ol>
              <li>Select Task: The task you choose to edit will be displayed, showing its current details.</li>
              <li>Modify Task Details: You can edit various aspects of the task, including:
                <ol type="a">
                  <li>Description/Name: Update the task's description or name as needed.</li>
                  <li>Due Date: Adjust the date by which the task should be completed.</li>
                  <li>Due Time: Modify the specific time at which the task is due.</li>
                  <li>Repeat Option: Change how often the task repeats, selecting from daily, weekly, monthly, or none.</li>
                  <li>Notification Setting: Toggle the notification setting to receive alerts for the task's due date and time, if desired.</li>
                </ol>
              </li>
              <li>Click Update: Once you've made the necessary changes, click the "Update" button to save your edits.</li>
            </ol>
            <Typography variant="body1">
              By following these steps, you can easily modify task details to ensure they align with your current needs and preferences.
            </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={ToDoEditTask} alt="Edit Task Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Delete Task Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Delete Task
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
              To delete one or more tasks, follow these steps:
            </Typography>
            <ol>
              <li>Select Task(s): Check the box next to the task(s) you wish to delete from the list of displayed tasks.</li>
              <li>Initiate Deletion: Once you've selected the desired task(s), click the "Delete" button.</li>
            </ol>
            <Typography variant="body1">
              By following these steps, you can efficiently remove unwanted tasks from your list, helping you keep your task list organized and up to date.
            </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={ToDoDeleteTask} alt="Delete Task Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Financial Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr id="financialSection">
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Financial
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
              This function operates on the double-entry accounting system. In double-entry accounting, each financial transaction is recorded by debiting one account and crediting another. This ensures that the accounting equation stays balanced and provides a clear record of how funds move within an organization. Put simply, every debit has a corresponding credit, allowing for accurate financial reporting and analysis.
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              This program has simplified the accounting process for common everyday use. It only uses Asset accounts such as cash, accounts payable accounts such as credit cards, income accounts, and expense accounts. Each type of account has a positive balance in either the debit column or the credit column. These are the positive balance columns for the accounts this program uses:
            </Typography>
            <ul>
              <li>Asset Accounts: Debit column</li>
              <li>Accounts Payable Accounts: Credit column</li>
              <li>Income Accounts: Credit column</li>
              <li>Expense Accounts: Debit column</li>
            </ul>
            <Typography variant="body1">
              By following this structure, users can easily track their financial transactions and maintain accurate records within the program.
            </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </Container>




<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Financial Drop Down Section */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Financial Drop Down Menus
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
              At the top of every Financial page, you'll find a bar with drop-down menus designed to facilitate navigation within the function.
            </Typography>
            {/* Description of Financial Drop Down Menus */}
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              <ul>
                <li><strong>Navigate:</strong> This drop-down menu offers access to key pages, including:</li>
                <ul>
                  <li>To Do List: Opens the main page displaying all existing tasks.</li>
                  <li>General Journal: Directs you to the opening page of the Financial Function where you can make entries.</li>
                </ul>
                <li><strong>View/Edit:</strong> This menu provides options to view and edit essential components, such as:</li>
                <ul>
                  <li>General Journal: Allows you to view and edit entries made in the General Journal.</li>
                  <li>Existing Accounts: Lists all existing accounts, enabling viewing and editing.</li>
                </ul>
                <li><strong>Reports:</strong> This drop-down menu allows you to access various reports, including:</li>
                <ul>
                  <li>Totals Report: Provides an overview of total financial figures.</li>
                  <li>Current Budget Report: Displays the current budget status.</li>
                  <li>Adjustable Budget Report: Shows a breakdown of budget adjustments.</li>
                </ul>
                <li><strong>Create:</strong> Selecting this menu allows you to create different types of accounts:</li>
                <ul>
                  <li>Income: Represents any income received, such as from employment.</li>
                  <li>Asset: Includes current assets you possess, like cash or checking accounts.</li>
                  <li>Expense: Covers expenses, such as groceries or rent.</li>
                  <li>Account Payable (Credit): Represents credit accounts, like credit cards or loans.</li>
                </ul>
                <li><strong>Help:</strong> Clicking on this option will display the Help Page, offering assistance and guidance on using the Financial function.</li>
                <li><strong>Logout:</strong> Selecting this option provides the ability to log out of the program, redirecting you to the login page.</li>
              </ul>
            </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FDropDown} alt="Financial Drop Down Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* General Journal */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  General Journal
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
              The General Journal serves as the central hub for recording all financial transactions. Here's how it works:
            </Typography>
            {/* Description of General Journal */}
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              <ol>
                <li><strong>Select Date:</strong> Begin by selecting the date of the transaction. You can either leave it as the current date or choose a specific date using the date picker.</li>
                <li><strong>Choose Account:</strong> From the "Select Account" drop-down menu, you can choose the account to which the entry will be posted. This menu lists all available accounts for selection.</li>
                <li><strong>Description:</strong> Enter a brief description of the transaction to provide context or details about what it entails.</li>
                <li><strong>Enter Transaction Amount:</strong> Depending on the nature of the transaction, input the dollar value in either the debit or credit columns. For example, if you spent money on groceries, select the "Groceries" account and enter the amount in the debit column.</li>
                <li><strong>Add Additional Transactions:</strong> You can record multiple transactions in the General Journal. Simply repeat steps 2 to 4 for each transaction.</li>
                <li><strong>Post Entries:</strong> Once all transactions are entered, click the "Post" button to finalize and post the entries to the respective accounts. Note that you can only click the "Post" button if the total of the debit column matches the total of the credit column, ensuring the entries are balanced.</li>
              </ol>
            </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FGJEntry} alt="General Journal Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* General Journal View */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  General Journal View
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1" style={{ marginBottom: '20px' }}>
                The General Journal View provides a comprehensive display of all entries recorded in the General Journal. It serves as an organized record of your financial transactions, allowing for easy reference and analysis of past activities.
            </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FGJView} alt="General Journal View Image" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>




<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* View Edit Account */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  View/Edit
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1">
                  When you access the View/Edit page for an account, you'll encounter the following features:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Account Display:</strong> The page will showcase the selected account along with all entries that have been posted to it. This comprehensive view provides insight into the account's transaction history.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Edit Account Details:</strong> Depending on the type of account, you may have the option to modify certain details:
                      <ul>
                        <li>
                          <Typography variant="body1">
                            <strong>Expense Accounts:</strong> If the account is an expense account, checkboxes across the top allow you to change the type of expense, if necessary. You can also edit the Account Name to ensure accuracy.
                          </Typography>
                        </li>
                      </ul>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Save Changes:</strong> After making any modifications, click the "Save Changes" button to ensure that your changes are updated and saved.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Entry Display:</strong> Entries will be displayed with columns labeled "Debit" and "Credit." Each column will have a "+" or "-" symbol next to it, indicating whether entries in that column add to (+) or subtract from (-) the account balance.
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body1">
                  By utilizing these features, users can efficiently view and edit account details, ensuring accurate and up-to-date records within the system.
                </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FViewEditAccount} alt="View/Edit" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Create Account */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Create Account
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1">
                  When creating a new account, follow these steps:
                </Typography>
                <ol>
                  <li>
                    <Typography variant="body1">
                      <strong>Select Account Type:</strong> Choose the type of account you wish to create, such as Expense, Asset, or Income. The Create Account page will then open.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Expense Account Details:</strong>
                      <ul>
                        <li>
                          <Typography variant="body1">
                            <strong>Expense Type:</strong> If creating an expense account, indicate the type of expense it represents:
                            <ul>
                              <li>
                                <Typography variant="body1">
                                  <strong>Fixed Monthly:</strong> A recurring expense with a consistent amount, such as Rent.
                                </Typography>
                              </li>
                              <li>
                                <Typography variant="body1">
                                  <strong>Variable:</strong> An expense that fluctuates in amount, such as Groceries.
                                </Typography>
                              </li>
                              <li>
                                <Typography variant="body1">
                                  <strong>Temporary:</strong> An expense deemed temporary, such as Rent for a storage space intended for temporary use.
                                </Typography>
                              </li>
                            </ul>
                          </Typography>
                        </li>
                      </ul>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Set Date:</strong> The date is automatically set to the current date.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Enter Account Name:</strong> Provide a name for the account to identify its purpose or category.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Beginning Balance (for Asset or Income Accounts):</strong> If creating an Asset or Income account, enter the beginning balance for the account.
                    </Typography>
                  </li>
                </ol>
                <Typography variant="body1">
                  <strong>Positive and Negative Symbols:</strong> The "+" and "-" symbols indicate whether the debit or credit column represents a positive number for your beginning balance. Additionally, they indicate which column adds to or subtracts from the account balance as you make entries.
                </Typography>
                <Typography variant="body1">
                  By following these steps, you can effectively create new accounts tailored to your financial needs, ensuring accurate tracking and management within the system.
                </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FCreateAccount} alt="Create Account" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Totals Report */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Totals Report
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1">
                  The Totals Report provides an overview of accounts and their current balances as of the current date. Here's how it works:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Account Balances:</strong> The report displays the current balance of each account, reflecting their financial status at the present time.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Expense Totals:</strong> For expense accounts, the report includes the total balance for the current month. This helps users track their expenses and monitor spending patterns.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Color Legend:</strong> Across the top of the report is a color legend that indicates the type of expense and expense account. For example:
                    </Typography>
                    <Typography variant="body1">
                      • If an expense account name appears in purple, it signifies that the account represents a fixed monthly expense.
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body1">
                  By utilizing the Totals Report, users can gain valuable insights into their financial accounts and effectively manage their finances.
                </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FTotalsR} alt="Totals Report" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Current Budget Report */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Current Budget Report
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1">
                  The Current Budget report provides a snapshot of your financial situation, detailing the following:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Credit and Asset Account Balances:</strong> Displays the current balances of your credit and asset accounts.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Expenses and Income Accounts:</strong> Shows an average balance over the last 6 months for both expenses and income accounts.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Expected Monthly Income and Total Averaged Expenses:</strong> Across the bottom of the report, the starting balance of your assets is displayed alongside the expected income for the month. Below that, the total of the averaged expenses over the last 6 months is subtracted from the starting balance to show the expected balance of your total assets at the end of the indicated month.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Projected Values for the Next 6 Months:</strong> These totals are projected for the expected values over the next 6 months, providing insight into your financial forecast and allowing for effective planning and budgeting.
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body1">
                  By utilizing the Current Budget report, users can assess their current financial standing, anticipate future income and expenses, and make informed decisions to achieve their financial goals.
                </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FCurrentB} alt="Current Budget Report" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>



<Container maxWidth='100%' style={{ marginTop: '20px' }}>
          {/* Adjustable Budget Report */}
          <table style={{ width: '100%', backgroundColor: '#ffffff', padding: '10px 20px'}}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', textDecoration: 'underline', paddingRight: '10px' }}>
                  Adjustable Budget Report
                </td>
              </tr>
              <tr>
                <td>
<Typography variant="body1">
                  The Adjustable Budget Report functions similarly to the Current Budget Report but offers additional flexibility in budget management. Here's how it works:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Credit and Asset Account Balances:</strong> Displays the current balances of your credit and asset accounts.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Expenses and Income Accounts:</strong> Shows an average balance over the last 6 months for both expenses and income accounts.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Expected Monthly Income and Total Averaged Expenses:</strong> Across the bottom of the report, the starting balance of your assets is displayed alongside the expected income for the month. Below that, the total of the averaged expenses over the last 6 months is subtracted from the starting balance to show the expected balance of your total assets at the end of the indicated month.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Projected Values for the Next 6 Months:</strong> These totals are projected for the expected values over the next 6 months, providing insight into your financial forecast.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Budget Adjustment:</strong> In the Adjustable Budget Report, users have the ability to edit the averaged monthly amounts in each expense account to a desired budget number. As changes are made, the budget displayed at the bottom of the report will update accordingly, showing how the adjustments affect your monthly budgets.
                    </Typography>
                  </li>
                </ul>
                <Typography variant="body1">
                  By utilizing the Adjustable Budget Report, users can not only assess their current financial standing but also tailor their budgets to align with their financial goals and priorities.
                </Typography>
                </td>
                <td>
                  {/* Insert image here */}
                  <img src={FAdjustB} alt="Adjustable Budget Report" style={{ width: '500px', height: 'auto' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Container>

      </div>
  );
};

export default Help;