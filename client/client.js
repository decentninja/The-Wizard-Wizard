window.flows = new Meteor.Collection("flows")	// Globalscope for debugging

Meteor.subscribe("flows")

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

Template._loginButtonsMessages.infoMessage = "@kth.se mail required"
