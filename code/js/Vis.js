/*
Vis

Draws the MBTA visualization
Handles interative elements: mouseover, select

*/
console.log("Defining tip");
// create a tooltip for each node 
tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0])
        .html(function(d) { 
            return d.station 
            + "<div class='tip-details'>Listings: " 
            + 10 // replace later using stop_count 
            + "</div>" });
console.log("Defined tip", tip);

var svg = d3.select('#mbta_svg');
console.log("Print SVG: " + svg);
svg.call(tip); 

// draw the initial circles 
var path = "https://github.mit.edu/pages/6894-sp19/Journey-Ahead/data/"
d3.csv(path + "count_listings_stations.csv", function(error, data) {
        if (error) {
        return console.warn(error);
        }

        d3.select("#circles")
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", function(d){
                return d.x;
            })
            .attr("cy", function(d){
                return d.y;
            })
            .attr("r", 10) // replace 10 with stop_count
            .attr("class", "mbta-circle")
	    	.attr("id", function(d){
                return d.station
            })	
            .on('mouseover', tip.show )
            .on('mouseout', tip.hide )
            // .exit()
            // .remove()
        });






