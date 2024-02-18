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

const DeleteTasks = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue, setNavigateValue] = useState('');

    const defaultTask = {
      id: 1,
      titleDescription: 'Please Create Tasks',
      date: '2024-02-12T23:57:46',
      time: '15:57:46',
      repeat: 0,
      notification: false
    };

    const [taskList, setTaskList] = useState([defaultTask]); // State to hold the list of tasks
    const [editTaskValue, setEditTaskValue] = useState(''); // State to hold the value of the "Edit Task" dropdown menu
    const [createDeleteValue, setCreateDeleteValue] = useState(''); // State to hold the value of the "Create/Delete" dropdown menu
    const [helpValue, setHelpValue] = useState('');
    const [logoutValue, setLogoutValue] = useState('');   
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]);

    useEffect(() => {
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
    console.log('Task List:', taskList);

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

    const handleCreateDeleteTask = (event) => {
      const value = event.target.value;
      switch (value) {
          case 'createTask':
              navigate('/createTask');
              break;
          case 'deleteTasks':
              navigate('/deleteTasks');
              break;
          default:
              break;
      }
    };

    const handleEditTask = (event) => {
        const taskId = event.target.value;
        navigate(`/editTask/${taskId}`);
    };


    // Function to handle menu item selection for "Help"
    const handleHelp = () => {
        navigate('/help'); // Navigate to Help.js
    };
  
    // Function to handle menu item selection for "Logout"
    const handleLogout = () => {
        navigate('/'); // Navigate to LoginPage.js
    };

     // Function to handle checkbox change
     const handleCheckboxChange = (taskId) => {
      // Check if the task ID is already selected
      if (selectedTasks.includes(taskId)) {
        // If selected, remove it from the selectedTasks array
        setSelectedTasks(selectedTasks.filter(id => id !== taskId));
      } else {
        // If not selected, add it to the selectedTasks array
        setSelectedTasks([...selectedTasks, taskId]);
      }
    };

    // Function to handle delete button click
    const handleDelete = async () => {
      try {

        console.log('Selected tasks:', selectedTasks);
        // Call the deleteTasks API with the selected task IDs
        const response = await Apis.deleteTasks(selectedTasks);

        console.log('Delete tasks response:', response);

        // Clear the selected tasks array
        setSelectedTasks([]);

        navigate('/toDo');
      } catch (error) {
        console.error('Delete tasks error:', error);
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
                    <MenuItem key={index} value={task.ID}>
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
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>Delete Tasks</h1>
        </div>

      {/* Page Content */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table className='task-list'>
              <TableHead>
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
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
              ) : (
                taskList && taskList.map((ttask, index) => (
                  <TableRow key={index}>
                    {/* Add a checkbox for each row */}
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.includes(ttask.id)}
                        onChange={() => handleCheckboxChange(ttask.id)}
                      />
                    </TableCell>
                    {/* Render other task information */}
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
                  {/* Delete Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="secondary" onClick={handleDelete} disabled={selectedTasks.length === 0}>
            Delete
          </Button>
        </div>
      </div>
    );
};


export default DeleteTasks;