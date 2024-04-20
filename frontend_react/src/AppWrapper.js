import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotificationModal from './NotificationModal';
import Apis from './Apis';

// Import pages
import LoginPage from './LoginPage';
import SelectFunction from './SelectFunction';
import GeneralJournal from './GeneralJournal';
import CreateIncome from './CreateIncome';
import CreateAsset from './CreateAsset';
import CreateExpense from './CreateExpense';
import CreateAccountPayable from './CreateAccountPayable';
import Help from './Help';
import Totals from './Totals';
import CurrentBudget from './CurrentBudget';
import AdjustableBudget from './AdjustableBudget';
import ToDo from './ToDo';
import EditAccount from './EditAccount';
import GeneralJournalView from './GeneralJournalView';
import PostSuccess from './PostSuccess';
import CreateTask from './CreateTask';
import DeleteTasks from './DeleteTasks';
import EditTask from './EditTask';

// Wrapper for the pages to handle routing
const AppWrapper = () => {
  const [notificationList, setNotificationList] = useState([]); // Initialize notification list state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize login state

  // Function to check for notifications
  const checkNotifications = async () => {
    //console.log('Checking for notifications:');
    try {
      const response = await Apis.checkTasks(); // Call the API to check for notifications
      //console.log('API Response:', response);
      // Send reponse to console
      //console.log('Notification response:', response);
      // Update notification list state
      setNotificationList(response);
      //console.log('Notification List:', notificationList);

          // Call UpdateRepeat API
    const nresponse = await Apis.updateRepeat();

    //console.log('Update Response:', nresponse);
    
    //console.log('UpdateRepeat API called successfully');
    } catch (error) {
      // Handle errors
      console.error('Error checking notifications:', error);
    }
  };


  // UseEffect hook to check for notifications when the component mounts
  useEffect(() => {
    //console.log('Useeffect called');
    // Check notifications if user logged in
    if (isLoggedIn) {
      //console.log('User is logged in');
      // Call checkNotifications immediately after login
      checkNotifications();

      // Set up an interval to periodically check for notifications (every minute)
      const interval = setInterval(() => {
        checkNotifications();
      }, 60000); // 60000 milliseconds = 1 minute

      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]); // Run the effect whenever the login state changes

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update login state
    // Call checkNotifications immediately after successful login
    //console.log('Logged in successfully!', isLoggedIn);
    //console.log('Before checkNotifications()');
    checkNotifications();
    //console.log('After checkNotifications()');
  };

  
  
  return (
    // Set up routes for the pages
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/selectFunction" element={<SelectFunction />} />
        <Route path="/generalJournal" element={<GeneralJournal />} />
        <Route path="/createIncome" element={<CreateIncome />} />
        <Route path="/createAsset" element={<CreateAsset />} />
        <Route path="/createExpense" element={<CreateExpense />} />
        <Route path="/createAccountPayable" element={<CreateAccountPayable />} />
        <Route path="/help" element={<Help />} />
        <Route path="/totals" element={<Totals />} />
        <Route path="/currentBudget" element={<CurrentBudget />} />
        <Route path="/adjustableBudget" element={<AdjustableBudget />} />
        <Route path="/toDo" element={<ToDo />} />
        <Route path="/editAccount/:accountName" element={<EditAccount />} />
        <Route path="/generalJournalView" element={<GeneralJournalView />} />
        <Route path="/postSuccess" element={<PostSuccess />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="/deleteTasks" element={<DeleteTasks />} />
        <Route path="/editTask/:taskId" element={<EditTask />} />
      </Routes>
      {/* Display the notification modal if there are notifications */}
      {notificationList && notificationList.length > 0 && <NotificationModal notificationList={notificationList} />}
    </Router>
  );
};

export default AppWrapper;