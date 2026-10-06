var dvc = {};


if (Modernizr.inlinesvg) {
$(document).ready(function(){	

	d3.select("#graphic").remove();
	  
	pymChild = new pym.Child();
	  
	var dvc ={};//global namespace
	dvc.curr = "house";
	dvc.scale = 1;
	
	getParams();
	
	dvc.format=d3.format(",");
	
	/* Load both the starting SVGs */	
	/* Load SVG for the right */  	

	/* Load SVG for the left */ 
	
	d3.select("#left")
		.append("svg")
		.attr("id","svgElement");

	d3.select("#right")
		.append("svg")
		.attr("id","svgElement2");
	
	
	//url = "assets/PCONmerge2.json";
	var aspectheight = 2;
	var aspectwidth = 1;
	

		
	function getParams() {

		  firstbit = window.location.href.split(".html")[0];
		
		  var url = decodeURI(window.location.hash);
		
		  if(url != "") {		
				params = url.split("&");
				dvc.curr = params[0].split("=")[1];	
		  }
		  
		  
		  
		  
	}
	
	function updateHash(curr) {
	
		  window.location.hash = encodeURI("selected=" + curr);
			
	}

	contentwidth = $('#content').width();
	
		
	queue()
		.defer(d3.json, "assets/PCONhex.json")
		.defer(d3.csv, "assets/data.csv")
		.defer(d3.json, "assets/config.json")
		.await(ready);
		
	
		 function ready(error, pconhex2, datacsv2, config2) {
		 		 
		 pconhex = pconhex2;
		 datacsv = datacsv2;
		 config = config2;

		 width = $('#left').width();
		 		 		 
		 
		 if(width>=330) {
		 		 scale = 3300
		 		 rotate = [2.7, 1]} 
		 else {
		 		 scale = 2300
		 		 rotate = [3,1.5];
		 };

		 if(contentwidth>=768) {
		 		 height = 520;
		 } else {
		 		 
		 		 
		 height = width * 1.5;
		 d3.select("#left").style("height",height + "px");
		 		 
		 }
		 		 
		 svgL = d3.select("#svgElement")
		 		 .attr("width", width)
		 		 .attr("height", height);
		 		 
		 svgR = d3.select("#svgElement2")
		 		 .attr("width", width)
		 		 .attr("height", height);
		 
		 		 
		 projectionA = d3.geo.albers()
    .center([0, 55.4])
    .rotate([3.2, 1])
    .parallels([50, 60])
    .scale(scale)
    .translate([width / 2, height / 2]);
		 
		 projectionB = d3.geo.albers()
    .center([0, 55.4])
    .rotate(rotate)
    .parallels([50, 60])
    .scale(scale)
    .translate([width / 2, height / 2]);
		 
		 pathA = d3.geo.path()
		 		 .projection(projectionA);
		 		 
		 pathB = d3.geo.path()
		 		 .projection(projectionB);
		 		 
		 navigation(config, datacsv);
		 sources(config);
		   
		 rateById = {};
		 
		 datacsv.forEach(function(d) { rateById[d.PCON14CD] = +eval("d." + dvc.curr); });

		 var values =  datacsv.map(function(d) { return +eval("d." + dvc.curr); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);
		 		 		 
		 //Get the jenks breaks		 
		 breaks = ss.jenks(values, 5);
		 
		 var newbreaks = breaks.slice(1,5);
		 //make sure that the top range break is greater than the max value
		 
		 newbreaks.push((d3.max(values)+1));
		 
		  color = d3.scale.threshold()
		 		 .domain(newbreaks)
		 		 .range(['#73bac9','#4ea8bb','#3c8a9a','#2d6976','#1f4851']);

		 pymChild = new pym.Child({ renderCallback: xxx});
		 
		 }


		 function xxx(){
		 		 width = $('#left').width();
		 		 contentwidth = $('#content').width();

		 		 if(width>=330) {
		 		 		 scale = 3300
		 		 		 rotate = [2.7, 1]} 
		 		 else {
		 		 		 scale = 2300
		 		 		 rotate = [3,1.5];
		 		 };
		 
		 		 if(contentwidth>=768) {
		 		 		 height = 520;
		 		 		 d3.select("#left").style("height",height + "px");
		 		 		 d3.select("#right").style("height",height + "px");

		 		 } else if(contentwidth>=500) {
		 		 		 
		 		 		 height = width * 0.9;
		 		 		 d3.select("#left").style("height",height + "px");
		 		 } else {
		 		 		 
		 		 		 height = width * 1.5;
		 		 		 d3.select("#left").style("height",height + "px");
		 		 }

		 		 d3.select("#svgElement").selectAll("g").remove();
		 		 d3.select("#svgElement2").selectAll("g").remove();
		 
		 		 d3.select("#svgElement")
		 		 		 .attr("width", width)
		 		 		 .attr("height", height);
		 		 		 
		 		 d3.select("#svgElement2")
		 		 		 .attr("width", width)
		 		 		 .attr("height", height);
		 		 		 
		 		 projectionA = d3.geo.albers()
		 		 		 .center([0, 55.4])
		 		 		 .rotate([3.2, 1])
		 		 		 .parallels([50, 60])
		 		 		 .scale(scale)
		 		 		 .translate([width / 2, height / 2]);
		 		 
		 		 projectionB = d3.geo.albers()
		 		 		 .center([0, 55.4])
		 		 		 .rotate(rotate)
		 		 		 .parallels([50, 60])
		 		 		 .scale(scale)
		 		 		 .translate([width / 2, height / 2]);
		 		 
		 		 pathA = d3.geo.path()
		 		 		 .projection(projectionA);
		 		 		 
		 		 pathB = d3.geo.path()
		 		 		 .projection(projectionB);
		 
		 		 if(contentwidth>=768) {
		 		 		 d3.json("assets/PCONreg.json", function(error, pconx) {
		 		 		 		 pconregular = pconx
		 		 		 		 desktop(pconhex, pconregular, datacsv);  
		 
		 		 		 });
		 		 }
		 		 else {
		 		 		 mobile(pconhex, datacsv);
		 		 };		 
		 
		 		 };
// Insert functions that work on mobile / desktop only.



function desktop(pconhex, pconregular, datacsv){

	d3.select("#svgElement2").selectAll("g").remove();


	key(breaks);

	svgL.append("g")
		  .attr("class", "pcon")
		  .selectAll("path")
		  .data(topojson.feature(pconregular, pconregular.objects.PCONreg).features)
		  .enter()
		  .append("path")
		  .attr("id",function(d){return "reg" + d.properties.PCON14CD})
		  .attr("data-nm",function(d){return d.properties.PCON14NM})
		  .style("fill", "#fff")	
		  .attr("d", pathB)
		  .attr("pointer-events","none")
		  .on("mouseout", unhighlight)
		  .on("mouseover", function(d){highlight(d.properties.PCON14CD)});
	
	d3.select("#regS14000051").attr("transform","translate(50,130)");


 	var bbox = d3.select("#regS14000051").each(function() {
		
		
		box = this.getBBox();
		
		console.log(box);
		
		svgL.select("g").append("rect")
			.attr("x",box.x-3)
			.attr("y",box.y-3)
			.attr("height",box.height+6)
			.attr("width",box.width+6)
			.attr("fill","none")
			.attr("stroke","#f2f2f2")
			.attr("stroke-width",1)
			.attr("transform","translate(50,130)");
			
		
	});
	//console.log(bbox);
	
	svgR.append("g")
		  .attr("class", "pconhex hide")
		  .selectAll("path")
		  .data(topojson.feature(pconhex, pconhex.objects.PCONmerc).features, function(d) { return d.properties.PCON14CD; })
		  .enter()
		  .append("path")
		  .attr("id",function(d){return "hex" + d.properties.PCON14CD})
		  .attr("d", pathA)
		  .attr("pointer-events","none")
		  .style("fill", function(d) {return color(rateById[d.properties.PCON14CD]); });
		  
		var zoom = d3.behavior.zoom()
    		.on("zoom",function() {
			dvc.scale = d3.event.scale;
     	   d3.select(".pcon").style("stroke-width",0.5/d3.event.scale).attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
		   d3.select(".pconhex2").style("stroke-width",0.5/d3.event.scale).attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");

		});

		svgL.call(zoom);
		svgR.call(zoom);	


		  
	//Build an object for each path
	
	var pathReg = {};
	var pathHex = {};
	

	
	d3.select(".pconhex").selectAll("path").each(function(d,i){pathHex[d.properties.PCON14CD] = d3.select("#hex"+ d.properties.PCON14CD).attr("d")});
	
	pconreg = d3.select(".pcon").selectAll("path");
	
	pconreg.each(function(d,i){pathReg[d.properties.PCON14CD] = d3.select("#reg"+ d.properties.PCON14CD).attr("d")})
		.transition()
		.delay(2500)
		.duration(1500)
		//.style("stroke","#fff")
	    .style("fill", function(d) {if (typeof(color(rateById[d.properties.PCON14CD])) != "undefined") { return color(rateById[d.properties.PCON14CD]); }else {return "#e0e0e0"}});
	
	setTimeout(function(){pconreg.attr("pointer-events","all")},2500)

  
		  
	svgR.append("g")
		  .attr("class", "pconhex2")
		  .selectAll("path")
		  .data(topojson.feature(pconregular, pconregular.objects.PCONreg).features, function(d) { return d.properties.PCON14CD; })
		  .enter()
		  .append("path")
		  .attr("id",function(d){return d.properties.PCON14CD})
		  .attr("d", function(d) {return pathReg[d.properties.PCON14CD]; })
		  .attr("data-nm",function(d){return d.properties.REALNAME})
		  .style("fill", "#fff")
		  .attr("pointer-events","none")
		  .on("mouseout", unhighlight)
		  .on("mouseover", function(d){highlight(d.properties.PCON14CD)});

 	pconhex = d3.select(".pconhex2")
	  	  .selectAll("path");

	pconhex.each(function(d){
		
				var newPath = pathHex[d.properties.PCON14CD];
				var origPath = d3.select(this).attr("d");		
				d3.select(this).call(transition, origPath, newPath);
	});
	
	setTimeout(function(){pconhex.attr("pointer-events","all")},2500)
		
	}
	
	
	function mobile(pconhex, datacsv){
		
	key(breaks);
	
		 svgL.append("g")
		  .attr("class", "pcon")
		  .selectAll("path")
		  .data(topojson.feature(pconhex, pconhex.objects.PCONmerc).features, function(d) { return d.properties.PCON14CD; })
		  .enter()
		  .append("path")
		  .attr("id",function(d){return "reg" + d.properties.PCON14CD})
		  .attr("data-nm",function(d){return d.properties.REALNAME})
		  .attr("d", pathB)
		  .attr("pointer-events","all")
		  .style("fill", function(d) {if (typeof(color(rateById[d.properties.PCON14CD])) != "undefined") { return color(rateById[d.properties.PCON14CD]); }else {return "#e0e0e0"}})
		  .on("mouseout", unhighlight)
		  .on("mouseover", function(d){highlight(d.properties.PCON14CD)});

		var zoom = d3.behavior.zoom()
    		.on("zoom",function() {
     	   d3.select(".pcon").style("stroke-width",0.5/d3.event.scale).attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
		});

		svgL.call(zoom);


	d3.select("#regS14000051").attr("transform","translate(50,130)");
	
			
	}

	function navigation(data, datacsv){

		//Build pills
		
			dvc.varname = data.ons.varname;
			dvc.varunit = data.ons.varunit;
			
			var a = dvc.varname.indexOf(dvc.curr);
			dvc.unittext = dvc.varunit[a];
			d3.select("#areaunit").html(dvc.unittext);
			dvc.prefixtext = data.ons.unitprefix[a];
			dvc.units = data.ons.units[a];
			dvc.label = data.ons.varlabel[a];
	
			var pills = d3.select("#pills")//.append("nav").attr("class","container-fluid")
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
					var a = dvc.varname.indexOf(dvc.curr);
					dvc.unittext = dvc.varunit[a];
					dvc.prefixtext = data.ons.unitprefix[a];
					d3.select("#areaunit").html(dvc.unittext);
					dvc.units = data.ons.units[a];
					updateMap(data, dvc.curr,datacsv);
					updateHash(dvc.curr);
					sources(data);
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
		
				
		//Build dropdown
		
//		var drop = d3.select("#menu")
//					.append("ul")
//					.attr("class","nav navbar-nav navbar-right")
//					.append("li")
//					.attr("class","dropdown");
//					
//			drop.append("a")
//					.attr("href","#")
//					.attr("class","dropdown-toggle")
//					.attr("data-toggle", "dropdown")
//					.text("Select data")
//					.append("span")
//					.attr("class","caret");

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
						updateMap(data, dvc.curr, datacsv);
						var a = dvc.varname.indexOf(dvc.curr);
						dvc.unittext = dvc.varunit[a];
						dvc.prefixtext = data.ons.unitprefix[a];
						dvc.units = data.ons.units[a];
						d3.select("#areaunit").html(dvc.unittext);
						d3.select("#varsel").html(data.ons.varlabel[i] + " <span class='caret'></span>");
						updateHash(dvc.curr);

			
			dropnext.selectAll("li").attr("class","")
			d3.select("#drop" + dvc.curr).attr("class","active");
					});
			
			d3.select("#drop" + dvc.curr).attr("class","active");
			
			var areacodes =  datacsv.map(function(d) { return d.PCON14CD; });
			var areanames =  datacsv.map(function(d) { return d.PCON14NM; });
				var menuarea = d3.zip(areanames,areacodes).sort(function(a, b){ return d3.ascending(a[0], b[0]); });
			
			// Build option menu for occupations
			var optns = d3.select("#chosensel").append("div").attr("id","sel").append("select")
				.on("change",function(){  
					options = d3.select("#occselect").selectAll('option')  
					var selectedIndex = d3.select("#occselect").property('selectedIndex');
					var ids = options[0][selectedIndex].__data__[1];
					setTimeout(function(){highlight(ids)},200);
				})
				.attr("id","occselect")
				.attr("style","width:100%")
				.attr("class","chosen-select");
			
			if(contentwidth>=768){
				optns.append("option")
					.attr("value","first")
					.text("");
			}
			
			else {
				optns.append("option")
					.attr("value","first")
					.text("Choose an area");
			}
			
			
			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function(d){ return d[1]}) 
				.text(function(d){ return d[0]})
			
			
			$('#occselect').chosen({width: "100%", allow_single_deselect: true, placeholder_text_single:"Choose an area"}).on('change',function(evt,params){
		
								if(typeof params != 'undefined') {
									
										
										/* identify the data-nm attribute of the polygon you've hove#ccc over */
										myId=params.selected;
										
										highlight(myId);
										
										d3.select(".pconhex2").selectAll("path").attr("pointer-events","none");
										d3.select(".pcon").selectAll("path").attr("pointer-events","none");

										//updateHash();
								}
								else {
										// Remove any selections
										myId=null;
										unhighlight();
										d3.select(".pconhex2").selectAll("path").attr("pointer-events","all");
										d3.select(".pcon").selectAll("path").attr("pointer-events","all");

								}
								
			});

				
				
		if (pymChild) {
        	pymChild.sendHeight();
  		}
		
	}
	
	function updateMap(data, curr, datacsv){
		
		rateById = {};
		
		datacsv.forEach(function(d) { rateById[d.PCON14CD] = +eval("d." + curr); });
		  
		
		var values =  datacsv.map(function(d) { return +eval("d." + curr); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);

		//Get the jenks breaks	
		breaks = ss.jenks(values, 5);
		
		key(breaks);
		
		var newbreaks = breaks.slice(1,5);
		//make sure that the top range break is greater than the max value
		newbreaks.push((d3.max(values)+1));
		
		color = d3.scale.threshold()
			.domain(newbreaks)
			.range(['#73bac9','#4ea8bb','#3c8a9a','#2d6976','#1f4851']);
		
		unhighlight();

		d3.select(".pcon").selectAll("path")
		 .transition()
		 .duration(1500)
	     .style("fill", function(d) {if(typeof(color(rateById[d.properties.PCON14CD])) != "undefined") { return color(rateById[d.properties.PCON14CD]);} else {return "#e0e0e0"}});	
			 
		if(contentwidth>=768){
		d3.select(".pconhex2").selectAll("path")
		 .transition()
		 .duration(1500)
	     .style("fill", function(d) {if (typeof(color(rateById[d.properties.PCON14CD])) != "undefined") { return color(rateById[d.properties.PCON14CD]); }else {return "#e0e0e0"}});
		 
		}
		 
		 if(typeof myId == 'string'){
		 highlight(myId);
		 }
	
	}
			
		
	function transition(path, d0, d1) {

		path.transition()
	  	  .delay(1000)
		  .duration(1500)
		  .attrTween("d", pathTween(d1, 5));
		  
		  
		path.transition()
	  	  .delay(2500)
		  .duration(1500)	
		  //.style("stroke","#fff")	  
	    .style("fill", function(d) {if (typeof(color(rateById[d.properties.PCON14CD])) != "undefined") { return color(rateById[d.properties.PCON14CD]); }else {return "#e0e0e0"}});	}
	
	
	
	function pathTween(d1, precision) {

	  return function() {
		var path0 = this,
			path1 = path0.cloneNode(),
			n0 = path0.getTotalLength(),
			n1 = (path1.setAttribute("d", d1), path1).getTotalLength();
	
		// Uniform sampling of distance based on specified precision.
		var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
		while ((i += dt) < 1) distances.push(i);
		distances.push(1);
	
		// Compute point-interpolators at each distance.
		var points = distances.map(function(t) {
		  var p0 = path0.getPointAtLength(t * n0),
			  p1 = path1.getPointAtLength(t * n1);
		  return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
		});
	
		return function(t) {
		  return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
		};
	  };
	}


	function highlight(area){
		
		
		unhighlight();
	/* get the id of the the equivalent polygons for either side */
		var reg=document.getElementById("reg" + area);
		var hex=document.getElementById("hex" + area);
					
	/* Display name of area*/
		var name = d3.select("#reg" + area).attr("data-nm");
		
		d3.select("#areanm").text(name);
		d3.select("#areainfo").html(function(){if(isNaN(rateById[area])){return ""} else {return dvc.prefixtext + dvc.format(rateById[area]) + dvc.units}})
		d3.select("#areaunit").html(dvc.unittext);
		
	/* select the parent element for all paths for each map (left and right)*/
		svg = d3.select('.pcon');
		
				svg.append("path")
				  .attr("d", d3.select(reg).attr("d"))
				  .attr("id","selected")
				  .attr("class", "arcSelection")
				  .attr("pointer-events", "none")
				  .style("fill", "none")
				  .style("stroke", "orange")
				  .style("stroke-width", 3/dvc.scale);
				
				if(area =="S14000051") {d3.select("#selected").attr("transform","translate(50,130)")}
		if(contentwidth>=768) {		
				svg1 = d3.select('.pconhex2');
  
				 svg1.append("path")
				  .attr("d", d3.select(hex).attr("d"))
				  .attr("class", "arcSelection")
				  .attr("pointer-events", "none")
				  .style("fill", "none")
				  .style("stroke", "orange")
				  .style("stroke-width", 3/dvc.scale); 
				 
				 var fill = d3.select("#reg" + area).style("fill");
				 var value = rateById[area]; 
		
				 keyvalue(fill, value);
		}
	}	
	
	function unhighlight(){
				
		d3.selectAll(".arcSelection").remove();
		d3.select("#keybar").transition().duration(2000).attr("height",0).attr("y", function() {return y(newbreaks[0])});	
		d3.select("#areanm").text("");
		d3.select("#areainfo").html("")

	}	
	
	


	function key(breaks){
		
		d3.select("#key1").select("svg").remove();

		var svgkey = d3.select("#key1")
			.selectAll("svg")
			.data([breaks])
			.enter()
			.append("svg")
			.attr("id", "key");
			
		newbreaks = breaks;

		
		var color = d3.scale.threshold()
		   .domain(newbreaks)
 		   .range(['#73bac9','#4ea8bb','#3c8a9a','#2d6976','#1f4851']);

		y = d3.scale.linear()
		    .domain([newbreaks[0], breaks[5]]) /*range for data*/
		    .range([400, 0]); /*range for pixels*/

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
    		.tickSize(15)
		    .tickValues(color.domain());
			
		keywidth = $("#key2").width();	
		
		x = d3.scale.linear()
		    .domain([newbreaks[0], breaks[5]]) /*range for data*/
		    .range([0,keywidth-50]); /*range for pixels*/

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
    		.tickSize(15)
		    .tickValues(color.domain());

		var g = svgkey.append("g").attr("id","vert").attr("class","hidden-xs").attr("transform", "translate(60,10)");
		
		keyg = d3.select("#vert");
		
		g.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				y0: i ? y(color.domain()[i]) : y.range()[0],
				y1: i < color.domain().length ? y(color.domain()[i+1]) : y.range()[1],
				z: d
			  };
			}))
			.enter().append("rect")
			.attr("width", 8)
			.attr("y", function(d) {return d.y1; })
			.attr("height", function(d) {return d.y0 - d.y1; })
			.style("fill", function(d) {return d.z; });
			
		keyg.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				y0: i ? y(color.domain()[i]) : y.range()[0],
				y1: i < color.domain().length ? y(color.domain()[i+1]) : y.range()[1],
				z: d
			  };
			}))
			.attr("y", function(d) {return d.y1; })
			.attr("height", function(d) {return d.y0 - d.y1; })
			.style("fill", function(d) { return d.z; });
		
		keyg.call(yAxis).append("text")
			.attr("id", "caption")
			.attr("x", -63)
			.attr("y", -20)
			.text("");

		keyg.append("rect")
			.attr("id","keybar")
			.attr("width",8)
			.attr("height",0)
			.attr("transform","translate(15,0)")
			.style("fill", "#ccc")
			.attr("y",y(newbreaks[0]));
			
		//horizontal key	
		d3.select("#key2").select("svg").remove();

		var svgkey2 = d3.select("#key2")
			.selectAll("svg")
			.data([breaks])
			.enter()
			.append("svg")
			.attr("id", "key");
			
		var g2 = svgkey2.append("g").attr("id","horiz").attr("class","visible-xs").attr("transform", "translate(25,20)");
		
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
			.attr("x", function(d) { return d.x0; })
			.attr("width", function(d) { return d.x1 - d.x0; })
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
			.attr("x",x(newbreaks[0]));	
			
		d3.select("#horiz").selectAll("text").attr("transform",function(d,i){if(i % 2){return "translate(0,10)"}});			
			
		
		}
		
		function keyvalue(fill, value) {
					
			d3.select("#keybar")
				.transition()
				.duration(500)
				.attr("height", function(){return y(newbreaks[0]) - y(value)})
				.attr("y", function() {return y(value)})
				.style("fill",fill);
			
		}	
		
		
		function sources(config) {
			
			var getIndex = config.ons.varname.indexOf(dvc.curr);
			d3.select("#leftfoot").selectAll("div").remove();
			
			d3.select("#leftfoot").selectAll("div")
				.data(config.ons.sources[getIndex])
				.enter()
				.append("div")
				.text(function(d,i){return config.ons.meta[getIndex][i] + " - "})
				.append("a")
			    .attr("href", function(d,i){return config.ons.urls[getIndex][i] })
				.attr("target", "_blank")
				.text(function(d,i){return config.ons.sources[getIndex][i] });		
				
		}
		

        });

    //setTimeout(function(){if (pymChild) {pymChild.sendHeight()}},5000);

} 	else  // from modernizer
	
	{
		d3.select("#graphic").select("p").html("Sorry your browser does not support this interactive graphic");
		d3.select("#graphic")
			.append("img")
			.attr("src","./images/alt.png")
			.attr("width","100%")
			.attr("height","100%")
		
		pymChild = new pym.Child();
        
		pymChild.sendHeight();

		
	}
