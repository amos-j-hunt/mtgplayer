// main.js (add these)
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs           = require('fs')
const sqlite3      = require('sqlite3').verbose()
const path         = require('path')


const dbPath = path.join(__dirname, 'data', 'AllPrintings.sqlite')
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, err => {
  if (err) console.error('Failed to open DB:', err)
  else console.log('✅ Opened cards DB at', dbPath)
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // In dev: load React dev server; in prod: load built files
  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, 'build', 'index.html')}`
  win.loadURL(startUrl)
}

ipcMain.handle('import-mtgo-deck', async () => {
  // 1. Show open‐file dialog
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select MTGO deck file',
    filters: [{ name: 'MTGO Deck', extensions: ['txt'] }],
    properties: ['openFile']
  })
  if (canceled || !filePaths.length) return []

  // 2. Read & split lines
  const text  = fs.readFileSync(filePaths[0], 'utf8')
  const lines = text.split(/\r?\n/)

  // 3. Parse lines of the form "4 Lightning Bolt"
  const entries = lines
    .map(line => {
      const m = line.match(/^(\d+)\s+(.+)$/)
      return m ? { count: +m[1], name: m[2].trim() } : null
    })
    .filter(Boolean)

  // 4. For each entry, query the DB by exact name
  const deck = []
  for (const { count, name } of entries) {
    try {
      const row = await new Promise((res, rej) => {
        db.get(
          `SELECT uuid AS id FROM cards WHERE name = ? LIMIT 1;`,
          [name],
          (err, r) => (err ? rej(err) : res(r))
        )
      })
      deck.push({ count, name, id: row ? row.id : null })
    } catch {
      deck.push({ count, name, id: null })
    }
  }

  return deck
})

app.whenReady().then(createWindow)

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
