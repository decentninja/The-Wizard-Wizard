window.flows = new Meteor.Collection("flows")	// Globalscope for debugging

Router.map(function() {
	this.route("home", {
		path: "/",
		data: function() {
			return flows.find({publicstartingnode: true})
		}
	})
	this.route("flow", {
		path: "/flows/:_id",
		data: function() {
			return flows.findOne(this.params._id)
		}
	})
})

Router.configure({
	notFoundTemplate: 'notFound'
})

Handlebars.registerHelper('arrayify', function(obj) {
    var r = []
    for(var key in obj) {
    	r.push({
    		"key": key,
    		value: obj[key]
    	})
    }
    return r
})