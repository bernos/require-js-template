/**
 * This is our main application module. It defines our custom application
 * class. Generally speaking our application class will extend piewpiew.Application
 * by adding some methods specific to our app.
 */
define(['config', 'piewpiew', 'router', 'controllers/applicationController'], function(config, piewpiew, Router, Controller) {
  var MyApplicationClass = piewpiew.Application.extend({
    // We would fill in all our custom methods here...
  });

  return new MyApplicationClass({
    config: config,
    router: Router,
    controller: Controller
  });  
});