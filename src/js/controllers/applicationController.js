define(['piewpiew'], function(piewpiew) {

	return new piewpiew.ApplicationController({   

		indexAction: function() {
			console.log("indexAction");
		},

		helpAction: function() {
			console.log("helpAction");
		},

		searchAction: function(q) {
			console.log("searchAction", q);
		},

    projectAction: function(id) {
      console.log("show project", id);
    },

    projectsAction: function(filter) {
      console.log("show projects", filter);
    }
	});
});