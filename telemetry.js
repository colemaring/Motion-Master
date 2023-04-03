const {ipcRenderer} = require("electron");

ipcRenderer.send('cueing', cueing);
ipcRenderer.send('input', input);


drawTractionCircle(0, 0);

ipcRenderer.on('data', (event, data) => {
  // data received from main process
  document.getElementById("gForce").innerHTML = data[1];
  document.getElementById("pitchValue").innerHTML = data[3];
  document.getElementById("yawValue").innerHTML = data[2]; //just for display
  document.getElementById("rollValue").innerHTML = data[4];
  document.getElementById("rpmValue").innerHTML = data[0];
  drawTractionCircle(data[5], data[6]);
})

function drawTractionCircle(xAccel, yAccel) {
    var canvas = document.getElementById('tractionCircle');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // outer circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, 2 * Math.PI);
    ctx.stroke();

    // crosshairs
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 10);
    ctx.lineTo(canvas.width / 2, canvas.height - 10);
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();

    // red dot math
    var x = -1 * (xAccel * 4 * (canvas.width / 2 - 10)) + (canvas.width / 2);
    var y = (yAccel * 4 * (canvas.height / 2 - 10)) + (canvas.height / 2);

    // line from center to red dot
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(x, y);
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke();
    ctx.lineWidth = 1; // Reset the line width

    // red dot
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}

