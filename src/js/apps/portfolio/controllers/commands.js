define(['piewpiew-backbone', 'backbone'], function(piewpiew, Backbone) {
  return {

    /**
     * Get the app up and running!
     */
    StartupCommand: piewpiew.SimpleCommand.extend({
      execute: function() {
        console.log("StartupCommand");
        var app   = this.app;
        var projects = app.getModel('projects');

        projects.fetch({
          success: function(collection, response) {
            app.trigger(app.EVENT_STARTUP_COMPLETE);
            Backbone.history.start();
          },
          error: function(collection, response) {
            // TODO: handle errors here.
            alert('failed to load projects');
          }
        });
      }
    }),

    DefaultRouteCommand: piewpiew.SimpleCommand.extend({
      execute: function() {
        console.log("DefaultRouteCommand", arguments);
        // TODO: we got here cuz the route was not not handled. Should throw an error
      }
    }),

    ShowFeaturedProjectsCommand: piewpiew.SimpleCommand.extend({
      execute: function() {
        console.log("ShowFeaturedProjectsCommand", arguments);
        var view = this.app.getView('applicationView');
        view.showView(view.featuredProjectsView);
      }
    }),

    ShowFilteredProjectsCommand: piewpiew.SimpleCommand.extend({
      execute: function(filter) {
        console.log("ShowFilteredProjectsCommand", arguments);
        var view = this.app.getView('applicationView');
        
        view.projectListView.setFilter(filter);
        view.showView(view.projectListView);
      }      
    }),

    ShowProjectCommand: piewpiew.SimpleCommand.extend({
      execute: function(projectId, itemId) {
        console.log("ShowProjectCommand", arguments);

        // get project from the model..
        var view     = this.app.getView('applicationView');
        var projects = this.app.getModel('projects');
        var project  = projects.get(projectId);   
        var item     = project.getItemById(itemId);

        // set project.currentItem
        if (item) {
          project.set({currentItem:item});
        } else {
          project.set({currentItem:project.get('items')[0]})
        }

        view.projectView.setProject(project);
        view.showView(view.projectView);
      }
    })
  };
});