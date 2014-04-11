Router.map(function() {
	this.route("home", {
		path: "/",
		data: function() {
			Session.set("selected", -1)
			return flows.find({publicstartingnode: true})
		}
	})
	this.route("flow", {
		path: "/flows/:_id",
		data: function() {
			var data = flows.findOne(this.params._id)
			if(data) {
				Session.set("selected", data._id)
			}
			return data
		}
	})
})

Router.configure({
	notFoundTemplate: 'notFound',
	layoutTemplate: 'layout'
})