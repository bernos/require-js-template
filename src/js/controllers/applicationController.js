define(['piewpiew', "underscore", 'collections/projects'], function(piewpiew, _, Projects) {

  return piewpiew.ApplicationController.extend({
    indexAction: function() {
      console.log("show featured projects");

      this.featuredProjectsView.render();

      console.log(this.featuredProjectsView.el)
    },

    projectAction: function(id) {
      var project = Projects.get(id);

      console.log(project);
    },

    projectsAction: function(filter) {
      if (filter == "all") {
        var projects = Projects.models;
      } else {
        var projects = Projects.filter(function(project){
          return (_(project.get('categories') || []).indexOf(filter) > -1);
        });
      }

      console.log("show projects", filter, projects);
    }  
  });
});