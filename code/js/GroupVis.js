GroupVis = function(_parentElement,_data,_filterData) {
    this.parentElement  = _parentElement;
    this.data = _data;
    this.filterData = _filterData;
    this.radius_scale   = d3.scale.linear().range([5,50]);
    // console.log("Defining tip");
    //create a tooltip for each node
    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return (d.station
            + "<div class='tip-details'>Listings: " 
            + d.stop_count 
            + "</div>") });
    // console.log("Defined tip", tip);

    var svg = d3.select('#mbta_svg');
    // console.log("Print SVG: " + svg);
    svg.call(tip); 

    this.data.forEach(function(d){
        d3.select("#circles")
        .append('circle')
        .attr("cx", d.x)
        .attr("cy", d.y)
        .attr("r", 5)
        .attr("class", "listing-circle")
        .attr("id", d.station)
        .datum(d)
        .on('mouseover', tip.show )
        .on('mouseout', tip.hide)   
    })

    // this.filterData.forEach(function(value){
    //     console.log(value)
    // })
    this.update(this.filterData);
}

GroupVis.prototype.update = function(_filterData){
    radius_scale = this.radius_scale;
    filterData = _filterData;
    // radius_scale.domain(d3.extent(filterData, function(d){ return d.value.nb_listings }));
    // var plot_r=0;
    // d3.selectAll('.listing-circle').transition().duration(1000).attr("r", function(d){
    d3.selectAll('.listing-circle').attr("r", function(d){
        filterData.forEach(function(pt){
            filter_d = pt['value'];
            if (filter_d['stop_id'] == d.stop_id){
                cnt = filter_d['nb_listings'];
                console.log(radius_scale(cnt));
                plot_r  = cnt ? radius_scale(cnt) : 0;
                // plot_r  = cnt ? radius_scale(cnt) : 0;
            }
        })
        return plot_r;
    })
    // console.log("plot_r: "+plot_r)
}
// console.log("GROUPVIS type: "+typeof(GroupVis))
    
