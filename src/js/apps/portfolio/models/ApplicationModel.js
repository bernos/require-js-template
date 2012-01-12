define(['underscore', 'backbone', './collections/Projects'], function(_, Backbone, Projects) {
  return Backbone.Model.extend({
    defaults : {
      id: 0,
      projects: new Projects()
    }
  });
})