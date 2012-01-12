define(['piewpiew-backbone', 'underscore', 'text!../templates/ProjectListView.html'], function(piewpiew, _, template){

  return piewpiew.View.extend({

    template: template,

    initialize: function() {
      var view = this;

      this.model.bind("reset", function() {
        view.render();
      });
    },

    setFilter: function(filter) {
      this.filter = filter;
      this.render();
    },

    templateContext: function() {
      var projects  = this.model.filterByCategory(this.filter || 'all');
      
      return {
        projects:   projects.map(function(project) { return project.toJSON(); }),
        categories: this.model.getCategories()
      }
    }
  });
});