require.config({
  paths: {
    jquery:     'libs/jquery-min',
    underscore: 'libs/underscore-min',
    backbone:   'libs/backbone-min'
  }
});

require(['application'], function(application) {
  console.log("application is now ready");
});