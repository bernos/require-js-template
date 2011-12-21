define(['underscore', 'backbone', 'jquery'], function(_, Backbone, $) {
  return Backbone.View.extend({
    render: function() {
      var projects = this.model.filter(function(p) {
        console.log("filtering", p);
        return p.get('featured') == true;
      });

      var output = "<ul>";

      _(projects).each(function(p) {
        console.log("featured: ", p)
        output += "<li class=\""+p.get("id")+"\">" + p.get("title") + "</li>";
      });

      output += "</ul>";

      $(this.el).html(output);
    }
  });
});