/**
 * This is an AMD module containing some useful, re-usable backbone utilities
 */
define(['underscore', 'backbone'], function(_, Backbone) {

  var piewpiew = {};

  /**
   *  piewpiew.Class
   *  --------------------------------------------------------------------------
   */

  piewpiew.Class = function() {
    var methods = null,
        parent  = null,
        initializing = false;
                
    /**
     * Default constructor for our new class. All classes created using the 
     * piewpiew.Class() method will share this constructor.
     */
    var klass = function() {
      if(!initializing) {
        this.initialize.apply(this, arguments);
      }
    };
      
    /**
     * If the first argument is a function, assume it is the "class" from which 
     * the new class will inherit. In this case the second argument is an object 
     * containing the methods and properties for the new class.
     *
     * If the first argument is not a function, then we interpret it as an 
     * object containing the methods and properties of the new class
     */
    if (typeof arguments[0] === 'function') {
      parent = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (parent) {
      // Set the initializing flag to prevent the normal initialization methods 
      // firing when creating the new prototype object
      initializing = true;
      klass.prototype = new parent();
      initializing = false;
    }

    _.extend(klass.prototype, methods);
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = function(){};
    } 

    klass.extend = function(o) {
      return piewpiew.Class(this, o);
    }

    return klass;
  };

  /**
   *  piewpiew.Application base class
   *  --------------------------------------------------------------------------
   */

  piewpiew.Application = piewpiew.Class({
    initialize: function(options) {

      // Ensure we have a valid options object
      options = options || {};

      _.extend(this, options);

      this.initializeModel();
      this.initializeView();
      this.initializeController();      
    },

    initializeModel: function() {
      
    },

    initializeView: function() {
      
    },

    initializeController: function() {
      this.controller = new piewpiew.ApplicationController({
        router: new Backbone.Router({
          '*splat' : 'default'
        })
      });
    },

    run: function() {
      Backbone.history.start();
    }
  });

  /**
   *  piewpiew.ApplicationController base class
   *  --------------------------------------------------------------------------
   */

  piewpiew.ApplicationController = piewpiew.Class({

    initialize: function(options) {
      options = options || {};
      options.config = options.config || {};

      _.extend(this, options); 

      if (options.router) {
        this.setRouter(options.router);
      }
    },

    /**
     * Our default action handles the default '*splat' route. This 'path'
     * argument contains the url path after the '#' in the requested URL.
     *
     * Default behavior is to split path by '/' and use the first path part as 
     * the name of an action method to run, and pass the rest of the path  parts 
     * as arguments to the action 
     *
     * @param {String} path
     *  The portion of the requested URL after the '#'
     */
    defaultAction : function(path) {
      var parts  = path.split("/");
      var action = parts.shift();
      
      if (action == "") {
        action = "index";
      }  

      if (typeof this[action + 'Action'] == 'function') {
        this[action + 'Action'].apply(this, parts);
      } else {
        // Controller does not have an action for this route. 
        if (this.config.enableExceptions) {
          throw 'Action "' + action + '"" not implemented.';
        }
      }
    },

    /**
      * Binds the controller to a router. The controller binds a handler to all events
      * dispatched by the Router. This handler will inspect the name of the route
      * fired by the router, and attempt to call the relevant controller action
      * function. Controller actions follow the naming conventions '<route>Action'
      * where <route> is the name of the route, as defined in the router.js file.
      * For example, if we had a route named 'search' in router.js, the controller
      * will attempt to call a function named searchAction.
      */
    setRouter: function(router) {
      var controller = this;

      this.router = router;

      router.bind("all", function() {
        var args  = Array.prototype.slice.apply(arguments);
        var route = args.shift().split(':')[1];

        if (typeof controller[route + 'Action'] == 'function') {
          controller[route + 'Action'].apply(controller, args); 
        } else {
          // Controller does not have an action for this route.
          if (controller.config.enableExceptions) {
            throw 'Action for route "' + route + '"" not implemented.';
          }
        }   
      });
    }
  });

  return piewpiew;
});