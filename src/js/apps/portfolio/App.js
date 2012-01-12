/**
 * This is our Porfolio App.
 */
define([
  'piewpiew-backbone', 
  'backbone', 
  './models/collections/Projects', 
  './views/ApplicationView', 
  './controllers/commands'
], 

function(piewpiew, Backbone, Projects, ApplicationView, commands) {
  var PortfolioApp = piewpiew.App.extend({
    
    EVENT_STARTUP:                'PortfolioApp:startup',
    EVENT_STARTUP_COMPLETE:       'PortfolioApp:startup_complete',

    defaults: {

      // Default routes for our App. These routes are relative to the
      // App.baseUrl property if one is set, otherwise they are relative to 
      // the docroot
      routes: {
        ''                  : 'showFeaturedProjects',
        'project/:id'       : 'showProject',
        'project/:id/:item' : 'showProject',
        'projects/:filter'  : 'showProjects',
        '*splat'            : 'default'
      }
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
        el:this.el
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
   * Retrieve the singleton instance of the App
   */
  PortfolioApp.getInstance = function(key, options) {
    if (!piewpiew.App.instanceMap[key]) {
      return new PortfolioApp(key, options);
    }
    return piewpiew.App.instanceMap[key];
  }

  return PortfolioApp;
});


 