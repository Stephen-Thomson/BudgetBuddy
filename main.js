const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the React application from the build folder
  win.loadURL(
    isDev
      ? 'http://localhost:3000/login.html' // Use development server URL during development
      : `file://${path.join(__dirname, 'frontend_react', 'build', 'login.html')}` // Use built login.html file in production
  );
  
  // Open DevTools for debugging (optional)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);