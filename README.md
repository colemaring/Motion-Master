# Motion Master

Motion Master is an application to control a 2DOF motion simulator and view its corresponding telemetry.
Insert a cool gif here

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
git clone https://github.com/colemaring/Motion-Master && cd Motion-Master

npm install

npm run start
```

## Usage

### Arduino Setup:
Open Arduino IDE -> Select Board -> File -> Examples -> Firmata -> StandardFirmataPlus. Verify and then upload to your Arduino.   

To connect your Arduino to a pca9685:  
A5 -> SCL  
A4 -> SDA  
GND -> GND  
5V -> VCC  
Servos 1 to pin 0 and servo 2 to pin 1 on pca9685  

It is recommended to power your pca9685 externally via a 5v -ish power supply.

### Input: 
Here is where you can establish a connection to the game. In order to establish a successful connection between your game and Motion Master, you must first find the option in your game's settings to open and specify a UDP port. Once you select your game and UDP port in motion master, click Apply and you should see the text below change if Motion Master is connected to your game.
### Motion Control: 
This is where you can change the sensitivity, motion smoothing, and axis direction for your motion simulator. Changes here will also reflect on the 3d cars on the right side. Higher sensitivity will cause a jittery motion, due to minor details being exaggerated, whereas a high motion smoothing will cause details to mellow out. Inverting the pitch/roll rotation may be needed depending on how your motion simulator was built.
### Output: 
Here is where you can connect Motion Master to your Arduino motion simulator. Specify the communications port your Arduino is connected to and click apply. Upon a successful connection, you should see the text at the bottom change to notify you of a successful connection. Once you are connected to your Arduino motion simulator, you will now be able to choose which type of motion cueing you would like to use, aswell as set the servo offset angles. To find the correct servo offset angles, start with 90 and move your car to a flat surface. If the offset is correct, both servo arms should be parallel to each other, and perpendicular to the ground/surface it is sitting on. Click apply to apply your settings.
### Test: 
Here you can test the minimum and maximum mobility of your motion simulator. You must be connected via the Output tab in order for this to work. The sliders are on a range from 0 to 180. Inverted axis assignments will NOT reflect here.

## Known Errors/Bugs:
When an output mode, such as G-Force is selected, the test sliders do not work. servos are receiving 0s and slider vals and fighting.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
