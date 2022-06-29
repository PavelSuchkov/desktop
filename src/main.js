const {app, BrowserWindow} = require('electron');
const {is, setContentSecurityPolicy} = require("electron-util");
const config = require('./config');

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: false
        }
    });

    // load the HTML file
    window.loadURL('http://localhost:1234');

    // if in development mode, open the browser dev tools
    if (is.development) {
        window.webContents.openDevTools();
        window.loadURL(config.LOCAL_WEB_URL);
    } else {
        window.loadURL(config.PRODUCTION_WEB_URL);
    }

    // Устанавливаем CSP в производственном режиме
    if (!is.development) {
        setContentSecurityPolicy(`
    default-src 'none';
    script-src 'self';
    img-src 'self' https://www.gravatar.com;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    connect-src 'self' ${config.PRODUCTION_API_URL};
    base-uri 'none';
    form-action 'none';
    frame-ancestors 'none';
  `);
}


    // when the window is closed, dereference the window object
    window.on('closed', () => {
        window = null;
    });
}

app.on('ready', createWindow);

// Выходим при закрытии всех окон
app.on('window-all-closed', () => {
    // В macOS выходим, только если пользователь явно закрывает приложение
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // В macOS повторно создаем окно при нажатии иконки в панели dock
    if (window === null) {
        createWindow();
    }
});