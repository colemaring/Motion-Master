# Motion Master![icon1](https://github.com/colemaring/Motion-Master/assets/65455664/c22a50dd-2108-4e5d-b7ea-bf9f34ffd181)



Motion Master is an application to control a 2DOF Arduino motion simulator and view its corresponding telemetry.   
<br>
![](https://github.com/colemaring/Motion-Master/blob/main/renderer/video.gif)    
Watch the full video with sound: https://www.youtube.com/watch?v=YvrfcUyO0JA&ab_channel=ColeMaring   

## Installation


```bash
git clone https://github.com/colemaring/Motion-Master && cd Motion-Master

npm install

npm run start
```

## Usage

### Input: 
![162d9000259a3d451d5de32b1faf1b76](https://github.com/colemaring/Motion-Master/assets/65455664/81a3a474-9fce-4895-9aa1-25f06c6ff848)   
Here is where you can establish a connection to the game. In order to establish a successful connection between your game and Motion Master, you must first find the option in your game's settings to open and specify a UDP port. Once you select your game and UDP port in motion master, click Apply and you should see the text below change if Motion Master is connected to your game.
### Motion Control: 
![c3fcf073a412d86745b3f27987d59cec](https://github.com/colemaring/Motion-Master/assets/65455664/66f68132-895f-4392-a37c-552dd001816c)   
This is where you can change the sensitivity, motion smoothing, and axis direction for your motion simulator. Changes here will also reflect on the 3d cars on the right side. High sensitivity will cause a jittery motion due to minor details being exaggerated. However, too much motion smoothing will cause details to mellow out. Inverting the pitch/roll rotation may be needed depending on how your motion simulator was built.
### Output: 
![3e569243480e0b45daae3a3019ebdac3](https://github.com/colemaring/Motion-Master/assets/65455664/1f61fdcb-4191-4bd8-97cb-2bf4bb02bfee)   
Here is where you can connect Motion Master to your Arduino motion simulator ([view Arduino setup](#arduino-setup)). Specify the communications port your Arduino is connected to and click apply. Upon a successful connection, you should see the text at the bottom change to notify you of a successful connection. Once you are connected to your Arduino motion simulator, you will now be able to choose which type of motion cueing you would like to use, aswell as set the servo offset angles. To find the correct servo offset angles, start with 90 and move your car to a flat surface. If the offset is correct, both servo arms should be parallel to each other and parallel to the ground/surface it is sitting on. Click apply to apply your settings.
### Test:
![83a7e46f75cf7d6f8c095fab1cf40436](https://github.com/colemaring/Motion-Master/assets/65455664/b52dacdd-b0f5-4f2d-8813-969038a976cf)   
Here you can test the minimum and maximum mobility of your motion simulator. You must be connected via the Output tab in order for this to work. The sliders are on a range from 0 to 180. Inverted axis assignments will NOT reflect here.
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
Motion Master can be configured to support different kinds of 2DOF layouts. However, if you do not want to
design your own motion simulator, you can use the STLs and hardware information provided.

1 Arduino Uno or similar   
1 pca9685  
2 9g micro servos  
1 6V power supply  
4 male to female jumper wires  
6 25mm M4 screws  
2 16mm M4 screws  
12 M4 nuts  
Approx 177g of PLA filament ([view stls](https://github.com/colemaring/Motion-Master/tree/main/stls))

## Development
My initial vision for this project was to create a program that would visualize and compare different sets of motion that could be extracted from a racing game. I wanted to compare how pitch and roll motion might differ from lateral x and y acceleration motion, and visualize how that might look on a motion simulator. 

Motion Master uses [Electron](https://www.electronjs.org/) as its framework. In the Nodejs runtime (also called the main process), Motion Master is reading UDP packets and is extracting data such as rpm, pitch, roll, yaw, lateral x, and lateral y acceleration. After some computation, which can be scaled or altered by user input, the data is sent  to the renderer process and displayed as telemetry data or applied as quaternions to the Three.js meshes. To control the servos, a serial communications interface is established between the main process and the Arduino. Because the Arduino is flashed with [firmata](https://github.com/firmata/arduino), we can use a js library such as [Johnny Five](https://johnny-five.io/) to send commands to the servos. In summary, these commands are interpreted by firmata and then sent to the pca9685, which drives the servos. 

I encountered many issues when developing this project. Most of the walls I hit had to do with communicating with the servos. Thankfully, there are some native Nodejs modules such as Johnny Five to aid with this communication. However, since native modules must be compiled against the Nodejs runtime they will be run on, they must be [Electron-rebuilt](https://github.com/electron/rebuild). Here is where my build environment would not cooperate, and I had to compile Johnny Five in a virtual machine.

My next goal with this project is to implement a slider that lets the user blend pitch and roll motion and lateral x and y acceleration motion. Mixing these two sets of motion would be very interesting, as being able to simulate lateral G's as well as refined details about how the car is handling would provide for a more immersive motion simulator experience.

## Known Errors/Bugs:
When an output mode such as G-Force is selected, the test sliders do not work. Servos are receiving 0s and slider vals are fighting.

## License

[MIT](https://choosealicense.com/licenses/mit/)
