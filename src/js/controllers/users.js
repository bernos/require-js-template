define([], function() {
  return {
    list: function() {
      console.log("list all users");
    },
    detail: function(id) {
      console.log("details for user " + id);
    }
  }
});