import React, { useState, useEffect } from 'react';

const NotificationModal = ({ notificationList }) => {
  const [modalOpen, setModalOpen] = useState(false); // Start with modal closed

  // Effect to open the modal when there are notifications
  useEffect(() => {
    if (notificationList.length > 0) {
      setModalOpen(true);
    }
  }, [notificationList]);

  // Define the handleClose method to close the modal
  const handleClose = () => {
    // Update the state to close the modal
    setModalOpen(false);
  };

  // Return null if modalOpen is false (modal is closed)
  if (!modalOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', /* semi-transparent black background */
      width: '100%',
      height: '100%',
      zIndex: 1000, /* ensure modal is on top of everything else */
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2>Notifications</h2>
        <ul>
          {notificationList.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
        <button style={{ marginTop: '20px' }} onClick={handleClose}>OK</button>
      </div>
    </div>
  );
};

export default NotificationModal;
