define(['backbone'], function(Backbone) {
  return Backbone.Router.extend({
    routes: {
      'project/:id'       : 'project',
      'projects/:filter'  : 'projects',
      '*splat'            : 'default'
    }
  });
});