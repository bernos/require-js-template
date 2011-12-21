define(['backbone'], function(Backbone) {
  return Backbone.Collection.extend({
    url: '/data/projects.json'
  });
});