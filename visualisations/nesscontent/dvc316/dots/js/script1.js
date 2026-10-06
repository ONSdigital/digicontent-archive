//namespace any global variables
var dvc = {}; 


if (Modernizr.inlinesvg)
{
	//remove preview image/message if browser suppports SVG
	d3.select("#altern").remove();
	d3.select(".container-fluid").classed("hide", false);
	pymChild = new pym.Child();
	
	//Load main script/data
	$(document).ready(function()
	{	
		//main script
	
	var loadcsvname = "CCGs";
	valsel = "yr1";
	direction = "asc";
	var first = 0;
	var filtergroupx = false;
	dataload(loadcsvname);
		
	function dataload(loadcsvname){
	
	loadcsv = "assets/data" + loadcsvname + ".csv";
	
		d3.json("assets/config.json", function(error, config) {
				dvc=config;
			
		
			
				//Load the data
				d3.csv(loadcsv, function(error, data) {
					
					graphic_data = data;
					if(first == 0) {
						occopt();
						first = 1;
					}
					
					//checkUrl(); 
					
					dvc.format1 = d3.format(",.0f");
					
					//Set up sorting
					d3.selectAll(".sort").on("click",function(){
						sortme(this.id,direction);
						valsel = this.id;
						
					});
					
					//Set up direction
					d3.selectAll(".direction").on("click",function(){
						sortme(valsel,this.id);
						direction = this.id;
						
					});
					
				//	d3.selectAll(".fullpart").on("click",function(){dataload(this.id);});
					
					function toggleDiv(){
					  if($(this).is(':checked')){
						$('#filtergrp').show(1000);
					  } else {
						$('#filtergrp').hide(1000);
					  }
					}

					$('#filtercheck')
						.change(toggleDiv);


					
					
					$(".btn-group > .btn").click(function(){
						$(this).addClass("active").siblings().removeClass("active");
					});
					
					pymChild = new pym.Child({ renderCallback: drawGraphic});
					pymChild.sendHeight();
					
				});
		});
	
	}
	
	//function checkUrl () {
//		
//				if(self!=top) {
//				
//					if(window.location != window.parent.location)
//					{
//						var url = document.referrer;
//					} else {
//						var url = document.location;
//					}
//					
//				} else {
//					url = window.location.href;
//				}
//						
//
//		
//		var occ_q = url.split("?")[1];
//		
//		if(typeof occ_q != 'undefined') {
//			
//			filteredocc = occ_q.slice(0,4);  
//			setTimeout(function(){filterfirst(filteredocc)},2000);
//			d3.select("#backrect" + filteredocc).attr("id","selectedbar");
//			$("#occselect").val(filteredocc);
//			
//			
//			
//			$("#occselect").trigger("chosen:updated");
//		
//		}
//	
	//Function to create drop down
	function occopt () {
	
	//Create a chosen drop down to show the list of occupations 

		dvc.allOcc = [];
			
		//Create an array for each occupation title
		graphic_data.forEach(function(d,i){	
				dvc.allOcc.push(graphic_data[i].AREANM);								
		});
		
		dvc.allCode = [];
	
		//Create an array for each occupation code
		graphic_data.forEach(function(d,i){	
				dvc.allCode.push(graphic_data[i].AREACD);								
		});

		// Join occupation and codes together in an array
		var codeoccyzip = d3.zip(dvc.allOcc, dvc.allCode);
		
		//sort occupation list alphabetically	
		dvc.codeoccyzip = codeoccyzip.sort(function(b, a){ return d3.descending(a[0], b[0])});


		// Build option menu for occupations
		var optns = d3.select("#occupation").append("div").attr("id","sel").append("select")
				.attr("id","occselect")
				.attr("style","width:90%")
				.attr("class","chosen-select");
			
			//append message
			
			optns.append("option")
				.attr("value","first")
				.text("");
			
			optns.selectAll("p").data(dvc.codeoccyzip).enter().append("option")
				.attr("value", function(d){ return d[1]}) 
				.text(function(d){ return d[0]});


			// Little function to bring objects to the front
			d3.selection.prototype.moveToFront = function() { 
			  return this.each(function() { 
				this.parentNode.appendChild(this)
			  }); 
			}; 
			
			
			$('#occselect').chosen({width: "90%", allow_single_deselect: true, placeholder_text_single:"search for your area"}).on('change',function(evt,params){
		
								if(typeof params != 'undefined') {
										if(typeof filteredoccs !== "undefined"){
											d3.select("selectedbar").attr("id","#backrect" + filteredoccs);
										}
										var filteredocc = params.selected;
										filterfirst(filteredocc);
										d3.select("#backrect" + filteredocc).attr("id","selectedbar");
								}
								else {
									
									d3.select("#selectedbar").attr("id","#backrect" + filteredocc);
									filterremove();
										
								}
								
			});
			
			
			
			
			
//			// Occupation hierarchy
//			groupno = [];
//			
//			dvc.essential.occgroup.forEach(function(d,i){groupno.push(i+1)});
//			
//
//		  	occgroups = d3.zip(dvc.essential.occgroup,groupno);
//			
//			var optns2 = d3.select("#occgroup").append("div").attr("id","sel").append("select")
//				.attr("id","occgrpselect")
//				.attr("style","width:90%")
//				.attr("class","chosen-select");
//			
//			//append message
//			
//			optns2.append("option")
//				.attr("value","first")
//				.text("");
//			
//			optns2.selectAll("p").data(occgroups).enter().append("option")
//				.attr("value", function(d){ return d[1]}) 
//				.text(function(d){ return d[0]});
//
//			
//			
//			$('#occgrpselect').chosen({width: "90%", allow_single_deselect: false, disable_search:true, placeholder_text_single:"CHOOSE OCCUPATION GROUP"}).on('change',function(evt,params){
//		
//								if(typeof params != 'undefined') {
//									hier = params.selected;
//									
//									filtergroup();
//								}
//								else {
//								}
//								
//			});		
			
			

	} //End of make occupation


	function drawGraphic(width) {
		

		   var graphic = $('#graphic');
		   graphic.empty();
		   $('#static_graphic').empty();
		   graphicwidth = graphic.width();
		   threshold_md = 788;
		   threshold_sm = dvc.optional.mobileBreakpoint; // 510
		  
		
			
			
		   var numobs = graphic_data.length;
		  
		  	//set variables for chart dimensions dependent on width of #graphic
		    if (graphicwidth < threshold_sm) {
					ball = 5;     	
		            margin = {top: dvc.optional.margin_sm[0], right: dvc.optional.margin_sm[1], bottom: dvc.optional.margin_sm[2], left: dvc.optional.margin_sm[3]}; 
					chart_width = graphic.width() - margin.left - margin.right;
		            height = (dvc.optional.lineheight[0]*numobs) - margin.top - margin.bottom;
					lineheight = dvc.optional.lineheight[0];
					tspanupper = -5;
					tspanlower =8;
					mobtabdesk = 0;
		    } else if (graphicwidth < threshold_md){ 
					ball = 5; 
		        	margin = {top: dvc.optional.margin_md[0], right: dvc.optional.margin_md[1], bottom: dvc.optional.margin_md[2], left: dvc.optional.margin_md[3]}; 
					chart_width = graphic.width()*1 - margin.left - margin.right;
					chart_width2 = graphic.width()*0;
		            height = (dvc.optional.lineheight[1]*numobs) - margin.top - margin.bottom;
					lineheight = dvc.optional.lineheight[1];
					tspanupper = -6;
					tspanlower =9;
					mobtabdesk = 1;
		  	} else { ball = 5; 
		        	margin = {top: dvc.optional.margin_lg[0], right: dvc.optional.margin_lg[1], bottom: dvc.optional.margin_lg[2], left: dvc.optional.margin_lg[3]};
					chart_width = graphic.width()*1 - margin.left - margin.right;
					chart_width2 = graphic.width()*0;
		            height = (dvc.optional.lineheight[2]*numobs) - margin.top - margin.bottom;
					lineheight = dvc.optional.lineheight[2];
					tspanupper = -6;
					tspanlower = 9;
					mobtabdesk = 2;
			}

		    // clear out existing graphicsFhourly
		    graphic.empty();
			
			x = d3.scale.linear()
		        .range([ 0, chart_width]);

			y = d3.scale.ordinal()
			.rangePoints([0, height], .3);
				//.rangeRoundBands([0, height]);  // .1
		    

		    var yAxis = d3.svg.axis()
		        .scale(y)
		        .orient("left");
		    
		    var xAxis = d3.svg.axis()
		        .scale(x)
		        .orient('top')
				.tickSize(-height,0)
				.tickFormat(d3.format("s"));
		    			    
			//specify number or ticks on x axis
			if (graphic.width() <= threshold_sm) {
				xAxis.ticks(dvc.optional.x_num_ticks_sm_md_lg[0]);
			 } else if (graphic.width() <= threshold_md){
				xAxis.ticks(dvc.optional.x_num_ticks_sm_md_lg[1]);
			 } else {
				xAxis.ticks(dvc.optional.x_num_ticks_sm_md_lg[2]);
			 }
				
		     	lines = graphic_data.map(function(d,i) {
					
						return {  
							'name': d.AREANM,
							'code': d.AREACD,   // might not need since we mappe it in y.domain earlier
							'mymin': +d.yr1,   // + changes string to numeric.
							'mymax': +d.yr2,
							'diff': +d.yr2 - +d.yr1,
							'diffper': ((+d.yr2 - +d.yr1)/+d.yr1)*100
						};
					
		        });
				
						
			lines.sort(function(a,b) {return a.mymin-b.mymin});
					
							
				
								
				y.domain(lines.map(function(d) { return d.name; }));
				
				var memax = d3.max(lines, function(d){
													return d.mymax;
													});
				
				var memin = d3.min(lines, function(d){
													return d.mymin;
													});
			
				//x domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
				var xDomain = dvc.essential.xAxisScale;
				var yDomain = dvc.essential.yAxisScale;
				
				x.domain(xDomain);
			
			
		    //create svg for chart
		    var svg = d3.select('#graphic').append('svg')
				        .attr("width", graphic.width())
				        .attr("height", height + margin.top + margin.bottom +30)
				        .append("g")
				        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
					svg.append("rect")
						.attr("class","svgRect")
						.attr("width", chart_width)
						.attr("height", height);
			    
				    svg.append('g')
				        .attr('class', 'x axis')
				        .attr("transform", "translate(0, 0)")
				        .call(xAxis);
					
					d3.select("#graphic").select(".x").selectAll("text").transition().duration(2000).attr("fill","none");
					
					//create y axis, if x axis doesn't start at 0 drop x axis accordingly	
					svg.append('g')
				        .attr('class', 'y axis')
				        .attr('transform', function(d){ 
				        			if(xDomain[0] != 0){
										return 'translate(' + ( 5) + ',0)'
									} else {
										return 'translate(' + 0  + ', 0)'
									}
							})
				        .call(yAxis)
						.selectAll("text")	
            			.style("text-anchor", "start");
					
				d3.selectAll(".y text")
						.each(insertLinebreaks);		
				
				tie_split = svg.append("g").attr("id","tiefight");
				
				
				// Build male / female split graph 
//				if (graphic.width() > threshold_sm) {
//				
//				
//				
//					var svgsplit = d3.select('#graphic').select('svg').append('g')
//				        .attr("width", chart_width2)
//				        .attr("height", height + margin.top + margin.bottom +30)
//				        .append("g")
//				        .attr("transform", "translate(" + (chart_width + margin.left + margin.right)+ "," + margin.top + ")");
//				
//					svgsplit.append("rect")
//						.attr("class","svgRect")
//						.attr("width", chart_width2)
//						.attr("height", height);
//					
//					
//				}
				
									
				// Create top graphic	
				height2 = 30;
				
				y2 = d3.scale.ordinal()
					.rangePoints([0, height2], .3);
						//.rangeRoundBands([0, height]);  // .1
		   		
				y2.domain(lines.filter(function(d) {return d.code == 1115}).map(function(d) { return d.name; }));
								
				var yAxis2 = d3.svg.axis()
					.scale(y2)
					.orient("left");
					
				//set y domain later?
				
					
				labels = d3.select('#static_graphic').append("div")
				        .attr('class', 'labelling');
						 
					labels.append("p")
						 .style("padding-top","5px")
						 .style("padding-right","10px")
						 .attr("display","inline-block")
						 .style("text-align", "right")
						 .style("width","250px")
						 .style("float","right")
						 .text("one-year survival estimate (%)");

					var legend =labels.append('ul')
			                .attr('class', 'key')
			            .selectAll('li')
			                .data(dvc.essential.legendLabels)
			            	.enter()
							.append("li")
							
					legend.append('b')
						 	.attr("class",function(d,i){return "background" + i})
							 
					legend.append('label')
				         .html(function(d,i) { return dvc.essential.legendLabels[i];  });	


	
				
				
				
				var svgtop = d3.select('#static_graphic').append('svg')
				        .attr("width", graphicwidth)
				        .attr("height", 20)
				        .append("g")
				        .attr("transform", "translate(" + margin.left + ",20)");
				
					svgtop.append("rect")
						.attr("class","svgRect")
						.attr("width", chart_width)
						.attr("height", height2);
			    
				    svgtop.append('g')
				        .attr('class', 'x axis')
				        .attr("transform", "translate(0, 0)")
				        .call(xAxis);

					//create y axis, if x axis doesn't start at 0 drop x axis accordingly	
					svgtop.append('g')
				        .attr('class', 'y2 axis')
				        .attr('transform', 'translate(5, 0)')
				        .call(yAxis2)
						.selectAll("text")
						.attr("x", -margin.left)
						.style("text-anchor", "start");
				
				d3.selectAll(".y2 text")
						.each(insertLinebreaks);		
											
				
				svgtop.append("g").attr("id","tiefighttop");
				tieFight(lines);
      
		//create centre line if required
					if (dvc.optional.centre_line == true){
							groups.append("line")
							.attr("id","centreline")
							.attr('y1',0)
							.attr('y2',height)
							.attr('x1',x(dvc.optional.centre_line_value))
							.attr('x2',x(dvc.optional.centre_line_value));
					
					} else if(xDomain[0] <0){
						//svg.append("line")
						groups.append("line")
							.attr("id","centreline")
							.attr('y1',0)
							.attr('y2',height)
							.attr('x1',x(0))
							.attr('x2',x(0));
					}  	
	
							
			//create link to source				
//			d3.select(".footer").append("p")
//				.text("Source: ")
//				.append("a")
//				.attr("href", dvc.essential.sourceURL)
//				.attr("target", "_blank")
//				.html(dvc.essential.sourceText);
						
			//use pym to calculate chart dimensions	
		    if (pymChild) {
		        pymChild.sendHeight();
		    }
	}
		
	function tieFight(linesfilt) {
			
			groups = d3.select("#tiefight").selectAll('g')
						.data(linesfilt, function(d) { return d.name; });
						//
							
			groupsa = groups.enter().append('g');
			
			groupsa.attr("transform",function(d,i){return "translate(0," + y(d.name) +")"});
						
			groups.transition().duration(2000).attr("transform",function(d,i){return "translate(0," + y(d.name) +")"});		
				
			groups.exit().remove();
			
			
			backrect1 = 	groupsa.append('rect')
						.attr("class","backrect1")
						.attr("width",function(d,i){return margin.left})
						.attr("height",lineheight)
						.attr("x",0-margin.left)
						.attr("y",-lineheight/2);
			
			backrect1.transition().duration(2000);
			
			backrect2 = 	groupsa.append('rect')
						.attr("class","backrect2")
						.attr("id",function(d,i){return "backrect" + d.code})
						.attr("width",function(d,i){return graphicwidth})
						.attr("height",lineheight)
						.attr("x",0)
						.attr("y",-lineheight/2)
						.on("mouseover",function(d,i){showTooltip(d, this); d3.select(this).attr("class","backrect2hover")})
						.on("mouseout",function(){removeTooltip(); d3.select(this).attr("class","backrect2")});
			
			
			$("#graphic").scroll(function(){ removeTooltip()});
			
			backrect2.transition().duration(2000);
					
var ms_ie = false;
    var ua = window.navigator.userAgent;
    var old_ie = ua.indexOf('MSIE ');
    var new_ie = ua.indexOf('Trident/');

    if ((old_ie > -1) || (new_ie > -1)) {
        ms_ie = true;
    }
			
			linesx = groupsa.append('line')
					.attr('class', function(d, i) {
			                if ( d.mymin <0 ) { 
								return 'tiefighter line_neg'; 
							} else { 
								return 'tiefighter line_pos'; 
							}
			            })
					.style("stroke","#abc")
					//.style("opacity", 0)
					.attr('x1', function(d) { return x(d.mymin); })  //d.mymin
					.attr('x2', function(d) { 
						if ( ms_ie ) {
							//IE specific code goes here
							return x(d.mymax);
						} else {
							return x(d.mymin); 
						}
														
					 })
					.attr("marker-end", "url(#markerArrow)")
				
		if ( ms_ie == false) {			
			linesx.transition().duration(2000)
					.attr('x2', function(d) { return x(d.mymax); });
		}


//			textper = groupsa.append('text')
//					.attr("class","textper")
//					//.style("opacity", function(d,i){
////						if(d.mymin == 0 || d.mymax == 0 )
////							 {return 0} 
////						else {return 1}
////					})				
//					.attr('x',-9)
//					.attr('y',4)
//					.text(function(d,i){
//						if(d.mymin == 0 || d.mymax == 0 )
//							 {return "*"} 
//						else {return dvc.format1(d.diffper) + "%";}
//					});
					
//			textper.transition().duration(2000).attr('x',function(d,i) { return -9; });

			circle1 = groupsa.append('circle')
					.attr("class","circle1")
					.attr('r', ball)
//					.style("opacity", function(d,i){
//						if(d.mymin == 0)
//							 {return 0} 
//						else {return 1}
//					})				
					.attr('cx',function(d,i) { return x(d.mymin); });

			circle1.transition().duration(2000).attr('cx',function(d,i) { return x(d.mymin); });
//
//					
//			circle2 = groupsa.append('circle')
//					.attr("class","circle2") 
////					.style("opacity", function(d,i){
////						if(d.mymax==0)
////							 {return 0} 
////						else {return 1}
////					})
//					 // make it .circle2 for different end colour
//					.attr('cx',function(d,i) { return x(0); }) 
//					//.attr('cy',function(d,i) {return y(d.name); }) 
//					.attr('r', ball); // (1/lines.length)*40);
//			
//			
//			circle2.transition().duration(2000).attr('cx',function(d,i) { return x(d.mymax); });	
			




//			rect1 = 	groupsa.append('rect')
//						.attr("class","rect1")
//						.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitf})
//						.attr("height",10)
//						.attr("x",chart_width + margin.right)
//						.attr("y",-5);
//			
//			rect1.transition().duration(2000)
//				.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitf})
//				.attr("x",chart_width + margin.right)
						
//			rect2 = 	groupsa.append('rect')
//						.attr("class","rect2")
//						.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitm})
//						.attr("height",10)
//						.attr("x",function(d,i){return (chart_width+margin.right)+(((graphicwidth-80) * 0.2)*d.jobsplitf)})
//						.attr("y",-5);
//						
//			rect2.transition().duration(2000)
//				.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitm})
//				.attr("x",function(d,i){return (chart_width+margin.right)+(((graphicwidth-80) * 0.2)*d.jobsplitf)});
				
			
			}
			
	function tieFightTop() {
			
			$("#static_graphic").show(1000);
			
			groupstop = d3.select("#tiefighttop").selectAll('g')
						.data(filteredsel, function(d) { return d.name; });
						//
						
			groupsatop = groupstop.enter().append('g');

			y2.domain(filteredsel.map(function(d) { return d.name; }));
			
			yAxis2 = d3.svg.axis().scale(y2).orient("left");			
			
			d3.select(".y2.axis")
				.transition()
				.duration(2000)
				.call(yAxis2)
				.selectAll("text")
				.attr("x", -margin.left)
				.style("text-anchor", "start");
				
			d3.selectAll(".y2 text")
				.each(insertLinebreaks);				
			
			groupsatop.attr("transform",function(d,i){return "translate(0," + y2(d.name) +")"});
						
			groupstop.transition().duration(2000).attr("transform",function(d,i){return "translate(0," + y2(d.name) +")"});		
				
			groupstop.exit().remove();
			
				
			backrect2top = 	groupsatop.append('rect')
						.attr("class","backrect2hover")
						.attr("width",function(d,i){return graphicwidth})
						.attr("height",lineheight-8)
						.attr("x",0)
						.attr("y",-(lineheight-8)/2)
						.on("mouseover",function(){})
						.on("mouseout",function(){});
			
			backrect2top.transition().duration(2000);
					
	var ms_ie = false;
    var ua = window.navigator.userAgent;
    var old_ie = ua.indexOf('MSIE ');
    var new_ie = ua.indexOf('Trident/');

    if ((old_ie > -1) || (new_ie > -1)) {
        ms_ie = true;
    }

    
			
			linesxtop = groupsatop.append('line')
					.attr('class', function(d, i) {
			                if ( d.mymin <0 ) { 
								return 'tiefighter line_neg'; 
							} else { 
								return 'tiefighter line_pos'; 
							}
			            })
					.style("stroke","#abc")
					.style("opacity", function(d,i){
						if(d.mymin==0 || d.mymax==0)
							 {return 0} 
						else {return 1}
					}).attr('x1', function(d,i) {return x(d.mymin); })  //d.mymin
					.attr('x2', function(d) { 
						if ( ms_ie ) {
							//IE specific code goes here
							return x(d.mymax);
						} else {
							return x(d.mymin); 
						}
					})
					.attr("marker-end", "url(#markerArrow)");
					
			
			if ( ms_ie ==false ) {
				
				linesxtop.transition().duration(2000)
					//.attr('x1', function(d,i) {return x(d.mymin); })  //d.mymin
					.attr('x2', function(d) { return x(d.mymax); });			
						
			}
					
			

					
			circle1top = groupsatop.append('circle')
					.attr("class","circle1")
					.attr('r', ball)
//					.style("opacity", function(d,i){
//						if(d.mymin == 0)
//							 {return 0} 
//						else {return 1}
//					})
//									
					.attr('cx',function(d,i) { return x(d.mymin); });

			//circle1top.transition().duration(2000).attr('cx',function(d,i) { return x(d.mymin); });
//
//					
//			circle2top = groupsatop.append('circle')
//					.attr("class","circle2") 
//					.style("opacity", function(d,i){
//						if(d.mymax==0)
//							 {return 0} 
//						else {return 1}
//					})
//					 // make it .circle2 for different end colour
//					.attr('cx',function(d,i) { return x(0); }) 
//					//.attr('cy',function(d,i) {return y(d.name); }) 
//					.attr('r', ball); // (1/lines.length)*40);
//			
//			
//			circle2top.transition().duration(2000).attr('cx',function(d,i) { return x(d.mymax); });	
			
			
//			textpertop = groupsatop.append('text')
//					.attr("class","textper")
//					.style("opacity", function(d,i){
//						if(d.mymin == 0 || d.mymax == 0 )
//							 {return 0} 
//						else {return 1}
//					})				
//					.attr('x',-9)
//					.attr('y',4)
//					.text(function(d,i){
//						if(d.mymin == 0 || d.mymax == 0 )
//							 {return "*"} 
//						else {return dvc.format1(d.diffper)+ "%";}
//					});
					
//			textpertop.transition().duration(2000).attr('x',function(d,i) { return -9; });
//	
//			rect1top = 	groupsatop.append('rect')
//						.attr("class","rect1")
//						.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitf})
//						.attr("height",10)
//						.attr("x",chart_width + margin.right)
//						.attr("y",-5);
//						
//			rect2top = 	groupsatop.append('rect')
//						.attr("class","rect2")
//						.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitm})
//						.attr("height",10)
//						.attr("x",function(d,i){return (chart_width+margin.right)+(((graphicwidth-80) * 0.2)*d.jobsplitf)})
//						.attr("y",-5);
//			
//			rect1top.transition().duration(2000)
//				.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitf})
//				.attr("x",chart_width + margin.right);
//						
//			rect2top.transition().duration(2000)
//				.attr("width",function(d,i){return ((graphicwidth-80) * 0.2)*d.jobsplitm})
//				.attr("x",function(d,i){return (chart_width+margin.right)+(((graphicwidth-80) * 0.2)*d.jobsplitf)});
//			
			
				
			//Scroll to relevant	
			d3.select("#graphic").transition().duration(3000).delay(1000).tween("uniquetweenname", scrollTopTween((index*dvc.optional.lineheight[mobtabdesk])-200));
	}

	function scrollTopTween(scrollTop) {
	  return function() {
		var i = d3.interpolateNumber(this.scrollTop, scrollTop);
		return function(t) { this.scrollTop = i(t); };
	 };
	}
	
	
	function sortme(varsel, direction){
		
		if(filtergroupx ==true){
			linesubsel = linesubsel;
		} else {
			linesubsel = lines;
		}
		
		
		d3.selectAll(".sort").classed("active");
		d3.selectAll(".direction").classed("active");
		
		if(direction=="asc"){
					if(varsel =="amount"){
						linesubsel.sort(function(a,b) {return a.diff-b.diff});
					}
					else if (varsel =="percent"){
						linesubsel.sort(function(a,b) {return a.diffper-b.diffper});
					}
					else if (varsel =="yr1"){
						linesubsel.sort(function(a,b) {return a.mymin-b.mymin});
					}
					else if(varsel =="yr2"){
						linesubsel.sort(function(a,b) {return a.mymax-b.mymax});
					}
		} else {
					
					if(varsel =="amount"){
						linesubsel.sort(function(a,b) {return b.diff-a.diff});
					}
					else if (varsel =="percent"){
						linesubsel.sort(function(a,b) {return b.diffper-a.diffper});
					}
					else if (varsel =="yr1"){
						linesubsel.sort(function(a,b) {return b.mymin-a.mymin});
					}
					else if(varsel =="yr2"){
						linesubsel.sort(function(a,b) {return b.mymax-a.mymax});
					}
		}

			y.domain(linesubsel.map(function(d) { return d.name; }));
			
			yAxis = d3.svg.axis().scale(y).orient("left");
			
			d3.select(".y.axis").transition().duration(2000).call(yAxis).selectAll("text").attr("x", -margin.left).style("text-anchor", "start");
			
		d3.selectAll(".y text")
				.each(insertLinebreaks);	
					
			tieFight(linesubsel);

		    //d3.select("#graphic").transition().duration(3000).delay(3000).tween("uniquetweenname", scrollTopTween(2000));
			
	
	}
	
	function filterfirst(filteredocc){
		
		d3.select('#static_graphic').select("svg").transition().duration(2000).attr("height",60);
		
		index = lines.map(function(d) { return d.code; }).indexOf(filteredocc)
		filteredsel = lines.filter(function(d,i) {return d.code == filteredocc;});
				
		tieFightTop();
		
	}
	function filterremove(){
		
		d3.select('#static_graphic').select("svg").transition().duration(2000).attr("height",20);
	
	}
	
	
	function filtergroup(){
		
		filtergroupx =true;
		
	
		y = d3.scale.ordinal()
			.rangePoints([0, height], .3);
		
		linesubsel = lines.filter(function(d,i) {return d.hierarchy == hier;});
		
		var numobs = linesubsel.length;

		    if (graphicwidth < threshold_sm) {
	            height = (dvc.optional.lineheight[0]*numobs) - margin.top - margin.bottom;
		    } else if (graphicwidth < threshold_md){ 
		        height = (dvc.optional.lineheight[1]*numobs) - margin.top - margin.bottom;
		  	} else { ball = 5; 
		        height = (dvc.optional.lineheight[2]*numobs) - margin.top - margin.bottom;
			}
			
		d3.select('#graphic').select('svg')
				        .attr("height", height + margin.top + margin.bottom +30)	
		
		y = d3.scale.ordinal()
			.rangePoints([0, height], .3);
		
		y.domain(linesubsel.map(function(d) { return d.name; }));
			
		yAxis = d3.svg.axis().scale(y).orient("left");
			
		d3.select(".y.axis").transition().duration(2000).call(yAxis).selectAll("text").attr("x", -margin.left).style("text-anchor", "start");
			
			
		d3.selectAll(".y text")
			.each(insertLinebreaks);	
		
		
		tieFight(linesubsel);
		
	}
	
	function showTooltip(d, sel) {
	
			var element = sel;
						
			if ( graphicwidth > dvc.optional.mobileBreakpoint ) {
				
				//work out content upfront
				
//				if(d.mymax > 0){
//					var femearn = "s earn <b> £" + dvc.format1(d.mymax)+ "</b> per hr";
//				} 
//				else {
//					var femearn = " earnings unavailable"
//				}
//				
//				if(d.mymin > 0){
//					var maleearn = "s earn <b> £" + dvc.format1(d.mymin)+ "</b> per hr";
//				} 
//				else {
//					var maleearn = " earnings unavailable"
//				}
//				
//				if(d.diffper > 0){
//					var diffs = "Pay gap of <b>" + dvc.format1(d.diffper)+ "%</b>";
//				} 
//				else {
//					var diffs = "Pay gap unavailable"
//				}
//				
//				if(d.earnfann > 0) {
//					var annF = "  (£"+  dvc.format1(d.earnfann) +  " year)";
//				} else {
//					var annF = "";
//				}
//				
//				if(d.earnmann > 0) {
//					var annM = "  (£"+  dvc.format1(d.earnmann) +  " year)";
//				} else {
//					var annM = "";
//				}
				
			
					
	//			var maleearn =;
//				var gap =;
//				var fprop = ;
				
					$(element).popover({
							title: function() {return  "<div style='font-size: 14px;'><b>" + d.name + "</b>"} ,
							placement: 'auto',
							container: '#graphic',
							id:"toolTip",
							trigger: 'manual',
							html : true,
							content: function() { 
								format= d3.format(".1f");
								
								return  "<div style='font-size: 14px;'>One year survival estimate: </div>" +
										"<div style='font-size: 14px; margin-left: 15px;'> <b> 1998: </b> " + format(d.mymin)  + "% </div>" +
									 	"<div style='font-size: 14px; margin-left: 15px;'> <b> 2013: </b>" + format(d.mymax)  + "% </div>" +
										"<div style='font-size: 14px;'> An increase of " + format(d.diff) + "</div>" ;
							}
						 
					});
					$(element).popover('show');
					
	
			}// end if ...
			
	
			
	}//end function showTooltip
	
	function removeTooltip() {
		
			$('.popover').each(function() { $(this).remove(); });

	}//function removeTooltip	
	
	function insertLinebreaks() {
								
		var str = $(this).text();
		

		if(str.length > 28){
			
			var middle = Math.floor(str.length / 2);
			var before = str.lastIndexOf(' ', middle);
			var after = str.indexOf(' ', middle + 1);
			
			if (middle - before < after - middle) {
				middle = before;
			} else {
				middle = after;
			}
			
			var s1 = str.substr(0, middle);
			var s2 = str.substr(middle + 1);
	
			d3.select(this).text("");
	
			d3.select(this).append('tspan').text(s1).attr("x",-margin.left).attr("y",tspanupper);//-7
			d3.select(this).append('tspan').text(s2).attr("x",-margin.left).attr("y",tspanlower);//8
		
		} else {
			
			d3.select(this).attr("x",-margin.left);
		}
	};
	



	
	$("#submitPost").click(function( event ) {
					event.preventDefault();
					event.stopPropagation();
					myValue=$("#pcText").val();
					d3.select("#selectedbar").attr("id","backrect" + dvc.area)
					getCodes(myValue);
	});
		
	$("#clearBtn").click(function( event ) {
					event.preventDefault();
					event.stopPropagation();
	
					d3.select("#selectedbar").attr("id","backrect" + dvc.area)
					d3.select("#clearBtn").classed("hide", true);
					filterremove();			
	});
		
	
	
	function getCodes(myPC)	{
		
		var myURIstring=encodeURI("https://api.postcodes.io/postcodes/"+myPC);
		$.support.cors = true; 
		$.ajax({
			type: "GET",
			crossDomain: true,
			dataType: "jsonp",
			url: myURIstring,
			error: function (xhr, ajaxOptions, thrownError) {
					$("#pcError").text("couldn't process this request").show();
				},
			success: function(data1){
					if(data1.status == 200 ){
								dvc.area =data1.result.codes.ccg;
								areaName = data1.result.ccg;
			
								filterfirst(dvc.area);
								d3.select("#backrect" + dvc.area).attr("id","selectedbar");

								d3.select("#clearBtn").classed("hide", false);
				
					} else {
       
					$("#areainfo").text("Not a valid postcode I'm afraid").show();
				}
			} 

		});
	
	}





	}
	) 
}

