var dvc = {};


if (Modernizr.inlinesvg) {
$(document).ready(function(){	
	pymChild = new pym.Child();
	
	d3.select("#altern").remove();
	//If browser supports inline SVG then show the main graphic (container)
	$("#ashe").show();
	
	//Load in the CSV file full of occupation data
	d3.csv("assets/input.csv", function(error, data) {
   	
	
	
	//Transform this data so that it is grouped by the occupation hierarchy
	nesty = d3.nest()
		.key(function(d) {return d.hierarchy;})
		.entries(data);
	
	console.log(nesty);
	
	defineDefs();
	showPanels();
	
	//Create the DVC object array so that we can store variables without risk of them interfering with anyone elses site.
	dvc = [];	
	
	//set starting panel and occupation;
	
	dvc.panel = 0;
	dvc.occupation = 0;
	
	// Set format for numbers
	
	dvc.nformat = d3.format("0,000");
	
	//What are the hierarchies - will load from seperate file eventually
	dvc.occ = ["Managers,  directors  & senior  officials","Professional","Associate  professional  & technical","Admin &  secretarial","Skilled  trades","Caring,  leisure  & other  services ","Sales &  customer  service","Process,  plant &  machine  operatives","Elementary"];
	
	//Set some padding for the main chart
	dvc.xPadding = 50;
	dvc.yPadding = 30;
	dvc.show = true;
	
	//Create an array to store all of the earnings data - then we will be able to interogate it's properties.
	dvc.allEarn = [];
		
	data.forEach(function(d,i){	
			dvc.allEarn.push(data[i].earningsa);								
	});
	
	//Create an array to store all of the male earnings data
	dvc.allEarnm = [];
		
	data.forEach(function(d,i){	
			dvc.allEarnm.push(data[i].earningsm);								
	});
	
	
	//Create an array to store all of the female earnings data
	dvc.allEarnf = [];
		
	data.forEach(function(d,i){	
			dvc.allEarnf.push(data[i].earningsf);								
	});
	
	//Create an array to store all of the occupations
	dvc.allocc = [];
		
	data.forEach(function(d,i){	
			dvc.allocc.push(data[i].occupation);								
	});
	
	
	
	

	//Get the min & max of the earnings data
	dvc.maxValue = d3.max(dvc.allEarn, Number);
	dvc.minValue = d3.min(dvc.allEarn, Number); 
	
	dvc.maxValuem = d3.max(dvc.allEarnm, Number); 
	dvc.maxValuef = d3.max(dvc.allEarnf, Number); 
	
	dvc.maxValueAll = d3.max([dvc.maxValuem,dvc.maxValuef],Number);

	dvc.quantiles = [19135,	27017, 38110];
	
	//Build a 1) Slider to allow selection of a range of incomes to display on the chart
	//		  2) A drop down where you can select individual occupations
	
	incomeSlider();
	owl();
	
	//Append Title
	d3.select("#owl").append("div").attr("id","hide").text("explore the data")
		.on("click",function(){$(".owl-stage-outer").slideToggle(300, "linear"); $("#controls").slideToggle(300, "linear");
			if(dvc.show)
				{dvc.show = false; 
				 d3.select("#hide").transition().duration(300).ease("linear").style("top","-10px").text("show me the stories"); 
				 d3.selectAll(".chartcircles").attr("class","chartcircles").attr("pointer-events","all");
				 d3.selectAll(".items").attr("class","items col-sm-3 hidden");
				 d3.select("#charts").attr("class","items col-sm-3 show");
				 d3.select("#secondContainer").transition().duration(100).style("border-top-color","#fff").style("border-top-width","0px");				 
				 }
			else{dvc.show = true; 
				 d3.select("#hide").transition().duration(300).ease("linear").style("top","134px").text("explore the data");
				 d3.selectAll("circle").attr("pointer-events","none");
				 d3.select("#charts").attr("class","well col-sm-3 hidden");
				 };
	
			});


	//Append main svg element and group to contain all of the chart stuff
	
	dvc.svg = d3.select("#ashecont").append("div").attr("id","secondContainer").append("svg").attr("viewBox","0 0 705 590").attr("preserveAspectRatio","xMinYMin meet").attr("id","SVGele").append("g").attr("transform","translate(" + dvc.xPadding + "," + dvc.yPadding + ")");
	
	occopt ();
	
	dvc.occHeight = 400;
	dvc.occWidth = 600;

	//Set the scales up
	dvc.yScale=d3.scale.linear()
		.domain([dvc.maxValue,dvc.minValue])
		.range([0,dvc.occHeight])
		.nice();
		
		
	//Create xScale variable (ordinal - for number of categories)
	dvc.xScale=d3.scale.ordinal()
					.domain(dvc.occ)
					.rangeBands([0,dvc.occWidth],0.1);

	//Create a yAxis based on the yScale
	dvc.yAxis=d3.svg.axis()
			.scale(dvc.yScale)
			.orient("left")
			.ticks(8)
			.tickSize(-(dvc.occWidth));

	// Append the axis to the chart
			
	dvc.svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(0, 0)")
		.call(dvc.yAxis);

			
	//Add Median lines and quantile shading
	
	dvc.svg.append("line")
		.attr("id","median")
		.attr("x1",(dvc.xScale(dvc.occ[0])+30))
		.attr("x2",((dvc.xPadding+15) + dvc.xScale(dvc.occ[dvc.occ.length -1])))
		.attr("y1",dvc.yScale(dvc.quantiles[1]))
		.attr("y2",dvc.yScale(dvc.quantiles[1]))
		.attr("stroke-width",2).attr("stroke","#ccc")
		.attr("fill","#ccc");
		

	dvc.svg.append("text")
		.attr("id","mediantxt")
		.text("UK median")
		.attr("x",(dvc.xScale(dvc.occ[8])-10))
		.attr("y",dvc.yScale(dvc.quantiles[1])-3)
		.attr("fill","#ccc");
					
	//Append a group element for each occupation hierarchy
	groups = dvc.svg.selectAll("footer")
		.data(nesty)
		.enter()
		.append("g")
		.attr("transform",function(d,i)	{
							return "translate("+ (dvc.xPadding + dvc.xScale(dvc.occ[i])) + ",0)";
						});
	
	// For each of the groups call the makeCircles function to draw the circles associated with the group
	groups.each(makeCircles);
	
	

	
	
	var insertLinebreaks = function () {
		
		var el1 = this.firstChild;
		var el = el1.data;

		var words = el.split('  ');
		
		d3.select(this).text('');

	
		for (var i = 0; i < words.length; i++) {
			var tspan = d3.select(this).append('tspan').text(words[i]);
			if (i > 0)
				tspan.attr('x', 0).attr('dy', '15');
		}
	};


	//Append a label for each occupation hierarchy
	groups.append("text").attr("id","labels").attr("text-anchor","middle").attr("transform","translate(0,470)").text(function(d,i){return dvc.occ[i]});
	
	//Append y-axis label
	dvc.svg.append("text").attr("id","yaxislab").attr("x",-50).attr("y",-18).text("Full-time earnings (£'s)");
	
	//Append x-axis label
	dvc.svg.append("text").attr("id","xaxislab").attr("x",250).attr("y",550).text("Occupation groups");

	
	//Append a circle for each occupation hierarchy
	groups.append("circle")
		.attr("id","circles")
		.attr("cx",0)
		.attr("cy",0)
		.attr("r",15)
		.attr("class", function(d,i){return "fill" + i})
		.attr("transform","translate(0,430)");
		
	groups.append("text").attr("id","circletext").attr("text-anchor","middle").attr("transform","translate(0,436)").attr("fill","#fff").text(function(d,i){return i+1});
	
	groups.selectAll("text").each(insertLinebreaks);
	
	
	//get any preselected parameters
	getParams();

	function showPanels() {
		setTimeout(function(){
			d3.select(".owl-carousel").selectAll(".tiles").on("mouseover",function(){d3.select(this).style("opacity","1");}).on("mouseout",function(){d3.select(this).style("opacity","0.7");}).on("click", whichOne);
			
			},1000);
	}
	
	
	function whichOne() {

		d3.select(".selecttile").classed("selecttile", false).style("opacity","0.7").on("mouseover",function(){d3.select(this).style("opacity","1");}).on("mouseout",function(){d3.select(this).style("opacity","0.7");});
		
		d3.select(this).classed("selecttile", true).on("mouseover",null).on("mouseout",null);
	
		var idis = d3.select(this).attr("id");
		
		var idof = "y" + idis.substr(1,1);
		
		d3.selectAll(".items").attr("class","items col-sm-3 hidden");
		
		d3.select("#" + idof).attr("class", "items col-sm-3 show");
	
		$('#earningsform').submit(function(event) {
			
			  event.preventDefault();
			  event.stopPropagation();
			  
			  d3.selectAll("#salaryrow").remove();
			  d3.selectAll(".chartcircles").classed("circlel", false);
			  
			  d3.select("#y1").select("table").attr("class","table-striped show");
			  
			  // prevent default browser behaviour
			 
			
			  //do stuff with your form here
		
			  var ownearn = $("#inputSuccess4").val();
				
			  //Error trap
			  //Remove any commas or £ signs
			  ownearnerror = ownearn.replace(/([,£])/g, '');
			  
			  if(isNaN(ownearnerror)){
				//If it's still not a number then throw a wobbler  
				  
				
				d3.select("#earningform").attr("class","form-group has-error");  
				
				} else {
				
					//continue
				d3.select("#earningform").attr("class","form-group has-feedback");	
					//Create array of differences
			  
			 	dvc.allDiff = [];
		
				dvc.allEarn.forEach(function(d,i){	
						dvc.allDiff.push(Math.abs(dvc.allEarn[i] - ownearnerror));								
				});
				
				var zipped = d3.zip(dvc.allocc,dvc.allDiff,dvc.allEarn,dvc.allCode);
				
				
				
				zipped.sort(function(a, b){ return d3.ascending(a[1], b[1]); });
				
				var subset = zipped.slice(0,5);
				
				var tabley = d3.select("#y1").select("table").select("tbody").selectAll("footer")
					.data(subset)
					.enter()
					.append("tr")
					.attr("id","salaryrow");
					
					
				tabley.append("td")
					.text(function(d,i){return d[0]});
				tabley.append("td")
					.text(function(d,i){return "£" + dvc.nformat(d[2])});
					
				subset.forEach(function(d,i){d3.select("#occ" + subset[i][3]).classed("circlel", true).moveToFront()})

				
				}});
			
		if(idof == "y2"){startquiz()};
		if(idof == "y3"){startmfquiz()};
		if(idof == "y4"){topten()};
		if(idof == "y5"){bottomten()};
		
		
		dvc.panel = idof;
		dvc.occupation = 0;
		updateHash();

			
	}
			
		
	function startquiz() {
		d3.selectAll(".chartcircles").attr("class","chartcircles");
		resety2();
		dvc.occearn = [["Garage managers / proprietors",30949,1252],["Hairdressing / Salon Managers & Proprietors",25005,1253],["Journalists / Editors",31980,2471],["Senior Police Officers",57896,1172],["Optician",38484,2214],["Vet",40804,2216],["Civil Engineer",38508,2121],["Conservation Professional",30208,2141],["Psychologist",38212,2212],["Programmers/Software development professionals",39298,2136]];
		
		dvc.iteration=0;
		dvc.occscore=0;

		d3.select("#topocc")
			.append("h4")
			.text(dvc.occearn[dvc.iteration][0]);
			
		d3.select("#topocc")
			.append("div")
			.attr("id","imagediv")
			.append("img")
			.attr("width","140px")
			.attr("src","images/icon_" + (dvc.iteration+1) +".svg")
			.on("click",function (){testanswer("a")})
			
		d3.select("#topocc")
			.append("h4")
			.attr("class","incometext")
			.text("£?");	
			
		d3.select("#bottomocc")
			.append("h4")
			.text(dvc.occearn[dvc.iteration+1][0]);		
				
		d3.select("#bottomocc")
			.append("div")
			.attr("id","imagediv")
			.append("img")
			.attr("width","140px")
			.attr("src","images/icon_" + (dvc.iteration+2) +".svg")
			.on("click",function (){testanswer("b")})
		
		d3.select("#bottomocc")
			.append("h4")
			.attr("class","incometext")
			.text("£?");
	
	};
	
	
	function testanswer(x) {
		
		d3.select("#topocc").style("pointer-events","none");
		d3.select("#bottomocc").style("pointer-events","none");
	
		selected = x;
	
	
		
		d3.select("#topocc")
			.select(".incometext")
			.text("£" + dvc.nformat(dvc.occearn[dvc.iteration][1]));
			
		d3.select("#bottomocc")
			.select(".incometext")
			.text("£" + dvc.nformat(dvc.occearn[dvc.iteration+1][1]));
		
	
		
		if(dvc.occearn[dvc.iteration][1] > dvc.occearn[dvc.iteration+1][1])
		{	
			d3.select("#topocc").attr("opacity","0.5");
			d3.select("#occ" + dvc.occearn[dvc.iteration][2]).classed("correct",true).moveToFront();
			d3.select("#occ" + dvc.occearn[dvc.iteration+1][2]).classed("wrong",true).moveToFront();
			
			if(selected == "a"){
				d3.select("#y2").select("#wrngright").append("h3").text("Correct!");
				d3.select("#topocc").select("#imagediv").style("border","3px solid green")
				d3.select("#topocc").select("img").style("opacity",1);

				dvc.occscore = dvc.occscore+1;
			} else {
				d3.select("#y2").select("#wrngright").append("h3").text("Unlucky");
				d3.select("#bottomocc").select("#imagediv").style("border","3px solid red")
				d3.select("#bottomocc").select("img").style("opacity",1);	
				
			}
			
		} else {
	
			d3.select("#occ" + dvc.occearn[dvc.iteration][2]).classed("wrong",true).moveToFront();	
			d3.select("#occ" + dvc.occearn[dvc.iteration+1][2]).classed("correct",true).moveToFront();

			if(selected == "a"){
				d3.select("#y2").select("#wrngright").append("h3").text("Unlucky");
				d3.select("#topocc").select("#imagediv").style("border","3px solid red")
				d3.select("#topocc").select("img").style("opacity",1);

			} else {
				d3.select("#y2").select("#wrngright").append("h3").text("Correct!");
				d3.select("#bottomocc").select("#imagediv").style("border","3px solid green")
				d3.select("#bottomocc").select("img").style("opacity",1);

				dvc.occscore = dvc.occscore+1;	
			}			
		
		
		}


		
		d3.select("#nexthide").attr("class","btn btn-default btn-block show").on("click", loadnext);
	
		
		
	}
	

	
	
	function loadnext() {
	
		resety2();
		
		dvc.iteration = dvc.iteration + 2;

		
		if(dvc.iteration != 10) {
		
			d3.select("#topocc")
			.append("h4")
			.text(dvc.occearn[dvc.iteration][0]);
					
			d3.select("#topocc")
				.append("div")
				.attr("id","imagediv")
				.append("img")
				.attr("width","140px")
				.attr("src","images/icon_" + (dvc.iteration+1) +".svg")
				.on("click",function (){testanswer("a")})
			
			d3.select("#topocc")
				.append("h4")
				.attr("class","incometext")
				.text("£?");
			
				
			d3.select("#bottomocc")
				.append("h4")
				.text(dvc.occearn[dvc.iteration+1][0]);		
					
			d3.select("#bottomocc")
				.append("div")
				.attr("id","imagediv")
				.append("img")
				.attr("width","140px")
				.attr("src","images/icon_" + (dvc.iteration+2) +".svg")
				.on("click",function (){testanswer("b")})
	
			d3.select("#bottomocc")
				.append("h4")
				.attr("class","incometext")
				.text("£?");
		
		} else {
			
			
			var firstbit = window.location.href.split("ashe.html")[0];
		    var hash = decodeURI(window.location.hash);
	
			dvc.urlstring = firstbit + "index.html" + hash;
			
			d3.select("#y2").select("#wrngright").append("h3").text("You scored " + dvc.occscore + "/5");	
			
			//Append facebook/twitter share links
			
			d3.select("#wrngright").append("p").text("Share this quiz and your score on:");

			
			d3.select("#wrngright").append("img").attr("id","twitter").attr("alt","tweet").style("padding-top","20px").style("padding-bottom","20px").attr("src","images/twitter.svg").on("click",tweeta);
			d3.select("#wrngright").append("img").attr("id","face").attr("alt","share me on fb").attr("src","images/facebook.svg").on("click",faceb);
			

		}
			
	}
	
	
	function faceb() {
				var face = 'http://www.facebook.com/share.php?u=' + dvc.urlstring;
				window.open(face);
		}
		
	function tweeta() {
				var myString="http://twitter.com/home?status="+escape("Higher or Lower? I scored " + dvc.occscore + "/5 on this occupation quiz "+ dvc.urlstring);
				window.open(myString);
		}
	
		function tweetb() {
				var myString="http://twitter.com/home?status="+escape("Who earns more Men or Women? I scored " + dvc.mfscore + "/5 on this occupation quiz "+ dvc.urlstring);
				window.open(myString);
		}
	
	function resety2() {
		d3.select("#nexthide").attr("class","btn btn-default hide");
		
		d3.select("#topocc").selectAll("h4").remove();
		d3.select("#bottomocc").selectAll("h4").remove();
		d3.select("#topocc").selectAll("img").remove();
		d3.select("#bottomocc").selectAll("img").remove();
		d3.select("#topocc").selectAll("#imagediv").remove();
		d3.select("#bottomocc").selectAll("#imagediv").remove();
		d3.select("#wrngright").select("h3").remove();
		d3.select("#wrngright").select("p").remove();
		d3.select("#wrngright").selectAll("img").remove();

		d3.select("#topocc").style("pointer-events","all");
		d3.select("#bottomocc").style("pointer-events","all");
		
		d3.selectAll(".chartcircles").attr("class","chartcircles");
		
	}


	function startmfquiz() {
		
		d3.selectAll(".chartcircles").attr("class","chartcircles");
		dvc.occupationsmf = [["Chief executives",97911,63174,1115],["Midwife",33511,35498,2232],["Optician",34733,36350,2214],["Nurse",33460,31140,2231],["Primary education",36474,34181,2315]];
		
		dvc.iterationmf=0;
		dvc.mfscore=0;
		
		d3.select("#occ" + dvc.occupationsmf[dvc.iterationmf][3]).classed("circlel",true).moveToFront();	

		
		d3.select("#occmflab").selectAll("#imagediv1").remove();
		d3.select("#occmflab").selectAll("#imagediv2").remove();
		d3.select("#occmflab").selectAll("#imagediv3").remove();
		d3.select("#occmflab").selectAll("h4").remove();

		d3.select("#topmocc").selectAll("p").remove();
		d3.select("#bottomfocc").selectAll("p").remove();
		d3.select("#wrngorright").select("h3").remove();
		d3.select("#wrngorright").select("p").remove();
		d3.select("#wrngorright").selectAll("img").remove();		
		
		d3.select("#occmflab")
			.append("h4")
			.text(function(d,i){return dvc.occupationsmf[dvc.iterationmf][0]});


		d3.select("#occmflab")
			.append("div")
			.attr("id","imagediv1")
			.append("img")
			.attr("width","140px")
			.attr("src","images/iconmf_" + (dvc.iterationmf + 1) + ".svg");
			
		d3.select("#occmflab")
			.append("img")
			.attr("id","imagediv2")
			.attr("width","60px")
			.attr("src","images/male-1.svg")
			.on("click",function (){testanswermf("m")});
			
		d3.select("#occmflab")
			.append("img")
			.attr("id","imagediv3")
			.attr("width","60px")
			.attr("src","images/female-1.svg")
			.on("click",function (){testanswermf("f")});
	
			
	}
	
	function testanswermf(x) {
		
		d3.select("#occmflab").style("pointer-events","none");
		
		maleorfemale = x;
		
		d3.select("#occmflab").append("h4").attr("id","mfl").text("£" + dvc.nformat(dvc.occupationsmf[dvc.iterationmf][1]));
		d3.select("#occmflab").append("h4").attr("id","mfr").text("£" + dvc.nformat(dvc.occupationsmf[dvc.iterationmf][2]));
		
		
		if(dvc.occupationsmf[dvc.iterationmf][1] > dvc.occupationsmf[dvc.iterationmf][2])
		{	
			d3.select("#topocc").attr("opacity","0.5");
			
			if(maleorfemale == "m"){
				d3.select("#y3").select("#wrngorright").append("h3").text("Correct!");
				dvc.mfscore = dvc.mfscore+1;
			} else {
				d3.select("#y3").select("#wrngorright").append("h3").text("Unlucky");	
			}
			
		} else {

			if(maleorfemale == "m"){
				d3.select("#y3").select("#wrngorright").append("h3").text("Unlucky");
			} else {
				d3.select("#y3").select("#wrngorright").append("h3").text("Correct!");
				dvc.mfscore = dvc.mfscore+1;	
			}			
		
		
		}
		
		d3.select("#nexthidemf").attr("class","btn btn-default btn-block show").on("click", loadnextmf);

		dvc.iterationmf = dvc.iterationmf + 1;
	}
	
	
	function loadnextmf() {
	
		d3.select("#occmflab").style("pointer-events","all");
		d3.selectAll(".chartcircles").attr("class","chartcircles");

		d3.select("#nexthidemf").attr("class","btn btn-default hide");
		
		d3.select("#occmflab").selectAll("#imagediv1").remove();
		d3.select("#occmflab").selectAll("h4").remove();

		d3.select("#topmocc").selectAll("p").remove();
		d3.select("#bottomfocc").selectAll("p").remove();
		d3.select("#wrngorright").select("h3").remove();
		
		if(dvc.iterationmf != 5) {
		d3.select("#occ" + dvc.occupationsmf[dvc.iterationmf][3]).classed("circlel",true).moveToFront();	
	
		d3.select("#occmflab")
			.append("h4")
			.text(function(d,i){return dvc.occupationsmf[dvc.iterationmf][0]});


		d3.select("#occmflab")
			.append("div")
			.attr("id","imagediv1")
			.append("img")
			.attr("width","140px")
			.attr("src","images/iconmf_" + (dvc.iterationmf + 1) + ".svg");

		
		} else {
			
			d3.select("#imagediv2").remove();
			d3.select("#imagediv3").remove();
			
			var firstbit = window.location.href.split("ashe.html")[0];
		    var hash = decodeURI(window.location.hash);
	
			dvc.urlstring = firstbit + "index.html" + hash;
			
			d3.select("#y3").select("#wrngorright").append("h3").text("You scored " + dvc.mfscore + "/5");	
			//Append facebook/twitter share links
			
			d3.select("#wrngorright").append("p").text("Share this quiz and your score on:");

			d3.select("#wrngorright").append("img").attr("id","twitter").attr("alt","tweet").style("padding-top","20px").style("padding-bottom","20px").attr("src","images/twitter.svg").on("click",tweetb);
			d3.select("#wrngorright").append("img").attr("id","face").attr("alt","share me on fb").attr("src","images/facebook.svg").on("click",faceb);
			
		}
		
	}
	
	
	function topten (){
		
		d3.select("#y4").select("table").select("tbody").selectAll("tr").remove();
		d3.selectAll(".chartcircles").attr("class","chartcircles");

		var zipped = d3.zip(dvc.allocc, dvc.allEarn, dvc.allCode);
				
		zipped.sort(function(a, b){ return d3.descending(a[1], b[1]);});
				
		var subset = zipped.slice(0,10);
		
		var tabley = d3.select("#y4").select("table").select("tbody").selectAll("footer")
			.data(subset)
			.enter()
			.append("tr")
			.attr("id","salaryrow");
			
		
			tabley.append("td")
				.text(function(d,i){return d[0]});
			tabley.append("td")
				.text(function(d,i){return "£" + dvc.nformat(d[1])});
		
		
		
		subset.forEach(function(d,i){d3.select("#occ" + subset[i][2]).classed("circlel", true).moveToFront()})
		
	}
	
	function bottomten (){
		
		d3.select("#y5").select("table").select("tbody").selectAll("tr").remove();
		d3.selectAll(".chartcircles").attr("class","chartcircles");
		var zipped = d3.zip(dvc.allocc, dvc.allEarn, dvc.allCode);
				
		zipped.sort(function(a, b){ return d3.ascending(a[1], b[1]);});
				
		var subset = zipped.slice(0,10);
		
		var tabley = d3.select("#y5").select("table").select("tbody").selectAll("footer")
			.data(subset)
			.enter()
			.append("tr")
			.attr("id","salaryrow");
			
		
			tabley.append("td")
				.text(function(d,i){return d[0]});
			tabley.append("td")
				.text(function(d,i){return "£" + dvc.nformat(d[1])});
		
		subset.forEach(function(d,i){d3.select("#occ" + subset[i][2]).classed("circlel", true).moveToFront()})
		
	
	}
	

	
	function zoom(){
		
	//reset the yScale variable to account for the user selection
	dvc.yScale=d3.scale.linear()
					.domain([dvc.high, dvc.low])
					.range([0,400])
					.nice();
	//redefine the axis
	dvc.yAxis=d3.svg.axis()
		.scale(dvc.yScale)
		.orient("left")
		.ticks(8)
		.tickSize(-(dvc.occWidth));


	//and rescale				
	d3.select(".axis").transition()
		.duration(500).call(dvc.yAxis);
				

		
	//reposition each of the circles 
	d3.selectAll('.chartcircles')
		.transition()
		.duration(500)
		.attr("cy",function(d,i){ 
				if(d.earningsa != 'x'){
					return dvc.yScale(d.earningsa)
					}
				else {return 0}
					})
		.attr("r",function(d,i){ 
				if(d.earningsa >dvc.low && d.earningsa < dvc.high){
					return 5
					}
				else {return 0}
					});
					
	
	//also rescale the median line
	
	d3.select("#median")
		.transition()
		.duration(500)
		.attr("stroke-width", function(d,i){ 
				if(dvc.quantiles[1] >dvc.low && dvc.quantiles[1] < dvc.high){
					return 2
					}
				else {return 0}
					})
		.attr("y1",dvc.yScale(dvc.quantiles[1]))
		.attr("y2",dvc.yScale(dvc.quantiles[1]));
	

	//also rescale the median line
	d3.select("#mediantxt")
		.transition()
		.duration(500)
		.attr("fill", function(d,i){ 
				if(dvc.quantiles[1] >dvc.low && dvc.quantiles[1] < dvc.high){
					return "#ccc"
					}
				else {return "#fff"}
					})
		.attr("y",dvc.yScale(dvc.quantiles[1]));
		
		
	}
	
	
	function defineDefs() {
		
		icon1 = d3.select("body").append("svg")
				.attr("height",0)
				.attr("viewBox","0 0 30 30")
				.attr("preserveAspectRatio","xMinYMin meet")
				.append("defs")
                .append("g")
                .attr("id","iconMale")
				.attr("fill", "white")
				.attr("stroke","#666")
				.attr("stoke-width",2);
				
        icon1.append("path")
                .attr("d","M26.346,22.813c6.295,0,11.403-5.106,11.403-11.409C37.749,5.113,32.642,0,26.346,0C20.05,0,14.938,5.113,14.938,11.404C14.938,17.707,20.05,22.813,26.346,22.813");
						
		icon1.append("path")
	            .attr("d","M51.358,43.344c0.48-6.869-4.656-18.019-16.174-18.019H16.457c-11.47,0-16.655,11.148-16.175,18.019L0,76.046c0.149,2.164,2.021,3.792,4.18,3.646c2.162-0.148,3.565-1.986,3.64-4.176L9.561,48.78c0.014-0.495,0.426-0.888,0.919-0.869c0.498,0.013,0.882,0.429,0.868,0.919v76.105c0,1.669,1.369,3.04,3.044,3.04h5.321c1.674,0,2.941-1.172,3.044-3.04l1.881-42.319c0.111-1.148,0.092-1.896,1.14-1.896h0.06c1.052,0,1.032,0.747,1.14,1.896l1.883,42.319c0.104,1.868,1.367,3.04,3.043,3.04h5.32c1.676,0,3.045-1.371,3.045-3.04l0.02-76.105h0.004c-0.016-0.49,0.377-0.906,0.867-0.919c0.494-0.019,0.906,0.374,0.92,0.869l1.74,26.736c0.076,2.188,1.484,4.026,3.641,4.176c2.158,0.146,4.033-1.482,4.18-3.646L51.358,43.344");
				
				
				
				
				
		icon2 = d3.select("body").append("svg")
				.attr("height",0)
				.attr("viewBox","0 0 30 30")
				.attr("preserveAspectRatio","xMinYMin meet")
				.append("defs")
                .append("g")
                .attr("id","iconFemale")
				.attr("fill", "white")
				.attr("stroke","#666")
				.attr("stoke-width",2);
				
        icon2.append("path")
                .attr("d","M30.771,22.819c6.291,0,11.404-5.105,11.404-11.409C42.176,5.113,37.063,0,30.771,0c-6.305,0-11.409,5.113-11.409,11.41C19.362,17.714,24.466,22.819,30.771,22.819");
						
		icon2.append("path")
	            .attr("d","M61.48,72.103l-6.322-32.154c-1.107-6.801-7.227-14.616-16.918-14.616H23.295c-9.697,0-15.811,7.815-16.924,14.616L0.053,72.103c-0.353,2.14,1.096,4.158,3.232,4.504c2.135,0.357,3.927-1.116,4.503-3.225l8.214-27.034c0.122-0.472,0.602-0.761,1.08-0.633c0.475,0.117,0.755,0.6,0.638,1.078L7.315,91.78c-0.339,1.64,0.75,2.983,2.426,2.983l2.991-0.01c1.677,0,3.262,1.361,3.525,3.004l4.362,27.23c0.263,1.658,1.848,3,3.525,3h12.928c1.67,0,3.228-1.352,3.453-3.014l3.733-27.209c0.227-1.65,1.783-3.012,3.453-3.012l3.044,0.01c1.675,0,2.764-1.344,2.422-2.983l-9.36-44.986c-0.12-0.478,0.159-0.961,0.635-1.078c0.473-0.128,0.956,0.161,1.078,0.633l8.215,27.034c0.583,2.108,2.369,3.582,4.504,3.225C60.383,76.261,61.832,74.243,61.48,72.103");

//		d3.select("#chart").append("svg").attr("viewBox","0 0 100 100").append("g")
//                .attr("id","pictoLayer")
//                .append("use")
//                .attr("xlink:href","#iconMale");
            		
	};
	
	
	
	function incomeSlider() {

	
	//Make a slider so that the user can select the range that they are interested in
		d3.select("#ashe").append("div").attr("id","sliderInc").html("<h4>Choose income range</h4><br>").append("div").attr("id","slider");
		
		dvc.low = 0
		dvc.high = 100000;
		
		$('#slider').labeledslider({min:0, max:100000, values: [dvc.low, dvc.high], tickInterval:15000,  range: true, step:1, change:function(event,ui){
			
			dvc.high = ui.values[1];
			dvc.low = ui.values[0];
			zoom();
							
		}}); 
		
	}
	
	function owl () {
	
		$('.owl-carousel').owlCarousel({
			margin:10,
			nav:false,
			dots:true,
			center:false,
			loop:false,
			autoplay:false,
			autoplayTimeout:2000,
			autoplaySpeed:2000,
			responsive:{
				0:{
					items:1
				},
				440:{
					items:2
				},
				600:{
					items:3
				},
				940:{
					items:4
				},
				1100:{
					items:5
				}
			}
		})
		
	}
	
	function getParams() {

		  var firstbit = window.location.href.split(".html")[0];

		  var url = decodeURI(window.location.hash);
		
		  if(url != "") {
			params = url.split("&");
			dvc.panel = params[0].split("=")[1];
			dvc.occupation = params[1].split("=")[1];
			
			//fire off starting screens
			
			if(dvc.panel !=0) {
				d3.select("#" + dvc.panel).attr("class", "items col-sm-3 show");
				
				if(dvc.panel == "y2"){startquiz()};
				if(dvc.panel == "y3"){startmfquiz()};
				if(dvc.panel == "y4"){topten()};
				if(dvc.panel == "y5"){bottomten()};
					
			}
			
			if(dvc.occupation !=0) {
			setTimeout(function(){
				dvc.show = false;
				$(".owl-stage-outer").slideToggle(300, "linear"); 
				$("#controls").slideToggle(300, "linear"); 
			 	d3.selectAll(".items").attr("class","items col-sm-3 hidden");
				d3.select("#hide").transition().duration(300).ease("linear").style("top","-10px").text("show me the stories"); 
				
				$('#occselect').val(dvc.occupation);
				$('#occselect').trigger("chosen:updated");
				d3.select("#charts").attr("class","items col-sm-3 show");
				
				var firstno = dvc.occupation.slice(0,1);
				
				d3.select("#occ" + dvc.occupation).classed("fill" + (firstno-1), true).attr("r","7").each(function(d,i){makeChart([d.earningsm,d.earningsf]); dvc.currtext = d.occupation + "<br><span> £"+ dvc.nformat(d.earningsa) + "</span>"}).moveToFront();
				d3.select("#occ").html(dvc.currtext);
			},500);
				
					
			}
			
		  }
		}


	function updateHash() {
			  window.location.hash = encodeURI("panel=" + dvc.panel + "&occ=" + dvc.occupation);
	}

	
	
	function occopt () {
	
	//Create a chosen drop down to show the list of occupations 

		dvc.allOcc = [];
			
		//Create an array for each occupation title
		data.forEach(function(d,i){	
				dvc.allOcc.push(data[i].occupation);								
		});
		
		dvc.allCode = [];
	
		//Create an array for each occupation code
		data.forEach(function(d,i){	
				dvc.allCode.push(data[i].code);								
		});

		// Join occupation and codes together in an array
		var codeoccyzip = d3.zip(dvc.allOcc, dvc.allCode);
		
		//sort occupation list alphabetically	
		dvc.codeoccyzip = codeoccyzip.sort(function(b, a){ return d3.descending(a[0], b[0])});

		// Build option menu for occupations
		var optns = d3.select("#occupation").append("div").attr("id","sel").append("select")
				.attr("id","occselect")
				//.attr("multiple","multiple")
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
				this.parentNode.appendChild(this); 
			  }); 
			}; 
			
			
			$('#occselect').chosen({width: "90%", allow_single_deselect: true, placeholder_text_single:"Occupation"}).on('change',function(evt,params){
		
								if(typeof params != 'undefined') {
										var firstno = params.selected.slice(0,1);
										// If a selection has been made highlight the circle and use the earnings value from the circle and update the text
										d3.select("#occ" + params.selected).classed("fill" + (firstno-1), true).attr("r","7").each(function(d,i){makeChart([d.earningsm,d.earningsf]); dvc.currtext = d.occupation + "<br><span> £"+ dvc.nformat(d.earningsa) + "</span>"}).moveToFront();
										d3.select("#occ").html(dvc.currtext);
										d3.selectAll('.chartcircles').attr("pointer-events","none");
										dvc.occupation = params.selected;
										dvc.panel=0;
										updateHash();
								}
								else {
										// Remove any selections
										
										d3.selectAll(".chartcircles").attr("class","chartcircles").attr("r",5).attr("opacity","0.6").attr("pointer-events","all");
										dvc.occupation = 0;
										updateHash();
								}
								
			});
			

}


function makeChart(array)
{	
	d3.select("#missing").remove();

	dvc.chartWidth = 150;
	dvc.chartHeight = 180;
	
	dvc.xPadding2 = 50;
	dvc.yPadding2 = 30;
    
    //Find out about the data
    
    //length of the array
    dvc.myInputDivisor = array.length;

    //Find min/max 
    dvc.minValue2 = d3.min(array);
    dvc.maxValue2 = d3.max(array);
    
    
    //set up the scale objects as per normal

    dvc.yScale2=d3.scale.linear()
        .domain([Math.min(0,dvc.minValue2),dvc.maxValuem])
        .range([dvc.chartHeight,0])
        .nice();
        
    dvc.xScale2 = d3.scale.ordinal()
        .domain(array)
        .rangeRoundBands([0, dvc.chartWidth]);
        
        
    //work out the width of the bars based on the nummber of records
        
    dvc.cellWidth=dvc.chartWidth/dvc.myInputDivisor;
    
    
    //Set up the chart object the data([array]) is part of a trick that means that it's only set up the once
    
    mainChart = d3.select("#chart").selectAll('svg').data([array]);
    
                
    //Add the main SVG - only once on enter
    mainChartEnter = mainChart.enter()
                      .append('svg')
                      .attr('id','mainChart')
                      .attr("viewBox", "0 0 210 290")
                      .attr("preserveAspectRatio","xMidYMin meet");
                      
    //Set up the axis - this is done on each call of the function

    dvc.yAxisChar=d3.svg.axis()
            .scale(dvc.yScale2)
            .orient("left")
            .tickSize(-(dvc.chartWidth))
            .ticks(6);
    
    //Append the axis - only once (mainChartEnter)
   mainChartEnter.append("g")
        .attr("class","axis")
        .attr("transform","translate("+ dvc.xPadding2 + ", " + dvc.yPadding2 + ")")
        .call(dvc.yAxisChar);
		
		
	    //Add axis label - only once (mainChartEnter)
   mainChartEnter.append("text")
   		.attr("id","xaxislab")
		.attr("y",12)
        .html("Full-time earnings (£'s)");


    
    //removes the stroke on the y-axis vertical - only once	
    mainChartEnter.selectAll(".domain").style("stroke","none");
    

    //add a group element for the bar - only once
   	var mainbarsenter = mainChartEnter.append("g")
        .attr("id","grpBars")
        .attr("transform", "translate(" + dvc.xPadding2 + "," + dvc.yPadding2 + ")");

    
    
    // Every time the function is called
    mainChart.select('.axis')
        .transition()
        .duration(500)
        .call(dvc.yAxisChar);
        
    
    //Same trick as before
    //Select the group element which contains the bars and then all the chartBars within
    bar = mainChart.select("#grpBars").selectAll(".chartBars")
        .data(array);
    
    //If the element is a new selection then append a rectangle - ENTER - Do the things you only want to do once.
    bar.enter()
            .append("rect")
            .attr("class", "chartBars")
            .attr("id",function(d,i) {
                return "bar" + i;
            });
            

    //If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
    bar.attr("width", dvc.cellWidth-10)
            .attr("y", function(d) { 
                return dvc.yScale2(Math.max(0, d));
            })
            .attr("transform", function(d, i) {
                return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
            })
            .attr("height", function(d,i)	{
				if(d!=0){
                return Math.abs(dvc.yScale2(d) - dvc.yScale2(0));
				}
				else {	
				
				if(i==0) {var trans =  81}
						else {var trans = 157}
						
						
						mainChart
							.append("text")
							.attr("id","missing")
							.text("*")
							.attr("transform", "translate(" + trans + ",188)");
					
				}
            });
            
        
    //If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
    bar.exit().remove();
	
	
	//add the icons
	
	mainbarsenter.append("use")
		.attr("id","maleIcon")
		.attr("transform", "translate(20,188) scale(0.4)")
        .attr("xlink:href","#iconMale");
		
	mainbarsenter.append("use")
		.attr("id","femaleIcon")
		.attr("transform", "translate(95,188) scale(0.4)")
        .attr("xlink:href","#iconFemale");
       
	d3.select("#maleIcon").moveToFront();
	
	
	
	
}

	

	function makeCircles(d,i){
	
	var loopno = i
		
    d3.select(this).selectAll('circle')
		.data(d.values)
		.enter()
        .append('circle')
		.attr("class","chartcircles  ")
		.attr("id",function(d,i){return "occ" + d.code})
		.attr("pointer-events","none")
		.attr("cy",function(d,i){ 
				if(d.earningsa != 'x'){
					return dvc.yScale(d.earningsa)
					}
				else {return 0}
					})
        .attr('r',function(d,i){ 
				if(d.earningsa != 'x'){
					return 5
					}
				else {return 0}
					})
		//.style("fill","#697A92")
		.attr("opacity","0.6")		
		.on("mouseover", function(d,i){d3.select("#occ").html(d.occupation + "<br><span> £"+ dvc.nformat(d.earningsa) + "</span>");
                                d3.select(this).attr("r",7).classed("fill" + loopno,true).attr("opacity","1");//Could set colour class here
                                /*d3.select(this).moveToFront();*/
								makeChart([d.earningsm,d.earningsf]);
		})
		.on("mouseout", function(d,i){
								d3.select("#occ").text("");
								d3.select(this).attr("r",5).classed("fill" + loopno,false).attr("opacity","0.6");
								makeChart([1,1]);          
		});
		

	
	if (pymChild) {
        pymChild.sendHeight();
    }	
			
	
	}
	

	

	});	
	
	

	
})

} 	else  // from modernizer
	
	{
		$("#ieMsg").fadeIn(1000);
		
	}
