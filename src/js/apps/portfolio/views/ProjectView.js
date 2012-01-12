define(['piewpiew-backbone', 'text!../templates/ProjectView.html'], function(piewpiew, template) {
  return piewpiew.View.extend({

    template: template,

    setProject: function(project) {
      if(project != this.model) {
        var view = this;

        this.model = project;  
        this.model.bind('change:currentItem', function(model, item) {
          view.setCurrentItem(item);
        })
        this.render();
      }
      this.setCurrentItem(project.get('currentItem'));  
    },    

    setCurrentItem: function(item) {
      this.$('.current-item').html(item.title);
    }
  });
});