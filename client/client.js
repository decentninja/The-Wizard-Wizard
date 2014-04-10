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
			var data = flows.findOne(this.params._id)
			return data
		}
	})
})

Router.configure({
	notFoundTemplate: 'notFound',
	layoutTemplate: 'layout'
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