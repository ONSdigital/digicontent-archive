
//test if browser supports webGL

if(Modernizr.webgl) {

	//setup pymjs
	var pymChild = new pym.Child();

	//Load data and config file
	d3.queue()
		.defer(d3.csv, "data/data.csv")
		.defer(d3.json, "data/config.json")
		.defer(d3.json, "data/geog.json")
		.defer(d3.json, "data/parks.json")
		.defer(d3.json, "data/ltla2022.json")
		.await(ready);


	function ready (error, data, config, geog, parks, ltla){

		//Set up global variables
		dvc = config.ons;
		oldAREACD = "";
		selected = false;
		firsthover = true;

		//Get column names
		variable = null;
		for (var column in data[0]) {
			if (column == 'AREACD') continue;
			if (column == 'AREANM') continue;
			variable = column;
		}

		//set title of page
		//Need to test that this shows up in GA
		document.title = dvc.maptitle;

	

		//Set up number formats
		displayformat = d3.format("." + dvc.displaydecimals + "f");
		legendformat = d3.format("." + dvc.legenddecimals + "f");

		//set up basemap
		map = new mapboxgl.Map({
		  container: 'map', // container id
		  style: 'data/style.json', //stylesheet location //includes key for API
		  bounds:[[-8.28764657662947,49.882346320559265],[3.6733352758074886,55.811091377010456]],
		  minZoom: 3.5,//
		  maxZoom: 13, //
		  attributionControl: false //
		});
		//add fullscreen option
		//map.addControl(new mapboxgl.FullscreenControl());

		// Add zoom and rotation controls to the map.
		// map.addControl(new mapboxgl.NavigationControl());

		// Disable map rotation using right click + drag
		map.dragRotate.disable();

		// Disable map rotation using touch rotation gesture
		map.touchZoomRotate.disableRotation();

		// Add geolocation controls to the map.
		// map.addControl(new mapboxgl.GeolocateControl({
		// 	positionOptions: {
		// 		enableHighAccuracy: true
		// 	}
		// }));

		//add compact attribution
		map.addControl(new mapboxgl.AttributionControl({
			compact: true
		}));

		// if touch screen, disable stuff
		// if ($('html').hasClass('touch')) {
			map.scrollZoom.disable();
			map.dragPan.disable();
			map.doubleClickZoom.disable();
			map.boxZoom.disable();
			map.keyboard.disable();
		// };

		//get location on click
		// d3.select(".mapboxgl-ctrl-geolocate").on("click",geolocate);

		//addFullscreen();

		defineBreaks();

		setupScales();

		//now ranges are set we can call draw the key
		createKey(config);

		//convert topojson to geojson
		for(key in geog.objects){
			var areas = topojson.feature(geog, geog.objects[key])
		}

		for(key in parks.objects){
			var np = topojson.feature(parks,parks.objects[key])
		}

		for(key in ltla.objects){
			var la = topojson.feature(ltla,ltla.objects[key])
		}

		//Work out extend of loaded geography file so we can set map to fit total extent
		bounds = turf.extent(areas);

		//set map to total extent
		setTimeout(function(){
			map.fitBounds([[bounds[0],bounds[1]], [bounds[2], bounds[3]]])
		},1000);



		//and add properties to the geojson based on the csv file we've read in
		areas.features.map(function(d,i) {
		  if(!isNaN(rateById[d.properties.AREACD]))
		  	{d.properties.fill = color(rateById[d.properties.AREACD])}
		  else {d.properties.fill = '#fff'};
		});

		map.on('load', defineLayers);



		function defineBreaks(){

			rateById = {};
			areaById = {};

			data.forEach(function(d) {
				rateById[d.AREACD] = +d[variable];
				areaById[d.AREACD] = d.AREANM
			}); //change to brackets


			//Flatten data values and work out breaks
			if(config.ons.breaks =="jenks" || config.ons.breaks =="equal") {
				var values =  data.map(function(d) { return +d[variable]; }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);
			};

			if(config.ons.breaks =="jenks") {
				breaks = [];

				ss.ckmeans(values, (dvc.numberBreaks)).map(function(cluster,i) {
					if(i<dvc.numberBreaks-1) {
						breaks.push(cluster[0]);
					} else {
						breaks.push(cluster[0])
						//if the last cluster take the last max value
						breaks.push(cluster[cluster.length-1]);
					}
				});
			}
			else if (config.ons.breaks == "equal") {
				breaks = ss.equalIntervalBreaks(values, dvc.numberBreaks);
			}
			else {breaks = config.ons.breaks;};


			//round breaks to specified decimal places
			breaks = breaks.map(function(each_element){
				return Number(each_element.toFixed(dvc.legenddecimals));
			});

			//work out halfway point (for no data position)
			midpoint = breaks[0] + ((breaks[dvc.numberBreaks] - breaks[0])/2)

		}

		function setupScales() {
			//set up d3 color scales
			if(typeof dvc.varcolour === 'string') {
				color=chroma.scale(dvc.varcolour).colors(dvc.numberBreaks)
				colour=[]
				color.forEach(function(d){colour.push(chroma(d).darken(0.4).saturate(0.6).hex())})
			} else {
				colour = dvc.varcolour;
			}

			//set up d3 color scales
			color = d3.scaleThreshold()
					.domain(breaks.slice(1))
					.range(colour);

		}

		function defineLayers() {
			map.addSource('area', { 'type': 'geojson', 'data': areas });
			map.addSource('park', { 'type':'geojson', 'data': np});
			map.addSource('la', { 'type':'geojson', 'data': la});

			map.addLayer({
				'id': 'area',
				'type': 'fill',
				'source': 'area',
				'touchAction':'none',
				'layout': {},
				'paint': {
					'fill-color': {
						type: 'identity',
						property: 'fill'
					},
					'fill-opacity': dvc.fillOpacity,
					'fill-outline-color': '#ECECEC'
				}
			}, 'place_city');

			map.addLayer({
				"id": "la",
				"type": "line",
				"source": "la",
				"layout": {},
				"paint": {
					"line-color": "#b3b3b3",
					"line-width": 1
				},
				
			}, 'place_city');

			map.addLayer({
				"id": "natpark",
				"type": "line",
				"source": "park",
				"layout": {},
				"paint": {
					"line-color": "#d73027",
					"line-width": 2
				},
				
			}, 'place_city');

			//Get current year for copyright
			today = new Date();
			copyYear = today.getFullYear();
			map.style.sourceCaches['area']._source.attribution = "Contains OS data &copy; Crown copyright and database right " + copyYear;

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


			//test whether ie or not
			// function detectIE() {
			// 	  var ua = window.navigator.userAgent;

			// 	  var msie = ua.indexOf('MSIE ');
			// 	  if (msie > 0) {
			// 		// IE 10 or older => return version number
			// 		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			// 	  }

			// 	  var trident = ua.indexOf('Trident/');
			// 	  if (trident > 0) {
			// 		// IE 11 => return version number
			// 		var rv = ua.indexOf('rv:');
			// 		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			// 	  }

			// 	  var edge = ua.indexOf('Edge/');
			// 	  if (edge > 0) {
			// 		// Edge (IE 12+) => return version number
			// 		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
			// 	  }

			// 	  // other browser
			// 	  return false;
			// }


			// if(detectIE()){
			// 	onMove = onMove.debounce(200);
			// 	onLeave = onLeave.debounce(200);
			// };

			//Highlight stroke on mouseover (and show area information)
			// map.on("mousemove", "area", onMove);

			// Reset the state-fills-hover layer's filter when the mouse leaves the layer.
			// map.on("mouseleave", "area", onLeave);

			//Add click event
			// map.on("click", "area", onClick);




		}


		


		

		function createKey(config){

			d3.select("#keydiv").selectAll("*").remove();

			keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

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
				.attr("transform", "translate(15,0)");

			// In order for the legend rects to match the map colours, the legend
			// needs a background rectangle of the same colour as the map background.
			g2.append("rect")
				.attr("class", "blocks-background")
				.attr("height", dvc.legendRectHeight)
				.attr("x", function(d) { return x(color.domain()[0]); })
				.attr("width", function(d) {
				    var cd = color.domain();
				    return x(cd[cd.length - 1]) - x(cd[0]);
				})
				.style("fill", dvc.backgroundColour);

			g2.selectAll("rect.blocks")
				.data(color.range().map(function(d,i) {
				  return {
					x0: x(color.domain()[i]),
					x1: x(color.domain()[i+1]),
					fill: d
				  };
				}))
			  .enter().append("rect")
				.attr("class", "blocks")
				.attr("height", dvc.legendRectHeight)
				.attr("x", function(d) { return d.x0; })
				.attr("width", function(d) {return d.x1 - d.x0; })
				.style("opacity", dvc.fillOpacity)
				.style("fill", function(d) { return d.fill; });

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

			g2.call(xAxis).append("text")
				.attr("id", "caption")
				.attr("x", -63)
				.attr("y", -20)
				.text("");

			g2.append("rect")
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
			d3.select("#keydiv").append("p").attr("id","keyunit")
			.attr('aria-hidden',true)
			.style("margin-top","-47px")
			.style("margin-left","10px")
			.style("margin-bottom",0)
			.style('font-size','14px').text(dvc.varunit);
			
			extra = d3.select("#keydiv").append('svg').attr('aria-hidden',true)
			.attr("width", keywidth)
			.attr("height",30)
			.append('g')
			.attr("transform", "translate(15,15)");
			
			extra.append('line')
			.attr("x1",0).attr("x2",20).attr("y1",0).attr("y2",0)
			.attr('stroke-width','3px')
			.attr('stroke-linecap','round')
			.attr('stroke',"#d73027")

			extra.append('text')
			.attr('x', 25)
			.text('National Park')
			.attr('font-size','14px')
			.attr('y',5)
	} // Ends create key

	pymChild.sendHeight();

	
}//end ready

} else {

	//provide fallback for browsers that don't support webGL
	d3.select('#map').remove();
	d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>")

}
