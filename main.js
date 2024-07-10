const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { shell } = require('electron')
const fs = require('fs')

function openInvoicePrint(event, invoice) {
  const filepath = app.getAppPath('userData') + '/preview.html';

  fs.writeFileSync(filepath, invoice)
  shell.openPath(filepath)
}

function loadUserConfig() {
  const filepath = app.getAppPath('userData') + '/config.json';

  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error while trying to open configuration file:', err);
        reject(err);
        return;
      }

      try {
        const config = JSON.parse(data);
        resolve(config)
      }
      catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        reject(parseError);
      }
    });
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  win.maximize()
  win.show()
  win.loadFile('index.html')

  //devTools
  //win.webContents.openDevTools();
}

app.whenReady().then(() => {
  //One-way communication (renderer -> main)
  ipcMain.on('open-invoice-print', openInvoicePrint)

  //Two-way communication (renderer <-> main)
  ipcMain.handle('load-user-config', loadUserConfig)

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})