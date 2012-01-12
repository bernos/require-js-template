define(['underscore', 'backbone'], function(_, Backbone) {
  return Backbone.Model.extend({

    initialize: function() {
      var items = this.get('items');

      if (items && items.length > 0) {
        this.set({currentItem: items[0]});
      }
    },

    getItemById: function(itemId) {
      return _(this.get('items')).find(function(item){
        return item.id == itemId;
      });
    }
  });
});