const {app, screen, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const isDevelopment = (process.env.NODE_ENV || '').trim() === 'dev';

let mainWindow;

function createMainWindow() {
    let {width, height} = screen.getPrimaryDisplay().workAreaSize;
    width = Math.round(width * 0.75);
    height = Math.round(height * 0.75);

    const window = new BrowserWindow({
        width: width,
        height: height,
        title: '#{TITLE}',
        show: false,
    });

    if (!isDevelopment) {
        window.setFullScreen(true);
        window.setMenu(null);
    }

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'public', 'index.html'),
        protocol: 'file',
        slashes: true,
    }));

    window.on('closed', () => {
        mainWindow = null;
    });

    window.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        })
    });

    return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();
});