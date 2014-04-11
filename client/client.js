window.flows = new Meteor.Collection("flows")	// Globalscope for debugging

Meteor.subscribe("flows")

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

Template.graph.data = function() {
	var data = flows.find({})
}

Template.graph.rendered = function() {
	this.node = this.find(".graph")
	var elem = d3.select(this.node)
	var self = this

	// Mouse handling
	var graph = elem.append("svg:svg")
		.attr("pointer-events", "all")
		.append('svg:g')

	function view(translate, scale) {
		graph.attr(
			"transform",
			"translate(" + translate + ")"+ " scale(" + scale + ")"
		)
	}

	// Fade while balancing
	graph.style("opacity", 1e-6)
		.transition()
		.duration(1000)
		.style("opacity", 1)

	if(!this.handle) {
		this.handle = Deps.autorun(function() {
			var nodes = {}
			var links = []
			var data = flows.find({}).fetch()

			data.forEach(function(question) {
				nodes[question._id] = {
					name: question.text,
					id: question._id
				}
			})
			data.forEach(function(question) {
				for(var choice in question.choices) {
					links.push({
						source: nodes[question._id],
						target: nodes[question.choices[choice]],
						choice: choice
					})
				}
			})

			// Force handling
			var force = d3.layout.force()
				.gravity(0.05)
			    .charge(-1500)
			    .linkDistance(100)
			    .gravity(.05)
			    .friction(0.5)
				.nodes(d3.values(nodes))
				.links(links)

			// Resize browser window
			function resize() {
				var width = document.querySelector(".flowchart").offsetWidth
				var height = document.querySelector(".flowchart").offsetHeight
				graph.attr("width", width).attr("height", height)
				force.size([width, height]).resume()
			}
			resize()
			d3.select(window).on("resize", resize)

			force.start()

			var link = graph.selectAll("line.link")
				.data(links)
				.enter().append("svg:line")
				.attr("class", "link")
				.attr("x1", function(d) { return d.source.x })
				.attr("y1", function(d) { return d.source.y })
				.attr("x2", function(d) { return d.target.x })
				.attr("y2", function(d) { return d.target.y })
				.attr("marker-end", function(d) { return "url(#triangle)" })

			var arrow = graph.append('svg:defs').append('svg:marker')
			    .attr('id', 'triangle')
			    .attr('viewBox', '0 -5 10 10')
			    .attr('refX', 15)
			    .attr('markerWidth', 5)
			    .attr('class', 'arrow')
			    .attr('markerHeight', 5)
			    .attr('orient', 'auto')
			  .append('svg:path')
			    .attr('d', 'M0,-5L10,0L0,5')

			var link_label = graph.append("svg:g").selectAll(".link_label")
				.data(force.links())
				.enter()
				.append("svg:text")
				.attr("class", "link_label")
			    .attr("text-anchor", "middle")
				.text(function(d) {
					return d.choice
				})

			var node = graph.selectAll("circle.node")
				.data(d3.values(nodes))
				.enter().append("svg:circle")
				.attr("class", "node")
				.attr("cx", function(d) { return d.x })
				.attr("cy", function(d) { return d.y })
				.attr("id", function(d) { return "node_" + d.id})
				.attr("r", 7.5)

			var node_text = graph.append("svg:g").selectAll("g")
			    .data(force.nodes())
			    .enter()
			    .append("svg:text")
			    .attr("class", "nodetext")
			    .attr("x", 10)
			    .attr("y", 6)
				.text(function(d) {
					return d.name
				})
				.on("click", function(d) {
					Router.go("/flows/" + d.id)
				})

			force.on("tick", function() {
				link.attr("x1", function(d) { return d.source.x })
				    .attr("y1", function(d) { return d.source.y })
				    .attr("x2", function(d) { return d.target.x })
				    .attr("y2", function(d) { return d.target.y })

				node.attr("cx", function(d) { return d.x })
			    	.attr("cy", function(d) { return d.y })

			    node_text.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")"
				})

				link_label.attr("transform", function(d) {
					var x = (d.source.x + d.target.x) / 2
					var y = (d.source.y + d.target.y) / 2
					//var rotation = Math.atan2((d.source.x - d.target.x), (d.source.y - d.target.y)) * 57
					return "translate(" + x + "," + y + ") "
					//	+ "rotate(" + rotation + ")"
				})
			})
			setInterval(function() {
				var id = Session.get("selected")
				if(id === -1) {
					graph.attr("transform", "scale(0.5)")
				}

				// Center on selected
				if(id) {
					var selected = d3.select("#node_" + Session.get("selected"))
					if(selected[0][0]) {
						var width = document.querySelector(".flowchart").offsetWidth
						var height = document.querySelector(".flowchart").offsetHeight
						var x = -selected.attr("cx") + width / 2
						var y = -selected.attr("cy") + height / 2
						selected.attr("class", "followed")
						graph.attr(
							"transform",
							"translate(" + [x, y] + ")"
						)
					}
				}
			}, 1000/60)
		})
	}

	Template.graph.destroyed = function() {
		this.handle && this.handle.stop()
	}
}