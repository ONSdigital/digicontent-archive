    // Copyright (c) 2013 Ryan Clark
    // https://gist.github.com/rclark/5779673
  
      L.TopoJSON = L.GeoJSON.extend({
      addData: function(jsonData) {    
        if (jsonData.type === "Topology") {
          for (key in jsonData.objects) {
            geojson = topojson.feature(jsonData, jsonData.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }    
        else {
          L.GeoJSON.prototype.addData.call(this, jsonData);
        }
      }  
    });
  
  	//Set-up pym
	pymChild = new pym.Child();

	//Check whether inline svg is supported
	if(Modernizr.inlinesvg) {	
	d3.select("#graphic").remove();
	dvc = {};
	
	dvc.time = "yr17";
	first = true;
	selected=false;
	
	function ready (error, data, config){
	
	data2 = data;
	
	if(config.ons.varcolour instanceof Array) {
		dvc.colour = config.ons.varcolour
	} else {
		dvc.colour = eval("colorbrewer." + config.ons.varcolour);
	}
	
	dvc.curr = config.ons.varload;
	a = 0;
	dvc.unittext = config.ons.varunit[a];
	dvc.label = config.ons.varlabel[a];
	dvc.prefix = config.ons.varprefix[a];

	config2 = config;
		
	if(config.ons.varlabel.length > 1)
		{navigation(config2,data);}
	else {d3.selectAll("#varsel").attr("class","hidden")};
	selectlist(config2,data);
	
	// Work out how many years we have in our dataset; number of rows - area name & code // Look at linechart templates to see how?
	    // parse data into columns
			var cols = -2; // set to -2 as that's the number of non-data columns
		    var values = [];
			allvalues = [];

		    for (var column in data[0]) {
				cols = cols + 1;
		        if (column != 'AREANM' && column != 'AREACD') {
		        values[column] =  data.map(function(d) { return +eval("d." + column); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);
				allvalues = allvalues.concat(values[column]);
				}
			
		    }
			
			
	allvalues.sort(d3.ascending);	
			
	
	//Create a flat array of all the values of earnings / filter out any non-numbers / sort in ascending order ready to pass to jenks algorithm 
	
	if(config.ons.breaks =="jenks")
		{breaks = ss.jenks(allvalues, 5);}
	else {breaks = config.ons.breaks[a];};
	
	//Set-up and create an object variable to hold the data for the currently selected variable and the 
	rateById = {};
	areaById = {};
	
	data.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.time); areaById[d.AREACD] = d.AREANM});
	
		
	var layerx = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',{
	  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB background</a> Contains OS data © Crown copyright 2015'
	});
   
    var map = L.map('map',{maxZoom:10,minZoom:3}),
    
	//Set-up new Topojson layer
	topoLayer = new L.TopoJSON();

	
	//Set-up colour scale
	color = d3.scale.threshold()
			.domain(breaks.slice(1,5))
			.range(dvc.colour);
			
    //Set initial centre view and zoom layer
    map.setView(eval(config.ons.centre), config.ons.zoom).addLayer(layerx)

	map.on("zoomstart", leaveLayer)
	map.on("zoomend", function(){setTimeout(function(){highlightArea()},50)})
	d3.select(".leaflet-top").style("top","70px");
	
	createKey(config);
	
	//Set year
	numb = dvc.time.slice(2)-1;
	 if(numb<8){
				until ="200"+(numb+2)
			} else {
				until ="20"+(numb+2)
			}
				
		if(numb.toString().length==1){
			d3.select("#map").append("div").attr("id","time").text("200" + numb+"-" +  until);
		} else {
			d3.select("#map").append("div").attr("id","time").text("20" + numb+"-" + until);
		}


    $.getJSON('data/geog.json').done(addTopoData);

    function addTopoData(topoData){
      topoLayer.addData(topoData);
      topoLayer.eachLayer(handleLayer);
      topoLayer.addTo(map);
	  
	  var xy = d3.select(".leaflet-overlay-pane").selectAll("path");
  
	  xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",selectArea);
	  

    }


	drawChart(dvc.curr);
	timeSlider();

	
    function handleLayer(layer){
		
		x = layer.feature.properties.AREACD;
		
		fillColor = color(rateById[x]);
		
        layer.setStyle({
		  fillColor: fillColor,
          fillOpacity: 0.7,
          color:'#ccc',
          weight:0.7,
          opacity:1,
		  className: x
        });
	
    }
	
	function selectArea() {

			selected=true;
			myId = d3.select(this).attr("class").split(' ')[0];
			currclass = d3.select(this).attr("class").split(' ')[0];
			
			highlightArea();
			$("#occselect").val(currclass);
			$("#occselect").trigger("chosen:updated");		
			
			d3.select(".leaflet-overlay-pane").selectAll("path").attr("pointer-events","none");
			indexarea = document.getElementById("occselect").selectedIndex;
			pymChild.sendMessage('navigate', indexarea + " " + dvc.time);
	}
	
	
	function enterLayer(){
		currclass = d3.select(this).attr("class").split(' ')[0];
		d3.select('#selected').remove();
		highlightArea();
		
	}

    function highlightArea(){
		
		
		var currpath = d3.select("." + currclass).attr("d");
		
		
		d3.select(".leaflet-overlay-pane").select("svg").append("path")
				.attr("d",currpath)
				.attr("id","selected")
				.attr("class", "arcSelection")
				.attr("pointer-events", "none")
				.attr("fill", "none")
				.attr("stroke", "#b4005a")
				.attr("stroke-width", "2");
		
	
		/* Display name of area*/
		d3.select("#areanm").text(areaById[currclass]);
	
	format=d3.format(".3n")
	
		d3.select("#areainfo").html(function(d,i){if (!isNaN(rateById[currclass]))  {return dvc.prefix + format(rateById[currclass]) + "<span>" + " "+dvc.unittext + "</span>"} else {return "Data unavailable"}});

		d3.select("#line1").attr("opacity",1);
		drawChart(currclass);
    }

    function leaveLayer(){

		d3.select('#selected').remove();
		if(selected==false){
			d3.select("#areanm").text("");
			d3.select("#areainfo").text("");
		}
		
		if(selected==false){
			d3.select("#line1").transition().duration(500).attr("opacity",0);
			//d3.select("#localcircles").selectAll("circle").transition().duration(500).attr("opacity",0);

		}
		
    }
	

	
	function timeSlider() {
	
	//Make a slider so that the user can select the time period that they are interested in
//		d3.select("#mapPane").append("div").attr("id","sliderInc").append("div").attr("id","slider");
//		dvc.low = 1
//		
//		$('#slider').labeledslider({min:0, max:4, values: dvc.low, tickInterval:1,  range: true, step:1, change:function(event,ui){
//			
//			dvc.time = ui.values[0];
//									
//		}}); 
//		
//		labels = ['Mon', 'Tue', 'Wed', 'Thu'];
//		
//		$('#slider').labeledslider( 'option', 'tickLabels', labels );
		
		if($(".container-fluid").width()<500){
			var timeLabels = ["'98", "", "'00", "", "'02", "", "'04", "", "'06", "", "'08", "", "'10", "", "'12", "", "'14"];
		
		} else {
			var timeLabels = ["1998", "", "2000", "", "2002", "", "2004", "", "2006", "", "2008", "", "2010", "", "2012", "", "2014"];
		}
		
		
		$(window).resize(function(){$("#slide").slider('destroy'); initiateSlider()});
		
		d3.select("#timeSlider").append("div").attr("id","slide");
		
		initiateSlider();
		
		function initiateSlider(){
			
			var currVal = dvc.time.substr(2) - 1;
			console.log(currVal);
			$("#slide").slider({
				value:currVal,//Set to whatever the last value was
				tooltip: 'hide',
				step: 1,
				ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
				ticks_labels: timeLabels,
				ticks_snap_bounds: 0
			});
			
			$("#slide").on("change", function(slideEvt) {
				
				dvc.time = "yr" + (slideEvt.value.newValue + 1);
				
				
				updateYear();
			});
		}
		
		d3.select(".footer").remove();
		
		//create link to source				
			d3.select(".container-fluid").append("div").attr("class", "footer").append("p")
				.text("Source: ")
				.append("a")
				.attr("href","http://www.ons.gov.uk/ons/rel/subnational-health4/life-expectancy-at-birth-and-at-age-65-by-local-areas-in-england-and-wales/2012-14/index.html")
				.attr("target", "_blank")
				.html("Regional GVA, ONS");

		
		//setTimeout(function(){$("#slide").slider('setValue', 3)},5000);
			pymChild.sendHeight();
	}
	
	
		
	function drawChart(currid){
		
		function capitalizeFirstLetter(string) {
			if(string.charAt(1) == "a") {
		    	return string.charAt(1).toUpperCase() + string.slice(2);
			} else {
				return string
			}
		}	

		commaSep = d3.format(',')

		time = ["96","97", "98", "99","00", "01", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"]; 
		
		if(first){
			first = false;
			second = true;
			

			//Start drawing chart
			natvalues = config2.ons.average[a];
			natdata = d3.zip(time,natvalues);
			
			var margin = {top: 180, right: 35, bottom: 10, left: 40}; 
			var chart_width = $("#chartPane").width() - margin.left - margin.right;
		
			
			var height = Math.ceil((chart_width * 3) / 4);

		    // clear out existing graphics
		    d3.select("#chartPane").select("svg").remove();
			//keypoints.empty();
//			footer.empty();
			
		    xchart = d3.time.scale()
		        .range([0, chart_width]);
				
				
		    ychart = d3.scale.linear()
		        .range([height, 0]);

		    xchart.domain([d3.time.format("%y").parse(time[0]),d3.time.format("%y").parse(time[time.length-1])]);	
			
		    xAxis = d3.svg.axis()
		        .scale(xchart)
		        .orient("bottom")
		        .tickFormat(function(d,i) {
		           var fmt = d3.time.format("%y");
				   nxtyr = +fmt(d) +1;
		           return '\u2019' + fmt(d);
		        })
				.tickPadding(5)
				.ticks(5);
		    
	        //specify number of ticks on x axis and whether 1st and last data point labels are included
//	        if(graphic.width()<threshold_sm){		
//	            xAxis.tickValues(x.ticks(dvc.optional.x_num_ticks_sm_md_lg[0]).concat( x.domain() ));
//	        } else if (graphic.width() <= threshold_md){
//				xAxis.tickValues(x.ticks(dvc.optional.x_num_ticks_sm_md_lg[1])/*.concat( x.domain() )*/);
//			} else {
//	            xAxis.tickValues(x.ticks(dvc.optional.x_num_ticks_sm_md_lg[2])/*.concat( x.domain() )*/);		
//	        }
		    

		    			    
			//specify number or ticks on y axis
//			if (graphic.width() <= threshold_sm) {
//				yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[0])
//			 } else if (graphic.width() <= threshold_md){
//				yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[1])
//			 } else {
//				yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[2])
//			 }
				
		    //gridlines
		    y_axis_grid = function() { return yAxis; }
			
			fmt = d3.time.format("%y");

			line2 = d3.svg.line()
				.defined(function(natdata) { return !isNaN(natdata[1]); })
		        .x(function(d,i) { return xchart(d3.time.format("%y").parse(natdata[i][0]))})
		        .y(function(d,i) { return ychart(natdata[i][1]); });
				
	
			
		  	//y domain calculations	: taking the maximum of all values
					
			maxVal = d3.max(allvalues);			
			ceiling = Math.ceil(maxVal);	
			minVal = d3.min(allvalues);				
			yDomain = [minVal,ceiling];
				 
		    ychart.domain(yDomain);
			
		    yAxis = d3.svg.axis()
		        .scale(ychart)
		        .orient('left')
				.ticks(5);

		    //create svg for chart
		    svg = d3.select('#chartPane').append('svg')
				        .attr("width", chart_width + margin.left + margin.right)
				        .attr("height", height + margin.top + margin.bottom +30)
				        .append("g")
				        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
					svg.append("text")
						.attr("id","ylabel")
						.attr("transform", "translate(-20,-12)")
						.text(capitalizeFirstLetter(dvc.unittext));
	
					svg.append("text")
						.attr("id","ylabel")
						.attr("x",xchart(d3.time.format("%y").parse(natdata[(cols-1)][0]))+5)
						.attr("y",ychart(natdata[(cols-1)][1])+5)
						.text(config.ons.averagelabel);
			    

					svg.append("rect")
						.attr("class","svgRect")
						.attr("width", chart_width)
						.attr("height", height)

				    svg.append('g')
				        .attr('class', 'y axis')
				        .call(yAxis);

				    svg.append('g')
				        .attr('class', 'y grid')
				        .call(y_axis_grid()
				            .tickSize(-chart_width, 0, 0)
				            .tickFormat('')
				        );
					
					//create x axis, if y axis doesn't start at 0 drop x axis accordingly	
					svg.append('g')
				        .attr('class', 'x axis')
				        .attr('transform', function(d){ 
				        			if(yDomain[0] != 0){
										return 'translate(0,' + (height) + ')'
									} else {
										return 'translate(0,' + height  + ')'
									}
							})
				        .call(xAxis);
				
				//create icon to symbolise break in y axis if required					
				//if(yDomain[0] > 0 && dvc.essential.yAxisBreak == true){
//					var paths = svg.append("defs")
//								.append("g")
//								.attr("id","icon")
//								.append("g");
//								
//							paths.append("polyline")
//								 .attr("points", "2.881,9.54 7.94,5.061 12.341,9.54 17.77,5.061")
//								 .attr("stroke", "#666")
//								 .attr("fill", "none")
//							paths.append("polyline")
//								.attr("points", "2.881,14.54 7.94,10.061 12.341,14.54 17.77,10.061")
//								.attr("stroke", "#666")
//								.attr("fill", "none");
//				  
//						//specify position of icon				  
//						svg.append("g").attr("id","iconpath")
//								.attr("transform","translate(-10,3)")
//								.append("use")
//								.attr("xlink:href","#icon")
//								.attr("x", x(x.domain()[0]))
//								.attr("y", function(){ 
//									if (graphic.width() < threshold_sm) {
//										return y(dvc.essential.yAxisBreak_sm_md_lg[0])
//									} else if (graphic.width() < threshold_md){
//										return y(dvc.essential.yAxisBreak_sm_md_lg[1])
//									} else {
//										return y(dvc.essential.yAxisBreak_sm_md_lg[2])
//									}
//								});
//				}

				////create centre line if required
//				if (dvc.optional.centre_line == true){
//					svg.append("line")
//						.attr("id","centreline")
//						.attr('y1',y(dvc.optional.centre_line_value))
//						.attr('y2',y(dvc.optional.centre_line_value))
//						.attr('x1',0)
//						.attr('x2',chart_width);
//				} else if(yDomain[0] <0){
//					svg.append("line")
//						.attr("id","centreline")
//						.attr('y1',y(0))
//						.attr('y2',y(0))
//						.attr('x1',0)
//						.attr('x2',chart_width);
//				}  

				//create lines 		
				
				svg.append("path") 
					.attr("id","line2") 
					.attr("d", line2(natdata)) 
					.attr("fill","none");
//					.attr("transform", "translate("+paddingXTime+","+paddingYTime+")");

				svg.append("text")
					.attr("id", "lineText")
					.attr("fill", "#666666")
					.attr("font-size", "11px")
					.attr("x", "240px")
					.attr("y", "83px")
					.append("tspan")
					.text("England");
			
			d3.select("#lineText").append("tspan")
					.attr("dy", "1.1em")
					.attr("x", "240px")
					.text("& Wales");
//				svg.append("g")
//					.attr("id","natcircles")
//					.selectAll("circle")
//					.data(natvalues)
//					.enter()
//					.append("circle")
//					.attr("opacity",1)
//					.attr("fill","#fff")
//					.attr("stroke-width",2)
//					.attr("stroke","#666")
//					.attr("cx",function(d,i){
//									
//									
//									return xchart(d3.time.format("%y").parse(natdata[i][0]))
//						})
//					.attr("cy",function(d,i){
//						
//						if(isNaN(ychart(natdata[i][1]))){
//							return 0
//						} else {
//							return ychart(natdata[i][1])
//						}
//					})
//					.attr("r",function(d,i){if(isNaN(ychart(natdata[i][1])))
//							{return 0}
//							else {return 3}
//					});
					
				
		} else if(second){
			
			second = false;
			namesall = d3.keys(data2[0]).filter(function(key) { return key !== "AREANM"; });
			
			currdata = data2.filter(function(d) {return d.AREACD ==currid});	
			
			currdata.forEach(function(d) {
				  valuesx = namesall.map(function(name) { return +d[name]});		  
			});
			
	
	
			names = namesall.slice(1);
			
			values = valuesx.slice(1);
					
			linedata = d3.zip(time,values);
		
			line1 = d3.svg.line()
				//.defined(function(linedata){ return linedata[1] != null;}) 
				.defined(function(linedata) { return !isNaN(linedata[1]); })
		        .x(function(d,i) { return xchart(d3.time.format("%y").parse(linedata[i][0]))})
		        .y(function(d,i) { return ychart(linedata[i][1]); });
				
		 	svg.append("path") 
					.attr("id","line1") 
					.attr("d", line1(linedata)) 
					.attr("fill","none");
					
					
//			svg.append("g")
//					.attr("id","localcircles")
//					.selectAll("circle")
//					.data(natvalues)
//					.enter()
//					.append("circle")
//					.attr("opacity",1)
//					.attr("fill","#fff")
//					.attr("stroke-width",2)
//					.attr("stroke","#008cba")
//					.attr("cx",function(d,i){return xchart(d3.time.format("%y").parse(linedata[i][0]))})
//					.attr("cy",function(d,i){if(isNaN(ychart(linedata[i][1])))
//						{return 0}
//						else {return ychart(linedata[i][1])}
//					})
//					.attr("r",function(d,i){if(isNaN(ychart(linedata[i][1])))
//							{return 0}
//							else {return 3}
//					});
			
		} else {
			namesall = d3.keys(data2[0]).filter(function(key) { return key !== "AREANM"; });
			
			currdata = data2.filter(function(d) {return d.AREACD ==currid});	
			
			currdata.forEach(function(d) {
				  valuesx = namesall.map(function(name) { return +d[name]});		  
			});
			
	
	
			names = namesall.slice(1);
			
			values = valuesx.slice(1);
					
			linedata = d3.zip(time,values);

			svg.select("#line1").transition().duration(500).attr("d",line1(linedata));
			
//			svg.select("#localcircles").selectAll("circle")
//				.data(linedata)
//				.transition()
//				.duration(500)
//				.attr("opacity",1)
//				.attr("cx",function(d,i){return xchart(d3.time.format("%y").parse(linedata[i][0]))})
//				.attr("cy",function(d,i){if(isNaN(ychart(linedata[i][1])))
//						{return 0}
//						else {return ychart(linedata[i][1])}
//				})
//				.attr("r",function(d,i){if(isNaN(ychart(linedata[i][1])))
//						{return 0}
//						else {return 3}
//				});
				
		}
	}
	
	function createKey(config){
		
		keywidth = $("#keydiv").width();	
		
		var svgkey = d3.select("#keydiv")
			.append("svg")
			.attr("id", "key")
			.attr("width",keywidth);
		
		newbreaks = breaks;
	
		var color = d3.scale.threshold()
		   .domain(newbreaks)
		   .range(dvc.colour);

		y = d3.scale.linear()
		    .domain([newbreaks[0], breaks[4]]) /*range for data*/
		    .range([300, 0]); /*range for pixels*/

		
		
		x = d3.scale.linear()
		    .domain([newbreaks[0], breaks[4]]) /*range for data*/
		    .range([0,keywidth-150]); /*range for pixels*/

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
    		.tickSize(15)
		    .tickValues(color.domain())
			.tickFormat(d3.format(".1f"));

		
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
    		.tickSize(15)
		    .tickValues(color.domain())
			.tickFormat(d3.format(".1f"));
//
//		var g = svgkey.append("g").attr("id","vert").attr("class","hidden-xs")
//			.attr("transform", "translate(60,40)");
//		
//		
//		g.selectAll("rect")
//			.data(color.range().map(function(d, i) {
//			  return {
//				y0: i ? y(color.domain()[i]) : y.range()[0],
//				y1: i < color.domain().length ? y(color.domain()[i+1]) : y.range()[1],
//				z: d
//			  };
//			}))
//			.enter().append("rect")
//			.attr("width", 8)
//			.attr("y", function(d) {return d.y1; })
//			.attr("height", function(d) {return d.y0 - d.y1; })
//			.style("opacity",0.8)
//			.style("fill", function(d) {return d.z; });
//		
//		g.call(yAxis).append("text");
		
//		g.append("line")
//			.attr("x1","8")
//			.attr("x2","65")
//			.attr("y1",function(d,i){return y(config.ons.average[a])})
//			.attr("y2",function(d,i){return y(config.ons.average[a])})
//			.attr("stroke","blue")
//			.attr("stoke-width",1);	
//		
//		g.append("text")
//			.attr("x","10")
//			.attr("y",function(d,i){return y(config.ons.average[a]) - 4})
//			.attr("class","average")
//			.text(config.ons.averagelabel);
//			
//		g.append("text")
//			.attr("x","10")
//			.attr("y",function(d,i){return y(config.ons.average[a]) + 11})
//			.attr("class","average")
//			.text(config.ons.average[a]);		
		
		//add units
		
		//g.append("text").attr("id","keyunit").text(dvc.unittext).attr("transform","translate(-48,-20)");
		
		
		//horizontal key		
			
		var g2 = svgkey.append("g").attr("id","horiz")
			.attr("transform", "translate(25,25)");
		
		keyhor = d3.select("#horiz");
		
		g2.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				x0: i ? x(color.domain()[i]) : x.range()[0],
				x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
				z: d
			  };
			}))
		  .enter().append("rect")
			.attr("height", 8)
			.attr("x", function(d) {
				 return d.x0; })
			.attr("width", function(d) { return d.x1 - d.x0; })
			.style("opacity",0.8)
			.style("fill", function(d) { return d.z; });

			
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
			
			

		d3.select("#horiz").selectAll("text").attr("transform",function(d,i){if(i % 2){return "translate(0,10)"}});			
		
		g2.append("text").attr("id","keyunit").text(dvc.unittext).attr("transform","translate(0,-10)");
			
		}
		
		
		
		function navigation(data, datacsv){
			
			$("#navigation").show();

		//Build pills
		
			dvc.varname = data.ons.varname;
			dvc.varunit = data.ons.varunit;
			
			a = dvc.varname.indexOf(dvc.curr);

			dvc.unittext = dvc.varunit[a];
			dvc.label = data.ons.varlabel[a];
			dvc.prefix = data.ons.varprefix[a];
	
			var pills = d3.select("#pills")
					.append("ul")
					.attr("class","nav navbar nav-pills navbar-inverse nav-justified")
					
		
			pills.selectAll("li")
				.data(data.ons.varlabel)
				.enter()
				.append("li")
				.attr("id", function(d,i){return data.ons.varname[i]})
				.append("a")
				.attr("href","#")
				.attr("data-nm", function(d,i){return data.ons.varname[i]})
				.attr("data-toggle","pill")
				.text(function(d,i){return d;})
				.on("click", function(d,i){
					dvc.curr = d3.select(this).attr("data-nm");
					a = dvc.varname.indexOf(dvc.curr);
					loading = data.ons.datanames[a];
									
					updateMap(config2);
					dvc.unittext = dvc.varunit[a];
					dvc.label = data.ons.varlabel[a];
					d3.select("#keyunit").text(dvc.unittext);
					d3.select("#areainfo")
					d3.select("#areanm").text("");
					d3.select("#areainfo").text("");
					$("#occselect").val('').trigger("chosen:updated");
					d3.select('#selected').remove();
					
				});
				
		
			d3.select("#" + dvc.curr).attr("class","active");
			
			 var highest = null;

			   $(".nav-pills a").each(function(){  //find the height of your highest link
				   var h = $(this).height();
				   if(h > highest){
					  highest = $(this).height();  
				   }    
				});
			
			   $(".nav-pills a").height(highest);  //set all your links to that height.
			
			d3.select("#varsel").html(dvc.label + " <span class='caret'></span>");
					
			dropnext = d3.select("#menu").append("ul")
					.attr("class","dropdown-menu")
					.attr("role","menu");
					
			dropnext.selectAll("li")
					.data(data.ons.varlabel)
					.enter()
					.append("li")
					.attr("id", function(d,i){return "drop" + data.ons.varname[i]})
					.append("a")
					.attr("href","#")
					.attr("data-nm", function(d,i){return data.ons.varname[i]})
					.text(function(d,i){return d;})
					.on("click", function(d,i){
						dvc.curr = d3.select(this).attr("data-nm");
						a = dvc.varname.indexOf(dvc.curr);
						loading = data.ons.datanames[a];
						updateMap(config2);
						dvc.unittext = dvc.varunit[a];
						d3.select("#varsel").html(data.ons.varlabel[i] + " <span class='caret'></span>");
						dvc.label = data.ons.varlabel[a];
						d3.select("#keyunit").text(dvc.unittext);
						dropnext.selectAll("li").attr("class","")
						d3.select("#drop" + dvc.curr).attr("class","active");
						d3.select("#areanm").text("");
						d3.select("#areainfo").text("");
						$("#occselect").val('').trigger("chosen:updated");
						d3.select('#selected').remove();
					});
			
			d3.select("#drop" + dvc.curr).attr("class","active");
			
	}
	
	function selectlist(data, datacsv) {
	
			var areacodes =  datacsv.map(function(d) { return d.AREACD; });
			var areanames =  datacsv.map(function(d) { return d.AREANM; });
			var menuarea = d3.zip(areanames,areacodes).sort(function(a, b){ return d3.ascending(a[0], b[0]); });
			
			
			// Build option menu for occupations
			var optns = d3.select("#chosensel").append("div").attr("id","sel").append("select")
				.attr("id","occselect")
				.attr("style","width:98%")
				.attr("class","chosen-select");
			
			
			optns.append("option")
				.attr("value","first")
				.text("");
			
			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function(d){ return d[1]}) 
				.text(function(d){ return d[0]});
			
			myId=null;
			
			$('#occselect').chosen({width: "98%", allow_single_deselect:true}).on('change',function(evt,params){
		
								if(typeof params != 'undefined') {
									
										
										/* identify the data-nm attribute of the polygon you've hovered over */
										indexarea = document.getElementById("occselect").selectedIndex;
										myId=params.selected;
										currclass=params.selected;
										
										selected=true;
										leaveLayer();
										highlightArea();
										
										
										d3.select(".leaflet-overlay-pane").selectAll("path").attr("pointer-events","none");
  										pymChild.sendMessage('navigate', indexarea + " " + dvc.time);

								}
								else {
										// Remove any selections										
										indexarea ="0";
										myId=null;
										selected=false;
										leaveLayer();
										d3.select(".leaflet-overlay-pane").selectAll("path").attr("pointer-events","all");
										pymChild.sendMessage('navigate', indexarea + " " + dvc.time);
								
								}
								
			});
	
	};
	playTime();
	
	function playTime() {
		var currentState = "play";
		
		
		
		d3.select("#playPause").on("click", function(){
		d3.select("#playPause").html("<span class='glyphicon glyphicon-pause' aria-hidden='true'></span> Pause");
		if(currentState == "play") {
		currentState = "pause";

			 playInt = setInterval(function(){
				currTime = $("#slide").slider('getValue');
				if(currTime<(cols-1)) {
					currTime =  currTime + 1;
				} else {
					currTime =  0;
				};
	
				dvc.time = "yr" + (currTime+1);
				$("#slide").slider('setValue', currTime)
				updateYear();
				},2000);
		
		} else {
			currentState = "play";
			d3.select("#playPause").html("<span class='glyphicon glyphicon-play' aria-hidden='true'></span> Play");
		  	clearInterval(playInt);
		}
		});
		
			
	}
	
	function updateYear(){	
	indexarea = document.getElementById("occselect").selectedIndex;
	pymChild.sendMessage('navigate', indexarea + " " + dvc.time);
		// Create an object to give yourself a pair of values for the parlicon code and data value
	
		rateById = {};

		data2.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.time);});
		
		topoLayer.eachLayer(handleLayer);
		
		var xy = d3.select(".leaflet-overlay-pane").selectAll("path");
		
		xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",selectArea);
	
		numb = dvc.time.slice(2)-1;
		if(numb<8){
				until ="200"+(numb+2)
			} else {
				until ="20"+(numb+2)
			}	
				
		if(numb.toString().length==1){
			d3.select("#time").text("200" + numb+"-" + until);
		} else {
			d3.select("#time").text("20" + numb+"-" + until);
		}
	
		
		format=d3.format(".3n")
		
		if(myId != null) {
			highlightArea();
			d3.select(".leaflet-overlay-pane").selectAll("path").attr("pointer-events","none");
			d3.select("#areainfo").html(function(d,i){if (!isNaN(rateById[currclass]))  {return dvc.prefix + format(rateById[currclass]) + "<span>" + dvc.unittext + "</span>"} else {return "Data unavailable"}});

		}
		
	}	
	

	function updateMap(config){
		loadingPath = "data/" + loading + ".csv";
		
		//First load the new csv file
		d3.csv(loadingPath, function(error, data) {
				data2 = data;
				
				// Work out how many years we have in our dataset; number of rows - area name & code // Look at linechart templates to see how?
				// parse data into columns
					var cols = -2; // set to -2 as that's the number of non-data columns
					var values = [];
					allvalues = [];
			
					for (var column in data[0]) {
						cols = cols + 1;
						if (column != 'AREANM' && column != 'AREACD') {
						values[column] =  data.map(function(d) { return +eval("d." + column); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);
						allvalues = allvalues.concat(values[column]);
						}
					}
					
			allvalues.sort(d3.ascending);	
			
			if(config.ons.breaks =="jenks"){
				breaks = ss.jenks(allvalues, 5);
			} else {
				breaks = config.ons.breaks[a];
			};

			//Set-up and create an object variable to hold the data for the currently selected variable and the year
			rateById = {};
			areaById = {};
			
			data.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.time); areaById[d.AREACD] = d.AREANM});
			
			color = d3.scale.threshold()
				.domain(breaks.slice(1,5))
				.range(dvc.colour);
			
			d3.select("#keydiv").select("svg").remove();
		    d3.select("#chartPane").select("svg").remove();
			
//			d3.select("#areainfo").html(function(d,i){
//				
//				if (!isNaN(rateById[currclass]))  {
//					return dvc.prefix + rateById[currclass] + "<span>" + dvc.unittext + "</span>"
//				} else {
//					return "Data unavailable"
//				}
//			});
			
			
			createKey(config);
			first=true;
			drawChart(dvc.curr);
				
			topoLayer.eachLayer(handleLayer);
				var xy = d3.select(".leaflet-overlay-pane").selectAll("path");
				
				xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",selectArea);
			
				
		});
		

		    }; // End function ready
	}	

		



	//Load data and config file
	queue()
		.defer(d3.csv, "data/datanuts.csv")
		.defer(d3.json, "data/config.json")
		.await(ready);
		
		
	
	} else {
		d3.select("#graphic").html("Sorry your browser does not support this interactive graphic");
		d3.select("#graphic")
			.append("img")
			.attr("src","./images/altlife.png")
			.attr("width","100%")
			.attr("height","100%");
		
		pymChild.sendHeight();
	}

