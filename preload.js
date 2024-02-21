const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('main', {
  openInvoicePrint: (invoice) => ipcRenderer.send('open-invoice-print', invoice)
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})
