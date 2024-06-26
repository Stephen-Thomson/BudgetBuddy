import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useParams } from 'react-router-dom';
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
  FormControlLabel,
  Checkbox } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles for the date picker
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css'; // Import the styles for the time picker

const EditTask = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue] = useState('');

    const defaultTask = {
      id: 1,
      titleDescription: 'Please Create Tasks',
      date: '2024-02-12T23:57:46',
      time: '15:57:46',
      repeat: 0,
      notification: false
    };

    const [taskList, setTaskList] = useState([defaultTask]); // State to hold the list of tasks
    const [editTaskValue] = useState(''); // State to hold the value of the "Edit Task" dropdown menu
    const [createDeleteValue] = useState(''); // State to hold the value of the "Create/Delete" dropdown menu
    const [helpValue] = useState(''); // State to hold the value of the "Help" dropdown menu
    const [logoutValue] = useState(''); // State to hold the value of the "Logout" dropdown menu
    const [loading, setLoading] = useState(true); // State to hold the loading status
    const [titleDescription, setTitleDescription] = useState(''); // State for Title/Description input
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for Date picker
    const [selectedTime, setSelectedTime] = useState('12:00 PM'); // State for Time picker
    const [repeatValue, setRepeatValue] = useState(0); // State for Repeat dropdown value
    const [notificationChecked, setNotificationChecked] = useState(false); // State for Notification checkbox
    const { taskId } = useParams(); // Get the task ID from the URL
    const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task

    useEffect(() => {
      // Function to fetch tasks from the backend API
      const fetchTasks = async () => {
          try {
              const rtasks = await Apis.getTasks();
              setTaskList(rtasks.value.tasks);
          } catch (error) {
              console.error('Fetch tasks error:', error);
          }
      };
  
      // Function to fetch a single task from the backend API
      const fetchTask = async () => {
          try {
              const response = await Apis.getTask(taskId);

              const retrievedTask = response.value.retrievedTask;
              setSelectedTask(retrievedTask);
              setTitleDescription(retrievedTask.titleDescription);
              setSelectedDate(new Date(retrievedTask.date));
              setSelectedTime(retrievedTask.time);
              setRepeatValue(retrievedTask.repeat);
              setNotificationChecked(retrievedTask.notification);
              setLoading(false);
          } catch (error) {
              console.error('Fetch task error:', error);
          }
      };
  
      fetchTasks();
      fetchTask();
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

  // Function to handle menu item selection for "Create/Delete"
  const handleCreateDeleteTask = (event) => {
    const value = event.target.value;
    switch (value) {
        case 'createTask':
            navigate('/createTask'); // Navigate to CreateTask.js
            break;
        case 'deleteTasks':
            navigate('/deleteTasks'); // Navigate to DeleteTasks.js
            break;
        default:
            break;
    }
  };

  // Function to handle menu item selection for "Edit Task"
  const handleEditTask = (event) => {
      const taskId = event.target.value;
      navigate(`/editTask/${taskId}`); // Navigate to EditTask.js with the task ID
  };


  // Function to handle menu item selection for "Help"
  const handleHelp = () => {
      navigate('/help'); // Navigate to Help.js
  };

  // Function to handle menu item selection for "Logout"
  const handleLogout = () => {
      navigate('/'); // Navigate to LoginPage.js
  };
    
  // Handle function for Date picker
  const handleDateChange = (date) => {
    // Parse the time string to get hours and minutes
    const [hours, minutes] = selectedTime.split(':').map((str) => parseInt(str));

    // Create a new Date object for the selected date
    const combinedDateTime = new Date(date);

    // Set the hours and minutes from the parsed time string
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);

    // Update the selectedDate state with the combined date and time
    setSelectedDate(combinedDateTime);
};
  
  // Handle function for Time picker
  const handleTimeChange = (time) => {
      setSelectedTime(time);
  };
  
  // Handle function for Repeat dropdown menu
  const handleRepeatChange = (e) => {
      setRepeatValue(e.target.value);
  };
  
  // Handle function for Notification checkbox
  const handleNotificationChange = (e) => {
      setNotificationChecked(e.target.checked);
  };

  // Handle function for creating a new task
  const handleUpdateTask = async () => {    
      const updatedTaskData = {
      id: taskId,
      titleDescription: titleDescription,
      date: selectedDate.toISOString(), // Send the date as an ISO string
      time: selectedTime, // Send the formatted time as a string
      repeat: repeatValue,
      notification: notificationChecked
      };
    try {
      // Call the createTask function from the Apis module
      await Apis.updateTask(updatedTaskData);

      navigate('/toDo'); // Navigate to the ToDo.js page
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
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
                Create/Delete
              </Typography>
              <Select label="Create/Delete" onChange={handleCreateDeleteTask} value={createDeleteValue}>
                <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                <MenuItem value="createTask">Create Task</MenuItem>
                <MenuItem value="deleteTasks">Delete Tasks</MenuItem>
              </Select>
            </div>
          </div>

          <div style={{ marginRight: '16px', marginLeft: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" style={{ color: 'black', marginRight: '8px' }}>
                Edit Task
              </Typography>
              <Select label="Create/Delete" onChange={handleEditTask} value={editTaskValue}>
                <MenuItem value="" style={{ display: 'none' }} disabled>Select an option</MenuItem>
                {/* Populate the dropdown menu with tasks from state */}
                {taskList.map((task, index) => (
                  <MenuItem key={index} value={task.id}>
                    {task.titleDescription}
                  </MenuItem>
                  ))}
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>
            {`Edit Task: ${selectedTask ? selectedTask.titleDescription : ''}`}
            </h1>
      </div>

      {/* Page Content */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table className='task-list'>
            <TableHead>
              {/* Table header row */}
              <TableRow>
                  <TableCell>Title/Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Repeat</TableCell>
                  <TableCell>Notification</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {/* Display a loading message if the data is still loading */}
            {loading ? (
                <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
            ) : (
                // Display the task
                <TableRow>
                <TableCell>
                    <TextField
                    label="Title/Description"
                    variant="outlined"
                    fullWidth
                    value={titleDescription}
                    onChange={(event) => setTitleDescription(event.target.value)}
                    />
                </TableCell>
                <TableCell>
                    <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="M/dd/yyyy"
                    todayButton="Today"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    />
                </TableCell>
                <TableCell>
                  <TimePicker
                    onChange={handleTimeChange}
                    value={selectedTime}
                    showSecond={false}
                    format="h:mm a"
                    use12Hours
                  />
                </TableCell>
                <TableCell>
                    <Select
                    label="Repeat"
                    onChange={handleRepeatChange}
                    value={repeatValue}
                    variant="outlined"
                    fullWidth
                    >
                    <MenuItem value={0}>No Repeat</MenuItem>
                    <MenuItem value={1}>Daily</MenuItem>
                    <MenuItem value={2}>Weekly</MenuItem>
                    <MenuItem value={3}>Monthly</MenuItem>
                    </Select>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                      control={<Checkbox checked={notificationChecked ? notificationChecked : false}
                      onChange={handleNotificationChange} />}
                      label="Notification"
                  />
                </TableCell>
              </TableRow>
            )}

            {/* Update Button */}
            <TableRow>
                <TableCell colSpan={5} align="center">
                  <Button variant="contained" color="primary" onClick={handleUpdateTask}>
                      Update
                  </Button>
                </TableCell>
            </TableRow>
          </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}


export default EditTask;