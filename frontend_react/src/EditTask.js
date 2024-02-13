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

const ToDo = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [navigateValue, setNavigateValue] = useState('');
    const [taskList, setTaskList] = useState(['No Tasks']); // State to hold the list of tasks
    const [editTaskValue, setEditTaskValue] = useState(''); // State to hold the value of the "Edit Task" dropdown menu
    const [createDeleteValue, setCreateDeleteValue] = useState(''); // State to hold the value of the "Create/Delete" dropdown menu
    const [helpValue, setHelpValue] = useState('');
    const [logoutValue, setLogoutValue] = useState('');   

    useEffect(() => {
      const fetchTasks = async () => {
          try {
              const tasks = await Apis.getTasks();
              setTaskList(tasks.length > 0 ? tasks : ['No Tasks']); // Set taskList to 'No Tasks' if the response is empty
          } catch (error) {
              console.error('Fetch tasks error:', error);
              setTaskList(['No Tasks']); // Set taskList to 'No Tasks' in case of error
          }
      };
    
      fetchTasks();
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
                  {taskList.map((task) => (
                    <MenuItem key={task.ID} value={task.ID}>
                      {task.TitleDescription}
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
  
 {/* Page Content */}
 <Container maxWidth="md" style={{ marginTop: '20px' }}>
        {/* Centered Text */}
        <Typography variant="h2" align="center" style={{ color: 'purple', fontWeight: 'bold' }}>
            To-Do<br />
            Under<br />
            Construction
        </Typography>
      </Container>
    </div>
    );
};


export default ToDo;