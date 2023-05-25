const {Board, Servo} = require("johnny-five");
const {ipcMain } = require('electron')

let userPort, gForceMode, pitchAndRollMode = null;

ipcMain.on("output", (event, value) => {
    userPort = value[0];
    // console.log("COM3" === userPort)
    gForceMode = value[1];
    pitchAndRollMode = value[2];

    const board = new Board({
        repl: false,
        port: userPort,
        // timeout: 1
      });
      
      const controller = "PCA9685";
      
      
      board.on("ready", () => {
        console.log("Connected");
        let pitch, yaw, roll;
      
        // Initialize the servo instance
        const a = new Servo({
          controller,
          pin: 0,
        });
      
        const b = new Servo({
          controller,
          range: [0, 180],
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
              let pitchVal = xAccel * -400;
              let rollVal = yAccel * -400;
              b.to(pitchVal + rollVal + 110);
              a.to(pitchVal + -1 * rollVal + 90);
           }
           else if (pitchAndRollMode)
           {
              let pitchVal = pitch * -400;
              let rollVal = roll * -400;
              b.to(pitchVal + rollVal + 110);
              a.to(pitchVal + -1 * rollVal + 90);
           }
        });

        ipcMain.on("pitchTestSlider", (event, value) => {
            a.to(value);
            b.to(-value + 180);
          })
          
          ipcMain.on("rollTestSlider", (event, value) => {
            a.to(value);
            b.to(value);
          })
})


// create new board connection when userport is changed, or when output ipc is triggered?




  
});