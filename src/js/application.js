/**
 * This is our main application module. It defines our custom application
 * class. Generally speaking our application class will extend piewpiew.Application
 * by adding some methods specific to our app.
 */
define(['piewpiew', 'router', 'controllers/applicationController', 'collections/projects', 'views/featuredProjectsView', 'backbone'], function(piewpiew, Router, Controller, Projects, FeaturedProjectsView, Backbone) {
  return piewpiew.Application.extend({
       
    initializeModel: function() {
      this.projects = new Projects();
    },

    initializeView: function() {
      this.featuredProjectsView = new FeaturedProjectsView({
        model:this.projects
      });
    },

    /**
     * Initialize our application specific controller with our application specific
     * router
     */
    initializeController: function() {
      this.controller = new Controller({
        router: new Router(),
        config: this.config.controller || {},
        projects: this.projects,
        featuredProjectsView: this.featuredProjectsView
      })
    },

    run: function() {
      console.log("Preloading projects");
      this.projects.fetch({
        success: function(collection, response) {
          console.log("projects loaded", collection, response);
          Backbone.history.start();
        },
        error: function(collection, response) {
          console.log("error loading projects", collection, response);
        }
      });
    }
  });  
});


 