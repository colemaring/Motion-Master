# Motion Master![icon1](https://github.com/colemaring/Motion-Master/assets/65455664/c22a50dd-2108-4e5d-b7ea-bf9f34ffd181)


Motion Master is an application to control a 6DOF Arduino motion simulator and view its corresponding telemetry.   
<br>
![](https://github.com/colemaring/Motion-Master/blob/main/renderer/video.gif)    
https://www.youtube.com/watch?v=blXVVoAPlQ4   

## Installation
```bash
git clone https://github.com/colemaring/Motion-Master && cd Motion-Master && npm i
npm start
```

## Usage

### Input: 
![Screenshot 2024-12-05 151935](https://github.com/user-attachments/assets/002f3638-0f77-4734-b9f2-108888d5e76d)
Here is where you can establish a connection to the game. In order to establish a successful connection between your game and Motion Master, you must first find the option in your game's settings to open and specify a UDP port. Once you select your game and UDP port in motion master, click Apply and you should see the text below change if Motion Master is connected to your game.
### Motion Control: 
![Screenshot 2024-12-05 150911](https://github.com/user-attachments/assets/cb3deea0-609a-41c7-88cb-8f1cdbe0ef07)
This is where you can change the sensitivity, motion smoothing, and simulation mode for your motion simulator. Changes here will also reflect on the 3d cars on the right side. High sensitivity will cause a jittery motion due to minor details being exaggerated. However, too much motion smoothing will cause details to mellow out.
### Output: 
![Screenshot 2024-12-05 150923](https://github.com/user-attachments/assets/1c67879d-c67b-4b44-b28b-dffb04d63293)
Here is where you can connect Motion Master to your Arduino motion simulator ([view Arduino setup](#arduino-setup)). Specify the communications port your Arduino is connected to and click apply. Upon a successful connection, you should see the text at the bottom change to notify you of a successful connection. Specify the minimum and maximum angle your servos can reach given the physical constraints of the linear actuator. Click apply to apply your settings.
### Arduino Setup:
Open Arduino IDE -> Select Board -> File -> Examples -> Firmata -> StandardFirmataPlus.   
Verify and then upload to your Arduino.   

To connect your Arduino to a pca9685:  
A5 -> SCL  
A4 -> SDA  
GND -> GND  
5V -> VCC  
Servos 1 to pin 0 and servo 2 to pin 1 on pca9685   

Please note that Motion Master will only work on pins 0 and 1 on a pca9685. 

It is recommended to power your pca9685 externally via a 6v -ish power supply.

## Hardware
1 Arduino Uno or similar   
1 pca9685  
6 9g micro servos  
1 6V power supply  
4 male to female jumper wires  
Assortment of M2 nuts and bolts
Approx 177g of PLA filament ([view stls](https://github.com/colemaring/Motion-Master/tree/main/stls/6dof))


## Development
My initial vision for this project was to create a program that would visualize and compare different sets of motion that could be extracted from a racing game. I wanted to compare how pitch and roll motion might differ from lateral x and y acceleration motion, and visualize how that might look on a motion simulator. 

Motion Master uses [Electron](https://www.electronjs.org/) as its framework. In the Nodejs runtime (also called the main process), Motion Master is reading UDP packets and is extracting data such as rpm, pitch, roll, yaw, lateral x, and lateral y acceleration. After some computation, which can be scaled or altered by user input, the data is sent  to the renderer process and displayed as telemetry data or applied as quaternions to the Three.js meshes. To control the servos, a serial communications interface is established between the main process and the Arduino. Because the Arduino is flashed with [firmata](https://github.com/firmata/arduino), we can use a js library such as [Johnny Five](https://johnny-five.io/) to send commands to the servos. In summary, these commands are interpreted by firmata and then sent to the pca9685, which drives the servos. 

I encountered many issues when developing this project. Most of the walls I hit had to do with communicating with the servos. Thankfully, there are some native Nodejs modules such as Johnny Five to aid with this communication. However, since native modules must be compiled against the Nodejs runtime they will be run on, they must be [Electron-rebuilt](https://github.com/electron/rebuild). Here is where my build environment would not cooperate, and I had to compile Johnny Five in a virtual machine.

My next goal with this project is to implement more advanced motion cueing that blends pitch and roll motion and lateral x and y acceleration motion. Mixing these two sets of motion would be very interesting, as being able to simulate lateral G's as well as refined details about how the car is handling would provide for a more immersive motion simulator experience.

## Screenshot:
![Screenshot 2024-12-05 150555](https://github.com/user-attachments/assets/6d280c09-367a-4428-939f-3e095f9e6275)

## License
[MIT](https://choosealicense.com/licenses/mit/)
