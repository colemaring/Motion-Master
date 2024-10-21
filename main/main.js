// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const packetsJS = require("./packets.js");
// const electronReload = require("electron-reload");
// const servodriver = require('./servodriver.js')
// const servos = require('./servos.js')
const isDev = process.env.NODE_ENV !== "development";
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: "renderer/icon.png",
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
    fullscreenable: false,
    width: 1680,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Open devtools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const { Board, Servo } = require("johnny-five");
const { ipcMain } = require("electron");

let userPort,
  gForceMode,
  pitchAndRollMode,
  minAngle,
  maxAngle = null;

// values to use in our servo driver
ipcMain.on("outputSettings", (event, value) => {
  gForceMode = value[0];
  pitchAndRollMode = value[1];
  minAngle = value[2];
  maxAngle = value[3];
});

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
    mainWindow.webContents.send("update-html-text", [
      "connected to arduino",
      true,
    ]);
    let pitch, yaw, roll;

    // initialize the servo instances
    const a = new Servo({
      controller,
      pin: 0,
    });

    const b = new Servo({
      controller,
      pin: 1,
    });

    const c = new Servo({
      controller,
      pin: 2,
    });

    const d = new Servo({
      controller,
      pin: 3,
    });

    const e = new Servo({
      controller,
      pin: 4,
    });

    const f = new Servo({
      controller,
      pin: 5,
    });

    ipcMain.on("data-to-main", (event, data) => {
      // data received from parsing of udp packets
      pitch = data[3];
      yaw = data[2];
      roll = data[4];
      xAccel = data[5];
      yAccel = data[6];

      if (gForceMode) {
        // arbitrary scalars dont really matter here
        // Use accelerations to control servos for all axes
        let pitchVal = xAccel * -400;
        let rollVal = yAccel * -400;
        let yawVal = zAccel * 400;

        // Update the servos based on the motion inputs (adjust as needed)
        a.to(Math.max(minAngle, Math.min(maxAngle, pitchVal + rollVal)));
        b.to(Math.max(minAngle, Math.min(maxAngle, pitchVal - rollVal)));
        c.to(Math.max(minAngle, Math.min(maxAngle, yawVal)));
        d.to(Math.max(minAngle, Math.min(maxAngle, -yawVal)));
        e.to(Math.max(minAngle, Math.min(maxAngle, pitchVal + yawVal)));
        f.to(Math.max(minAngle, Math.min(maxAngle, rollVal - yawVal)));
      } else if (pitchAndRollMode) {
        // arbitrary scalars
        // Control for pitch and roll
        // vals for pitch and roll are between -10 and 10, yaw is 360
        // console.log(pitch, roll, yaw);
        let pitchVal = pitch * -6;
        let rollVal = roll * -6;
        //let yawVal = yaw / -10;
        //console.log(yaw, yawVal);

        // Update the servos for pitch, roll, and yaw (adjust accordingly)
        a.to(
          Math.max(
            minAngle,
            Math.min(maxAngle, maxAngle - 60 + pitchVal - rollVal / 1.4)
          )
        );
        b.to(Math.max(minAngle, Math.min(maxAngle, maxAngle - 60 - rollVal)));
        c.to(
          Math.max(
            minAngle,
            Math.min(maxAngle, maxAngle - 60 - pitchVal - rollVal / 1.4)
          )
        );
        d.to(
          Math.max(
            minAngle,
            Math.min(maxAngle, maxAngle - 60 - pitchVal + rollVal / 1.4)
          )
        );
        e.to(Math.max(minAngle, Math.min(maxAngle, maxAngle - 60 + rollVal)));
        f.to(
          Math.max(
            minAngle,
            Math.min(maxAngle, maxAngle - 60 + pitchVal + rollVal / 1.4)
          )
        );
      }
    });

    // does not work when an output mode is toggled
    ipcMain.on("pitchTestSlider", (event, value) => {
      a.to(Math.max(minAngle, Math.min(maxAngle, value)));
      b.to(Math.max(minAngle, Math.min(maxAngle, -value + 180)));
      c.to(Math.max(minAngle, Math.min(maxAngle, value + 30)));
      d.to(Math.max(minAngle, Math.min(maxAngle, -value + 150)));
    });

    ipcMain.on("rollTestSlider", (event, value) => {
      e.to(Math.max(minAngle, Math.min(maxAngle, value)));
      f.to(Math.max(minAngle, Math.min(maxAngle, -value + 180)));
    });
  });

  // update html text
  board.on("exit", () => {
    mainWindow.webContents.send("update-html-text", [
      "not connected to arduino",
      true,
    ]);
  });
});
