/**
 * Let require.js know where our libraries live
 */
require.config({
  paths: {
    jquery:     'libs/jquery-min',
    underscore: 'libs/underscore-min',
    backbone:   'libs/backbone-min',
    piewpiew:   'libs/piewpiew-backbone' 
  }
});

/**
 * Load the main application module and kick things off
 */
require(['application'], function(Application) {
  Application.run();
});