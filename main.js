// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const packetsJS = require('./packets.js')
// const servodriver = require('./servodriver.js')
// const servos = require('./servos.js')
const  isDev = process.env.NODE_ENV !== "production"
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
    fullscreenable: false,
    width: 1280,
    height: 720 ,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  // Open devtools if in dev env
  if (isDev ){
    mainWindow.webContents.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const {Board, Servo } = require("johnny-five");
const {ipcMain } = require('electron')

let userPort, gForceMode, pitchAndRollMode, offset1, offset2 = null;

// values to use in our servo driver
ipcMain.on("outputSettings", (event, value) => {
  gForceMode = value[0];
  pitchAndRollMode = value[1];
  offset1 = value[2];
  offset2 = value[3];
})

// connect to the board using com port
ipcMain.on("output", (event, value) => {
    userPort = value;

    const board = new Board({
        repl: false,
        port: userPort,
        // timeout: 1
    });
      
    const controller = "PCA9685";
  
    board.on("ready", () => {
        console.log("Connected");
        // update html connected text
        mainWindow.webContents.send('update-html-text', ["Connected", true]);
        let pitch, yaw, roll;
      
        // Initialize the servo instance
        const a = new Servo({
          controller,
          pin: 0,
        });
      
        const b = new Servo({
          controller,
          pin: 1,
        });
      
        ipcMain.on('data-to-main', (event, data) => {
           // data received from main process
            pitch = data[3];
            yaw = data[2]; 
            roll = data[4];
            xAccel = data[5];
            yAccel = data[6];
      
            if (gForceMode)
            {
              // arbitrary scalars dont really matter here
              let pitchVal = xAccel * -400;
              let rollVal = yAccel * -400;
              b.to(pitchVal + rollVal + parseInt(offset1));
              a.to(pitchVal + -1 * rollVal + parseInt(offset2));
            }
            else if (pitchAndRollMode)
            { 
              // arbitrary scalars 
              let pitchVal = pitch * -10;
              let rollVal = roll * -10;
              b.to(pitchVal*-1 + rollVal + parseInt(offset1));
              a.to(pitchVal + rollVal + parseInt(offset2));
            }
        });

        // does not work when an output mode is toggled
        ipcMain.on("pitchTestSlider", (event, value) => {
            a.to(value);
            b.to(-value + 180);
        })
          
        ipcMain.on("rollTestSlider", (event, value) => {
            a.to(value);
            b.to(value);
        })
    })

    // update html text 
    board.on("exit", () => {
    mainWindow.webContents.send('update-html-text',  ["Disconnected", true]);
    });
});

