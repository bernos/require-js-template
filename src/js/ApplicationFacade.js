/**
 * This is our main application module. It defines our custom application
 * class. Generally speaking our application class will extend 
 * piewpiew.Application by adding some methods specific to our app.
 */
define([
  'piewpiew', 
  'backbone', 
  'models/collections/Projects', 
  'views/ApplicationView', 
  'controllers/Commands'
], 

function(piewpiew, Backbone, Projects, ApplicationView, commands) {
  var ApplicationFacade = piewpiew.Facade.extend({
    
    EVENT_STARTUP:                'facade:startup',
    EVENT_STARTUP_COMPLETE:       'facade:startup_complete',

    /**
     * Initialize the router
     */
    initializeRouter: function() {
      this.registerRouter('default', new Backbone.Router({
        routes: {
          ''                  : 'showFeaturedProjects',
          'project/:id'       : 'showProject',
          'project/:id/:item' : 'showProject',
          'projects/:filter'  : 'showProjects',
          '*splat'            : 'default'
        }
      }));
    },

    /**
     * Initialize the model for the application
     */    
    initializeModel: function() {
      this.registerModel('projects', new Projects());
    },

    /**
     * Initialize the view for the application
     */
    initializeView: function() {
      this.registerView('applicationView', new ApplicationView({
        el:document.body
      }));
    },

    /**
     * Initialize our application specific controller with our application 
     * specific router
     */
    initializeController: function() {
      var router = this.getRouter('default');

      this.registerCommand(commands.StartupCommand,               this,   this.EVENT_STARTUP);
      this.registerCommand(commands.DefaultRouteCommand,          router, 'all');
      this.registerCommand(commands.ShowFeaturedProjectsCommand,  router, 'route:showFeaturedProjects');
      this.registerCommand(commands.ShowFilteredProjectsCommand,  router, 'route:showProjects');
      this.registerCommand(commands.ShowProjectCommand,           router, 'route:showProject');
    },

    /**
     * Run the application
     */
    startup: function() {
      this.trigger(this.EVENT_STARTUP);
    }
  });  

  /**
   * Retrieve the singleton instance of the ApplicationFacade
   */
  ApplicationFacade.getInstance = function(key) {
    if (!piewpiew.Facade.instanceMap[key]) {
      return new ApplicationFacade(key);
    }
    return piewpiew.Facade.instanceMap[key];
  }

  return ApplicationFacade;
});


 