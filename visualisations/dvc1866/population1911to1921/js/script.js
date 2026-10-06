//test if browser supports webGL

if (Modernizr.webgl) {

  //setup pymjs
  var pymChild = new pym.Child();

  //Load data and config file
  d3.queue()
    .defer(d3.json, "data/config.json")
    .defer(d3.csv, "data/data.csv")
    .defer(d3.json, "data/land-europe-nogb.json")
    .await(ready);

  function ready(error, config, data, geog) {
    //Set up global variables
    dvc = config.ons;
    hoveredId = null;

    d3.select("#source").text(dvc.source)

    //turn csv data into json format
    json = csv2json(data);

    //convert topojson to geojson
    for(key in geog.objects){
			var areas = topojson.feature(geog, geog.objects[key])
		}

    //set title of page
    document.title = dvc.maptitle;

    //Set up number formats
    displayformat = d3.format(dvc.displayFormat);
    legendformat = d3.format(dvc.legendFormat);

		//set up basemaps
		map = new mapboxgl.Map({
		  container: 'mapBottom', // container id
		  style: 'data/stylehistoric.json', //stylesheet location //includes key for API
		  center: [-2.5, 54], // starting position
		  minZoom: 4.2,//
		  zoom: 4.5, // starting zoom
		  maxZoom: 15, //
		  attributionControl: false //
		});

		//set starting position as a bounding box - [[-5.816, 49.864], [1.863, 55.872]]


		maptop = new mapboxgl.Map({
			container: 'mapTop', // container id
			style: 'data/labels.json', //stylesheet location //includes key for API
			center: [-2.5, 54], // starting position
			minZoom: 4.2,//
			zoom: 4.5, // starting zoom
			maxZoom: 15, //
			attributionControl: false //
		  });



    //add fullscreen option
    // map.addControl(new mapboxgl.FullscreenControl());

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Disable map rotation using right click + drag
    map.dragRotate.disable();
    maptop.dragRotate.disable();

    // Disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    // Add geolocation controls to the map.
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      }
    }));

    //add compact attribution
    map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      // add zoomstack attribution
      customAttribution: "Contains OS data © Crown copyright and database right (" + new Date().getFullYear() + ")"
    }));

    //define mouse pointer
    map.getCanvasContainer().style.cursor = 'pointer';

    addFullscreen();

    // if breaks is jenks or equal
    // get all the numbers, filter out the blanks, and then sort them
    breaks = generateBreaks(data, dvc);

    //work out halfway point (for no data position)
    midpoint = breaks[0] + ((breaks[dvc.numberBreaks] - breaks[0])/2)

    //Load colours
    if (typeof dvc.varcolour === 'string') {
      colour = colorbrewer[dvc.varcolour][dvc.numberBreaks];
    } else {
      colour = dvc.varcolour;
    }

    //set up d3 color scales
    color = d3.scaleThreshold()
      .domain(breaks.slice(1))
      .range(colour);

    //now ranges are set we can call draw the key
    createKey(dvc);


		//Work out extend of loaded geography file so we can set map to fit total extent
		//bounds = turf.extent(areas);
		//Manual:
		bounds = [-5.816, 49.864, 1.863, 55.872];

		//set map to total extent when both maptop and mapbottom have loaded
		var maptopLoaded = false;
		var mapbottomLoaded = false;
		function fitBoundsIfBothMapsLoaded() {
			if (maptopLoaded && mapbottomLoaded) {
				map.fitBounds([[bounds[0],bounds[1]], [bounds[2], bounds[3]]]);
			}
		}
		map.on('load', function() {
			mapbottomLoaded = true;
			fitBoundsIfBothMapsLoaded();
		});

		maptop.on('load', function() {
			maptopLoaded = true;
			fitBoundsIfBothMapsLoaded();
		});


    map.on('load', function() {

      maptop.addSource('country-outline', { 'type': 'geojson', 'data': areas })
			
      maptop.addLayer({
      'id': 'country-outline',
      'type': 'fill',
      'source': 'country-outline',
      'layout': {},
      'paint': {
         'fill-color': 'rgba(242,243,240,0.4)',
            "fill-outline-color": "rgba(0, 0, 0, 0.61)"
      }}, 
      'place_town'
      );

      // Add boundaries tileset
      maptop.addSource('msoa-tiles', {
        type: 'vector',
        tiles: ['https://cdn.ons.gov.uk/maptiles/historical/1921/administrative/district/v1/boundaries/{z}/{x}/{y}.pbf'],
        "promoteId": {
          "lad": "areacd"
        },
        minzoom:0,
        maxzoom: 11,
      });

      maptop.addLayer({
        id: 'msoa-boundaries',
        type: 'fill',
        source: 'msoa-tiles',
        'source-layer': 'lad',
        minzoom:4,
        maxzoom:17,
        paint: {
          'fill-color': ['case',
            ['!=', ['feature-state', 'colour'], null],
            ['feature-state', 'colour'],
            'lightgrey'
          ],
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8,
            0.9,
            9,
            0.1
          ]
        }
      }, 'place_town');


      // Add layer from the vector tile source with data-driven style
      maptop.addLayer({
        id: 'msoa-building',
        type: 'fill',
        source: 'msoa-tiles',
        'source-layer': 'lad',
        minzoom:8,
        maxzoom:17,
        paint: {
          'fill-color': ['case',
            ['!=', ['feature-state', 'colour'], null],
            ['feature-state', 'colour'],
            'rgba(255, 255, 255, 0)'
          ],
          'fill-opacity': 0.8
        }
      }, 'place_town');

      //loop the json data and set feature state for building layer and boundary layer
      for (var key in json) {
        // setFeatureState for buildlings
        maptop.setFeatureState({
          source: 'msoa-tiles',
          sourceLayer: 'lad',
          id: key
        }, {
          colour: getColour(json[key].value)
        });

        //setFeatureState for boundaries
        maptop.setFeatureState({
          source: 'msoa-tiles',
          sourceLayer: 'lad',
          id: key
        }, {
          colour: getColour(json[key].value)
        });
      }

        //outlines around msoa
        maptop.addLayer({
          id: "msoa-outline",
          type: "line",
          source: 'msoa-tiles',
          minzoom: 4,
          maxzoom: 17,
          "source-layer": "lad",
          // "background-color": "#ccc",
          paint: {
            'line-color': 'darkgrey',
            "line-width": 0.5,
          },
        }, 'place_town');

      //hovered outlines around msoa
      maptop.addLayer({
        id: "msoa-hover",
        type: "line",
        source: 'msoa-tiles',
        minzoom: 4,
        maxzoom: 17,
        "source-layer": "lad",
        // "background-color": "#ccc",
        paint: {
          'line-color': 'orange',
          "line-width": 3,
          "line-opacity": [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0
          ]
        },
      }, 'place_town');

      //get location on click
      d3.select(".mapboxgl-ctrl-geolocate").on("click", geolocate);

    });


    syncMaps(maptop, map);


    // clears search box on click
    // $(".search-control").click(function() {
    //   $(".search-control").val('');
    // });

    // if you push enter while in the box
    d3.select(".search-control").on("keydown", function() {
      if (d3.event.keyCode === 13) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        getCodes($(".search-control").val());
      }
    });
    //if you click on the search icon, find the postcode
    $("#submitPost").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
      getCodes($(".search-control").val());
    });

    //if you focus on the search icon and push space or enter
    d3.select("#submitPost").on("keydown", function() {
      if (d3.event.keyCode === 13 || d3.event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        getCodes($(".search-control").val());
      }
    });



    // When the user moves their mouse over the msoa boundaries layer, we'll update the
    // feature state for the feature under the mouse.
    maptop.on('mousemove', 'msoa-boundaries', onMove);

    // When the mouse leaves the msoa boundaries layer, update the feature state of the
    // previously hovered feature.
    maptop.on('mouseleave', 'msoa-boundaries', onLeave);


    maptop.on('click', 'msoa-boundaries', onClick);

    function onClick(e) {
      disableMouseEvents();
      highlightArea(e.features);
      addClearBox();
    }

    function addClearBox() {
      if(d3.select('#clearbutton').empty()){
        d3.select('#keydiv').append('button').attr('id', 'clearbutton').attr('class', 'clear').text("Clear area").attr('tabindex', 0);
        d3.select('#clearbutton').on('click', removeClearBox);
        d3.select("#clearbutton").on("keydown", function() {
          if (d3.event.keyCode === 13 || d3.event.keyCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            removeClearBox();
          }
        });
      }
    }

    function removeClearBox() {
      d3.select("#clearbutton").remove();
      enableMouseEvents();
      hideaxisVal();
      unhighlightArea();
    }

    function disableMouseEvents() {
      maptop.off('mousemove', 'msoa-boundaries', onMove);
      maptop.off('mouseleave', 'msoa-boundaries', onLeave);
    }
    //
    function enableMouseEvents() {
      maptop.on('mousemove', 'msoa-boundaries', onMove);
      maptop.on('mouseleave', 'msoa-boundaries', onLeave);
    }

    function createKey(dvc) {
      keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

      d3.select("#keydiv")
        .style("font-family", "Open Sans")
        .style("font-size", "14px")
        .append("p")
        .attr("id", "keyvalue")
        .style("font-size", "16.5px")
        .style("margin-top", "5px")
        .style("margin-bottom", "5px")
        .style("margin-left", "10px")
        .text("");

			var svgkey = d3.select("#keydiv")
				.append("svg")
				.attr("id", "key")
				.attr('aria-hidden',true)
				.attr("width", keywidth)
				.attr("height",75);


			var color = d3.scaleThreshold()
			   .domain(breaks)
			   .range(colour);

			// Set up scales for legend
			x = d3.scaleLinear()
				.domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
				.range([0,keywidth-30]); /*range for pixels*/


			var xAxis = d3.axisBottom(x)
				.tickSize(15)
				.tickValues(color.domain())
				.tickFormat(legendformat);

			var g2 = svgkey.append("g").attr("id","horiz")
				.attr("transform", "translate(15,35)");


			keyhor = d3.select("#horiz");

			g2.selectAll("rect")
				.data(color.range().map(function(d,i) {

				  return {
					x0: i ? x(color.domain()[i+1]) : x.range()[0],
					x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
					z: d
				  };
				}))
			  .enter().append("rect")
				.attr("class", "blocks")
				.attr("height", 8)
				.attr("x", function(d) {
					 return d.x0; })
				.attr("width", function(d) {return d.x1 - d.x0; })
				.style("opacity",0.8)
				.style("fill", function(d) { return d.z; });


			g2.append("line")
				.attr("id", "currLine")
				.attr("x1", x(10))
				.attr("x2", x(10))
				.attr("y1", -10)
				.attr("y2", 8)
				.attr("stroke-width","2px")
				.attr("stroke","#000")
				.attr("opacity",0);

			g2.append("text")
				.attr("id", "currVal")
				.attr("x", x(10))
				.attr("y", -15)
				.attr("fill","#000")
				.text("");

			keyhor.selectAll("rect")
				.data(color.range().map(function(d, i) {
				  return {
					x0: i ? x(color.domain()[i]) : x.range()[0],
					x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
					z: d
				  };
				}))
				.attr("x", function(d) { return d.x0; })
				.attr("width", function(d) { return d.x1 - d.x0; })
				.style("fill", function(d) { return d.z; });

			keyhor.call(xAxis).append("text")
				.attr("id", "caption")
				.attr("x", -63)
				.attr("y", -20)
				.text("");

			keyhor.append("rect")
				.attr("id","keybar")
				.attr("width",8)
				.attr("height",0)
				.attr("transform","translate(15,0)")
				.style("fill", "#ccc")
				.attr("x",x(0));


			if(dvc.dropticks) {
				d3.select("#horiz").selectAll("text").attr("transform",function(d,i){
						// if there are more that 4 breaks, so > 5 ticks, then drop every other.
						if(i % 2){return "translate(0,10)"} }
				);
			}

			//label the units
			d3.select("#keydiv").append("p").attr("id","keyunit").attr('aria-hidden',true).style("margin-top","-10px").style("margin-left","10px").style('font-size','14px').text(dvc.varunit);
    } // Ends create key

    function addFullscreen() {
      currentBody = d3.select("#map").style("height");
      d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight);
    }

    function setbodyheight() {
      d3.select("#map").style("height", "100%");

      document.addEventListener('webkitfullscreenchange', exitHandler, false);
      document.addEventListener('mozfullscreenchange', exitHandler, false);
      document.addEventListener('fullscreenchange', exitHandler, false);
      document.addEventListener('MSFullscreenChange', exitHandler, false);

    }


    function exitHandler() {
      if (document.webkitIsFullScreen === false) {
        shrinkbody();
      } else if (document.mozFullScreen === false) {
        shrinkbody();
      } else if (document.msFullscreenElement === false) {
        shrinkbody();
      }
    }

    function shrinkbody() {
      d3.select("#map").style("height", currentBody);
      pymChild.sendHeight();
    }

    function geolocate() {
      dataLayer.push({
        'event': 'geoLocate',
        'selected': 'geolocate'
      });

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    }

    function getCodes(myPC) {
      //first show the remove cross
      d3.select(".search-control").append("abbr").attr("class", "postcode");

      dataLayer.push({
        'event': 'geoLocate',
        'selected': 'postcode'
      });

      var myURIstring = encodeURI("https://api.postcodes.io/postcodes/" + myPC);
      $.support.cors = true;
      $.ajax({
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        url: myURIstring,
        error: function(xhr, ajaxOptions, thrownError) {
          d3.select("#keyvalue").text("Enter a valid postcode");
          d3.select("screenreadertext").text("Enter a valid postcode");
        },
        success: function(data1) {
          if (data1.status == 200) {
            lat = data1.result.latitude;
            lng = data1.result.longitude;
            successpc(lat, lng);
          } else {
            d3.select("#keyvalue").text("Enter a valid postcode");
            d3.select("screenreadertext").text("Enter a valid postcode");
          }
        }

      });
      pymChild.sendHeight();
    }


    function successpc(lat, lng) {
      maptop.jumpTo({
        center: [lng, lat],
        zoom: 12
      });
      point = maptop.project([lng, lat]);

      setTimeout(function() {
        var tilechecker = setInterval(function() {
          features = null;
          var features = maptop.queryRenderedFeatures(point, {
            layers: ['msoa-boundaries']
          });
          if (features.length != 0) {
            highlightArea(features);
            disableMouseEvents();
            addClearBox();
            clearInterval(tilechecker);
          }
        }, 500);
      }, 500);
    }

    function onMove(e) {
      highlightArea(e.features);
    }

  } //end function ready

} else {

  //provide fallback for browsers that don't support webGL
  d3.select('#map').remove();
  d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>");

}

function highlightArea(e) {
  if (e.length > 0) {
    if (hoveredId) {
      maptop.setFeatureState({
        source: 'msoa-tiles',
        sourceLayer: 'lad',
        id: hoveredId
      }, {
        hover: false
      });
    }

    hoveredId = e[0].id;

    maptop.setFeatureState({
      source: 'msoa-tiles',
      sourceLayer: 'lad',
      id: hoveredId
    }, {
      hover: true
    });

    setAxisVal(json[e[0].properties.areacd].areanm, json[e[0].properties.areacd].value);
    setScreenreader( json[e[0].properties.areacd].areanm, json[e[0].properties.areacd].value);
  
  }
}

function unhighlightArea(){
  if (hoveredId) {
    maptop.setFeatureState({
      source: 'msoa-tiles',
      sourceLayer: 'lad',
      id: hoveredId
    }, {
      hover: false
    });
  }
  hoveredId = null;
}


function generateBreaks(data, dvc) {
  if (!Array.isArray(dvc.breaks)) {
    values = data.map(function(d) {
      return +d.value;
    }).filter(function(d) {
      if (!isNaN(d)) {
        return d;
      }
    }).sort(d3.ascending);
  }


  if (dvc.breaks == "jenks") {
    breaks = [];

    ss.ckmeans(values, (dvc.numberBreaks)).map(function(cluster, i) {
      if (i < dvc.numberBreaks - 1) {
        breaks.push(cluster[0]);
      } else {
        breaks.push(cluster[0]);
        //if the last cluster take the last max value
        breaks.push(cluster[cluster.length - 1]);
      }
    });
  } else if (dvc.breaks == "equal") {
    breaks = ss.equalIntervalBreaks(values, dvc.numberBreaks);
  } else {
    breaks = dvc.breaks;
  }

  //round breaks to specified decimal places
  breaks = breaks.map(function(each_element) {
    return Number(each_element.toFixed(dvc.legenddecimals));
  });



  return breaks;
}

function onLeave() {
  if (hoveredId) {
    maptop.setFeatureState({
      source: 'msoa-tiles',
      sourceLayer: 'lad',
      id: hoveredId
    }, {
      hover: false
    });
  }
  hoveredId = null;
}

function setAxisVal(areanm, areaval) {
  d3.select("#keyvalue").html(function() {
    if (!isNaN(areaval)) {
      return areanm;
    } else {
      return areanm + "<br>No data available";
    }
  });

  d3.select("#currLine")
    .style("opacity", function(){if(!isNaN(areaval)) {return 1} else{return 0}})
    .transition()
    .duration(400)
    .attr("x1", function(){if(!isNaN(areaval)) {return x(areaval)} else{return x(midpoint)}})
    .attr("x2", function(){if(!isNaN(areaval)) {return x(areaval)} else{return x(midpoint)}});


  d3.select("#currVal")
    .text(function(){if(!isNaN(areaval))  {return displayformat(areaval)} else {return "Data unavailable"}})
    .style("opacity",1)
    .transition()
    .duration(400)
    .attr("x", function(){if(!isNaN(areaval)) {return x(areaval)} else{return x(midpoint)}});
}

function setScreenreader(name, value) {
  if (!isNaN(value)) {
    d3.select("#screenreadertext").text("The percentage point change in population from 1911 to 1921 in " + name + " was " + displayformat(value));
  } else {
    d3.select("#screenreadertext").text("There is no data available for " + name);
  }
}

function hideaxisVal() {
  d3.select("#keyvalue").style("font-weight", "bold").text("");
  d3.select("#screenreadertext").text("");

  d3.select("#currLine")
    .style("opacity",0)

  d3.select("#currVal").text("")
    .style("opacity",0)
}

function getColour(value) {
  return isNaN(value) ? dvc.nullColour : color(value);
}

function csv2json(csv) {
  var json = {},
    i = 0,
    len = csv.length;
  while (i < len) {

    var heads = {};
    heads.value = +csv[i][csv.columns[1]];
    heads.areanm = csv[i][csv.columns[2]];

    json[csv[i][csv.columns[0]]] = heads;

    i++;
  }
  return json;
}
