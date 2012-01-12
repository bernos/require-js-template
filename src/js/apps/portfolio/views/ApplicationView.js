define(['underscore', 'backbone', 'piewpiew-backbone', './FeaturedProjectsView', './ProjectView', './ProjectListView'], function(_, Backbone, piewpiew, FeaturedProjectsView, ProjectView, ProjectListView, template) {
  return piewpiew.View.extend({

    onRegister: function(facade) {
      var projects = this.facade.getModel('projects');
      var view     = this;

      this.facade.bind(this.facade.EVENT_STARTUP_COMPLETE, function() {
        view.hideLoader();  
      });
      
      this.featuredProjectsView = new FeaturedProjectsView({
        model: projects,
        el: $('#FeaturedProjectsView')
      });
        
      this.projectView = new ProjectView({
        el: $('#ProjectView')
      });

      this.projectListView = new ProjectListView({
        model: projects,
        el: $('#ProjectListView')
      });

      this.children = [
        this.featuredProjectsView,
        this.projectView,
        this.projectListView
      ];
      
      this.showView(null);
    },

    showLoader: function() {
      $('#loader').fadeIn('slow');
    },

    hideLoader: function() {
      $('#loader').fadeOut('slow');
    },

    showView: function(view) {
      _(this.children).each(function(v) {
        if (v == view) {
          $(v.el).show();
        } else {
          $(v.el).hide();
        }
      });
    }
  });
});