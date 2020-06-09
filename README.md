# UnitCalculatorVue

## The Rules: 
Units go to a wealth-club and collect boxes, the more units go the faster they collect the boxes,
unit crews can't obtain more than 100 boxes, when they do at that point they stop, and stay idle.
At that moment [Action is required] player must either recall them or send 1 biker-unit to obtain the boxes and restart the counter 0-100 

## The Purpose of the app: 
To provide player with exact time he must do action.

## The Functionality: 
- Based on desired time it can estimate the exact number of units player must send to club. 
_This is usefull when player knows when he will be online to collect the 100 boxes and reset the counter from 100 to 0._
- Based on exact crew size in the club player can estimate the time needed for 100 boxes to be obtained. 
_This is usefull when player has limited crew due to club's capacity or his own units ammount._
- Modify desired boxes. 
_Player can choose the number of boxes for wich calculating to be done, range is (1 - 100) boxes/default value is 100/_
- Start Countdown. 
_Player can start countdown wich will display collected boxes and remaining time, when time ends a ringing-sound is played.

## The Implementation: 
Implementation is simple [index.html + styles.css + main.js] file with VueJS loaded via CDN.
