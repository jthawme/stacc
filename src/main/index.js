'use strict'

import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

import Converter from '../modules/Converter';
import { EVENTS } from '../modules/Constants';

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({
    width: 720,
    height: 480,
    titleBarStyle: 'hidden',
    movable: true,
    webPreferences: { webSecurity: false }
  });

  window.setResizable(false);

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  const converter = new Converter();
  const convertDefaults = {
    start: 50,
    duration: 10,
    scaledDown: 2,
    scaledFps: 2,
    sampleColors: true,
    asGif: true
  };

  ipcMain.on(EVENTS.CONVERT, (event, { file, destination, properties}) => {
    converter.convert(
      { file, destination, properties: {...convertDefaults, properties} },
      (percent) => event.sender.send(EVENTS.PROGRESS, percent),
    )
      .then(filePath => {
        event.sender.send(EVENTS.FINISHED, {
          filePath,
          directory: path.dirname(filePath)
        });
      })
      .catch(err => event.sender.send(EVENTS.ERROR, err));
  });

  ipcMain.on(EVENTS.INFO_REQUEST, (event, file) => {
    converter.info(file)
      .then(data => {
        event.sender.send(EVENTS.INFO, data);
      });
  });

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
    converter.kill();
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
});

app.dock.setIcon(nativeImage.createFromDataURL(require(`./assets/icons/1024x1024.png`)));
