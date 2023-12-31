const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const Store = require('electron-store');
const DiscordRPC = require('discord-rpc');
const store = new Store();
const path = require('path');

// Your Discord application's client ID
const clientId = '1151896802660991048';

let mainWindow;
let tray;
let rpc;

app.on('ready', () => {
  // Initialize Discord RPC
  DiscordRPC.register(clientId);
  rpc = new DiscordRPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    console.log('RPC is ready!');
    updatePresence('In the Menu'); // Set the initial presence
  });

  rpc.login({ clientId }).catch(console.error);

  const lastWindowPosition = store.get('windowPosition', { x: 100, y: 100 });
  const lastWindowSize = store.get('windowSize', { width: 800, height: 600 });

  mainWindow = new BrowserWindow({
    width: lastWindowSize.width,
    height: lastWindowSize.height,
    x: lastWindowPosition.x,
    y: lastWindowPosition.y,
    icon: path.join(__dirname, 'logo.ico'), // Set the tray icon to 'logo.ico'
  });

  // Load your HTML file into the browser window
  mainWindow.loadFile('index.html');

  // Create a tray with your custom icon
  tray = new Tray(path.join(__dirname, 'logo.ico')); // Set the tray icon to 'logo.ico'

  // Create a context menu for the tray icon
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Return to Home',
      click: () => {
        // Load the 'index.html' page when the 'Return to Home' option is clicked
        mainWindow.loadFile('index.html');
        mainWindow.show(); // Show the main window
        updatePresence('In the Menu'); // Update presence when returning to Home
      },
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        // Quit the application when the 'Exit' option is clicked
        app.quit();
      },
    },
  ]);

  // Set the tray icon's context menu
  tray.setContextMenu(trayMenu);

  // Add a click event handler to the tray icon to return to home
  tray.on('click', () => {
    // Load the 'index.html' page when the tray icon is clicked
    mainWindow.loadFile('index.html');
    mainWindow.show(); // Show the main window
    updatePresence('In the Menu'); // Update presence when returning to Home
  });

  // Listen for the 'resize' event to update the stored window size
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowSize', { width, height });
  });

  // Listen for the 'move' event to update the stored window position
  mainWindow.on('move', () => {
    const { x, y } = mainWindow.getBounds();
    store.set('windowPosition', { x, y });
  });

  // Hide the default menu items
  Menu.setApplicationMenu(null);

  // Register Ctrl + R as a global shortcut to refresh the app
  globalShortcut.register('CommandOrControl+R', () => {
    mainWindow.reload();
  });

  // Register Alt + Left as a global shortcut to go back
  globalShortcut.register('Alt+Left', () => {
    if (mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
  });

  // Listen for page navigation events and update presence
  mainWindow.webContents.on('did-navigate-in-page', (_, url) => {
	const currentPage = mainWindow.webContents.executeJavaScript('document.body.getAttribute("data-page")');
	console.log(`Navigated to: ${url}`);
    let presenceDetails;

    if (currentPage==='index') {
      presenceDetails = 'In the Menu';
    } else if (url.startsWith('https://anix.to/')) {
      presenceDetails = 'Watching Anime';
    } else if (currentPage==='fileupload') {
      presenceDetails = 'Uploading Files';
    } else if (url.startsWith('https://linkdl')) {
      presenceDetails = 'On LinkDL';
	} else if (url.startsWith('https://www.youtube.com')) {
      presenceDetails = 'Watching Youtube';
	} else if (url.startsWith('https://www.dropbox.com')) {
		presenceDetails = 'Viewing Uploads'
	} else if (url.startsWith('https://w2g.tv')) {
		presenceDetails = 'Watching Together With Others'
    } else {
      // Handle other pages or set a default presence
      presenceDetails = 'Browsing the App';
    }

    // Update the RPC presence with the appropriate details
    updatePresence(presenceDetails);
  });

  // Function to update Discord RPC presence
  function updatePresence(details) {
    rpc.setActivity({
      details: details,
      state: 'W.A.L.L.Y',
      startTimestamp: new Date(),
      largeImageKey: '1024x1024', // Replace with your image key if you have one
    });

    console.log(`Updating Discord RPC presence: ${details}`);
  }

  // ... The rest of your existing code ...
});

// Other app event handlers and code