const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { shell } = require('electron')
const fs = require('fs')

function openInvoicePrint(event, invoice) {
  const path = 'preview.html'

  fs.writeFileSync(path, invoice)
  shell.openPath(path)
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
  ipcMain.on('open-invoice-print', openInvoicePrint)
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