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
   */
  piewpiew.View = Backbone.View.extend({
    template: 'No template specified for view',

    templateContext: function() {
      if (this.model && typeof this.model.toJSON == 'function') {
        return this.model.toJSON();
      }
      return {};
    },

    render: function() {
      $(this.el).html(_.template(this.template, this.templateContext()));
      return this;
    },

    onRegister: function(facade) {
      // noop
    }
  });

  /**
   *  piewpiew.Facade
   *  -------------------------------------------------------------------------
   */    
  piewpiew.Facade = Backbone.View.extend({

    /**
     * Initializes the Facade instance.
     *
     * @param {String} key
     *  Unique multiton key for the facade
     */
    initialize: function(key) {
      if (piewpiew.Facade.instanceMap[key]) {
        throw "Facade instance with key '" + key + "' already exists."
      }

      piewpiew.Facade.instanceMap[key] = this;

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

    intitializeRouter: function() {
      
    },

    /**
     * Register your models with the facade here. Inheritting classes should
     * override this
     */
    initializeModel: function() {
      // noop
    },

    /**
     * Register your views with the facade here. Inherittin classes should
     * override this.
     */
    initializeView: function() {
      // noop
    },

    /**
     * Initialize the controller here
     */
    initializeController: function() {
      // noop
    },

    registerRouter: function(name, router) {
      this._routerMap[name] = router;
    },

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

    registerCommand: function(commandClass, eventSource, eventName) {
      var facade = this;

      eventSource.bind(eventName, function() {
        var command = new commandClass(facade);
        command.execute.apply(command, arguments)  
      })
    }
  });

  piewpiew.Facade.instanceMap = {};

  /**
   *  piewpiew.SimpleCommand base class
   *  --------------------------------------------------------------------------
   */

  piewpiew.SimpleCommand = piewpiew.Class({
    initialize: function(facade) {
      this.facade = facade;
    },
    execute: function() {
      // noop 
    }
  });

  /**
   *  piewpiew.MacroCommand base class
   *  --------------------------------------------------------------------------
   */
  
  piewpiew.MacroCommand = piewpiew.Class({
    initialize: function(facade) {
      this.facade = facade;
      this.subCommands = [];
      this.initializeMacroCommand();
    },

    initializeMacroCommand: function() {
      
    },

    addSubCommand: function(commandClass) {
      this.subCommands.push(commandClass);
    },

    execute: function() {
      while(this.subCommands.length > 0) {
        var commandClass = this.subCommands.shift();
        var command      = new commandClass(this.facade);

        command.execute.apply(command, arguments);
      }
    }
  });

  return piewpiew;
});











































