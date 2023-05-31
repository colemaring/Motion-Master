// if input apply button clicked, send game and port values through ipc renderer as "input"
let input = [document.getElementById("gameSelector").value, document.getElementById("portSelector").value];
document.getElementById("inputApply").addEventListener("click", function() {input = [document.getElementById("gameSelector").value, document.getElementById("portSelector").value]});
document.getElementById("inputApply").addEventListener("click", function() {ipcRenderer.send('input', input);})

// if motionControl apply button clicked, send las, ms, prs, and ms2 values through ipc renderer as "motionControl"
let motionControl = [document.getElementById("linearAccelSlider").value, document.getElementById("maAccelSlider").value, 
document.getElementById("rawSlider").value, document.getElementById("maRawSlider").value, document.getElementById("servosInvertX").checked, document.getElementById("servosInvertY").checked];
document.getElementById("motionControlApply").addEventListener("click", function() {motionControl = [document.getElementById("linearAccelSlider").value, document.getElementById("maAccelSlider").value, 
document.getElementById("rawSlider").value, document.getElementById("maRawSlider").value, document.getElementById("servosInvertX").checked, document.getElementById("servosInvertY").checked]});
document.getElementById("motionControlApply").addEventListener("click", function() {ipcRenderer.send('motionControl', motionControl);})

// if output apply button clicked, send arduino port, and checkbox values through ipc renderer as "output"
let output = document.getElementById("arduinoPort").value;
document.getElementById("outputApply").addEventListener("click", function() {output = document.getElementById("arduinoPort").value;});
document.getElementById("outputApply").addEventListener("click", function() {ipcRenderer.send('output', output);})

let outputSettings = [document.getElementById("linearAccelCheckbox").checked, document.getElementById("pitchAndRollCheckbox").checked, document.getElementById("servo1Offset").value, document.getElementById("servo2Offset").value];
document.getElementById("outputApplySettings").addEventListener("click", function() {outputSettings = [document.getElementById("linearAccelCheckbox").checked, document.getElementById("pitchAndRollCheckbox").checked, document.getElementById("servo1Offset").value, document.getElementById("servo2Offset").value];});
document.getElementById("outputApplySettings").addEventListener("click", function() {ipcRenderer.send('outputSettings', outputSettings);})

// when tab button clicked
document.getElementById("inputButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("input")})
document.getElementById("motionControlButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("motionControl")})
document.getElementById("testButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("test")})
document.getElementById("outputButton").addEventListener("click", function() { clearTabContent(); removeFocus(); showTabContent("output")})
// click so menu is focused when opening program
document.getElementById("inputButton").click();

// when test pitch and roll sliders are moved, send their values through ipc renderer as pitch and rollTestSlider respectively
document.getElementById("pitchTestSlider").addEventListener("input", function() {ipcRenderer.send('pitchTestSlider', document.getElementById("pitchTestSlider").value);})
document.getElementById("rollTestSlider").addEventListener("input", function() {ipcRenderer.send('rollTestSlider', document.getElementById("rollTestSlider").value);})

// tab menu behavior

function clearTabContent()
{
    let tabContent = document.getElementsByClassName("tabcontent");

    for (let i = 0; i < tabContent.length; i++)
    {
        tabContent[i].style.display = "none";
    }
}

function showTabContent(id)
{
    document.getElementById(id).style.display = "block";
    document.getElementById(id + "Button").className += " active";
}

function removeFocus(id)
{
    let tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}
