define(['piewpiew', 'underscore', 'text!templates/FeaturedProjectsView.html'], function(piewpiew, _, template) {
  return piewpiew.View.extend({

    template: template, 

    initialize: function() {
      var view = this;
      
      this.model.bind("reset", function() {
        view.render();
      });
    },

    templateContext: function() {
      var projects = this.model.filter(function(p) {
        return p.get('featured') == true;
      });

      return {
        projects: _(projects).map(function(project) {
          return project.toJSON()
        })
      };
    }
  });
});