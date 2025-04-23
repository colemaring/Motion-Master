// reads data from game, calculates, and sends to renderer processes

const { ipcMain, BrowserWindow } = require('electron')
const dgram = require('dgram')
let server = dgram.createSocket('udp4')
let game,
  port,
  sensitivity,
  smoothing = null

// when apply button clicked on input tab
ipcMain.on('input', (event, input) => {
  game = input[0]
  port = input[1]

  // server is unbound
  if (server._bindState == 0) {
    server.bind(port)
    return
  }

  // server is bound, port was changed
  if (server._bindState == 2) {
    server.close(() => {
      server = dgram.createSocket('udp4')
      server.bind(port)
      server.on('message', handleMessage)
    })
  }
})

// when apply button clicked on motionControl tab
ipcMain.on('motionControl', (event, motionControl) => {
  sensitivity = motionControl[0]
  smoothing = motionControl[1]
})

// does this have to exist here? or can it be deleted
server.on('message', handleMessage)

// turns raw bytes from packets into useable data
function handleMessage(msg) {
  let rpm,
    xAccel,
    zAccel,
    yaw,
    pitch,
    gear,
    throttle,
    brake,
    yAccel,
    roll,
    maxRPM = null

  // game-specific UDP parsing
  // https://medium.com/@makvoid/building-a-digital-dashboard-for-forza-using-python-62a0358cb43b
  // add 12 to v2 sled
  if (game === 'FH5') {
    rpm = Math.floor(Buffer.from(msg.slice(16, 20)).readFloatLE() * 100) / 100
    xAccel = Math.floor(Buffer.from(msg.slice(20, 24)).readFloatLE() * 100) / 100
    yAccel = Math.floor(Buffer.from(msg.slice(24, 28)).readFloatLE() * 100) / 100
    zAccel = Math.floor(Buffer.from(msg.slice(28, 32)).readFloatLE() * 100) / 100
    yaw = Math.floor(Buffer.from(msg.slice(32 + 24, 36 + 24)).readFloatLE() * 10000) / 100
    pitch = Math.floor(Buffer.from(msg.slice(36 + 24, 40 + 24)).readFloatLE() * 10000) / 100
    roll = Math.floor(Buffer.from(msg.slice(40 + 24, 44 + 24)).readFloatLE() * 10000) / 100
    gear = Buffer.from(msg.slice(319, 320)).readUInt8()
    throttle = Buffer.from(msg.slice(315, 316)).readUInt8()
    brake = Buffer.from(msg.slice(316, 317)).readUInt8()
    maxRPM = Math.floor(Buffer.from(msg.slice(8, 12)).readFloatLE() * 100) / 100
  }

  // adding other games here should work as intended, although scalar values may need to be adjusted

  const returnData = [
    rpm,
    0,
    yaw,
    pitch,
    roll,
    xAccel,
    zAccel,
    gear,
    throttle,
    brake,
    yAccel,
    maxRPM
  ]
  sendDataToRenderer(returnData)
}

// the data returned by this function will be ready to be rendered or applied to servos
// the data returned by here will also correspond to the threejs cars
function dataProcessing(data) {
  let rpm = data[0]
  let xAccel = xAccelMovingAvg(data[5]) * sensitivity
  let zAccel = zAccelMovingAvg(data[6]) * sensitivity
  let yAccel = yAccelMovingAvg(data[10]) * sensitivity
  let gForce = calculateGForce(xAccelMovingAvg(data[5]), zAccelMovingAvg(data[6]))
  let yaw = yawMovingAvg(data[2]) * sensitivity
  let pitch = pitchMovingAvg(data[3]) * sensitivity * 70
  let roll = rollMovingAvg(data[4]) * sensitivity * 70
  let gear = data[7]
  let throttle = data[8]
  let brake = data[9]
  let maxRPM = data[11]

  const returnData = [
    rpm,
    gForce,
    yaw,
    pitch,
    roll,
    xAccel,
    zAccel,
    gear,
    throttle,
    brake,
    yAccel,
    maxRPM
  ]
  return returnData
}

// used to display car motion, traction circle, telemetery, and used for servo motion
function sendDataToRenderer(data) {
  // Get all open windows
  const windows = BrowserWindow.getAllWindows()

  // clean and or get moving average for data
  let dataProccessed = dataProcessing(data)

  // Send data to the first window
  if (windows.length > 0) {
    windows[0].webContents.send('data', dataProccessed)
  }
}

function calculateGForce(x, z) {
  let gForce = Math.sqrt(x * x + z * z) / 9.8
  gForce = Math.trunc(gForce * 100) / 100
  return gForce
}

function createMovingAvg() {
  let windowSize = smoothing
  const values = []

  return function (newValue) {
    if (smoothing !== windowSize) {
      windowSize = smoothing
      values.length = 0
    }
    values.push(newValue)

    if (values.length > windowSize) {
      values.shift()
    }

    const sum = values.reduce((acc, val) => acc + val, 0)

    return sum / values.length
  }
}

// Create separate moving average functions for each stream
const xAccelMovingAvg = createMovingAvg()
const zAccelMovingAvg = createMovingAvg()
const yAccelMovingAvg = createMovingAvg()
const yawMovingAvg = createMovingAvg()
const pitchMovingAvg = createMovingAvg()
const rollMovingAvg = createMovingAvg()
