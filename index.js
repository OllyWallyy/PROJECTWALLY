const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog, autoUpdater } = require('electron');
const Store = require('electron-store');
const DiscordRPC = require('discord-rpc');
const store = new Store();
const path = require('path');

// Your Discord application's client ID
const clientId = '1151896802660991048';

let mainWindow;
let tray;
let rpc;

// Update feed URL for manual updates
const updateFeedURL = 'https://github.com/OllyWallyy/PROJECTWALLY/releases/latest';

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

    if (currentPage === 'index') {
      presenceDetails = 'In the Menu';
    } else if (url.startsWith('https://anix.to/')) {
      presenceDetails = 'Watching Anime';
    } else if (currentPage === 'fileupload') {
      presenceDetails = 'Uploading Files';
    } else if (url.startsWith('https://linkdl')) {
      presenceDetails = 'On LinkDL';
    } else if (url.startsWith('https://www.dropbox.com')) {
      presenceDetails = 'Chatting With Others';
    } else if (url.startsWith('https://wallywebsocket')) {
      presenceDetails = 'Viewing Uploads';
	} else if (currentPage === 'changelog') {
      presenceDetails = 'Viewing Changelog';
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

  // Create a new window for the update popup
  let updatePopup;

  // Function to create and show the update popup
  function createUpdatePopup() {
    updatePopup = new BrowserWindow({
      width: 400,
      height: 200,
      resizable: false,
      show: false,
      title: 'Update Available',
    });

    // Load the update popup HTML file
    updatePopup.loadFile('update-popup.html');

    // Show the update popup when ready
    updatePopup.once('ready-to-show', () => {
      updatePopup.show();
    });

    // Handle the update popup being closed
    updatePopup.on('closed', () => {
      updatePopup = null;
    });
  }

  // Check for updates
  autoUpdater.setFeedURL({ url: updateFeedURL });

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
    createUpdatePopup(); // Create and show the update popup
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);

    // Send the update message to the popup window
    if (updatePopup) {
      updatePopup.webContents.send('update-message', 'A new version of the app is available. Do you want to update now?');
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('No updates available.');

    // Send a message to the popup window if no updates are available
    if (updatePopup) {
      updatePopup.webContents.send('update-message', 'No updates available.');
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Error checking for updates:', err);

    // Send an error message to the popup window if there's an error
    if (updatePopup) {
      updatePopup.webContents.send('update-message', 'Error checking for updates. Please try again later.');
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total}) bytes`);
  });

  autoUpdater.on('update-downloaded', () => {
    // Send a message to the popup window when the update is downloaded
    if (updatePopup) {
      updatePopup.webContents.send('update-message', 'The update has been downloaded. Do you want to install it now?');
    }
  });
});

// Other app event handlers and code
