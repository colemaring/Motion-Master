const {ipcRenderer} = require("electron");
let timeout;

ipcRenderer.send('cueing', cueing);
ipcRenderer.send('input', input);

drawTractionCircle(0, 0);

ipcRenderer.on('data', (event, data) => {
  // data received from main process
  document.getElementById("gForce").innerHTML = data[1].toFixed(2);
  document.getElementById("pitchValue").innerHTML = data[3].toFixed(2);
  document.getElementById("yawValue").innerHTML = data[2].toFixed(2); //just for display
  document.getElementById("rollValue").innerHTML = data[4].toFixed(2);
  document.getElementById("rpmValue").innerHTML = data[0].toFixed(2);
  // datar = data[0]
  drawTractionCircle(data[5], data[6]);
  changeConnectionStatus(data[0]);

  // send to servo driver
  ipcRenderer.send('data-to-main', data);
})


document.getElementById("arduinoConnected").style.color = "red";
ipcRenderer.on('update-html-text', (event, newText) => {
  // Update the HTML text
  document.getElementById('arduinoConnected').innerText = newText[0];
  document.getElementById("outputApply").disabled = newText[1];
  document.getElementById("outputApply2").disabled = !newText[1];
  if (newText[1] == true)
  document.getElementById("arduinoConnected").style.color = "green";
  else
  document.getElementById("arduinoConnected").style.color = "red";
});

// after some time of server inactivity we should change the status
function changeConnectionStatus(data)
{
  if(data >= 0)
  {
    document.getElementById("connectionStatus").innerHTML = "connected to game"
    document.getElementById("connectionStatus").style.color = "green";

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      document.getElementById("connectionStatus").innerHTML = "not connected to game";
      document.getElementById("connectionStatus").style.color = "red";
  }, 500);
  }
}

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

