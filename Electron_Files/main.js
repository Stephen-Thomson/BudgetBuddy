const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1580,
    height: 940,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: isDev,
    },
  });

  // Load your React application
  win.loadFile(path.join(__dirname, '../frontend_react/build', 'index.html'));

  // Open DevTools for debugging (optional)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Quit the app when all windows are closed, except on macOS (e.g., with Cmd + Q)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activate the app on macOS when the dock icon is clicked and no other windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});