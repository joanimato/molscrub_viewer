import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let pythonServer: ChildProcess | null = null;

const VITE_DEV_SERVER_URL = 'http://localhost:5173';

// Function to check if Vite is running
const waitForVite = async (retries = 10, delay = 1000): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(VITE_DEV_SERVER_URL);
      if (response.ok) return true;
    } catch (error) {
      console.log(`Waiting for Vite... (${i + 1}/${retries})`);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return false;
};

const serverPath = path.join(__dirname, '..', '..', 'server.py');

// Function to start the Python server inside Electron
const startPythonServer = () => {

  try {
    pythonServer = spawn('python', [serverPath], {
      cwd: __dirname,
      detached: false,
      stdio: ['inherit', 'pipe','pipe'],
    });

    console.log('Python server started with PID:', pythonServer.pid);

    // Show Python server output in terminal
    pythonServer.stdout?.on('data', (data) => {
      console.log(`[Python]: ${data.toString()}`);
    });

    pythonServer.stderr?.on('data', (data) => {
      console.error(`[Python ERROR]: ${data.toString()}`);
    });


  } catch (error) {
    console.error('Error starting Python server:', error);
  }
};

const stopPythonServer = () => {
  if (pythonServer) {
    console.log('Stopping Python server...');
    pythonServer.kill('SIGTERM'); // ✅ Sends termination signal
    pythonServer = null;
  }
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    const viteReady = await waitForVite();
    if (!viteReady) {
      console.error('Vite dev server is not responding. Exiting.');
      app.quit();
      return;
    }
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    console.log(__dirname)
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  startPythonServer(); // Start the Python server here

 createWindow();
});

app.on('window-all-closed', () => {
  stopPythonServer(); 
  app.quit();
});

app.on('quit', () => {
  stopPythonServer();
});
