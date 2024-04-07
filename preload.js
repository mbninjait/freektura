const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('main', {
  //One-way communication (renderer -> main)
  openInvoicePrint: (invoice) => ipcRenderer.send('open-invoice-print', invoice),

  //Two-way communication (renderer <-> main)
  loadUserConfig: () => ipcRenderer.invoke('load-user-config')
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})
