// Return the x position of an SVG rectangle, given the left and right x-values
// (in either order) and an x scale.
function rectX(x0, x1, scale) {
	return Math.min(scale(x0), scale(x1));
}

// Return the width of an SVG rectangle, given the left and right x-values
// (in either order) and an x scale.
function rectWidth(x0, x1, scale) {
	return Math.abs(scale(x0) - scale(x1));
}

function getMaleData(areaCode) {
	var data = graphic_data.filter(function(d) {return d.AREACD == areaCode})
	let maleCounts = data.filter(function(d){return d.Method == "Male"})[0]
	return varnames.map(function(d){return {ageBand: d, count: +maleCounts[d]}});
}

function getFemaleData(areaCode) {
	var data = graphic_data.filter(function(d) {return d.AREACD == areaCode})
	let femaleCounts = data.filter(function(d){return d.Method == "Female"})[0]
	return varnames.map(function(d){return {ageBand: d, count: +femaleCounts[d]}});
}

function getMaleData2011(areaCode) {
	var data = graphic_data2011.filter(function(d) {return d.AREACD == areaCode})
	let maleCounts = data.filter(function(d){return d.Method == "Male"})[0]
	return varnames.map(function(d){return {ageBand: d, count: +maleCounts[d]}});
}

function getFemaleData2011(areaCode) {
	var data = graphic_data2011.filter(function(d) {return d.AREACD == areaCode})
	let femaleCounts = data.filter(function(d){return d.Method == "Female"})[0]
	return varnames.map(function(d){return {ageBand: d, count: +femaleCounts[d]}});
}


//test if browser supports webGL

if(Modernizr.webgl) {

	//setup pymjs
	var pymChild = new pym.Child();

	//Load data and config file
	d3.queue()
		.defer(d3.csv, "data/data1961.csv")
		.defer(d3.csv, "data/data2011.csv")
		.defer(d3.json, "data/config.json")
		.defer(d3.json, "data/geog.json")
		.defer(d3.json, "data/mapmask.json")
		.await(ready);


	var leftBarRect, rightBarRect;
	var xAxisLeftG, xAxisRightG;

	function ready (error, data, data2011, config, geog){
		graphic_data = data;

		graphic_data2011 = data2011
		
		//Set up global variables
		dvc = config.ons;
		oldAREACD = "";
		firsthover = true;


		//get column name
		varnames = [];
		for (var column in data[0]) {
			if (column == 'AREACD') continue;
			if (column == 'AREANM') continue;
			if (column == dvc.bar.stackVar) continue;
			if (column == dvc.map.mapVarName) continue;
			//if (column == 'unique') continue;
			varnames.push(column);
		}

		//set title of page
		document.title = dvc.map.maptitle;

		//Make dropdown
		selectlist(data);

		//Set up number formats
		displayformat = d3.format("." + dvc.map.displaydecimals + "f");
		//legendformat = d3.format("." + dvc.map.legenddecimals + "f");
		legendformat = d3.format("s");


		//set up basemap
		map = new mapboxgl.Map({
		  container: 'map', // container id
		  style: 'data/style.json', //stylesheet location
		  center: [-2.5, 54], // starting position
		  zoom: 4.5, // starting zoom
		  maxZoom: 14, //
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
		areaById = {};

		data.forEach(function(d) { countById[d.AREACD] = +eval("d." + dvc.map.mapVarName); areaById[d.AREACD] = d.AREANM});

		//Flatten data values and work out breaks
		var values =  data.map(function(d) { return +eval("d." + dvc.map.mapVarName); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);

		if(dvc.map.breaks =="jenks") {
			breaks = [];

			ss.ckmeans(values, (dvc.map.numberBreaks)).map(function(cluster,i) {
				if(i<dvc.map.numberBreaks-1) {
					breaks.push(cluster[0]);
				} else {
					breaks.push(cluster[0])
					//if the last cluster take the last max value
					breaks.push(cluster[cluster.length-1]);
				}
			});
		}
		else if (dvc.map.breaks == "equal") {
			breaks = ss.equalIntervalBreaks(values, dvc.map.numberBreaks);
		}
		else {breaks = dvc.map.breaks;};


		//round breaks to specified decimal places
		breaks = breaks.map(function(each_element){
			return Number(each_element.toFixed(dvc.map.legenddecimals));
		});

		//work out halfway point (for no data position)
		midpoint = breaks[0] + ((breaks[dvc.map.numberBreaks] - breaks[0])/2)

		//Load colours
		if(typeof dvc.map.varcolour === 'string') {

			//colour = colorbrewer[dvc.map.varcolour][dvc.map.numberBreaks];

			colorScale=chroma.scale(dvc.map.varcolour).colors(dvc.map.numberBreaks)
  			colour=[]
			  colorScale.forEach(function(d){
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
		for(key in geog.objects){
			var areas = topojson.feature(geog, geog.objects[key])
		}

		//Work out extend of loaded geography file so we can set map to fit total extent
		bounds = turf.extent(areas);

		//set map to total extent
		setTimeout(function(){
			map.fitBounds([[bounds[0],bounds[1]], [bounds[2], bounds[3]]])
		},1000);

		//and add properties to the geojson based on the csv file we've read in
		areas.features.map(function(d,i) {

		  d.properties.fill = colorScale(countById[d.properties.AREACD])
		});


		map.on('load', function() {
			
			map.addSource('area', { 'type': 'geojson', 'data': areas,  promoteId: 'AREACD'  });

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
					  'fill-opacity': 0.0,
					  'fill-outline-color': '#000',
				  }
			  });

			//Get current year for copyright
			today = new Date();
			copyYear = today.getFullYear();
			map.style.sourceCaches['area']._source.attribution = "Contains OS data &copy; Crown copyright and database right " + copyYear;

			map.addLayer({
				"id": "state-fills-outline",
				"type": "line",
				"source": "area",
				"layout": {},
				"paint": {
					"line-color": "#000",
					"line-width": 0.3,
					"line-opacity": 0.7
				}
			}, "water");

			map.addLayer({
				"id": "state-fills-hover",
				"type": "line",
				"source": "area",
				"layout": {},
				"paint": {
					"line-color": "#a40071",
					'line-width': [
						'case',
						['==', ['feature-state', 'hover'], true],
						2,
						0]
				},
			//	"filter": ["==", "AREACD", ""]
			}, "water");

			  map.addLayer({
				  'id': 'area_labels',
				  'type': 'symbol',
				  'source': 'area',
				  'minzoom': 10,
				  'layout': {
					  "text-field": '{AREANM}',
					  "text-font": ["Open Sans","Arial Unicode MS Regular"],
					  "text-size": 14
				  },
				  'paint': {
					  "text-color": "#666",
					  "text-halo-color": "#fff",
					  "text-halo-width": 1,
					  "text-halo-blur": 1
				  }
			  });

			  map.loadImage(
				"images/bluegreen-pattern.png",
				  function (err, image) {
					  //Throw error
					  if (err) throw err;

					  //add to map style
					  map.addImage("bluegreen-pattern", image);

				  }
			)

			map.addSource('mask', { 'type': 'geojson', 'data': "data/mapmask.json" })
			
			map.addLayer({
			'id': 'mask',
			'type': 'fill',
			'source': 'mask',
			'layout': {},
			'paint': {
				'fill-color': 'rgb(242,243,240)'
			}}, 
			'water'
			);


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
			d3.select(".mapboxgl-ctrl-geolocate").on("click",geolocate);

		});


		function onMove(e) {
			newAREACD = e.features[0].properties.AREACD;

			if(newAREACD != oldAREACD) {

				map.setFeatureState(
					{ source: 'area', id: oldAREACD },
					{ hover: false }
					);
				
				map.setFeatureState(
					{ source: 'area', id: newAREACD },
					{ hover: true }
					);				

				selectArea(newAREACD);
				setAxisVal(newAREACD);

				oldAREACD = newAREACD;

				//console.log(newAREACD)

			}

			
	};



		function onLeave() {
				
				map.setFeatureState(
					{ source: 'area', id: oldAREACD },
					{ hover: false }
					);

				oldAREACD = "";
				$("#areaselect").val(null).trigger("chosen:updated");
				hideaxisVal();
				updateBars(dvc.bar.defaultBarVar)

		};

		function onClick(e) {
				
				
			newAREACD = e.features[0].properties.AREACD;

			if(newAREACD != oldAREACD) {

				map.setFeatureState(
					{ source: 'area', id: oldAREACD },
					{ hover: false }
					);
				
				map.setFeatureState(
					{ source: 'area', id: newAREACD },
					{ hover: true }
					);

				selectArea(newAREACD);
				setAxisVal(newAREACD);

				oldAREACD = newAREACD;
			}

			disableMouseEvents();
	};

		// function onClick(e) {
			
		// 		disableMouseEvents();
		// 		newAREACD = e.features[0].properties.AREACD;

		// 		if(newAREACD != oldAREACD) {
		// 			oldAREACD = e.features[0].properties.AREACD;
		// 			map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);

		// 			d3.selectAll(".cellsselected").classed("cellsselected",false)
		// 			d3.select(".cell" + e.features[0].properties.AREACD).classed("cellsselected",true)

		// 			selectArea(e.features[0].properties.AREACD);
		// 			setAxisVal(e.features[0].properties.AREACD);
		// 		}

		// 		dataLayer.push({
	    //     'event':'mapClickSelect',
	    //     'selected': newAREACD
	    // })
		// };

		function disableMouseEvents() {
				map.off("mousemove", "area", onMove);
				map.off("mouseleave", "area", onLeave);
			d3.selectAll(".cells path").style("pointer-events","none")

		}

		function enableMouseEvents() {
				map.on("mousemove", "area", onMove);
				map.on("click", "area", onClick);
				map.on("mouseleave", "area", onLeave);
			d3.selectAll(".cells path").style("pointer-events","all")
		}

		function selectArea(code) {
			//console.log(code)
			$("#areaselect").val(code).trigger("chosen:updated");
			//console.log(code)
			updateBars(code)
		}

		$('#areaselect').on('select2:unselect', function () {
	        dataLayer.push({
	            'event': 'deselectCross',
	            'selected': 'deselect'
	        })
	});

		function zoomToArea(code) {

			specificpolygon = areas.features.filter(function(d) {return d.properties.AREACD == code})

			specific = turf.extent(specificpolygon[0].geometry);

			map.fitBounds([[specific[0],specific[1]], [specific[2], specific[3]]], {
  				padding: {top: 150, bottom:150, left: 100, right: 100}
			});

		}

		function resetZoom() {

			map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);

		}


		function setAxisVal(code) {
			d3.select("#currLine")
				.style("opacity", function(){if(!isNaN(countById[code])) {return 1} else{return 0}})
				.transition()
				.duration(400)
				.attr("x1", function(){if(!isNaN(countById[code])) {return xKey(countById[code])} else{return xKey(midpoint)}})
				.attr("x2", function(){if(!isNaN(countById[code])) {return xKey(countById[code])} else{return xKey(midpoint)}});


			d3.select("#currVal")
				.text(function(){if(!isNaN(countById[code]))  {return displayformat(countById[code])} else {return "Data unavailable"}})
				.style("opacity",1)
				.transition()
				.duration(400)
				.attr("x", function(){
					if(!isNaN(countById[code])) {
						//console.log(xKey(countById[code]))
						return xKey(countById[code])
					} else {
						return xKey(midpoint)
					}
				});

		}

		function hideaxisVal() {
			d3.select("#currLine")
				.style("opacity",0)

			d3.select("#currVal").text("")
				.style("opacity",0)
		}

		function createKey(){

			keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

			var svgkey = d3.select("#keydiv")
				.append("svg")
				.attr("id", "key")
				.attr("width", keywidth)
				.attr("height",65);


			var colorScale = d3.scaleThreshold()
			   .domain(breaks)
			   .range(colour);

			// Set up scales for legend
			xKey = d3.scaleLinear()
				.domain([breaks[0], breaks[dvc.map.numberBreaks]]) /*range for data*/
				.range([0,keywidth-30]); /*range for pixels*/


			var xAxisKey = d3.axisBottom(xKey)
				.tickSize(15)
				.tickValues(colorScale.domain())
				.tickFormat(legendformat);

			var g2 = svgkey.append("g").attr("id","horiz")
				.attr("transform", "translate(15,30)");


			keyhor = d3.select("#horiz");

			g2.selectAll("rect")
				.data(colorScale.range().map(function(d,i) {

				  return {
					x0: i ? xKey(colorScale.domain()[i+1]) : xKey.range()[0],
					x1: i < colorScale.domain().length ? xKey(colorScale.domain()[i+1]) : xKey.range()[1],
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
				.attr("x1", xKey(10))
				.attr("x2", xKey(10))
				.attr("y1", -10)
				.attr("y2", 8)
				.attr("stroke-width","2px")
				.attr("stroke","#000")
				.attr("opacity",0);

			g2.append("text")
				.attr("id", "currVal")
				.attr("x", xKey(10))
				.attr("y", -15)
				.attr("fill","#000")
				.text("");



			keyhor.selectAll("rect")
				.data(colorScale.range().map(function(d, i) {
				  return {
					x0: i ? xKey(colorScale.domain()[i]) : xKey.range()[0],
					x1: i < colorScale.domain().length ? xKey(colorScale.domain()[i+1]) : xKey.range()[1],
					z: d
				  };
				}))
				.attr("x", function(d) { return d.x0; })
				.attr("width", function(d) { return d.x1 - d.x0; })
				.style("fill", function(d) { return d.z; });

			keyhor.call(xAxisKey).append("text")
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
				.attr("x",xKey(0));


			if(dvc.map.dropticks) {
				d3.select("#horiz").selectAll("text")
					.attr("transform",function(d,i){
						// if there are more that 4 breaks, so > 5 ticks, then drop every other.
						if(i % 2){return "translate(0,10)"} }
					);

			}
			//Temporary	hardcode unit text
			dvc.map.unittext = "change in life expectancy";

			d3.select("#keydiv").append("p")
			.attr("id","keyunit")
			.style("margin-top","-10px")
			.style("margin-left","10px")
			.text(dvc.map.varunit)
			// .attr("text-anchor", "end");

	} // Ends create key

	function addFullscreen() {

		mapheight = (d3.select("#map").style("height"));
		d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight)

	}

	function setbodyheight() {
		d3.select("#map").style("height","100%");

		document.addEventListener('webkitfullscreenchange', exitHandler, false);
		document.addEventListener('mozfullscreenchange', exitHandler, false);
		document.addEventListener('fullscreenchange', exitHandler, false);
		document.addEventListener('MSFullscreenChange', exitHandler, false);

	}


	function exitHandler() {

		console.log("shrink");
			if (document.webkitIsFullScreen === false)
			{
				shrinkbody();
			}
			else if (document.mozFullScreen === false)
			{
				shrinkbody();
			}
			else if (document.msFullscreenElement === false)
			{
				shrinkbody();
			}
		}

	function shrinkbody() {
		d3.select("#map").style("height",mapheight);
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
	  point = map.project([crd.longitude,crd.latitude]);

	  //then check what features are underneath
	  var features = map.queryRenderedFeatures(point);

	  //then select area
	  disableMouseEvents();

	  map.setFeatureState(
		{ source: 'area', id: oldAREACD },
		{ hover: false }
		);

	  map.setFeatureState(
		{ source: 'area', id: features[0].properties.AREACD },
		{ hover: true }
		);


		d3.select(".cell" + features[0].properties.AREACD).classed("cellsselected",true)

	  selectArea(features[0].properties.AREACD);
	  setAxisVal(features[0].properties.AREACD);


	};

		function selectlist(datacsv) {

			function getunique(arr) {
				console.log(arr)
				return arr.filter(function(item, pos) {
					if ([dvc.bar.defaultBarVar, dvc.bar.lineVar].indexOf(item) > -1) {
						return false;
					}
					return arr.indexOf(item) == pos
				} )
			}

			var areacodes =  datacsv.map(function(d) { return d.AREACD; });
			//var areacodesunique = getunique(areacodes);
			var areacodesunique = areacodes;
			var areanames =  datacsv.map(function(d) { return d.AREANM; });
			//var areanamesunique = getunique(areanames)
			var areanamesunique = areanames
			var menuarea = d3.zip(areanamesunique,areacodesunique).sort(function(a, b){ return d3.ascending(a[0], b[0]); });
			
			
			var menuarea = menuarea.filter((element, index) => {
				return index % 2 === 0;
					
			});
			

			// Build option menu for occupations
			var optns = d3.select("#selectNav").append("div").attr("id","sel").append("select")
				.attr("id","areaselect")
				.attr("style","width:98%")
				.attr("class","chosen-select");


			optns.append("option")
				.attr("value","first")
				.text("");

			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function(d){ return d[1]})
				.text(function(d){ return d[0]});

			myId=null;

			$('#areaselect').chosen({width: "98%", allow_single_deselect:true}).on('change',function(evt,params){

					if(typeof params != 'undefined') {
						
						console.log(params);

							disableMouseEvents();

							map.setFeatureState(
								{ source: 'area', id: oldAREACD },
								{ hover: false }
								);						

							map.setFeatureState(
								{ source: 'area', id: $('#areaselect').val() },
								{ hover: true }
								);

							d3.select(".cell" + params.selected).classed("cellsselected",true)
							selectArea(params.selected);
							setAxisVal(params.selected);

							zoomToArea(params.selected);

							dataLayer.push({
									'event': 'mapDropSelect',
									'selected': params.selected
							})

							oldAREACD = $('#areaselect').val();

					}
					else {

						map.setFeatureState(
							{ source: 'area', id: oldAREACD },
							{ hover: false }
							);

							d3.select(".cellsselected").classed("cellsselected",false)

							enableMouseEvents();
							hideaxisVal();
							onLeave();
							resetZoom();
					}

			});

	};

		drawGraphic() // draw the bar chart on the right


		function drawGraphic(){
			 clicked = false;

				var svg = d3.select("#graphic").select("svg"),
				  margin = dvc.bar.barMargin
					svgwidth =  parseInt(svg.style("width"));

				// get the height from CSS styling of map and key. Probably more robust to have all height stylings come from an integer in the config.
				var mapheight = parseInt(d3.select('#map').style('height').slice(0,-2))
				//var keyheight = parseInt(d3.select('#keydiv').style('height').slice(0,-2))
				height = mapheight - margin.top - margin.bottom + 16 // 16 for the height of the legend. If you need a legend on two lines this needs a better solution.
				heightper = height / varnames.length
				width = svgwidth - margin.left - margin.right;

				// clear out existing graphics
				// graphic.selectAll("*").remove();
				// keypoints.selectAll("*").remove();
				// footer.selectAll("*").remove();

				xRight = d3.scaleLinear()
					.range([width/2, width]);

				xLeft = d3.scaleLinear()
					.range([width/2, 0])

				var y = d3.scaleBand()
					.rangeRound([height, 0])
					.paddingInner(0.05);

				y.domain(varnames)

				var yAxis = d3.axisLeft(y)

				xAxisRight = d3.axisBottom(xRight)
					.tickSize(-height, 0, 0);
				
				xAxisLeft = d3.axisBottom(xLeft)
					.tickSize(-height, 0, 0);

				//specify number or ticks on x axis - does it for the chart width not the window
				if (width <= dvc.bar.mobileBreakpoint) {
					
					xAxisRight.ticks(dvc.bar.x_num_ticks_sm_md[0])
					xAxisLeft.ticks(dvc.bar.x_num_ticks_sm_md[0])
				} else {
					xAxisRight.ticks(dvc.bar.x_num_ticks_sm_md[1])
					xAxisLeft.ticks(dvc.bar.x_num_ticks_sm_md[1])
				}

				//remove the map div if it's mobile - HACKY
				if(parseInt(d3.select('body').style("width"))<=600){

					d3.selectAll("#map").remove()
				}

				// parse data into columns
				bars = {};
				graphic_data.forEach( function(d) {
					// add an entry to bars with AREACD as
					bars[d.AREACD] = {}
					bars[d.AREACD]["AREANM"] = d.AREANM
					bars[d.AREACD]["bars_data"] = []
				})

				// graphic_data.forEach( function(d) { // for each row of graphic data
				// 	// get data in the row into a tmp_array
				// 	var tmp_array = [];
				// 	for (var varname in d) {
				// 		if (varnames.indexOf(varname) > -1) { // check if varname is one of the variables to go on the bar chart
				// 			tmp_array.push({varname: +d[varname]});
				// 		}
				// 	}
				// 	// push the tmp_array to the right spot in bars
				// 	bars[d.AREACD]["bars_data"].push(tmp_array)

				// });

	            dataMale = getMaleData(dvc.bar.defaultBarVar);
	            dataFemale = getFemaleData(dvc.bar.defaultBarVar);

				dataMale2011 = getMaleData2011(dvc.bar.defaultBarVar);
				dataFemale2011 = getFemaleData2011(dvc.bar.defaultBarVar);

				//y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually

	            var xMax = d3.max([d3.max(dataMale.map(function(d){return d.count})),
	                               d3.max(dataFemale.map(function(d){return d.count})),
								   d3.max(dataMale2011.map(function(d){return d.count})),
								   d3.max(dataFemale2011.map(function(d){return d.count}))]);
	            var xDomain = [0, xMax];

				xRight.domain(xDomain);
				xLeft.domain(xDomain);

				d3.select("#buttonid").on("click", function() {
					saveSvgAsPng(document.getElementById("chart"), "diagram.png")
				});

				//create svg for chart
				var g = svg
					.style("background-color", "#fff")
					// .attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					g.append("rect")
						.attr("class", "svgRect")
						.attr("width", width)
						.attr("height", height)
						.attr("fill", "transparent")

					xAxisRightG = g.append('g')
						.attr('class', 'x axis')
						.attr("transform", "translate( 0 , " + height + ")")
						.call(xAxisRight)

					xAxisLeftG = g.append('g')
						.attr('class', 'x axis left')
						.attr("transform", "translate( 0 , " + height + ")")
						.call(xAxisLeft)

					// add axis label
					g.append('g')
						.attr('class', 'x axis')
						.attr("transform", "translate( 0 , " + height + ")")
						.append("text")
						.attr("y", 20)
						.attr("x", width)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.attr("font-size", "12px")
						.attr("fill", "#666")
						.text(dvc.bar.xAxisLabel);




				//create y axis, if x axis doesn't start at 0 drop x axis accordingly
				g.append('g')
					.attr('class', 'y axis')
					.attr('transform', function(d) {
						if (xDomain[0] != 0) {
							return 'translate(' + (0) + ',0)'
						} else {
							return 'translate(' + 0 + ', 0)'
						}
					})
					.call(yAxis);

					d3.selectAll(".y .tick text")
						.call(wrap, margin.left-10);
						
					

				rightbarg = g.append('g')
				.attr("class", "right bars")

				leftbarg = g.append("g")
				.attr("class", "left bars")


	            rightBarRect = rightbarg.selectAll('rect')
	                .data(dataFemale)
	                .enter()
	                .append('rect')
	                //.attr("class", function(d) {return "bar-group " + "Female"})
	                .attr("fill", dvc.bar.colour_palette[1])
					.attr("opacity", 0.7)
	                .attr("width", function(d) { return rectWidth(0, d.count, xRight) })
	                .attr("x", function(d) {return rectX(0, d.count, xRight)})
	                .attr("y", function(d) {return y(d.ageBand)})
	                .attr("height", y.bandwidth());

	            leftBarRect = leftbarg.selectAll('rect')
	                .data(dataMale)
	                .enter()
	                .append('rect')
	                //.attr("class", function(d) {return "bar-group " + "Male"})
	                .attr("fill", dvc.bar.colour_palette[0])
					.attr("opacity", 0.7)
	                .attr("width", function(d) { return rectWidth(0, d.count, xLeft) })
	                .attr("x", function(d) {return rectX(0, d.count, xLeft)})
	                .attr("y", function(d) {return y(d.ageBand)})
	                .attr("height", y.bandwidth());

				//Thick center line

				g.append("line")
						.attr("x1", function() {return xLeft(0)})
						.attr("y1", height)
						.attr("x2", function() {return xLeft(0)})
						.attr("y2",0)
						.attr("stroke", "black")

				//male label and border (untidy could do better)

				g.append("text")
						.attr("x", 50)
						.attr("y", 25)
						.attr("stroke", "#FFFFFF")
						.attr("stroke-width", "4px")
						.text("Male")

				g.append("text")
						.attr("x", 50)
						.attr("y", 25)
						.text("Male")

				g.append("text")
						.attr("x", width - 100)
						.attr("y", 25)
						.attr("stroke", "#FFFFFF")
						.attr("stroke-width", "4px")
						.text("Female")

				g.append("text")
						.attr("x", width - 100)
						.attr("y", 25)
						.text("Female")

				// add 2011 lines to bar chart for context. must be an AREACD in data
				
				rightlineg = g.append('g')
				.attr("class", "right lines")

				leftlineg = g.append("g")
				.attr("class", "left lines")

				rightline = rightlineg.selectAll('line')
					.data(dataFemale2011)
					.enter()
					.append("line")
					.attr("class", "line")
					.attr("x1", function(d) { return xRight(d.count) })
					.attr("x2", function(d) { return xRight(d.count) })
					.attr("y1", function(d) { return y(d.ageBand)})
					.attr("y2", function(d) { return y(d.ageBand) + y.bandwidth() })
					.attr("stroke", function(d) { return dvc.bar.lineColour})
					// .attr("stroke", "#053D58")
					.attr("stroke-width", 3);

				leftline = leftlineg.selectAll('line')
					.data(dataMale2011)
					.enter()
					.append("line")
					.attr("class", "line")
					.attr("x1", function(d) { return xLeft(d.count) })
					.attr("x2", function(d) { return xLeft(d.count) })
					.attr("y1", function(d) { return y(d.ageBand)})
					.attr("y2", function(d) { return y(d.ageBand) + y.bandwidth() })
					.attr("stroke", function(d) { return dvc.bar.lineColour})
					// .attr("stroke", "#053D58")
					.attr("stroke-width", 3);

					

				// add g tags for each bar's suppression text
				suppText = g.append('g').attr("class", "suppressed-group").selectAll("text")
					.data(varnames)
					.enter()
					.append('g')
					.attr("transform", function(d) { return "translate(" + (xRight(0) + 5) + "," + (y(d) + heightper/2) +")" } );

				// add background box for text
				suppText.append("rect")
				.attr("class", function(d) {return "suppressed box " + d.split(' ')[1]})
					.attr("fill", "white")
					.attr("x", 0)
					.attr("y", -12)
					.attr("width", 182)
					.attr("height", 18)
					.style("opacity", 0);

				// add text tag for suppression text
				suppText.append('text')
					.attr("class", function(d) { return "suppressed text " + d.split(' ')[1] })
					.text("suppressed due to small sample")
					.style("font-size", "12px")
					.style("opacity", 0);

				var legend = d3.select('ul.key')
					.selectAll('g')
					.data(d3.entries(dvc.bar.legendLabels))
					.enter()
					.append('li')
					.attr("class", function(d) {
						return "key-" + d.value
					})

				//edditted out to remove the legend as it's now on the vis	

				// legend.append('b')
				// 	.style('background-color', function(d) {
				// 		return dvc.bar.colour_palette[d.value]
				// 	})

				// legend.append('label')
				// 	.html(function(d) {
				// 		return d.key;
				// 	});

				var manualBoxLabel = d3.select('ul.key').append('li')
				manualBoxLabel.append('b')
					.style('background-color', dvc.bar.colour_palette[1])
				
				manualBoxLabel.append('label')
					.html("1961 Population")

				var manualLabel = d3.select('ul.key').append('li')
				manualLabel.append('b')
					.classed('line', true)
					.style('background-color', dvc.bar.lineColour)

				manualLabel.append('label')
					.html(dvc.bar.lineLegendLabel)
					
				d3.selectAll(".axis line").attr("stroke","rgb(102,102,102)")


				function wrap(text, width) {
					text.each(function() {
						var text = d3.select(this),
							words = text.text().split(/\s+/).reverse(),
							word,
							line = [],
							lineNumber = 0,
							lineHeight = 1.1, // ems
							y = text.attr("y"),
							x = text.attr("x"),
							dy = parseFloat(text.attr("dy")),
							tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
						if (words.length > 2) {
							while (word = words.pop()) {
								line.push(word);
								tspan.text(line.join(" "));
								if (tspan.node().getComputedTextLength() > width) {
									if (lineNumber == 0) {
										tspan.attr("dy", dy - 0.55 + "em")
									} else {
										tspan.attr("dy", -dy + 0.55 + "em")
									}
									line.pop();
									tspan.text(line.join(" "));
									line = [word];
									++lineNumber;
									tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (0.55 * lineNumber - dy + 0.55) + "em").text(word);
								}
							}
						} else {
							while (word = words.pop()) {
								line.push(word);
								tspan.text(line.join(" "));
								if (tspan.node().getComputedTextLength() > width) {
									if (lineNumber == 0) {
										tspan.attr("dy", dy - 0.55 + "em")
									} else {
										tspan.attr("dy", -dy + 0.55 + "em")
									}
									line.pop();
									tspan.text(line.join(" "));
									line = [word];
									++lineNumber;
									tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (1.1 * lineNumber - dy + 0.55) + "em").text(word);
								}
							}
						}

					});
				}

				//add source
				d3.select("#source").text("Source: " + dvc.bar.sourceText);

				// Adding a missing (visuallyhidden) label to the search input
				d3.select('input.chosen-search-input').attr('id','chosensearchinput')
				//d3.select('div.chosen-search').insert('label','input.chosen-search-input').attr('class','visuallyhidden').attr('for','chosensearchinput').html("Type to select an area")


				if (pymChild) {
					pymChild.sendHeight();
				}

		} //end drawGraphic()

		// updates the bars to be the ones from current area code
		function updateBars(code) {

	        dataMale = getMaleData(code);
	        dataFemale = getFemaleData(code);
			dataMale2011 = getMaleData2011(code);
	        dataFemale2011 = getFemaleData2011(code);


			var xMax = d3.max([d3.max(dataMale.map(function(d){return d.count})),
						d3.max(dataFemale.map(function(d){return d.count})),
						d3.max(dataMale2011.map(function(d){return d.count})),
						d3.max(dataFemale2011.map(function(d){return d.count}))]);

			//////// "transpose" this data into the right format for stacking
			//////transposedData = []
			//////varnames.forEach( function(d) {
			//////	var tmp_obj = {}
			//////	tmp_obj.key = d
			//////	data.forEach( function(k) {
			//////		tmp_obj[k[dvc.bar.stackVar]] = k[d]
			//////	})
			//////	transposedData.push(tmp_obj)
			//////})

			//////dataMale = transposedData.map(function(d) {return +d.Male})

			// bind new data to bars
			leftBarRect.data(dataMale)
			rightBarRect.data(dataFemale)

			leftline.data(dataMale2011)
			rightline.data(dataFemale2011)

//////			// when data is very different for certain areas, it might be necessary to transition to a new x axis
//////			// get previous upper limit of x domain
//////			var prevMax = xRight.domain();
//////
//////			// set new upper limit of x domain as newMax
//////			// by default it's the same as the old one
//////			var newMax = xRight.domain();
//////			// here's an example of some code to change the axis in specific parts of London
//////			// if (code == 'E09000001' || code == 'E09000030') {
//////			// 	var newMax = 40;
//////			// } else if (code.slice(0,3) == 'E09') {
//////			// 	var newMax = 16;
//////			// } else {
//////			// 	var newMax = 5;
//////			// }

			var prevXMax = xRight.domain()[1];

			if (prevXMax == xMax) { // no change in domain so just move the bars
				moveBars(100)
			} else {
				// change in domain so change x.domain, move axis, contexual lines, data bars
				xLeft.domain([0,xMax])
				xRight.domain([0,xMax])

				var transitionTime = 600;

				xAxisLeftG
					.transition() // transition x axis
					.duration(transitionTime)
					.call(xAxisLeft)

				xAxisRightG
					.transition() // transition x axis
					.duration(transitionTime)
					.call(xAxisRight)
					.on("start", function() {

						moveBars(400)

					})
					// .on("end", function() {
					// 	moveBars(400)
					// })

			} // end if else statement

			function moveBars(t) {
	            rightBarRect
					.transition()
					.duration(t)
	                .attr("width", function(d) { return rectWidth(0, d.count, xRight) })
	                .attr("x", function(d) {return rectX(0, d.count, xRight)});

				leftBarRect
					.transition()
					.duration(t)
	                .attr("width", function(d) { return rectWidth(0, d.count, xLeft) })
	                .attr("x", function(d) {return rectX(0, d.count, xLeft)});

				rightline
					.transition()
					.duration(t)
					.attr("x1", function(d) { return xRight(d.count) })
					.attr("x2", function(d) { return xRight(d.count) })

				leftline
					.transition()
					.duration(t)
					.attr("x1", function(d) { return xLeft(d.count) })
					.attr("x2", function(d) { return xLeft(d.count) })
			}
		}
	}

} else {

	//provide fallback for browsers that don't support webGL
	d3.select('#map').remove();
	d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>")

}


//REMOVE THE STACK CODE AND RE-WRITE TO USE ACTUAL ARRAY BOLLOCKS


