var path = "https://github.mit.edu/pages/6894-sp19/Journey-Ahead/data/"

var price_min = $("#price_min").val();
var price_max = $("#price_max").val();
document.getElementById("private_room").checked = true;
document.getElementById("apt").checked = true;
document.getElementById("sharedroom").checked = true;



var count_per_station_no_null;

$( function() {
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
    price_min = $("#price_min").val()
    price_max = $("#price_max").val()
    console.log("price_min: " + price_min);
    console.log("price_max: " + price_max);
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );

    });


// update price min and max when slider values change
var update_range = function(){
    console.log("count for price_min: " + price_min);
    console.log("count for price_max: " + price_max);


    var privateRoom = document.getElementById("private_room").checked;
    var aptRoom = document.getElementById("apt").checked;
    var sharedRoom = document.getElementById("sharedroom").checked;
    console.log("private checked: "+ privateRoom);
    console.log("apt checked: "+ aptRoom);
    console.log("sharedRoom checked: "+ sharedRoom);
    
    d3.csv(path + "listings_summary_w_stations.csv", function(error, data) {


        if (error) {
        return console.warn(error);
        }




        $( function() {
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
                        price_min = $("#price_min").val()
                        price_max = $("#price_max").val()
                        //console.log("price_min: " + price_min);
                        //console.log("price_max: " + price_max);
                        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
                          " - $" + $( "#slider-range" ).slider( "values", 1 ) );

                        });


        



        var count_per_station = d3.nest()
                                  .key(function(d) { 
                                    var p = d.price;
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
                                        stop_id: d3.mean( v, function(d){ return d.stop_id} ),
                                        nb_listings: v.length ,
                                        mean_price: d3.mean( v, function(d){ return d.price} ),
                                        x : d3.mean( v, function(d){ return d.x} ),
                                        y : d3.mean( v, function(d){ return d.y} )
                                    };
                                })

                                  .entries(data);
        
        count_per_station_no_null = count_per_station.filter(function (d) { return ((d.key != "undefined") && (d.key != "")); });
        console.log("AFTER" + JSON.stringify(count_per_station_no_null));

        return(count_per_station_no_null)
        
        

/*        next steps:
        // GET THE PRICE MAX AND PRICE MIN
        // update the circle sizes!
        // need to MATCH circle id with station id

        d3.select("#SOME SVG CLASS")
            .selectAll("circle")
            .data(count_per_station)
            .enter()
            .append("")*/



});
    
};