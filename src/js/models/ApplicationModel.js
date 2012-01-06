define(['underscore', 'backbone', 'models/collections/Projects'], function(_, Backbone, Projects) {
  return Backbone.Model.extend({
    defaults : {
      id: 0,
      projects: new Projects()
    }
    // ,

    // setCurrentProjectById: function(projectId, itemId) {
    //   this._currentProjectId = projectId;
    //   this._currentItemId    = itemId;

    //   if (this.get('projects').length > 0 && projectId) {
    //     var projects = this.get('projects');
    //     var project  = projects.get(projectId);   
    //     var item     = project.get('items')[0];   
        
    //     if (itemId) {
    //       var item = _(project.get('items')).find(function(item){
    //         return item.id == itemId;
    //       });
    //     }
        
    //     project.set({currentItem:item});

    //     this.set({ currentProject: project});
    //   } 
    // }
  });
})