/**
 * Beer O'Clock
 *
 * Port of a Pebble SDK 1.0 watchface written by ThomW.
 * https://github.com/ThomW/pebble-beer-o-clock-dx
 *
 */

// module requirements
var UI = require('ui'),
    Vibe = require('ui/vibe'),
    Vector2 = require('vector2');

// constants
var START_HOUR = 9,
    END_HOUR = 17,
    STARTING_BEER_Y = 115;

// UI elements
var window = new UI.Window(),
    
bgRect = new UI.Rect({ 
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  backgroundColor: 'black'
}),

timeText = new UI.TimeText({
  position: new Vector2(0, 140),
  size: new Vector2(144, 40),
  text: '%l:%M %p',
  font: 'gothic_24_bold',
  color: 'white',
  textAlign: 'center',
}),
    
maskRect = new UI.Rect({ 
  position: new Vector2(0, 115),
  size: new Vector2(144, 53),
  backgroundColor: 'black'
}),

bocRect = new UI.Rect({ 
  position: new Vector2(0, 0),
  size: new Vector2(144, 140),
  backgroundColor: 'black'
}),
    
beerImg = new UI.Image({
  position: new Vector2(25, STARTING_BEER_Y),
  size: new Vector2(67, 125),
  image: 'images/beer.png'
}),
    
mugImg = new UI.Image({
  position: new Vector2(25, 11),
  size: new Vector2(98, 126),
  image: 'images/mug.png',
  compositing: 'or'
}),
    
bocImg = new UI.Image({
  position: new Vector2(6, 60),
  size: new Vector2(131, 46),
  image: 'images/boc.png'
});

/*
 * Calculate the current offset number and return it.
 */
var calculateOffset = function(date) {
  var offset = 0,
      totalMinutes = (END_HOUR - START_HOUR) * 60,
      currentMinutes = (date.getHours() * 60) + date.getMinutes();
  
  offset = STARTING_BEER_Y - ((currentMinutes / totalMinutes) * STARTING_BEER_Y);  
  
  return offset;
};

/*
 * Handles Beer O'Clock!
 * If Beer O'Clock (aka END_HOUR) overlay the image graphic over of the mug.
 * Otherwise, remove the image graphic if it was previously added to the window.
 */
var checkForBoc = function(date) {
  // capture boolean indication if the image graphic has been added to the window
  var isBocShowing = window.index(bocImg) > -1;
  
  if (date.getHours() === END_HOUR && !isBocShowing) {
    window.add(bocRect);
    window.add(bocImg);
    Vibe.vibrate('short');
  } else if (date.getHours() > END_HOUR && isBocShowing) {
    window.remove(bocRect);      
    window.remove(bocImg);
  }
};

/*
 * Fill up the mug!
 * Update the beer position every minute.
 */
var startFilling = function() {
  // loop fires on every whole minute
  (function loop() {
    var now = new Date();
    
    // check and handle Beer O'Clock on every iteration
    checkForBoc(now);
  
    // only start filling after START_HOUR :D
    var beerPos = beerImg.position();    
    beerPos.y = STARTING_BEER_Y;
    if (now.getHours() >= START_HOUR) {
      // update beer position with animation!
      beerPos.y += calculateOffset(now);
    }
    if (beerPos.y < 0) { beerPos.y = 0; }
    beerImg.animate('position', beerPos, 1000);
    
    // determine the next whole minute 
    // use a new date object for best accuracy
    var delay = 60000 - (new Date() % 60000);
    // delay next loop call until the determined next minute
    setTimeout(loop, delay);
  })();
};

/*
 * Setup the watchapp in this self-firing initializer.
 */
(function() {
  // add the background to the window and show it right away
  window.add(bgRect);
  window.show();
  
  // add the remaining elements
  window.add(beerImg);
  window.add(maskRect);
  window.add(mugImg);
  window.add(timeText);
  
  // handle Beer O'Clock on startup to avoid flashing UI elements
  checkForBoc(new Date());
  
  // fire up the beer fill loop!
  startFilling();
})();