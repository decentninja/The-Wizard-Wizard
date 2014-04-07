var flows = new Meteor.Collection("flows")

Meteor.startup(function () {
	// Sample data
	if (flows.find().count() == 0) {
		flow.insert({
			name: "Datasektionen",
			startNode: {
				text: "Så du vill hjälpa till på sektionen?",
				choices: {
					"Ja": {
						text: "Coolt! Vad vill du göra?",
						choices: {
							"Ordna en gasque": {
								text: "Snacka med DKM på http://www.datasektionen.se/sektionen/dkm"
							},
							"Ordna en filmkväll": {
								text: "Snacka med QN på http://www.datasektionen.se/sektionen/qn"
							}
						}
					},
					"Nej": {
						text: "Gå och gör något annat istället då! Fjant!"
					}
				}
			}
		})
	}
})