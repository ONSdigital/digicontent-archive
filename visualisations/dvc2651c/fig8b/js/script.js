
//test if browser supports webGL

if (Modernizr.webgl) {

	//setup pymjs
	var pymChild = new pym.Child();

	//Load data and config file
	d3.queue()
		.defer(d3.csv, "data/data.csv")
		.defer(d3.json, "data/config.json")
		.defer(d3.json, "data/geog.json")

		.await(ready);


	function ready(error, data, config, geog) {
		graphic_data = data;

		console.log(graphic_data);
		//Set up global variables
		dvc = config.ons;
		oldAREACD = "";
		firsthover = true;



		//set title of page
		document.title = dvc.map.maptitle;

		//Make dropdown
		selectlist(data);

		//Set up number formats
		displayformat = d3.format("." + dvc.map.displaydecimals + "f");
		legendformat = d3.format("." + dvc.map.legenddecimals + "f");

		//set up basemap
		map = new mapboxgl.Map({
			container: 'map', // container id
			style: 'data/style.json', //stylesheet location
			center: [-2.5, 54], // starting position
			zoom: 4.5, // starting zoom
			maxZoom: 11, //
			attributionControl: false
		});

		// Disable map rotation using right click + drag
		map.dragRotate.disable();

		// Disable map rotation using touch rotation gesture
		map.touchZoomRotate.disableRotation();

		//add compact attribution
		map.addControl(new mapboxgl.AttributionControl({
			compact: true
		}), 'bottom-right');

		var controlsPosition = 'top-right'

		// Add geolocation controls to the map.
		map.addControl(new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			}
		}), controlsPosition);

		//add fullscreen option
		map.addControl(new mapboxgl.FullscreenControl(), controlsPosition);

		// Add zoom and rotation controls to the map.
		map.addControl(new mapboxgl.NavigationControl(), controlsPosition);

		addFullscreen();

		//set up d3 color scales

		countById = {};
		nameById = {};
		areaById = {};
		incomeById = {};
		sizeById = {};
		qualsById = {};

		data.forEach(function (d) { countById[d.AREACD] = d.mapvar; incomeById[d.AREACD] = d.income; sizeById[d.AREACD] = d.size, areaById[d.AREACD] = d.AREANM ; qualsById[d.AREACD] = d.Highest_quals_score });

		//Flatten data values and work out breaks
		var values = data.map(function (d) { return +eval("d." + dvc.map.mapVarName); }).filter(function (d) { return !isNaN(d) }).sort(d3.ascending);

		if (dvc.map.breaks == "jenks") {
			breaks = [];

			ss.ckmeans(values, (dvc.map.numberBreaks)).map(function (cluster, i) {
				if (i < dvc.map.numberBreaks - 1) {
					breaks.push(cluster[0]);
				} else {
					breaks.push(cluster[0])
					//if the last cluster take the last max value
					breaks.push(cluster[cluster.length - 1]);
				}
			});
		}
		else if (dvc.map.breaks == "equal") {
			breaks = ss.equalIntervalBreaks(values, dvc.map.numberBreaks);
		}
		else { breaks = dvc.map.breaks; };


		//round breaks to specified decimal places
		breaks = breaks.map(function (each_element) {
			return Number(each_element.toFixed(dvc.map.legenddecimals));
		});

		//work out halfway point (for no data position)
		midpoint = breaks[0] + ((breaks[dvc.map.numberBreaks] - breaks[0]) / 2)

		//Load colours
		if (typeof dvc.map.varcolour === 'string') {

			//colour = colorbrewer[dvc.map.varcolour][dvc.map.numberBreaks];

			colorScale = chroma.scale(dvc.map.varcolour).colors(dvc.map.numberBreaks)
			colour = []
			colorScale.forEach(function (d) {
				colour.push(chroma(d).darken(0.4).saturate(0.6).hex())
			})

		} else {
			colour = dvc.map.varcolour;
		}
		//colour = dvc.map.bar.colour_palette
		//set up d3 color scales
		colorScale = d3.scaleThreshold()
			.domain(breaks.slice(1))
			.range(colour);

		//now ranges are set we can call draw the key
		//createKey();

		//convert topojson to geojson
		for (key in geog.objects) {
			var areas = topojson.feature(geog, geog.objects[key])
		}

		//Work out extend of loaded geography file so we can set map to fit total extent
		bounds = turf.extent(areas);

		//set map to total extent
		setTimeout(function () {
			map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]])
		}, 1000);

		//and add properties to the geojson based on the csv file we've read in
		areas.features.map(function (d, i) {

			d.properties.fill = colorScale(countById[d.properties.AREACD])
		});


		map.on('load', function () {

			map.addSource('area', { 'type': 'geojson', 'data': areas });

			map.addLayer({
				'id': 'area',
				'type': 'fill',
				'source': 'area',
				'layout': {},
				'paint': {
					'fill-color': {
						type: 'identity',
						property: 'fill',
					},
					'fill-opacity': 0.7,
					'fill-outline-color': '#fff'
				}
			});

			//Get current year for copyright
			today = new Date();
			copyYear = today.getFullYear();
			map.style.sourceCaches['area']._source.attribution = "Contains OS data &copy; Crown copyright and database right " + copyYear;

			map.addLayer({
				"id": "state-fills-hover",
				"type": "line",
				"source": "area",
				"layout": {},
				"paint": {
					"line-color": "#000",
					"line-width": 2
				},
				"filter": ["==", "AREACD", ""]
			});

			map.addLayer({
				'id': 'area_labels',
				'type': 'symbol',
				'source': 'area',
				'minzoom': 10,
				'layout': {
					"text-field": '{AREANM}',
					"text-font": ["Open Sans", "Arial Unicode MS Regular"],
					"text-size": 14
				},
				'paint': {
					"text-color": "#666",
					"text-halo-color": "#fff",
					"text-halo-width": 1,
					"text-halo-blur": 1
				}
			});


			//test whether ie or not
			function detectIE() {
				var ua = window.navigator.userAgent;

				// Test values; Uncomment to check result …

				// IE 10
				// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

				// IE 11
				// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

				// Edge 12 (Spartan)
				// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

				// Edge 13
				// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

				var msie = ua.indexOf('MSIE ');
				if (msie > 0) {
					// IE 10 or older => return version number
					return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
				}

				var trident = ua.indexOf('Trident/');
				if (trident > 0) {
					// IE 11 => return version number
					var rv = ua.indexOf('rv:');
					return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
				}

				var edge = ua.indexOf('Edge/');
				if (edge > 0) {
					// Edge (IE 12+) => return version number
					return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
				}

				// other browser
				return false;
			}


			// if(detectIE()){
			// 	onMove = onMove.debounce(100);
			// 	onLeave = onLeave.debounce(100);
			// 	console.log("ie");
			// };

			//Highlight stroke on mouseover (and show area information)
			map.on("mousemove", "area", onMove);

			// Reset the state-fills-hover layer's filter when the mouse leaves the layer.
			map.on("mouseleave", "area", onLeave);

			//Add click event
			map.on("click", "area", onClick);

			//get location on click
			d3.select(".mapboxgl-ctrl-geolocate").on("click", geolocate);

		});

		function onMove(e) {
			newAREACD = e.features[0].properties.AREACD;


			if (firsthover) {
				dataLayer.push({
					'event': 'mapHoverSelect',
					'selected': newAREACD
				})

				firsthover = false;
			}


			if (newAREACD != oldAREACD) {
				oldAREACD = e.features[0].properties.AREACD;
				map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);

				selectArea(e.features[0].properties.AREACD);
				setAxisVal(e.features[0].properties.AREACD);
				d3.selectAll(".cellsselected").classed("cellsselected", false)
				d3.select(".cell" + e.features[0].properties.AREACD).classed("cellsselected", true)
			}
		};



		function onLeave(e) {
			map.setFilter("state-fills-hover", ["==", "AREACD", ""]);
			oldAREACD = "";
			$("#areaselect").val("").trigger("chosen:updated");
			d3.selectAll(".cellsselected").classed("cellsselected", false)
			hideaxisVal();
			// update bars to default values
			updateBars(dvc.bar.defaultBarVar)
		};

		function onClick(e) {
			disableMouseEvents();
			newAREACD = e.features[0].properties.AREACD;


			if (newAREACD != oldAREACD) {
				oldAREACD = e.features[0].properties.AREACD;
				map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);

				d3.selectAll(".cellsselected").classed("cellsselected", false)
				d3.select(".cell" + e.features[0].properties.AREACD).classed("cellsselected", true)

				selectArea(e.features[0].properties.AREACD);
				setAxisVal(e.features[0].properties.AREACD);
			}

			dataLayer.push({
				'event': 'mapClickSelect',
				'selected': newAREACD
			})
		};

		function disableMouseEvents() {
			map.off("mousemove", "area", onMove);
			map.off("mouseleave", "area", onLeave);
			d3.selectAll(".cells path").style("pointer-events", "none")

		}

		function enableMouseEvents() {
			map.on("mousemove", "area", onMove);
			map.on("click", "area", onClick);
			map.on("mouseleave", "area", onLeave);
			d3.selectAll(".cells path").style("pointer-events", "all")
		}

		function selectArea(code) {
			//console.log(code)
			$("#areaselect").val(code).trigger("chosen:updated");
			console.log(code)
			updateBars(code)
			d3.select("#name").text(areaById[code]);
			d3.select("#deprivation").text(incomeById[code]);
			d3.select("#quals").text(d3.format(".1f")(qualsById[code]));
			// d3.select("#coastal").text(areaById[code]);
			d3.select("#townSize").text(sizeById[code]);
			d3.select("#name2").text(areaById[code]);
			d3.select("#name3").text(areaById[code]);
			d3.select("#name4").text(areaById[code]);

			var formattedNumber = d3.format(".1f")(countById[code])
			var formattedNumber2 = d3.format(".1f")(qualsById[code])

			
			
			//score top
			if (countById[code] >= 0.5) {
				result = d3.select("#result").html('<span class="rangePos">'+formattedNumber+'</span>');
			  } else if (countById[code] >= -0.5) {
				result = d3.select("#result").html('<span class="rangeMid">'+formattedNumber+'</span>');
			  } else {
				result = d3.select("#result").html('<span class="rangeNeg">'+formattedNumber+'</span>');
			  };
			//score bottom
			  if (countById[code] >= 3.9) {
				result = d3.select("#quals").html('<span class="rangePos">'+formattedNumber2+'</span>');
			  } else if (countById[code] >= 3.8) {
				result = d3.select("#quals").html('<span class="rangeMid">'+formattedNumber2+'</span>');
			  } else {
				result = d3.select("#quals").html('<span class="rangeNeg">'+formattedNumber2+'</span>');
			  };
			
		
			
			 //range bottom
			if (qualsById[code] >= 3.9) {
				result = d3.select("#qualsRange").html('<span id="rangePos">above average</span>');
			  } else if (qualsById[code] >= 3.8) {
				result = d3.select("#qualsRange").html('<span id="rangeMid">about average</span>');
			  } else {
				result = d3.select("#qualsRange").html('<span id="rangeNeg">below average</span>');
			  }

//rangetop	
					// d3.select("#name4").text(areaById[code]);
			if (countById[code] >= 0.5) {
				result = d3.select("#countRange").html('<span id="rangePos">above average</span>');
			  } else if (countById[code] >= -0.5) {
				result = d3.select("#countRange").html('<span id="rangeMid">about average</span>');
			  } else {
				result = d3.select("#countRange").html('<span id="rangeNeg">below average</span>');
			  };

			  if (qualsById[code] >= 3.9) {
				result = d3.select("#circlePenBottomB").attr("class","rangePosStroke");
			  } else if (qualsById[code] >= 3.8) {
				result = d3.select("#circlePenBottomB").attr("class","rangeMidStroke");
			  } else {
				result = d3.select("#circlePenBottomB").attr("class","rangeNegStroke");
			  }

			  if (sizeById[code] == "city" || sizeById[code] == ""  ) {
				result = d3.select("#with").text("");
			  }  else {result = d3.select("#with").text("with");}

			  if (sizeById[code] == ""  ) {
				result = d3.select("#isA").text("");
			  }  else {result = d3.select("#isA").text("is a");}



			  if (countById[code] >= 0.5) {
				result =d3.select("#resultNumber").attr("class","rangePos");
			  } else if (countById[code] >= -0.5) {
				result =d3.select("#resultNumber").attr("class","rangeMid");
			  } else {
				result =d3.select("#resultNumber").attr("class","rangeNeg");
			  };

			  if (countById[code] >= 0.5) {
				result =d3.select("#resultNumberB").attr("class","rangePos");
			  } else if (countById[code] >= -0.5) {
				result =d3.select("#resultNumberB").attr("class","rangeMid");
			  } else {
				result =d3.select("#resultNumberB").attr("class","rangeNeg");
			  };

			  if (qualsById[code] >= 3.9) {
				result = 		  d3.select("#resultNumberBottomB").attr("class","rangePos");
			  } else if (qualsById[code] >= 3.8) {
				result = 		  d3.select("#resultNumberBottomB").attr("class","rangeMid");
			  } else {
				result = 		  d3.select("#resultNumberBottomB").attr("class","rangeNeg");
			  }
			  if (qualsById[code] >= 3.9) {
				result = 		  d3.select("#resultNumberBottom").attr("class","rangePos");
			  } else if (qualsById[code] >= 3.8) {
				result = 		  d3.select("#resultNumberBottom").attr("class","rangeMid");
			  } else {
				result = 		  d3.select("#resultNumberBottom").attr("class","rangeNeg");
			  }


			  if (countById[code] >= 0.5) {
				result = 		  d3.select("#circlePenTop").attr("class","rangePosStroke");
			} else if (countById[code] >= -0.5) {
				result = 		  d3.select("#circlePenTop").attr("class","rangeMidStroke");
			  } else {
				result = 		  d3.select("#circlePenTop").attr("class","rangeNegStroke");
			  }
			

			  if (countById[code] >= 0.5) {
				result = 		  d3.select("#circlePenBottom").attr("class","rangePosStroke");
			} else if (countById[code] >= -0.5) {
				result = 		  d3.select("#circlePenBottom").attr("class","rangeMidStroke");
			  } else {
				result = 		  d3.select("#circlePenBottom").attr("class","rangeNegStroke");
			  }
			
			  if (countById[code] >= 0.5) {
				result = 		  d3.select("#circlePenTopB").attr("class","rangePosStroke");
			} else if (countById[code] >= -0.5) {
				result = 		  d3.select("#circlePenTopB").attr("class","rangeMidStroke");
			  } else {
				result = 		  d3.select("#circlePenTopB").attr("class","rangeNegStroke");
			  }
			  //show text
			  d3.select("#summaryLeft1").attr("id","summaryLeft1b");
			  d3.select("#summaryLeft2").attr("id","summaryLeft2b");
			  d3.select("#summaryLeft3").attr("id","summaryLeft3b");
			  d3.select("#summaryLeft4").attr("id","summaryLeft4b");
			  d3.select("#circlePenTop").attr("id","circlePenTopB");
			  d3.select("#circlePenBottom").attr("id","circlePenBottomB");
			  d3.select("#resultNumber").attr("id","resultNumberB");
			  d3.select("#resultNumberBottom").attr("id","resultNumberBottomB");
			  document.getElementById("resultNumberB").textContent = d3.format(".1f")(countById[code]);
			  document.getElementById("resultNumberBottomB").textContent = d3.format(".1f")(qualsById[code]);
			  
			//   if (countById[code] >= 0.5) {
			// 	 d3.select("#summaryLeft1").attr("id","SummaryLeft1none");;
			//   } else if (countById[code] >= -0.5) {
			// 	 d3.select("#summaryLeft1").attr("opacity","0");;
			//   } else {
			// 	 d3.select("#summaryLeft1").attr("opacity","1");;
			//   }

			  d3.select("#summaryLeft1").attr("opacity","0");
			//   if (qualsById[code] >= 4) {
			// 	result = d3.select("#qualsRange").text("above average");
			//   } else if (qualsById[code] >= 3) {
			// 	result = d3.select("#qualsRange").text("about average");
			//   } else {
			// 	result = d3.select("#qualsRange").text("below average");
			//   }


			  

var formattedNumber = d3.format(".1f")(countById[code]);
var formattedNumber2 = d3.format(".1f")(qualsById[code]);

			//   if (qualsById[code] >= 3.9) {
			// 	result =  document.getElementById("resultNumber").text(formattedNumber).attr("font-weight", "400");

			//   } else if (qualsById[code] >= 3.8) {
			// 	result =  document.getElementById("resultNumber").text(formattedNumber).attr("font-weight", "bold");

			//   } else {
			// 	result =  document.getElementById("resultNumber").text(formattedNumber).attr("font-weight", "bold");
			//   }

			//   if (qualsById[code] >= 3.9) {
			// 	result = document.getElementById("resultNumber").innerHTML = '<id="rangePos">' + formattedNumber +  '<id="rangePos">';
			//   } else if (qualsById[code] >= 3.8) {
			// 	result = document.getElementById("resultNumber").innerHTML = '<id="rangePos">' + formattedNumber +  '<id="rangePos">';
			//   } else {
			// 	result = document.getElementById("resultNumber").innerHTML = '<id="rangePos">' + formattedNumber +  '<id="rangePos">';
			//   }

	
			// // d3.select("#deprivation").text(countById[code]);

			console.log("testClick")
			// d3.selectAll("#report-card-div").attr("display","block")
		}

		$('#areaselect').on('select2:unselect', function () {
			dataLayer.push({
				'event': 'deselectCross',
				'selected': 'deselect'
			})
		});

		function zoomToArea(code) {

			specificpolygon = areas.features.filter(function (d) { return d.properties.AREACD == code })

			specific = turf.extent(specificpolygon[0].geometry);

			map.fitBounds([[specific[0], specific[1]], [specific[2], specific[3]]], {
				padding: { top: 0, bottom: 0, left: 0, right: 0 }
			});

		}

		function resetZoom() {

			map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);

		}


		function setAxisVal(code) {
			d3.select("#currLine")
				.style("opacity", function () { if (!isNaN(countById[code])) { return 1 } else { return 0 } })
				.transition()
				.duration(1)
				.attr("x1", function () { if (!isNaN(countById[code])) { return xKey(countById[code]) } else { return xKey(midpoint) } })
				.attr("x2", function () { if (!isNaN(countById[code])) { return xKey(countById[code]) } else { return xKey(midpoint) } });


			d3.select("#currVal")
				.text(areaById[code] + " is a " + nameById[code] + " town with " + nameById[code] + " deprivation")
				.style("opacity", 1)
				.transition()
				.duration(400)
				.attr("x", 20)
				;
			// var updatetext = document.getElementById("report-text")
			// .text(areaById[code]+" is a "+nameById[code]+" town with "+nameById[code]+" deprivation")

			// updatetext.textContent = areaById[code]+" is a "+nameById[code]+" town with "+nameById[code]+" deprivation";

			// d3.select("#currVal")
			// .text(function(){if(!isNaN(countById[code]))  {return displayformat(countById[code])} else {return "Data unavailable"}})
			// .style("opacity",1)
			// .transition()
			// .duration(400)
			// .attr("x", function(){
			// 	if(!isNaN(countById[code])) {
			// 		//console.log(xKey(countById[code]))
			// 		return xKey(countById[code])
			// 	} else {
			// 		return xKey(midpoint)
			// 	}
			// });

		}

		function hideaxisVal() {
			d3.select("#currLine")
				.style("opacity", 0)

			d3.select("#currVal").text("")
				.style("opacity", 0)
		}

		function createKey() {

			keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

			var svgkey = d3.select("#keydiv")
				.append("svg")
				.attr("id", "key")
				.attr("width", keywidth)
				.attr("height", 65);


			var colorScale = d3.scaleThreshold()
				.domain(breaks)
				.range(colour);

			// Set up scales for legend
			xKey = d3.scaleLinear()
				.domain([breaks[0], breaks[dvc.map.numberBreaks]]) /*range for data*/
				.range([0, keywidth - 30]); /*range for pixels*/


			var xAxisKey = d3.axisBottom(xKey)
				.tickSize(15)
				.tickValues(colorScale.domain())
				.tickFormat(legendformat);

			var g2 = svgkey.append("g").attr("id", "horiz")
				.attr("transform", "translate(15,30)");


			keyhor = d3.select("#horiz");

			g2.selectAll("rect")
				.data(colorScale.range().map(function (d, i) {

					return {
						x0: i ? xKey(colorScale.domain()[i + 1]) : xKey.range()[0],
						x1: i < colorScale.domain().length ? xKey(colorScale.domain()[i + 1]) : xKey.range()[1],
						z: d
					};
				}))
				.enter().append("rect")
				.attr("class", "blocks")
				.attr("height", 8)
				.attr("x", function (d) {
					return d.x0;
				})
				.attr("width", function (d) { return d.x1 - d.x0; })
				.style("opacity", 0.8)
				.style("fill", function (d) { return d.z; });


			// g2.append("line")
			// 	.attr("id", "currLine")
			// 	.attr("x1", xKey(10))
			// 	.attr("x2", xKey(10))
			// 	.attr("y1", -10)
			// 	.attr("y2", 8)
			// 	.attr("stroke-width","2px")
			// 	.attr("stroke","#000")
			// 	.attr("opacity",0);

			g2.append("text")
				.attr("id", "currVal")
				.attr("x", 20)
				.attr("y", -15)
				.attr("fill", "#000")
				.text("");



			keyhor.selectAll("rect")
				.data(colorScale.range().map(function (d, i) {
					return {
						x0: i ? xKey(colorScale.domain()[i]) : xKey.range()[0],
						x1: i < colorScale.domain().length ? xKey(colorScale.domain()[i + 1]) : xKey.range()[1],
						z: d
					};
				}))
				.attr("x", function (d) { return d.x0; })
				.attr("width", function (d) { return d.x1 - d.x0; })
				.style("fill", function (d) { return d.z; });

			keyhor.call(xAxisKey).append("text")
				.attr("id", "caption")
				.attr("x", -63)
				.attr("y", -20)
				.text("");

			keyhor.append("rect")
				.attr("id", "keybar")
				.attr("width", 8)
				.attr("height", 0)
				.attr("transform", "translate(15,0)")
				.style("fill", "#ccc")
				.attr("x", xKey(0));


			if (dvc.map.dropticks) {
				d3.select("#horiz").selectAll("text").attr("transform", function (d, i) {
					// if there are more that 4 breaks, so > 5 ticks, then drop every other.
					if (i % 2) { return "translate(0,10)" }
				}
				);
			}
			//Temporary	hardcode unit text
			dvc.map.unittext = "change in life expectancy";

			d3.select("#keydiv").append("p")
				.attr("id", "keyunit")
				.style("margin-top", "-10px")
				.style("margin-left", "10px")
				.text(dvc.map.varunit)
			// .attr("text-anchor", "end");

		} // Ends create key

		function addFullscreen() {

			mapheight = d3.select("#map").style("height");
			d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight)

		}

		function setbodyheight() {
			d3.select("#map").style("height", "100%");

			document.addEventListener('webkitfullscreenchange', exitHandler, false);
			document.addEventListener('mozfullscreenchange', exitHandler, false);
			document.addEventListener('fullscreenchange', exitHandler, false);
			document.addEventListener('MSFullscreenChange', exitHandler, false);

		}


		function exitHandler() {

			console.log("shrink");
			if (document.webkitIsFullScreen === false) {
				shrinkbody();
			}
			else if (document.mozFullScreen === false) {
				shrinkbody();
			}
			else if (document.msFullscreenElement === false) {
				shrinkbody();
			}
		}

		function shrinkbody() {
			d3.select("#map").style("height", mapheight);
			pymChild.sendHeight();
		}

		function geolocate() {
			dataLayer.push({
				'event': 'geoLocate',
				'selected': 'geolocate'
			})

			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

			navigator.geolocation.getCurrentPosition(success, error, options);
		}

		function success(pos) {
			crd = pos.coords;

			//go on to filter
			//Translate lng lat coords to point on screen
			point = map.project([crd.longitude, crd.latitude]);

			//then check what features are underneath
			var features = map.queryRenderedFeatures(point);

			//then select area
			disableMouseEvents();

			map.setFilter("state-fills-hover", ["==", "AREACD", features[0].properties.AREACD]);
			d3.select(".cell" + features[0].properties.AREACD).classed("cellsselected", true)
			selectArea(features[0].properties.AREACD);
			setAxisVal(features[0].properties.AREACD);


		};

		function selectlist(datacsv) {

			function getunique(arr) {
				return arr.filter(function (item, pos) {
					if ([dvc.bar.defaultBarVar, dvc.bar.lineVar].indexOf(item) > -1) {
						return false;
					}
					return arr.indexOf(item) == pos
				})
			}

			var areacodes = datacsv.map(function (d) { return d.AREACD; });
			//var areacodesunique = getunique(areacodes)
			var areanames = datacsv.map(function (d) { return d.AREANM; });
			//var areanamesunique = getunique(areanames)
			var menuarea = d3.zip(areanames, areacodes).sort(function (a, b) { return d3.ascending(a[0], b[0]); });
			// Build option menu for occupations
			var optns = d3.select("#selectNav").append("div").attr("id", "sel").append("select")
				.attr("id", "areaselect")
				.attr("style", "width:98%")
				.attr("class", "chosen-select");


			optns.append("option")
				.attr("value", "first")
				.text("");

			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function (d) { return d[1] })
				.text(function (d) { return d[0] });

			myId = null;

			$('#areaselect').chosen({ width: "98%", allow_single_deselect: true }).on('change', function (evt, params) {

				if (typeof params != 'undefined') {

					console.log(params);

					disableMouseEvents();

					map.setFilter("state-fills-hover", ["==", "AREACD", params.selected]);
					d3.select(".cell" + params.selected).classed("cellsselected", true)
					selectArea(params.selected);
					setAxisVal(params.selected);

					zoomToArea(params.selected);

					dataLayer.push({
						'event': 'mapDropSelect',
						'selected': params.selected
					})
				}
				else {
					d3.select(".cellsselected").classed("cellsselected", false)

					enableMouseEvents();
					hideaxisVal();
					onLeave();
					resetZoom();
				}

			});

		};

		drawGraphic() // draw the bar chart on the right
		drawGraphic2() // draw the bar chart on the right
		drawGraphic3() // draw the bar chart on the right

		d3.selectAll(".y.axis").selectAll(".tick").attr("class", function (d, i) { return "tick ticky ticky1" + i })
		d3.selectAll(".y2.axis").selectAll(".tick").attr("class", function (d, i) { return "tick ticky ticky2" + i })
		d3.selectAll(".y3.axis").selectAll(".tick").attr("class", function (d, i) { return "tick ticky ticky3" + i })


		d3.selectAll(".ticky10").selectAll("text").text(dvc.bar.tickname10);
		d3.selectAll(".ticky11").selectAll("text").text(dvc.bar.tickname11);
		d3.selectAll(".ticky12").selectAll("text").text(dvc.bar.tickname12);

		d3.selectAll(".ticky20").selectAll("text").text(dvc.bar.tickname20);
		d3.selectAll(".ticky21").selectAll("text").text(dvc.bar.tickname21);
		d3.selectAll(".ticky22").selectAll("text").text(dvc.bar.tickname22);
		d3.selectAll(".ticky23").selectAll("text").text(dvc.bar.tickname23);

		d3.selectAll(".ticky30").selectAll("text").text(dvc.bar.tickname30);
		d3.selectAll(".ticky31").selectAll("text").text(dvc.bar.tickname31);
		d3.selectAll(".ticky32").selectAll("text").text(dvc.bar.tickname32);

		d3.selectAll(".ticky").selectAll("text").call(wrap, MarginLeftAlt - 10);

		console.log(wrap)


		function wrap(text, width) {
			text.each(function () {
				var text = d3.select(this),
					words = text.text().split(/\s+/).reverse(),
					word,
					line = [],
					lineNumber = 0,
					lineHeight = 1.1, // ems
					// y = text.attr("y"),
					x = text.attr("x"),
					dy = parseFloat(text.attr("dy")),
					tspan = text.text(null).append("tspan").attr('x', x);
				while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr('x', x).attr("dy", lineHeight + "em").text(word);
					}
				}
				var breaks = text.selectAll("tspan").size();
				text.attr("y", function () { return -6 * (breaks - 1); });
			});

		}
		function drawGraphic() {
			//get column name
			varnames = [];
			for (var column in data[0]) {
				if (column == 'AREACD') continue;
				if (column == 'AREANM') continue;
				if (column == dvc.bar.stackVar) continue;
				if (column == 'mapvar') continue;
				if (column == 'Highest_quals_score') continue;
				if (column == 'Further education') continue;
				if (column == 'Apprenticeship') continue;
				if (column == 'Full-time higher education') continue;
				if (column == 'Employment') continue;
				if (column == 'GCSEs or equivalent') continue;
				if (column == 'A-Levels, or higher education certificate or equivalent') continue;
				if (column == 'Degree or equivalent') continue;
				if (column == 'percentage') continue;
				if (column == 'income') continue;
				if (column == 'size') continue;
				if (column == 'AREANM full') continue;
				if (column == "GCSEs or equivalent") continue;
				if (column == "A-Levels, or higher education certificate or equivalent") continue;

				//if (column == 'unique') continue;
				varnames.push(column);
			}

			//At age 11	GCSE	A-levels	Further education	Apprenticeship	Full-time higher education	Employment	 GCSEs or equivalent  	A-Levels, or higher education certificate or equivalent	Degree or equivalent	Highest_quals_score	mapvar


			console.log(varnames);



			clicked = false;


			var svg = d3.select("#graphic").select("svg"),


				svgwidth = parseInt(svg.style("width"));


			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				margin = dvc.bar.barMarginSm;
			} else {
				margin = dvc.bar.barMargin;
			}
			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				MarginLeftAlt = dvc.bar.barMarginLeftSm;
			} else {
				MarginLeftAlt = dvc.bar.barMarginLeft;
			}
			// Define a variable based on the condition


			// get the height from CSS styling of map and key. Probably more robust to have all height stylings come from an integer in the config.
			var mapheight = parseInt(d3.select('#map').style('height').slice(0, -2))
			var keyheight = parseInt(d3.select('#keydiv').style('height').slice(0, -2))

			height =
				30 * varnames.length +
				10 * (varnames.length - 1) +
				12;
			// height = mapheight + keyheight - margin.top - margin.bottom - 16 // 16 for the height of the legend. If you need a legend on two lines this needs a better solution.
			heightper = 30;
			width = svgwidth - margin.left - margin.right;


			// clear out existing graphics
			// graphic.selectAll("*").remove();
			// keypoints.selectAll("*").remove();
			// footer.selectAll("*").remove();



			x = d3.scaleLinear()
				.range([0, width]);

			var y = d3.scaleBand()
				// .rangeRound([0, height])
				// .paddingInner(0.1);
				.paddingOuter(0.2)
				.paddingInner(((graphic_data.length - 1) * 10) / (graphic_data.length * 30))
				.range([0, height])
				.round(true);


			y.domain(varnames)

			var yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10)

			xAxis = d3.axisBottom(x)
				.tickSize(-height, 0, 0)


			//specify number or ticks on x axis
			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				xAxis.tickValues([0, 50, 100])
			} else {
				xAxis.tickValues([0, 25, 50, 75, 100])
			}

			// parse data into columns
			bars = {};
			graphic_data.forEach(function (d) {
				// add an entry to bars with AREACD as
				bars[d.AREACD] = {}
				bars[d.AREACD]["AREANM"] = d.AREANM
				bars[d.AREACD]["bars_data"] = []
			})


			//maybe here
			graphic_data.forEach(function (d) { // for each row of graphic data
				// get data in the row into a tmp_array
				var tmp_array = [];
				for (var varname in d) {
					if (varnames.indexOf(varname) > -1) { // check if varname is one of the variables to go on the bar chart
						tmp_array.push({ varname: +d[varname] });
					}
				}
				// push the tmp_array to the right spot in bars
				bars[d.AREACD]["bars_data"].push(tmp_array)

			});

			// TODO: these are broken!
			//y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
			if (dvc.bar.xAxisScale == "auto_zero_max") {
				var xDomain = [
					0,
					d3.max(d3.entries(bars), function (c) {
						return d3.max(c.value, function (v) {
							var n = v.amt;
							return Math.ceil(n);
						});
					})
				];
			} else if (dvc.bar.xAxisScale == "auto_min_max") {
				var xDomain = [
					d3.min(d3.entries(bars), function (c) {
						return d3.min(c.value, function (v) {
							var n = v.amt;
							return Math.floor(n);
						});
					}),

					d3.max(d3.entries(bars), function (c) {
						return d3.max(c.value, function (v) {
							var n = v.amt;
							return Math.ceil(n);
						});
					})
				];
			} else {
				var xDomain = dvc.bar.xAxisScale;
			}

			x.domain(xDomain);

			d3.select("#buttonid").on("click", function () {
				saveSvgAsPng(document.getElementById("chart"), "diagram.png")
			});


			//create svg for chart
			var g = svg
				.style("background-color", "transparent")
				// .attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + 35 + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + 35) + ")");

			//transform to get bars 
			var defaultData = graphic_data.filter(function (d) { return d.AREACD == dvc.bar.defaultBarVar })
			stack = d3.stack().keys(defaultData.map(function (d) { return d[dvc.bar.stackVar] }))
			transposedData = []
			varnames.forEach(function (d) {
				var tmp_obj = {}
				tmp_obj.key = d
				defaultData.forEach(function (k) {
					tmp_obj[k[dvc.bar.stackVar]] = k[d]
				})
				transposedData.push(tmp_obj)
				// console.log(defaultData.map(function(k) {
				// 	var tmp_obj = {}
				// 	tmp_obj[k[dvc.bar.stackVar]] = k[d]
				// 	return tmp_obj
				// }))
			})

			bargx = g.append('g').selectAll('rect')
				.data(stack(transposedData))
				.enter()
				.append('g')
				.attr("class", function (d) { return "bar-group " + d.key })
				.attr("fill", "#222")
				.attr("opacity", 0.05)

			bargx.selectAll('rect')
				.data(function (d) { return d })
				.enter()
				.append('rect')
				.attr("class", "bar")
				.attr("width", width)
				.attr("x", x(0))
				.attr("y", function (d) {
					return y(d.data.key);
				})
				.attr("height", y.bandwidth())

			g.append("rect")
				.attr("class", "svgRect")
				.attr("width", width)
				.attr("height", height)
				.attr("fill", "transparent")

			g.append('g')
				.attr('class', 'x axis')
				.attr("transform", "translate(0, " + height + ")")
				.call(xAxis)
				.selectAll('line')
				.each(function (d) {
					if (d == 0) {
						d3.select(this).attr('class', 'zero-line');
					}
				});
			// append("text")
			// .attr("y", 20)
			// .attr("x", width)
			// .attr("dy", ".71em")
			// .style("text-anchor", "end")
			// .attr("font-size", "14px")
			// .attr("fill", "#666")
			// .text(dvc.bar.xAxisLabel);

			svg
				.append('g')
				.attr('transform', 'translate(0,' + height + ')')
				.append('text')
				.attr('x', width + margin.left)
				.attr('y', 35)
				.attr('text-anchor', 'end')
				.attr('class', 'axis--label')
				.text(dvc.bar.xAxisLabel);




			//create y axis, if x axis doesn't start at 0 drop x axis accordingly
			g.append('g')
				.attr('class', 'y axis')
				.attr('transform', function (d) {
					if (xDomain[0] != 0) {
						return 'translate(' + (0) + ',0)'
					} else {
						return 'translate(' + 0 + ', 0)'
					}
				})
				.call(yAxis);

			d3.selectAll(".y .tick text")
				.call(wrap, margin.left - 10);





			// create default bars
			barg = g.append('g').selectAll('rect')
				.data(stack(transposedData))
				.enter()
				.append('g')
				.attr("class", function (d) { return "bar-group " + d.key })
				.attr("fill", "#27A0CC")



			barg.selectAll('rect')
				.data(function (d) { return d })
				.enter()
				.append('rect')
				.attr("class", "bar")
				.attr("width", function (d) { return x(d[1] - d[0]) })
				.attr("x", function (d) { return x(d[0]) })
				.attr("y", function (d) {
					return y(d.data.key);
				})
				.attr("height", y.bandwidth())




			// add GB wide lines to bar chart for context. dvc.bar.lineVar must be an AREACD in data



			contextLines = graphic_data.filter(function (d) { return d.AREACD == dvc.bar.lineVar })[0]

			console.log(contextLines);

			g.append('g').attr("class", "lines").selectAll("line")
				.data(d3.entries(contextLines))
				.enter()
				.append("line")
				.attr("class", "line")
				.attr("x1", function (d) { return x(+d.value) })
				.attr("x2", function (d) { return x(+d.value) })
				.attr("y1", function (d) { return y(d.key) })
				.attr("y2", function (d) { return y(d.key) + y.bandwidth() })
				.attr("stroke", function (d) { return dvc.bar.lineColour })
				// .attr("stroke", "#053D58")
				.attr("stroke-width", 2)
			// .attr("stroke-linecap","round");

			// add g tags for each bar's suppression text
			suppText = g.append('g').attr("class", "suppressed-group").selectAll("text")
				.data(varnames)
				.enter()
				.append('g')
				.attr("transform", function (d) { return "translate(" + (x(0) + 5) + "," + (y(d) + heightper / 2) + ")" });

			// add background box for text
			suppText.append("rect")
				.attr("class", function (d) { return "suppressed box " + d.split(' ')[1] })
				.attr("fill", "white")
				.attr("x", 0)
				.attr("y", -12)
				.attr("width", 182)
				.attr("height", 18)
				.style("opacity", 0);

			// add text tag for suppression text
			suppText.append('text')
				.attr("class", function (d) { return "suppressed text " + d.split(' ')[1] })
				.text("suppressed due to small sample")
				.style("font-size", "14px")
				.style("opacity", 0);

			var legend = d3.select('ul.key')
				.selectAll('g')
				.data(d3.entries(dvc.bar.legendLabels))
				.enter()
				.append('li')
				.attr("class", function (d) {
					return "key-" + d.value
				})

			legend.append('b')
				.style('background-color', function (d) {
					return dvc.bar.colour_palette[d.value]
				})

			legend.append('label')
				.html(function (d) {
					return d.key;
				});

			var manualLabel = d3.select('ul.key').append('li')
			manualLabel.append('b')
				.classed('line', true)
				.style('background-color', dvc.bar.lineColour)

			manualLabel.append('label')
				.html(dvc.bar.lineLegendLabel)





			g.append("svg:defs").append("svg:marker")
				.attr("id", "annotation_arrowhead")
				.attr("class", "annotation_arrow")
				.attr("refX", 9)
				.attr("refY", 10)
				.attr("markerWidth", 20)
				.attr("markerHeight", 20)
				.attr("orient", "auto")
				.append("path")
				.attr("d", "M2,5 L10,10 L2,15")

			//draws annoation arrow

			g.append("path")
				.attr("class", "annotation_arrow")
				.attr("id", "annotation-arrow-south-west")
				.data(graphic_data)
				.attr("d", function (d) {
					return draw_curve(
						x(72.1) - 32,
						-22,
						x(72.1)-5,
						-2,
						true);
				})
				.attr("marker-end", "url(#annotation_arrowhead)");

			//adds annotation text

			g.append("text")
				.data(graphic_data)
				.text("Average for England")
				.attr("class", "annotation-text")
				.attr("id", "annotation-towns")
				.attr("x", x(72.1) - 38)
				.attr("y", -18)
				.attr("dy", -18)
				.style("text-anchor", "end")
				.call(wrap, svgwidth*0.75);



			//add source
			d3.select("#source").text("Source: " + dvc.bar.sourceText);

			// Adding a missing (visuallyhidden) label to the search input
			d3.select('input.chosen-search-input').attr('id', 'chosensearchinput')
			d3.select('div.chosen-search').insert('label', 'input.chosen-search-input').attr('class', 'visuallyhidden').attr('for', 'chosensearchinput').html("Type to select a town")


			if (pymChild) {
				pymChild.sendHeight();
			}

		} //end drawGraphic()


		function drawGraphic2() {
			clicked = false;

			varnames2 = [];
			for (var column in data[0]) {
				if (column == 'AREACD') continue;
				if (column == 'AREANM') continue;
				if (column == dvc.bar.stackVar) continue;
				if (column == 'mapvar') continue;
				if (column == 'At age 11') continue;
				if (column == 'GCSE') continue;
				if (column == 'A-levels') continue;
				if (column == 'GCSEs or equivalent') continue;
				if (column == 'A-Levels, or higher education certificate or equivalent') continue;
				if (column == 'Degree or equivalent') continue;
				if (column == 'Highest_quals_score') continue;
				if (column == 'percentage') continue;
				if (column == 'income') continue;
				if (column == 'size') continue;
				if (column == 'AREANM full') continue;
				if (column == "GCSEs or equivalent") continue;
				if (column == "A-Levels, or higher education certificate or equivalent") continue;

				//if (column == 'unique') continue;
				varnames2.push(column);
			}

			//At age 11	GCSE	A-levels	Further education	Apprenticeship	Full-time higher education	Employment	 GCSEs or equivalent  	A-Levels, or higher education certificate or equivalent	Degree or equivalent	Highest_quals_score	mapvar

			var svg = d3.select("#graphic2").select("svg"),

				svgwidth = parseInt(svg.style("width"));

			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				margin = dvc.bar.barMarginSm;
			} else {
				margin = dvc.bar.barMargin;
			}
			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				MarginLeftAlt = dvc.bar.barMarginLeftSm;
			} else {
				MarginLeftAlt = dvc.bar.barMarginLeft;
			}
			// Define a variable based on the condition
			// get the height from CSS styling of map and key. Probably more robust to have all height stylings come from an integer in the config.
			var mapheight = parseInt(d3.select('#map').style('height').slice(0, -2))
			var keyheight = parseInt(d3.select('#keydiv').style('height').slice(0, -2))

			height =
				30 * varnames2.length +
				10 * (varnames2.length - 1) +
				12;
			// height = mapheight + keyheight - margin.top - margin.bottom - 16 // 16 for the height of the legend. If you need a legend on two lines this needs a better solution.
			heightper = 30;
			width = svgwidth - margin.left - margin.right;

			// clear out existing graphics
			// graphic.selectAll("*").remove();
			// keypoints.selectAll("*").remove();
			// footer.selectAll("*").remove();



			x2 = d3.scaleLinear()
				.range([0, width]);

			var y2 = d3.scaleBand()
				// .rangeRound([0, height])
				// .paddingInner(0.1);
				.paddingOuter(0.2)
				.paddingInner(((graphic_data.length - 1) * 10) / (graphic_data.length * 30))
				.range([0, height])
				.round(true);


			y2.domain(varnames2)

			var y2Axis = d3.axisLeft(y2).tickSize(0).tickPadding(10)



			x2Axis = d3.axisBottom(x2)
				.tickSize(-height, 0, 0);

			//specify number or ticks on x axis
			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				x2Axis.tickValues([0, 50, 100])
			} else {
				x2Axis.tickValues([0, 25, 50, 75, 100])
			}

			// parse data into columns
			bars = {};
			graphic_data.forEach(function (d) {
				// add an entry to bars with AREACD as
				bars[d.AREACD] = {}
				bars[d.AREACD]["AREANM"] = d.AREANM
				bars[d.AREACD]["bars_data"] = []
			})


			//maybe here
			graphic_data.forEach(function (d) { // for each row of graphic data
				// get data in the row into a tmp_array
				var tmp_array = [];
				for (var varname in d) {
					if (varnames2.indexOf(varname) > -1) { // check if varname is one of the variables to go on the bar chart
						tmp_array.push({ varname: +d[varname] });
					}
				}
				// push the tmp_array to the right spot in bars
				bars[d.AREACD]["bars_data"].push(tmp_array)

			});

			// TODO: these are broken!
			//y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
			if (dvc.bar.xAxisScale == "auto_zero_max") {
				var x2Domain = [
					0,
					d3.max(d3.entries(bars), function (c) {
						return d3.max(c.value, function (v) {
							var n = v.amt;
							return Math.ceil(n);
						});
					})
				];
			} else if (dvc.bar.xAxisScale == "auto_min_max") {
				var x2Domain = [
					d3.min(d3.entries(bars), function (c) {
						return d3.min(c.value, function (v) {
							var n = v.amt;
							return Math.floor(n);
						});
					}),

					d3.max(d3.entries(bars), function (c) {
						return d3.max(c.value, function (v) {
							var n = v.amt;
							return Math.ceil(n);
						});
					})
				];
			} else {
				var x2Domain = dvc.bar.xAxisScale;
			}

			x2.domain(x2Domain);

			d3.select("#buttonid").on("click", function () {
				saveSvgAsPng(document.getElementById("chart"), "diagram.png")
			});


			//create svg for chart
			var g = svg
				//.style("background-color", "#fff")
				// .attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			g.append("rect")
				.attr("class", "svgRect")
				.attr("width", width)
				.attr("height", height)
				.attr("fill", "transparent")

			g.append('g')
				.attr('class', 'x2 axis')
				.attr("transform", "translate(0, " + height + ")")
				.call(x2Axis)
				.selectAll('line')
				.each(function (d) {
					if (d == 0) {
						d3.select(this).attr('class', 'zero-line');
					}
				});
			// append("text")
			// .attr("y", 20)
			// .attr("x", width)
			// .attr("dy", ".71em")
			// .style("text-anchor", "end")
			// .attr("font-size", "14px")
			// .attr("fill", "#666")
			// .text(dvc.bar.xAxisLabel);

			svg
				.append('g')
				.attr('transform', 'translate(0,' + height + ')')
				.append('text')
				.attr('x', width + margin.left)
				.attr('y', 35)
				.attr('text-anchor', 'end')
				.attr('class', 'axis--label')
				.text(dvc.bar.xAxisLabel);



			//create y axis, if x axis doesn't start at 0 drop x axis accordingly
			g.append('g')
				.attr('class', 'y2 axis')
				.attr('transform', function (d) {
					if (x2Domain[0] != 0) {
						return 'translate(' + (0) + ',0)'
					} else {
						return 'translate(' + 0 + ', 0)'
					}
				})
				.call(y2Axis);

			d3.selectAll(".y2 .tick text")
				.call(wrap, margin.left - 10);
			console.log(graphic_data)
			var defaultData = graphic_data.filter(function (d) { return d.AREACD == dvc.bar.defaultBarVar })
			stack2 = d3.stack().keys(defaultData.map(function (d) { return d[dvc.bar.stackVar] }))
			transposedData = []
			varnames2.forEach(function (d) {
				var tmp_obj = {}
				tmp_obj.key = d
				defaultData.forEach(function (k) {
					tmp_obj[k[dvc.bar.stackVar]] = k[d]
				})
				transposedData.push(tmp_obj)
				// console.log(defaultData.map(function(k) {
				// 	var tmp_obj = {}
				// 	tmp_obj[k[dvc.bar.stackVar]] = k[d]
				// 	return tmp_obj
				// }))
			})

			bargx = g.append('g').selectAll('rect')
				.data(stack2(transposedData))
				.enter()
				.append('g')
				.attr("class", function (d) { return "bar-group " + d.key })
				.attr("fill", "#222")
				.attr("opacity", 0.05)

			bargx.selectAll('rect')
				.data(function (d) { return d })
				.enter()
				.append('rect')
				.attr("class", "bar")
				.attr("width", width)
				.attr("x", x2(0))
				.attr("y", function (d) {
					return y2(d.data.key);
				})
				.attr("height", y2.bandwidth())

			// 	bargxtext = g.append('g').selectAll('text')
			// 	.data(stack2(transposedData))
			// 	.enter()
			// 	.append('g')
			// 	.attr("class", function(d) {return "bar-text-group " + d.key})
			// 	.attr("fill", "#fff")
			// 	.attr("opacity",0)

			// 	bargxtext.selectAll('text')
			// 	.data(function(d) { return d })
			// 	.enter()
			// 	.append('text')
			// 	.attr("class", "bar-text")
			//  //    .attr("width", function(d) { return x2(d[1] - d[0]) })
			// 	.attr("x", function(d) { return x2(0) })
			// 	.attr("y", function(d) {
			// 		return y2(d.data.key);
			// 	})
			// 	.text(function(d) {
			// 	 return x2(d[0]);
			//  })
			//  .attr("font-family","Open Sans")
			//  .attr("fill","black")
			//  .attr("font-size","20px")

			// create default bars
			barg2 = g.append('g').selectAll('rect')
				.data(stack2(transposedData))
				.enter()
				.append('g')
				.attr("class", function (d) { return "bar-group " + d.key })
				.attr("fill", function (d) { return dvc.bar.colour_palette[dvc.bar.legendLabels[d.key]] })

			barg2.selectAll('rect')
				.data(function (d) { return d })
				.enter()
				.append('rect')
				.attr("class", "bar")
				.attr("width", function (d) { return x2(d[1] - d[0]) })
				.attr("x", function (d) { return x2(d[0]) })
				.attr("y", function (d) {
					return y2(d.data.key);
				})
				.attr("height", y2.bandwidth())

			//    barg2text = g.append('g').selectAll('rect')
			//    .data(stack2(transposedData))
			//    .enter()
			//    .append('g')
			//    .attr("class", function(d) {return "bar-text-group " + d.key})
			//    .attr("fill", function(d) {return dvc.bar.colour_palette[dvc.bar.legendLabels[d.key]]})


			//    barg2text.selectAll('text')
			//    .data(function(d) { return d })
			//    .enter()
			//    .append('text')
			//    .attr("class", "bar-text")
			// //    .attr("width", function(d) { return x2(d[1] - d[0]) })
			//    .attr("x", function(d) { return x2(d[0]) })
			//    .attr("y", function(d) {
			// 	   return y2(d.data.key);
			//    })
			//    .text(function(d) {
			// 	return d[0];
			// })
			// .attr("font-family","Open Sans")
			// .attr("fill","black")
			// .attr("font-size","black")

			// add GB wide lines to bar chart for context. dvc.bar.lineVar must be an AREACD in data
			contextLines = graphic_data.filter(function (d) { return d.AREACD == dvc.bar.lineVar })[0]
			g.append('g').attr("class", "lines").selectAll("line")
				.data(d3.entries(contextLines))
				.enter()
				.append("line")
				.attr("class", "line")
				.attr("x1", function (d) { return x2(d.value) })
				.attr("x2", function (d) { return x2(d.value) })
				.attr("y1", function (d) { return y2(d.key) })
				.attr("y2", function (d) { return y2(d.key) + y2.bandwidth() })
				.attr("stroke", function (d) { return dvc.bar.lineColour })
				// .attr("stroke", "#053D58")
				.attr("stroke-width", 2);

			// add g tags for each bar's suppression text
			suppText = g.append('g').attr("class", "suppressed-group").selectAll("text")
				.data(varnames2)
				.enter()
				.append('g')
				.attr("transform", function (d) { return "translate(" + (x2(0) + 5) + "," + (y2(d) + heightper / 2) + ")" });

			// add background box for text
			suppText.append("rect")
				.attr("class", function (d) { return "suppressed box " + d.split(' ')[1] })
				.attr("fill", "white")
				.attr("x", 0)
				.attr("y", -12)
				.attr("width", 182)
				.attr("height", 18)
				.style("opacity", 0);

			// add text tag for suppression text
			suppText.append('text')
				.attr("class", function (d) { return "suppressed text " + d.split(' ')[1] })
				.text("suppressed due to small sample")
				.style("font-size", "14px")
				.style("opacity", 0);

			var legend = d3.select('ul.key')
				.selectAll('g')
				.data(d3.entries(dvc.bar.legendLabels))
				.enter()
				.append('li')
				.attr("class", function (d) {
					return "key-" + d.value
				})

			legend.append('b')
				.style('background-color', function (d) {
					return dvc.bar.colour_palette[d.value]
				})

			legend.append('label')
				.html(function (d) {
					return d.key;
				});

			var manualLabel = d3.select('ul.key').append('li')
			manualLabel.append('b')
				.classed('line', true)
				.style('background-color', dvc.bar.lineColour)

			manualLabel.append('label')
				.html(dvc.bar.lineLegendLabel)






			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.1, // ems
						// y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr('x', x);
					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr('x', x).attr("dy", lineHeight + "em").text(word);
						}
					}
					var breaks = text.selectAll("tspan").size();
					text.attr("y", function () { return -6 * (breaks - 1); });
				});

			}



			//add source
			d3.select("#source").text("Source: " + dvc.bar.sourceText);

			// Adding a missing (visuallyhidden) label to the search input
			d3.select('input.chosen-search-input').attr('id', 'chosensearchinput')
			d3.select('div.chosen-search').insert('label', 'input.chosen-search-input').attr('class', 'visuallyhidden').attr('for', 'chosensearchinput').html("Type to select a town")


			if (pymChild) {
				pymChild.sendHeight();
			}

		} //end drawgraphic2



		function drawGraphic3() {
			clicked = false;

			varnames3 = [];
			for (var column in data[0]) {
				if (column == 'AREACD') continue;
				if (column == 'AREANM') continue;
				if (column == dvc.bar.stackVar) continue;
				if (column == 'mapvar') continue;
				if (column == 'At age 11') continue;
				if (column == 'GCSE') continue;
				if (column == 'A-levels') continue;
				if (column == 'Highest_quals_score') continue;
				if (column == 'Further education') continue;
				if (column == 'Apprenticeship') continue;
				if (column == 'Full-time higher education') continue;
				if (column == 'Employment') continue;
				if (column == 'percentage') continue;
				if (column == 'income') continue;
				if (column == 'size') continue;
				if (column == 'AREANM full') continue;
				if (column == "GCSEs or equivalent") continue;
				if (column == "A-Levels, or higher education certificate or equivalent") continue;
				


				//if (column == 'unique') continue;
				varnames3.push(column);

			}

			console.log(varnames3);

			//At age 11	GCSE	A-levels	Further education	Apprenticeship	Full-time higher education	Employment	 GCSEs or equivalent  	A-Levels, or higher education certificate or equivalent	Degree or equivalent	Highest_quals_score	mapvar

			var svg = d3.select("#graphic3").select("svg");



			svgwidth = parseInt(svg.style("width"));


			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				margin = dvc.bar.barMarginSm;
			} else {
				margin = dvc.bar.barMargin;
			}
			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				MarginLeftAlt = dvc.bar.barMarginLeftSm;
			} else {
				MarginLeftAlt = dvc.bar.barMarginLeft;
			}
			// Define a variable based on the condition

			console.log(margin)
			console.log(MarginLeftAlt)

			// get the height from CSS styling of map and key. Probably more robust to have all height stylings come from an integer in the config.
			var mapheight = parseInt(d3.select('#map').style('height').slice(0, -2))
			var keyheight = parseInt(d3.select('#keydiv').style('height').slice(0, -2))

			height =
				30 * varnames3.length +
				10 * (varnames3.length - 1) +
				12;
			// height = mapheight + keyheight - margin.top - margin.bottom - 16 // 16 for the height of the legend. If you need a legend on two lines this needs a better solution.
			heightper = 30;
			width = svgwidth - margin.left - margin.right;

			// clear out existing graphics
			// graphic.selectAll("*").remove();
			// keypoints.selectAll("*").remove();
			// footer.selectAll("*").remove();



			x2 = d3.scaleLinear()
				.range([0, width]);

			var y3 = d3.scaleBand()
				// .rangeRound([0, height])
				// .paddingInner(0.1);
				.paddingOuter(0.2)
				.paddingInner(((graphic_data.length - 1) * 10) / (graphic_data.length * 30))
				.range([0, height])
				.round(true);


			y3.domain(varnames3)

			var y3Axis = d3.axisLeft(y3).tickSize(0).tickPadding(10)



			x2Axis = d3.axisBottom(x2)
				.tickSize(-height, 0, 0);

			//specify number or ticks on x axis
			if (svgwidth <= dvc.bar.mobileBreakpoint) {
				x2Axis.tickValues([0, 50, 100])
			} else {
				x2Axis.tickValues([0, 25, 50, 75, 100])
			}

			// parse data into columns
			bars = {};
			graphic_data.forEach(function (d) {
				// add an entry to bars with AREACD as
				bars[d.AREACD] = {}
				bars[d.AREACD]["AREANM"] = d.AREANM
				bars[d.AREACD]["bars_data"] = []
			})


			//maybe here
			graphic_data.forEach(function (d) { // for each row of graphic data
				// get data in the row into a tmp_array
				var tmp_array = [];
				for (var varname in d) {
					if (varnames3.indexOf(varname) > -1) { // check if varname is one of the variables to go on the bar chart
						tmp_array.push({ varname: +d[varname] });
					}
				}
				// push the tmp_array to the right spot in bars
				bars[d.AREACD]["bars_data"].push(tmp_array)

			});

			// TODO: these are broken!
			//y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
			if (dvc.bar.xAxisScale == "auto_zero_max") {
				var x2Domain = [
					0,
					d3.max(d3.entries(bars), function (c) {
						return d3.max(c.value, function (v) {
							var n = v.amt;
							return Math.ceil(n);
						});
					})
				];
			} else if (dvc.bar.xAxisScale == "auto_min_max") {
				var x2Domain = [
					d3.min(d3.entries(bars), function (c) {
						return d3.min(c.value, function (v) {
							var n = v.amt;
							return Math.floor(n);
						});
					}),

					d3.max(d3.entries(bars), function (c) {
						return d3.max(c.value, function (v) {
							var n = v.amt;
							return Math.ceil(n);
						});
					})
				];
			} else {
				var x2Domain = dvc.bar.xAxisScale;
			}

			x2.domain(x2Domain);

			d3.select("#buttonid").on("click", function () {
				saveSvgAsPng(document.getElementById("chart"), "diagram.png")
			});


			//create svg for chart
			var g = svg
				//.style("background-color", "#fff")
				// .attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			g.append("rect")
				.attr("class", "svgRect")
				.attr("width", width)
				.attr("height", height)
				.attr("fill", "transparent")

			g.append('g')
				.attr('class', 'x2 axis')
				.attr("transform", "translate(0, " + height + ")")
				.call(x2Axis)
				.selectAll('line')
				.each(function (d) {
					if (d == 0) {
						d3.select(this).attr('class', 'zero-line');
					}
				});
			// append("text")
			// .attr("y", 20)
			// .attr("x", width)
			// .attr("dy", ".71em")
			// .style("text-anchor", "end")
			// .attr("font-size", "14px")
			// .attr("fill", "#666")
			// .text(dvc.bar.xAxisLabel);

			svg
				.append('g')
				.attr('transform', 'translate(0,' + height + ')')
				.append('text')
				.attr('x', width + margin.left)
				.attr('y', 35)
				.attr('text-anchor', 'end')
				.attr('class', 'axis--label')
				.text(dvc.bar.xAxisLabel);



			//create y axis, if x axis doesn't start at 0 drop x axis accordingly
			g.append('g')
				.attr('class', 'y3 axis')
				.attr('transform', function (d) {
					if (x2Domain[0] != 0) {
						return 'translate(' + (0) + ',0)'
					} else {
						return 'translate(' + 0 + ', 0)'
					}
				})
				.call(y3Axis);

			d3.selectAll(".y3 .tick text")
				.call(wrap, margin.left - 10);
			console.log(graphic_data)
			var defaultData = graphic_data.filter(function (d) { return d.AREACD == dvc.bar.defaultBarVar })
			stack3 = d3.stack().keys(defaultData.map(function (d) { return d[dvc.bar.stackVar] }))
			transposedData = []
			varnames3.forEach(function (d) {
				var tmp_obj = {}
				tmp_obj.key = d
				defaultData.forEach(function (k) {
					tmp_obj[k[dvc.bar.stackVar]] = k[d]
				})
				transposedData.push(tmp_obj)
				// console.log(defaultData.map(function(k) {
				// 	var tmp_obj = {}
				// 	tmp_obj[k[dvc.bar.stackVar]] = k[d]
				// 	return tmp_obj
				// }))
			})

			bargx = g.append('g').selectAll('rect')
				.data(stack3(transposedData))
				.enter()
				.append('g')
				.attr("class", function (d) { return "bar-group " + d.key })
				.attr("fill", "#222")
				.attr("opacity", 0.05)

			bargx.selectAll('rect')
				.data(function (d) { return d })
				.enter()
				.append('rect')
				.attr("class", "bar")
				.attr("width", width)
				.attr("x", x2(0))
				.attr("y", function (d) {
					return y3(d.data.key);
				})
				.attr("height", y3.bandwidth())



			// create default bars
			barg3 = g.append('g').selectAll('rect')
				.data(stack3(transposedData))
				.enter()
				.append('g')
				.attr("class", function (d) { return "bar-group " + d.key })
				.attr("fill", function (d) { return dvc.bar.colour_palette[dvc.bar.legendLabels[d.key]] })

			barg3.selectAll('rect')
				.data(function (d) { return d })
				.enter()
				.append('rect')
				.attr("class", "bar")
				.attr("width", function (d) { return x2(d[1] - d[0]) })
				.attr("x", function (d) { return x2(d[0]) })
				.attr("y", function (d) {
					return y3(d.data.key);
				})
				.attr("height", y3.bandwidth())

			// add GB wide lines to bar chart for context. dvc.bar.lineVar must be an AREACD in data
			contextLines = graphic_data.filter(function (d) { return d.AREACD == dvc.bar.lineVar })[0]
			g.append('g').attr("class", "lines").selectAll("line")
				.data(d3.entries(contextLines))
				.enter()
				.append("line")
				.attr("class", "line")
				.attr("x1", function (d) { return x2(d.value) })
				.attr("x2", function (d) { return x2(d.value) })
				.attr("y1", function (d) { return y3(d.key) })
				.attr("y2", function (d) { return y3(d.key) + y3.bandwidth() })
				.attr("stroke", function (d) { return dvc.bar.lineColour })
				// .attr("stroke", "#053D58")
				.attr("stroke-width", 2);

			// add g tags for each bar's suppression text
			suppText = g.append('g').attr("class", "suppressed-group").selectAll("text")
				.data(varnames3)
				.enter()
				.append('g')
				.attr("transform", function (d) { return "translate(" + (x2(0) + 5) + "," + (y3(d) + heightper / 2) + ")" });

			// add background box for text
			suppText.append("rect")
				.attr("class", function (d) { return "suppressed box " + d.split(' ')[1] })
				.attr("fill", "white")
				.attr("x", 0)
				.attr("y", -12)
				.attr("width", 182)
				.attr("height", 18)
				.style("opacity", 0);

			// add text tag for suppression text
			suppText.append('text')
				.attr("class", function (d) { return "suppressed text " + d.split(' ')[1] })
				.text("suppressed due to small sample")
				.style("font-size", "14px")
				.style("opacity", 0);

			var legend = d3.select('ul.key')
				.selectAll('g')
				.data(d3.entries(dvc.bar.legendLabels))
				.enter()
				.append('li')
				.attr("class", function (d) {
					return "key-" + d.value
				})

			legend.append('b')
				.style('background-color', function (d) {
					return dvc.bar.colour_palette[d.value]
				})

			legend.append('label')
				.html(function (d) {
					return d.key;
				});

			var manualLabel = d3.select('ul.key').append('li')
			manualLabel.append('b')
				.classed('line', true)
				.style('background-color', dvc.bar.lineColour)

			manualLabel.append('label')
				.html(dvc.bar.lineLegendLabel)





			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.1, // ems
						// y = text.attr("y"),
						x = text.attr("x"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr('x', x);
					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan").attr('x', x).attr("dy", lineHeight + "em").text(word);
						}
					}
					var breaks = text.selectAll("tspan").size();
					text.attr("y", function () { return -6 * (breaks - 1); });
				});

			}






			//add source
			d3.select("#source").text("Source: " + dvc.bar.sourceText);

			// Adding a missing (visuallyhidden) label to the search input
			d3.select('input.chosen-search-input').attr('id', 'chosensearchinput')
			d3.select('div.chosen-search').insert('label', 'input.chosen-search-input').attr('class', 'visuallyhidden').attr('for', 'chosensearchinput').html("Type to select a town")


			if (pymChild) {
				pymChild.sendHeight();
			}

		} //end drawgraphic3.





		// updates the bars to be the ones from current area code
		function updateBars(code) {

			// get all the rows in graphic_data concerning current AREACD.
			var data = graphic_data.filter(function (d) { return d.AREACD == code })

			console.log(data);
			// "transpose" this data into the right format for stacking
			transposedData = []
			varnames.forEach(function (d) {
				var tmp_obj = {}
				tmp_obj.key = d
				data.forEach(function (k) {
					tmp_obj[k[dvc.bar.stackVar]] = k[d]
				})
				transposedData.push(tmp_obj)
			})

			console.log(transposedData)

			transposedData2 = []

			varnames2.forEach(function (d) {
				var tmp_obj2 = {}
				tmp_obj2.key = d
				data.forEach(function (k) {
					tmp_obj2[k[dvc.bar.stackVar]] = k[d]
				})
				transposedData2.push(tmp_obj2)
			})


			transposedData3 = []

			varnames3.forEach(function (d) {
				var tmp_obj2 = {}
				tmp_obj2.key = d
				data.forEach(function (k) {
					tmp_obj2[k[dvc.bar.stackVar]] = k[d]
				})
				transposedData3.push(tmp_obj2)
			})

			console.log(transposedData2)

			function addNewColumn(myArray) {
				myArray.forEach((element, index) => {
					if (index < 4) {
						element.column3 = "value1"
					} else if (index < 8) {
						element.column3 = "value2"
					} else {
					element.column3 =
						"value3"

					}
				});
			}


			addNewColumn(transposedData);
			console.log(transposedData)
			// bind new data to bars
			barg.data(stack(transposedData))
			barg2.data(stack2(transposedData2))
			barg3.data(stack3(transposedData3))

			console.log(transposedData)

			// when data is very different for certain areas, it might be necessary to transition to a new x axis
			// get previous upper limit of x domain
			var prevMax = x.domain()[1];

			// set new upper limit of x domain as newMax
			// by default it's the same as the old one
			var newMax = x.domain()[1];
			// here's an example of some code to change the axis in specific parts of London
			// if (code == 'E09000001' || code == 'E09000030') {
			// 	var newMax = 40;
			// } else if (code.slice(0,3) == 'E09') {
			// 	var newMax = 16;
			// } else {
			// 	var newMax = 5;
			// }

			if (prevMax == newMax) { // no change in domain so just move the bars
				barg.selectAll('rect')
					.data(function (d) { return d })
				moveBars(1000)

				barg2.selectAll('rect')
					.data(function (d) { return d })
				moveBars(1000)

				barg3.selectAll('rect')
					.data(function (d) { return d })
				moveBars(1000)
			} else {

				// change in domain so change x.domain, move axis, contexual lines, data bars
				x.domain([0, newMax])

				var transitionTime = 200;

				d3.selectAll('.x.axis')
					.transition() // transition x axis
					.duration(transitionTime)
					.call(xAxis)
					.on("start", function () {
						d3.selectAll("line.line") // transition contextual lines at same time as axis
							.transition()
							.duration(transitionTime)
							.attr("x1", function (d) { return x(d.value) })
							.attr("x2", function (d) { return x(d.value) })
							.on("start", function () {
								moveBars(transitionTime) // transition bars with axis
							})
					})
					.on("end", function () {
						barg.selectAll('rect')
							.data(function (d) { return d })
						moveBars(5000)
					})

			} // end if else statement

			function moveBars(t) {
				barg.selectAll('rect')
					.transition()
					.duration(t)
					.attr("width", function (d) { return x(d[1]) - x(d[0]) })
					.attr("x", function (d) { return x(d[0]) })

				barg2.selectAll('rect')
					.transition()
					.duration(t)
					.attr("width", function (d) { return x(d[1]) - x(d[0]) })
					.attr("x", function (d) { return x(d[0]) })

				barg3.selectAll('rect')
					.transition()
					.duration(t)
					.attr("width", function (d) { return x(d[1]) - x(d[0]) })
					.attr("x", function (d) { return x(d[0]) })

			}
		}
	}

} else {

	//provide fallback for browsers that don't support webGL
	d3.select('#map').remove();
	d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>")

}
