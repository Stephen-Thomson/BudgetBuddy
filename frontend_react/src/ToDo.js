import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Apis from './Apis';
import { TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper } from '@mui/material';

const ToDo = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue] = useState(''); // State to hold the value of the "Navigate" dropdown menu

    // Define a default task object
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

    useEffect(() => {
      // Fetch tasks from the API
      const fetchTasks = async () => {
          try {
              const rtasks = await Apis.getTasks();
              setTaskList(rtasks.value.tasks);
          } catch (error) {
              console.error('Fetch tasks error:', error);
          } finally {
              setLoading(false);
          }
      };
    
      fetchTasks();
    }, []);

    // Add a console.log statement to print the value of taskList
    //console.log('Task List:', taskList);

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
              navigate('/createTask'); // Navigate to the CreateTask.js page
              break;
          case 'deleteTasks':
              navigate('/deleteTasks'); // Navigate to the DeleteTasks.js page
              break;
          default:
              break;
      }
    };

    // Function to handle menu item selection for "Edit Task"
    const handleEditTask = (event) => {
        const taskId = event.target.value;
        console.log('Edit Task:', taskId);
        navigate(`/editTask/${taskId}`); // Navigate to the EditTask.js page with the task ID
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
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>To Do List</h1>
        </div>

    {/* Page Content */}
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table className='task-list'>
            <TableHead>
              {/* Add table row for the table header */}
              <TableRow>
                <TableCell>Title/Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Repeat</TableCell>
                <TableCell>Notification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
              ) : (
                // Map through the taskList and render each task as a table row
                taskList && taskList.map((ttask, index) => (
                  <TableRow key={index}>
                    <TableCell>{ttask.titleDescription}</TableCell>
                    <TableCell>{new Date(ttask.date).toLocaleDateString()}</TableCell>
                    <TableCell>{ttask.time}</TableCell>
                    <TableCell>{ttask.repeat === 0 ? "No Repeat" :
                      ttask.repeat === 1 ? "Daily" :
                      ttask.repeat === 2 ? "Weekly" :
                      ttask.repeat === 3 ? "Monthly" :
                      "Unknown"
                    }</TableCell>
                    <TableCell>{ttask.notification ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
};


export default ToDo;