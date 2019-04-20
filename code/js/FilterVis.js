FilterVis=function(_parentElement, _data, _filterData){
    this.parentElement  = _parentElement;
    this.data = _data;
    this.filterData = _filterData;

    this.price_min = $("#price_min").val();
    this.price_max = $("#price_max").val();
    this.privateRoom = document.getElementById("private_room").checked;
    this.aptRoom = document.getElementById("apt").checked;
    this.sharedRoom = document.getElementById("sharedroom").checked;
    // this.radius_scale   = d3.scale.linear().range([5,50]);

    document.getElementById("private_room").checked = true;
    document.getElementById("apt").checked = true;
    document.getElementById("sharedroom").checked = true;

    $(function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 500,
            values: [ $("#price_min").val(), $("#price_max").val()],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
                $("#price_min").val(ui.values[ 0 ]);
                $("#price_max").val(ui.values[ 1 ]);
            }
        });
        this.price_min = $("#price_min").val();
        this.price_max = $("#price_max").val();
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
          " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    });

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return (d.station
            + "<div class='tip-details'>Number of Listings: "
            + "<span class = 'showbold'>" + d.stop_count + "</span>"
            + "<br>Mean Price: "
            + "<span class = 'showbold'>"
            + "$"+ Math.round(d.price_mean)+ "</span>"
            + "</div>") });
    var svg = d3.select('#mbta_svg');
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

    this.update_range();
}

FilterVis.prototype.update_range = function(){
    filterData = this.filterData;
    price_min = this.price_min;
    price_max = this.price_max;
    privateRoom = document.getElementById("private_room").checked;
    aptRoom = document.getElementById("apt").checked;
    sharedRoom = document.getElementById("sharedroom").checked;

    $(function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 500,
            values: [ $("#price_min").val(), $("#price_max").val()],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
                $("#price_min").val(ui.values[ 0 ]);
                $("#price_max").val(ui.values[ 1 ]);
            }
        });
        price_min = $("#price_min").val();
        price_max = $("#price_max").val();
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
          " - $" + $( "#slider-range" ).slider( "values", 1 ));
    });


    var count_per_station = 
    d3.nest()
        .key(function(d) { 
            var p = Number(d.price);
            var r = d.room_type;
            if ((p >= price_min) && (p <= price_max)){
                if (privateRoom && sharedRoom && aptRoom){
                    return d.closest_station_1km;
                }

                if (privateRoom && (!sharedRoom) && (!aptRoom)){
                    if (r == "Private room"){return d.closest_station_1km;}
                }
                if ((!privateRoom) && (sharedRoom) && (!aptRoom)){
                    if (r == "Shared room"){return d.closest_station_1km;}
                }
                if ((!privateRoom) && (!sharedRoom) && (aptRoom)){
                    if (r == "Entire home/apt"){return d.closest_station_1km;}
                }

                if ((!privateRoom) && (sharedRoom) && (aptRoom)){
                    if ((r == "Shared room") || r == "Entire home/apt"){return d.closest_station_1km;}
                }
                if ((privateRoom) && (!sharedRoom) && (aptRoom)){
                    if ((r == "Private room") || r == "Entire home/apt"){return d.closest_station_1km;}
                }
                if ((privateRoom) && (sharedRoom) && (!aptRoom)){
                    if ((r == "Private room") || r == "Shared room"){return d.closest_station_1km;}
                }
            }
        })
        .rollup(function(v) { 
            return {
                stop_id : d3.min( v, function(d){ return d.stop_id} ),
                nb_listings: v.length ,
                mean_price: d3.mean( v, function(d){ return d.price} ),
                x : d3.mean( v, function(d){ return d.x} ),
                y : d3.mean( v, function(d){ return d.y} )
            };
        })
        .entries(filterData);

    var plot_r = 0;
    

    var countData = count_per_station.filter(function (d) { return ((d.key != "undefined") && (d.key != "")); });
    
    // radius_scale = this.radius_scale;
    // radius_scale.domain([0, d3.max(countData, function(d){ return d.value.nb_listings })]);
    
    d3.selectAll('.listing-circle').transition().duration(1000).attr("r", function(d){
        plot_r = 8;
        d.stop_count = 0;
        d.price_mean = 0;
        countData.forEach(function(pt){
            if (pt['value']['stop_id'] == d.stop_id){
                cnt = Number(pt['value']['nb_listings'])/5+5;
                plot_r  += cnt;
                d.stop_count = Number(pt['value']['nb_listings']);
                d.price_mean = Number(pt['value']['mean_price']);
                // plot_r  = cnt ? radius_scale(cnt) : 0;
            }
        })
        return plot_r;
    })

}