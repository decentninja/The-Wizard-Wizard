Template.layout.events({
	"click a.save": function() {
		if(window.location.pathname == "/") {
			return	// nothing to save here
		}
		flows.update({
			_id: this._id
		}, {
			$set: {
				text: $(".text").text(),
				body: $(".body").text(),
				_id: $("idid").text()
			}
		})
	},
	"click .public": function() {
		if(window.location.pathname == "/") {
			return	// nothing to save here
		}
		flows.update({
			_id: this._id
		}, {
			$set: {
				publicstartingnode: !this.publicstartingnode
			}
		})
	},
	"click .new": function() {
		var id = flows.insert({
			text: "Title",
			body: "Body"
		})
		Router.go("/flows/" + id)
	},
	"click .remove": function() {
		flows.remove({_id: this.id})
		Router.go("/")
	},
	"click .removechoice": function(event) {
		var choice = {}
		choice["choices." + this.key] = 1
		flows.update({
			_id: Session.get("selected")
		}, {
			$unset: choice
		})
	},
	"click .addchoice": function() {
		var choice = {}
		choice["choices." + $(".choicetitle").val()] = $(".to").val()
		console.log(choice)
		flows.update({
			_id: this._id
		}, {
			$set: choice
		})
		$(".choicetitle").val("")
		$(".to").val("")
	}
})