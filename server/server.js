var flows = new Meteor.Collection("flows")

Meteor.startup(function () {
	// Sample data
	if (flows.find().count() == 0) {
		flows.insert({
			_id: "1",
			text: "Hjälp till på Datasektionen",
			publicstartingnode: true,
			choices: {
				"Nej fan heller": 2,
				"Ja!": 3,
				"Jag har problem, hjälp mig": 4
			}
		})
		flows.insert({
			_id: "2",
			text: "Fan ta dej också!"
		})
		flows.insert({
			_id: "3",
			text: "Kul! Vad vill du göra?",
			choices: {
				"Ordna en gasque": 4,
				"Ordna en filmkväll": 5
			}
		})
	}
})