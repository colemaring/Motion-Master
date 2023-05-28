# Motion-Master
View and control your 2DOF motion simulator in a lightweight application.<br />
![motion](https://user-images.githubusercontent.com/65455664/229327411-935b650d-f0bb-4adc-8731-e0b37e9c3afe.gif)

Install:<br />
git clone https://github.com/colemaring/Motion-Master (clone repo)<br />
npm install (install dependencies)<br />
.\node_modules\.bin\electron-rebuild.cmd or $(npm bin)/electron-rebuild (rebuilds johnny-five to match electron node runtime)<br />
npm run start<br />

Configure:<br />
flash standardFirmataPlus onto arduino uno<br />
connect arduino to pca9685 as follows<br />
  A5 -> SCL<br />
  A4 -> SDA<br />
  GND -> GND<br />
  5V -> VCC<br />
servos to pins 0 and 1 on pca9685<br />

Settings:<br />
settings here

Notes for later:<br />
enable udp on forza 5 and match port<br />
if errors with rebuild, reinstall nodejs and check choco install<br />

TODO:<br />
fix test when a output mode selected <br />
styling <br />
support more games <br />
add data persistance <br />

V1

https://github.com/colemaring/Motion-Master/assets/65455664/49d2157e-1708-4f01-8d94-46e70c5ab0cf

