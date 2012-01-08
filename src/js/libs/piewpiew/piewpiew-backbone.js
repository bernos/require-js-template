/**
 * This is an AMD module containing some useful, re-usable backbone utilities
 */
define(['underscore', 'backbone'], function(_, Backbone) {

  var piewpiew = {};

  /**
   *  piewpiew.Class
   *  --------------------------------------------------------------------------
   *  Utility function for defining 'Classes'. 
   */
  var initializing = false;
    
  piewpiew.Class = function() {
    var methods = null;
    var parent  = null;
                
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
   *  piewpiew.View base class
   *  --------------------------------------------------------------------------
   *  Adds external template support to the basic Backbone.View class, as well 
   *  as default implementations for rendering and and facade registration.
   */
  piewpiew.View = Backbone.View.extend({

    // A default template.
    template: 'No template specified for view',

    /**
     * Template processing function. By default we use the template function 
     * provided by the underscore library. By default instances call
     * piewpiew.View.template(). You can implement per-view template functions
     * by overriding this method. If you want to override the template function
     * for all views in your app, you should override piewpiew.View.template()
     *
     * @param {String} template
     *  The unparsed template string
     * @param {Object} context
     *  The template context containing data to be rendered by the template
     * @return {String} the rendered template
     */
    templateFunction: function(template, context) {
      return piewpiew.View.template(template, context);
    },

    /**
     * Returns a template context object. A Template context is an object 
     * which encapsulates the data that will be rendered by our template
     * function. By default we simply return the result of calling our
     * model's toJSON method (assuming we have a model, and that model has a
     * toJSON method).
     *
     * In many cases you will want to override this method so that ir returns
     * data better suited to your template's requirements.
     *
     * @return {Object}
     */
    templateContext: function() {
      if (this.model && typeof this.model.toJSON == 'function') {
        return this.model.toJSON();
      }
      return {};
    },

    /**
     * Renders the view. By default we pass our template string and template
     * context to templateFunction()
     */
    render: function() {
      $(this.el).html(this.templateFunction(this.template, this.templateContext()));
      return this;
    },

    /**
     * This method is called when the view is registered with the Facade. It
     * is often a better idea to put any view initialization code in onRegister(),
     * as opposed to initialize() as the view will have access to the Facade via 
     * this.facade during onRegister().
     *
     * @param {piewpiew.Facade}
     *  the facade that the view is being registered with
     */
    onRegister: function(facade) {
      // noop
      return this;
    }
  });

  /**
   * Template processing function for all views. If you wish to use a templating
   * library other than the underscore template function (such as mustache etc)
   * just override this function
   *
   * @param {String} template
   *  The template string to be rendered
   * @param {Object} context
   *  The context object containing data to be rendered
   * @return {String} the rendered template
   */
  piewpiew.View.template = function(template, context) {
    return _.template(template, context);
  }

  /**
   *  piewpiew.Facade
   *  -------------------------------------------------------------------------
   *  The Facade class represents the 'core' of our app or app component. It
   *  provides a consistent point of access to views and models in our app
   *  via the regsiterView, registerModel, getView, getModel methods.
   */    
  piewpiew.Facade = Backbone.View.extend({

    /**
     * Initializes the Facade instance.
     *
     * @param {String} key
     *  Unique multiton key for the facade
     * @param {Object} options
     *  Default options for the facade
     */
    initialize: function(key, options) {
      if (piewpiew.Facade.instanceMap[key]) {
        throw "Facade instance with key '" + key + "' already exists."
      }

      piewpiew.Facade.instanceMap[key] = this;

      _.extend(this, options || {});

      this._multitonKey = key;
      this._routerMap   = {};
      this._modelMap    = {};
      this._viewMap     = {};

      this.initializeRouter();
      this.initializeModel();
      this.initializeView();
      this.initializeController();

      return this;
    },

    /**
     * Register your router(s) here.
     */
    intitializeRouter: function() { return this; },

    /**
     * Register your models with the facade here.
     */
    initializeModel: function() { return this; },

    /**
     * Register your views with the facade here.
     */
    initializeView: function() { return this; },

    /**
     * Initialize the controller here
     */
    initializeController: function() { return this; },

    /**
     * Registers a router with the facade
     *
     * @param {String} name
     *  Name of the router
     * @param {Backbone.Router} router
     *  A router to register
     */
    registerRouter: function(name, router) {
      this._routerMap[name] = router;
    },

    /**
     * Retrieve a router by name
     *
     * @param {String} name
     *  The name of the router to retrieve
     * @return {Backbone.Router} the requested router or null if no router has
     *  been registered with the provided name
     */
    getRouter: function(name) {
      return this._routerMap[name];
    },

    /**
     * Registers a model with the Facade. The model's facade property will be set
     * to reference this facade. If the model has an onRegister() method it will
     * be called
     *
     * @param {String} name
     *  A name to register the model under
     * @param {Backbone.Model} model
     * @return {Facade}
     */
    registerModel: function(name, model) {
      this._modelMap[name] = model;
      model.facade = this;

      if (typeof model.onRegister == 'function') {
        model.onRegister(this);
      }

      return this;
    },

    /**
     * Retrieve a model from the facade.
     *
     * @param {String} name
     *  The name of the model to retrieve
     * @return {Backbone.Model}
     */
    getModel: function(name) {
      return this._modelMap[name]
    },

    /**
     * Registers a view with the Facade. The view's facade property will be set
     * to reference this facade. If the view has an onRegister() method it will
     * be called
     *
     * @param {String} name
     *  A name to register the view under
     * @param {Backbone.View} view
     * @return {Facade}
     */
    registerView: function(name, view) {
      this._viewMap[name] = view;
      view.facade = this;

      if (typeof view.onRegister == 'function') {
        view.onRegister(this);
      }

      return this;
    },

    /**
     * Retrieve a view from the facade
     *
     * @param {String} name
     *  Name of the view to retrieve
     * @return {Backbone.View}
     */
    getView: function(name) {
      return this._viewMap[name];
    },

    /**
     * Binds a command class to an event source and event name. The Facade
     * will create an instance of the command class, and call it's execute()
     * method whenever the eventSource triggers the event. The command's
     * execute() method will receive the arguments provided by the event
     *
     * @param {Function} commandClass
     *  Constructor of a command class. Command classes must implement an
     *  execute() method
     * @param {Object} eventSource
     *  The event source that the command will be bound to
     * @param {String} eventName
     *  The name of the event the command will be bound to
     * @return {Facade}
     */
    registerCommand: function(commandClass, eventSource, eventName) {
      var facade = this;

      eventSource.bind(eventName, function() {
        var command = new commandClass(facade);
        command.execute.apply(command, arguments)  
      });

      return this;
    }
  });

  piewpiew.Facade.instanceMap = {};

  /**
   *  piewpiew.SimpleCommand base class
   *  --------------------------------------------------------------------------
   *  Basic command class implementation
   */

  piewpiew.SimpleCommand = piewpiew.Class({
    initialize: function(facade) {
      this.facade = facade;
    },

    execute: function() { return this; }
  });

  /**
   *  piewpiew.MacroCommand base class
   *  --------------------------------------------------------------------------
   *  Basic macro commadn class implementation. Macro commands can contain 
   *  multiple subcommands which will be executed in series.
   */
  
  piewpiew.MacroCommand = piewpiew.Class({
    initialize: function(facade) {
      this.facade = facade;
      this.subCommands = [];
      this.initializeMacroCommand();
    },

    /**
     * Initialize the MacroCommand instance. Normally you will override this
     * an call this.addSubCommand() to add sub commands to the MacroCommand.
     */
    initializeMacroCommand: function() { return this },

    /**
     * Adds a sub command to the MacroCommand
     *
     * @param {Function} commandClass
     *  Constructor function of the sub command to add
     */
    addSubCommand: function(commandClass) {
      this.subCommands.push(commandClass);
      return this;
    },

    /**
     * Executes the MacroCommand. Iterates over the collection of sub commands
     * and executes them one after the other
     */
    execute: function() {
      while(this.subCommands.length > 0) {
        var commandClass = this.subCommands.shift();
        var command      = new commandClass(this.facade);

        command.execute.apply(command, arguments);
      }
      return this;
    }
  });

  return piewpiew;
});










































