define(['backbone'], function(Backbone) {
  return new Backbone.Router({
    routes: {
      'project/:id'       : 'project',
      'projects/:filter'  : 'projects',
      '*splat'            : 'default'
    }
  });
});