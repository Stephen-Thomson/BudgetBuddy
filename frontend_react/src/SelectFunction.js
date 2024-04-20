import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

// This component is a simple page that allows the user to select which function they wish to open.
const SelectFunction = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'black',
        color: '#1E90FF',
        textAlign: 'center',
      }}
    >
      <h1>Select which function you wish to open.</h1>
      <div>
        {/* Use Link to create a link to the To-Do List page */}
        <Link to="/toDo" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#7921B1',
              color: 'black',
              fontWeight: 'bold',
              borderRadius: '8px',
              margin: '10px',
            }}
          >
            To-Do List
          </Button>
        </Link>
        {/* Use Link to create a link to the General Journal page */}
        <Link to="/generalJournal" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#7921B1',
              color: 'black',
              fontWeight: 'bold',
              borderRadius: '8px',
              margin: '10px',
            }}
          >
            Financial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SelectFunction;