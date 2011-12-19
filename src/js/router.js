define(['backbone'], function(Backbone) {
  console.log("setting up router", Backbone);

  var router = new Backbone.Router({
    routes: {
      "help" : "help",
      "*splat" : "default"
    }
  });



  router.bind("route:default", function(path) {
    console.log("default", arguments);
    var args       = path.split("/");
    var controller = args.shift();
    var action     = args.shift();

    if (!action) {
      action = 'index';
    }

    console.log(controller, action)

    require(['controllers/' + controller], function(c) {
      c[action].apply(c, args);
    })
  });


  router.bind("all", function() {
    console.log(arguments)
  })


  Backbone.history.start();

  return router;
});