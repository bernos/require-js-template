define(['underscore', 'backbone', 'models/Project'], function(_, Backbone, Project) {
  return Backbone.Collection.extend({
    url: '/data/projects.json',
    model: Project,

    getCategories: function() {
      var categories = [];

      this.each(function(project) {
        var pCategories = project.get('categories');
        _(pCategories).each(function(category) {
          if (_(categories).indexOf(category) == -1) {
            categories.push(category);
          }
        });
      });

      return categories;
    },

    filterByCategory: function(filter) {
      if (filter == 'all') {
        return this;
      }
      
      return this.filter(function(project){
        return (_(project.get('categories') || []).indexOf(filter) > -1);
      });
    }
  });
});