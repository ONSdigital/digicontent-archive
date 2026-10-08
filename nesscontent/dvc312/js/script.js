//namespace any global variables
var dvc = {}; 

pymChild = new pym.Child();


if (Modernizr.inlinesvg)
{
	//remove preview image/message if browser suppports SVG
	d3.select("#altern").remove();

	//Load main script/data
	$(document).ready(function()
	{	
	
		//Load csv data
		d3.csv("assets/data.csv", function(error, unformatteddata) {
			
			//var data = d3.csv.parseRows(unformatteddata);
			//datacsv = data;
			var data = unformatteddata.map(function(d) { return new Array(+d.Bottom, +d.Second, +d.Third, +d.Fourth, +d.Fifth, +d.Sixth, +d.Seventh, +d.Eighth, +d.Nineth, +d.Tenth, +d.Overall)});
			dvc ={};

			dvc.pageCount = 0;
			
			//Seperate data out into the individual lines
			dvc.breakpoints = data[0].slice(0,10);	
			dvc.numhh = data[1].slice(0,10);	
			dvc.totalIncome = data[2].slice(0,10);	
			dvc.totalcashbenefits = data[3].slice(0,10);
			dvc.grossincome = data[4].slice(0,10);	
			dvc.taxes = data[5].slice(0,10);	
			dvc.disposableincome = data[6].slice(0,10);
			dvc.disposableincomeEquiv = data[7].slice(0,10);	
			dvc.disposable97 = data[8].slice(0,10);
			
			
			dvc.notaxorben = [];
			
			
				for(var i=0; i< dvc.disposableincome.length; i++) {
					dvc.notaxorben[i]= dvc.disposableincome[i] - dvc.totalcashbenefits[i] + dvc.taxes[i];
				}
			
			dvc.incplusben = [];
			
			for(var i=0; i< dvc.disposableincome.length; i++) {
				dvc.incplusben[i]= dvc.notaxorben[i] + dvc.totalcashbenefits[i];
			}
						
			d3.select(".income").style("opacity",0); 
			
			
			addremoveAdult();
			
			//Attach event listeners to + and - buttons so that we can build / remove people
			d3.select("#adultfor").select(".minus").on("click", addremoveAdult);
			d3.select("#adultfor").select(".plus").on("click", addremoveAdult);
			
			d3.select("#adults").on("change", addremoveAdult);
			
			
			d3.select("#childfor").select(".minus").on("click", addremoveAdult);
			d3.select("#childfor").select(".plus").on("click", addremoveAdult);
			
			d3.select("#child").on("change", addremoveChild);
			
			$('#next').click(function(event){
			
					event.preventDefault();
					event.stopPropagation();

					$("#adultrow").hide();
					$("#childrow").hide();
					$("#next").hide();
					
					$("#hhincrow").attr("class", "row show");
					$("#hhoutrow").attr("class", "row show");
					$("#submit").attr("class", "btn btn-primary form-group btnnext show");
					
			});
			
			
			
			function addremoveAdult() {
				

				
	
				$('#hhincome').keyup(function(event){
					  // skip for arrow keys
					  if(event.which >= 37 && event.which <= 40){
						  event.preventDefault();
					  }
					  var $this = $(this);
					  var num = $this.val().replace(/,/gi, "").split("").reverse().join("");
					  
					  var num2 = RemoveRougeChar(num.replace(/(.{3})/g,"$1,").split("").reverse().join(""));
					  
					  // the following line has been simplified. Revision history contains original.
					  $this.val(num2);
				});
				
				
				$('#hhtax').keyup(function(event){
					  // skip for arrow keys
					  if(event.which >= 37 && event.which <= 40){
						  event.preventDefault();
					  }
					  var $this = $(this);
					  var num = $this.val().replace(/,/gi, "").split("").reverse().join("");
					  
					  var num2 = RemoveRougeChar(num.replace(/(.{3})/g,"$1,").split("").reverse().join(""));
					  
					  // the following line has been simplified. Revision history contains original.
					  $this.val(num2);
				});
				

				function RemoveRougeChar(convertString){
					if(convertString.substring(0,1) == ","){
						return convertString.substring(1, convertString.length)            
					}
					return convertString;
				}

				
				
				$("#adultPic").empty();
				$("#adultPic2").empty();
				
				// Set maximum for child input field (has to be 1 less that number)
				$("#child").attr("max",($("#adults").val()-1));
				
			
				// record value
				if($("#adults").val()>10)
					{ var numad = 10} 
				else { var numad = $("#adults").val()};
				
				for(i=0; i<numad; i++){
					d3.select("#adultPic").append("img").attr("id","person" + (numad-i)).attr("src","images/person.png").style("opacity","1").attr("height","64px").attr("width","34px");
					
					d3.select("#adultPic2").append("img").attr("id","person1" + (numad-i)).attr("src","images/person.png").style("opacity","1").attr("height","64px").attr("width","34px");
				}
				
				addremoveChild()
			}
			
			function addremoveChild() {
				
				if($("#child").val() <= ($("#adults").val()-1)) {
					$(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
				} 
				
				// record value
				if($("#child").val()>8)
					{ var numad = 8} 
				else { var numad = $("#child").val()};
				
				for(i=0; i<numad; i++){
					d3.select("#person" + (i+1)).attr("class","childPic").attr("src","images/child.png").style("opacity","1").attr("height","50px").attr("width","22px");
					d3.select("#person1" + (i+1)).attr("class","childPic").attr("src","images/child.png").style("opacity","1").attr("height","50px").attr("width","22px");
					
					
				}
			}
				
	
		});
		
	
				d3.select(".startcircle").on("click",function(d,i){
						d3.select(".startcircle").select("p").attr("class","hide");
					
						d3.select(".startcircle")
							.transition()
							.duration(500)
							.style("width","0px")
							.style("height","0px");
							
						d3.select(".splash")
							.transition()
							.duration(500)
							.style("height","0px");
							
						d3.select("#incomeform").attr("class","show");
						
						d3.select(".income").attr("class","show").transition()
							.duration(1500).delay(500).style("opacity",1); 
				
				});
	
	
				$('#submit').click(function(event){
					
					event.preventDefault();
					event.stopPropagation();
					
					d3.select(".bulk").classed("hide",false);
					d3.select(".titlebar").attr("class","titlebar");
					d3.select(".titlebar2").attr("class","titlebar2");
					
					// Check if the user has entered in some valid income figures
					
					regExp = RegExp(/[0-9]{1,3}/);
					
					if(regExp.test(parseFloat($("#hhincome").val().replace(/,/g, ''))) == true && 
					regExp.test(parseFloat($("#hhtax").val().replace(/,/g, '')))== true) {
					
					
	
			 
			 
					$("#incomeform").attr("class","hide");
					
					d3.select("#nextback").classed("hide",false);
					
					d3.select("#next1").on("click", pageUp);
					d3.select("#back").on("click", pageDown);
					
					
					//Get number of adults
					dvc.adults = $("#adults").val() - $("#child").val();
					
					//Get number of children <15
					dvc.children = $("#child").val();					
					
					//Get Weekly / Monthly / Yearly value
					if($("#incPeriod").val() ==2) {
						dvc.respIncomePeriod=12;
					} else if($("#incPeriod").val() ==1) {
						dvc.respIncomePeriod=52;
					} else {
						dvc.respIncomePeriod=1;
					};
										
					
					if($("#taxPeriod").val() =="2") {
						dvc.respTaxPeriod=12;
					} else if($("#taxPeriod").val() =="1") {
						fvc.respTdaxPeriod=52;
					} else {
						dvc.respTaxPeriod=1;
					};
					//Get income data and annualise it...
					dvc.respIncome = parseFloat($("#hhincome").val().replace(/,/g, ''))  * dvc.respIncomePeriod;
										
					//Get council tax and annualise it
					dvc.respTax = parseFloat($("#hhtax").val().replace(/,/g, '')) * dvc.respTaxPeriod;
					
					//Work out the equivalisation factor
					//0.67+((Questions!B3+Calculations!B6-1)*0.33)+(Calculations!B7*0.2)
					dvc.equivalisation = 0.67 + ((+dvc.adults - 1)*0.33) + (dvc.children*0.2);
					
					//Work out disposable income
					dvc.respDisposable = +dvc.respIncome - +dvc.respTax;
					
					//Work out equivalised  disposable income
					dvc.respDisposableEquiv = dvc.respDisposable / dvc.equivalisation;
					
					//Let's work out what decile this falls into
					for(i = 0; i <= 10; i++){
						if(dvc.respDisposableEquiv > dvc.breakpoints[i]){
							dvc.decile = i;
						}
					}
					
					
					//First make the chart based on the equivalised annual income
					makeChart(dvc.disposableincome);
					if(dvc.pageCount<=0) {d3.select("#back").classed("hide", true);} else {d3.select("#back").classed("hide", false);}
					
					dvc.formatpound = d3.format(",.0f");
					dvc.formatcomma = d3.format(".1f");
				
					if((dvc.decile+1) <=3) {
						titlemsg = "Poorest " + (dvc.decile+1) + "0%"					
						txtMsg = "Your disposable income puts you in the <span class='spanHigh'> poorest " + (dvc.decile+1) + "0%</span> of all households in the UK.";
						
						 
					} 
					else if((dvc.decile+1) >=8)  {
						
						titlemsg = "Richest " + (10 - dvc.decile) + "0%"	
						txtMsg = "Your disposable income puts you in the <span class='spanHigh'> richest " + (10 - dvc.decile) + "0%</span> of all households in the UK.";
						
					}
					else {
						titlemsg = "Near the middle"	
						txtMsg = "Your disposable income puts you in a group somewhere in the middle." ;
						
						
						
					}
												
					var txtMsg2 = "After adjusting for the number of people you live with, you have the equivalent of <span class='spanHigh'>£"+ dvc.formatpound(dvc.respDisposableEquiv/12) + " a month</span> (£" + dvc.formatpound(dvc.respDisposableEquiv) + " a year) left to spend or save after paying direct taxes like income tax and council tax.<br><br>" + 
										"This is your comparable <span class='spanTitle'>disposable income</span>.<br><br>" + txtMsg;
																		
					d3.select(".titlebar").text(titlemsg);
	
					d3.select("#commentary").select("p").html(txtMsg2);
					
					if (pymChild) {
						pymChild.sendHeight();
					}
					
					
					} else {
					
					// Show errors
						if(regExp.test(parseFloat($("#hhincome").val().replace(/,/g, ''))) == false) {$("#hhincrow div:first-child").addClass("has-error")}
						if(regExp.test(parseFloat($("#hhtax").val().replace(/,/g, ''))) == false) {$("#hhoutrow div:first-child").addClass("has-error")}
						
						
					}



						
				});
	

		function makeChart(array)
		{
			
			dvc.chartWidth = $("#chart").width();
			dvc.chartHeight = (dvc.chartWidth / 1.5);
			dvc.gapRatio = 0;
			dvc.yPadding = 50;
			dvc.xPadding = 55;
			
			//Find out about the data
			
			//length of the array
			dvc.myInputDivisor = array.length;

			//Find min/max 
			dvc.minValue = d3.min(array);
			dvc.maxValue = d3.max(array);
			
			//set up the scale objects as per normal

			dvc.yScale=d3.scale.linear()
				.domain([Math.min(0,dvc.minValue),100000/*dvc.maxValue*/])
				.range([dvc.chartHeight-(dvc.yPadding*2),0])
				.nice();
				
			dvc.xScale = d3.scale.ordinal()
				.domain(array)
				.rangeRoundBands([0, dvc.chartWidth], dvc.gapRatio);
				
				
			//work out the width of the bars based on the nummber of records
				
			dvc.cellWidth=((1-dvc.gapRatio)*(dvc.chartWidth-dvc.xPadding)/dvc.myInputDivisor)-1;
			
			//Set up the chart object the data([array]) is part of a trick that means that it's only set up the once
			
			mainChart = d3.select("#chart").selectAll('svg').data([array]);
			
			getWidth = $("#chart").width();
			
			aspect = [3,2];
						
			//Add the main SVG - only once on enter
    	    mainChartEnter = mainChart.enter()
                              .append('svg')
							  .attr('id','mainChart')
							  .attr('width',getWidth)
							  .attr('height',((getWidth*aspect[1])/aspect[0])+30);
							  
			//Set up the axis - this is done on each call of the function

			dvc.yAxisChar=d3.svg.axis()
					.scale(dvc.yScale)
					.orient("left")
					.tickSize(-(dvc.chartWidth))
					.ticks(5);
	
			//Append the axis - only once (mainChartEnter)
			mainChartEnter.append("g")
				.attr("class","axis")
				.attr("transform","translate("+ dvc.xPadding + ", " + dvc.yPadding + ")")
				.call(dvc.yAxisChar);

			
			//removes the stroke on the y-axis vertical - only once	
			mainChartEnter.selectAll(".domain").style("stroke","none");
			
			mainChartEnter.append("g")
				.append("text")
				.text("Annual household income (£)")
				.attr("transform", "translate(0," + (dvc.yPadding-30) + ")");

			//add a group element for the bar - only once
			mainChartEnter.append("g")
				.attr("id","grpBars")
				.attr("transform", "translate(" + dvc.xPadding + "," + dvc.yPadding + ")")
	
			
			// Every time the function is called
			mainChartEnter.select('.axis')
       		  	.transition()
  		       	.duration(2000)
			  	.call(dvc.yAxisChar);
				
			//Same trick as before
			//Select the group element which contains the bars and then all the chartBars within
			bar = mainChart.select("#grpBars").selectAll(".chartBars")
				.data(array);
			
			//If the element is a new selection then append a rectangle - ENTER - Do the things you only want to do once.
			bar.enter()
					.append("rect")
					.attr("class", function(d,i){if(dvc.decile != i){return "chartBars"} else {return "chartBars chartBarHigh"}})
					.attr("id",function(d,i) {
						return "bar" + i;
					})
					.attr("y", dvc.yScale(0))
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("width", dvc.cellWidth)
					.attr("height", 0);
		

			//If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
			bar.transition()
  		       		.duration(2000)
					.attr("y", function(d) { 
						return dvc.yScale(Math.max(0, d));
					})
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("height", function(d)	{
						return Math.abs(dvc.yScale(d) - dvc.yScale(0));
					});
					
				
			//If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
			bar.exit().remove();
			
			tspans = bar.enter().append("text")
				.attr("y", dvc.yScale(0))
				.attr("transform", function(d, i) {
						return "translate(" + ((dvc.cellWidth* i) +  (dvc.cellWidth/2)) +"," + 18  + ")";
					})
				.attr("text-anchor","middle");
				
			tspans.append("tspan")
				.text(function(d,i){if(i==0){ return "Poorest"}});
				
			tspans.append("tspan")
				.attr("y",(dvc.yScale(0) +18))
				.attr("x",0)
				.text(function(d,i){if(i==0){ return "10%"}});
				
			tspans.append("tspan")
				.text(function(d,i){if(i==9){ return "Richest"}});
				
			tspans.append("tspan")
				.attr("y",(dvc.yScale(0) +18))
				.attr("x",0)
				.text(function(d,i){if(i==9){ return "10%"}});
				
			mainChartEnter.append("line")
				.attr("stroke","#666")
				.attr("stroke-width","2px")
				.attr("y1", dvc.yScale(0)+ dvc.yPadding + 20)
				.attr("y2", dvc.yScale(0)+ dvc.yPadding + 20)
				.attr("x1", (dvc.cellWidth* 1) + dvc.xPadding +40)
				.attr("x2", (dvc.cellWidth* 9) + dvc.xPadding -40)
				.attr("marker-end", "url(#markerArrow)")
				
				
					if (pymChild) {
						pymChild.sendHeight();
					}
				
					
		}

		function addbar() {	
		
			bar = mainChart.select("#grpBars").selectAll(".chartBars")
				.data(dvc.disposableincome);
			
			//If the element is a new selection then append a rectangle - ENTER - Do the things you only want to do once.
			bar.enter()
					.append("rect")
					.attr("class", function(d,i){if(dvc.decile != i){return "chartBars"} else {return "chartBars chartBarHigh"}})
					.attr("id",function(d,i) {
						return "bar" + i;
					})
					.attr("y", dvc.yScale(0))
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("width", dvc.cellWidth)
					.attr("height", 0);
		

			//If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
			bar.transition()
  		       		.duration(2000)
					.attr("y", function(d) { 
						return dvc.yScale(Math.max(0, d));
					})
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("height", function(d)	{
						return Math.abs(dvc.yScale(d) - dvc.yScale(0));
					});
					
				
			//If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
			bar.exit().remove();
			
		}

		
		
		function pageUp() {
			
		dvc.pageCount = dvc.pageCount + 1;
			
			if(dvc.pageCount>=4) {d3.select("#next1").classed("hide", true);} else {d3.select("#next1").classed("hide", false);}
			if(dvc.pageCount<=0) {d3.select("#back").classed("hide", true);} else {d3.select("#back").classed("hide", false);}

			if(dvc.pageCount == 0) {
				
			addbar(); 
			
				if((dvc.decile+1) <=3) {
							titlemsg = "Poorest " + (dvc.decile+1) + "0%"					
							txtMsg = "Your disposable income puts you in the <span class='spanHigh'> poorest " + (dvc.decile+1) + "0%</span> of all households in the UK.";
						} 
						else if((dvc.decile+1) >=8)  {
							
							titlemsg = "Richest " + (10 - dvc.decile) + "0%"	
							txtMsg = "Your disposable income puts you in the <span class='spanHigh'> richest " + (10 - dvc.decile) + "0%</span> of all households in the UK.";
						}
						else {
							titlemsg = "Near the middle"	
							txtMsg = "Your disposable income puts you in a group somewhere in the middle." ;
						}
													
						var txtMsg2 = "After adjusting for the number of people you live with, you have the equivalent of <span class='spanHigh'>£"+ dvc.formatpound(dvc.respDisposableEquiv/12) + " a month</span> (£" + dvc.formatpound(dvc.respDisposableEquiv) + " a year) left to spend or save after paying direct taxes like income tax and council tax.<br><br>" + 
											"This is your comparable <span class='spanTitle'>disposable income</span>.<br><br>" + txtMsg;
																			
						d3.select(".titlebar").text(titlemsg);
						d3.select("#commentary").select("p").html(txtMsg2);
			
			
			} else if(dvc.pageCount == 1){
				
				
				addbars(dvc.notaxorben);	
				d3.select("#commentary").select("p").html("If there were no taxes or benefits, the average income for households in your group would be <span class='spanHigh'>£" + dvc.formatpound(dvc.notaxorben[dvc.decile]) + " a year</span><br><br>Overall, average income for the richest 10% would be <span class='spanHigh'>"+ dvc.formatpound(dvc.notaxorben[9]/dvc.notaxorben[0]) + " times</span> higher than the poorest 10%.");
				d3.select(".titlebar").text("Before taxes or benefits");
				
						
			} else if(dvc.pageCount == 2){
				
				addbars1(dvc.totalcashbenefits);	
				d3.select("#commentary").select("p").html("Households in your group receive an average of <span class='spanHigh'>£" + dvc.formatpound(dvc.totalcashbenefits[dvc.decile]) + " a year</span> in cash benefits such as Tax Credits, State Pension, Jobseeker's Allowance, and Disability Living Allowance.<br><br> This is around <span class='spanHigh'>" + dvc.formatcomma((dvc.totalcashbenefits[dvc.decile]/dvc.grossincome[dvc.decile])*100) + "%</span> of total income before tax.<br><br> As you might expect, poorer households tend to receive more in cash benefits than richer ones. This helps to reduce income inequality.");
				
				d3.select(".titlebar").text("Let's add in benefits");
				
							
			} else if(dvc.pageCount == 3){
				
				addbars2(dvc.taxes)
				d3.select("#commentary").select("p").html("Households in your group pay around <span class='spanHigh'>£" + dvc.formatpound(dvc.taxes[dvc.decile]) + " a year</span> in direct taxes. <br><br> This is around <span class='spanHigh'>" + dvc.formatcomma((dvc.taxes[dvc.decile]/dvc.grossincome[dvc.decile])*100) + "% of total income </span>(including cash benefits). <br><br> Richer households pay more in direct taxes both in terms of actual amount and as a proportion of income. This also helps reduce income inequality.");
				d3.select(".titlebar").text("Now let's deduct taxes");
				
			} else if(dvc.pageCount == 4){
				
				var moreorless = dvc.disposableincome[dvc.decile] - dvc.notaxorben[dvc.decile];
				
				if(moreorless <0) {var moreless = "less"; moreorless = moreorless*-1} else {var moreless = "more";}
				
				
				addbars3(dvc.disposable97)
				d3.select("#commentary").select("p").html("The red lines show average income levels before direct taxes and cash benefits.<br><br>They show the richest 10% had an average income " + dvc.formatpound(dvc.notaxorben[9]/dvc.notaxorben[0]) + " times higher than the poorest 10%. After taxes and benefits this is <span class='spanHigh'>reduced to " + dvc.formatpound(dvc.disposableincome[9]/dvc.disposableincome[0]) + " times</span>. <br><br>Households in your group, on average, have <span class='spanHigh'>£" + dvc.formatpound(moreorless) + " " + moreless + " </span>a year after taxes and benefits.");	
					
				d3.select(".titlebar").text("How does it compare?");
			
			} 
			
					if (pymChild) {
						pymChild.sendHeight();
					}
	 
			
		}
		
		
		function pageDown() {
			
			dvc.pageCount = dvc.pageCount - 1;
			
			if(dvc.pageCount>=4) {d3.select("#next1").classed("hide", true);} else {d3.select("#next1").classed("hide", false);}
			if(dvc.pageCount<=0) {d3.select("#back").classed("hide", true);} else {d3.select("#back").classed("hide", false);}

			if(dvc.pageCount == 0) {
				
			addbar(); 
			
				if((dvc.decile+1) <=3) {
							titlemsg = "Poorest " + (dvc.decile+1) + "0%"					
							txtMsg = "Your disposable income puts you in the <span class='spanHigh'> poorest " + (dvc.decile+1) + "0%</span> of all households in the UK.";
						} 
						else if((dvc.decile+1) >=8)  {
							
							titlemsg = "Richest " + (10 - dvc.decile) + "0%"	
							txtMsg = "Your disposable income puts you in the <span class='spanHigh'> richest " + (10 - dvc.decile) + "0%</span> of all households in the UK.";
						}
						else {
							titlemsg = "Near the middle"	
							txtMsg = "Your disposable income puts you in a group somewhere in the middle." ;
						}
													
						var txtMsg2 = "After adjusting for the number of people you live with, you have the equivalent of <span class='spanHigh'>£"+ dvc.formatpound(dvc.respDisposableEquiv/12) + " a month</span> (£" + dvc.formatpound(dvc.respDisposableEquiv) + " a year) left to spend or save after paying direct taxes like income tax and council tax.<br><br>" + 
											"This is your comparable <span class='spanTitle'>disposable income</span>.<br><br>" + txtMsg;
																			
						d3.select(".titlebar").text(titlemsg);
						d3.select("#commentary").select("p").html(txtMsg2);
			
			
			} else if(dvc.pageCount == 1){
				
				
				addbars(dvc.notaxorben);	
				d3.select("#commentary").select("p").html("If there were no taxes or benefits, the average income for households in your group would be <span class='spanHigh'>£" + dvc.formatpound(dvc.notaxorben[dvc.decile]) + " a year</span><br><br>Overall, average income for the richest 10% would be <span class='spanHigh'>"+ dvc.formatpound(dvc.notaxorben[9]/dvc.notaxorben[0]) + " times</span> higher than the poorest 10%.");
				d3.select(".titlebar").text("Before taxes or benefits");
				
						
			} else if(dvc.pageCount == 2){
				
				addbars1(dvc.totalcashbenefits);	
				d3.select("#commentary").select("p").html("Households in your group receive an average of <span class='spanHigh'>£" + dvc.formatpound(dvc.totalcashbenefits[dvc.decile]) + " a year</span> in cash benefits such as Tax Credits, State Pension, Jobseeker's Allowance, and Disability Living Allowance.<br><br> This is around <span class='spanHigh'>" + dvc.formatcomma((dvc.totalcashbenefits[dvc.decile]/dvc.grossincome[dvc.decile])*100) + "%</span> of total income before tax.<br><br> As you might expect, poorer households tend to receive more in cash benefits than richer ones. This helps to reduce income inequality.");
				
				d3.select(".titlebar").text("Let's add in benefits");
				
							
			} else if(dvc.pageCount == 3){
				
				addbars2(dvc.taxes)
				d3.select("#commentary").select("p").html("Households in your group pay around <span class='spanHigh'>£" + dvc.formatpound(dvc.taxes[dvc.decile]) + " a year</span> in direct taxes. <br><br> This is around <span class='spanHigh'>" + dvc.formatcomma((dvc.taxes[dvc.decile]/dvc.grossincome[dvc.decile])*100) + "% of total income </span>(including cash benefits). <br><br> Richer households pay more in direct taxes both in terms of actual amount and as a proportion of income. This also helps reduce income inequality.");
				d3.select(".titlebar").text("Now let's deduct taxes");
				
			} else if(dvc.pageCount == 4){
				
				var moreorless = dvc.disposableincome[dvc.decile] - dvc.notaxorben[dvc.decile];
				
				if(moreorless <0) {var moreless = "less"; moreorless = moreorless*-1} else {var moreless = "more";}
				
				
				addbars3(dvc.disposable97)
				d3.select("#commentary").select("p").html("The red lines show average income levels before direct taxes and cash benefits.<br><br>They show the richest 10% had an average income " + dvc.formatpound(dvc.notaxorben[9]/dvc.notaxorben[0]) + " times higher than the poorest 10%. After taxes and benefits this is <span class='spanHigh'>reduced to " + dvc.formatpound(dvc.disposableincome[9]/dvc.disposableincome[0]) + " times</span>. <br><br>Households in your group, on average, have <span class='spanHigh'>£" + dvc.formatpound(moreorless) + " " + moreless + " </span>a year after taxes and benefits.");	
				
				d3.select(".titlebar").text("How does it compare?");
			
			} 
			
					if (pymChild) {
						pymChild.sendHeight();
					}
			
			
		}


		function addbars(array)
		{
			
			bar = mainChart.select("#grpBars").selectAll(".chartBars")
				.data(array);	
			
			//If the element is a new selection then append a rectangle - ENTER - Do the things you only want to do once.
			bar.enter()
					.append("rect")
					.attr("class", function(d,i){if(dvc.decile != i){return "chartBars"} else {return "chartBars chartBarHigh"}})
					.attr("id",function(d,i) {
						return "bar" + i;
					})
					.attr("y", dvc.yScale(0))
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("width", dvc.cellWidth)
					.attr("height", 0);
		

			//If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
			bar.transition()
  		       		.duration(2000)
					.attr("y", function(d) { 
						return dvc.yScale(Math.max(0, d));
					})
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("height", function(d)	{
						return Math.abs(dvc.yScale(d) - dvc.yScale(0));
					})
					.style("opacity","1");
					
				
			//If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
			bar.exit().remove();
			
			
			var chartben = d3.selectAll(".chartBen");
			
			chartben.transition().duration(500)
					.attr("y", dvc.yScale(0))
					.attr("height",0);
					
			chartben.transition().delay(500).remove();
			
			
		}


		function addbars1(array)
		{

			//Fade back the existing bars & set height if going backwards
			mainChart.select("#grpBars").selectAll(".chartBars")
					.transition()
  		       		.duration(1000)
					.style("opacity","0.2")
					.attr("y", function(d,i) { 
						return dvc.yScale(Math.max(0, dvc.notaxorben[i]));
					})
					.attr("height", function(d,i)	{
						return Math.abs(dvc.yScale(dvc.notaxorben[i]) - dvc.yScale(0));
					});
			

			//Same trick as before
			//Select the group element which contains the bars and then all the chartBars within
			barBen= mainChart.select("#grpBars").selectAll(".chartBen")
				.data(array);
			
			//If the element is a new selection then append a rectangle - ENTER - Do the things you only want to do once.
			barBen.enter()
					.append("rect")
					.attr("class", function(d,i){if(dvc.decile != i){return "chartBen"} else {return "chartBen chartBenHigh"}})
					.attr("id",function(d,i) {
						return "barBen" + i;
					})
					.attr("width", dvc.cellWidth)
					.attr("height",0)
					.attr("y", function(d,i) { 
						return dvc.yScale(dvc.notaxorben[i]);
					})
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					});
					
					

			//If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
			barBen.transition()
  		       		.duration(500)
					.delay(1100)
					.attr("y", function(d,i) { 
						return dvc.yScale(Math.max(0, (d + dvc.notaxorben[i])));
					})
					.attr("height", function(d,i)	{
						return Math.abs(dvc.yScale(d) - dvc.yScale(0));
					});
					
				
			//If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
			barBen.exit().remove();

		}
		
		
		function addbars2(array)
		
		{
					

			mainChart.select("#grpBars").selectAll(".chartBen")
				.transition().duration(1000)
				.attr("height","3")
				.attr("y", function(d,i) { 
					return dvc.yScale(Math.max(0, (dvc.totalcashbenefits[i] + dvc.notaxorben[i])));
				})
				.style("fill","#078de2");
				
		
		
			bar= mainChart.select("#grpBars").selectAll(".chartBars")
				.data(dvc.incplusben);
					
		
		
			bar.enter()
					.append("rect")
					.attr("class", function(d,i){if(dvc.decile != i){return "chartBars"} else {return "chartBars chartBarHigh"}})
					.attr("id",function(d,i) {
						return "bar" + i;
					})
					.attr("y", dvc.yScale(0))
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("width", dvc.cellWidth)
					.attr("height", 0);
		

			//If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
			bar.transition()
  		       		.duration(1000)
					.attr("y", function(d) { 
						return dvc.yScale(Math.max(0, d));
					})
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("height", function(d)	{
						return Math.abs(dvc.yScale(d) - dvc.yScale(0));
					})
					.style("opacity",1);
					
				
			//If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
			bar.exit().remove();
			
			
			setTimeout(function(){
			
				bar= mainChart.select("#grpBars").selectAll(".chartBars")
					.data(dvc.disposableincome);
					
	
			bar.enter()
					.append("rect")
					.attr("class", function(d,i){if(dvc.decile != i){return "chartBars"} else {return "chartBars chartBarHigh"}})
					.attr("id",function(d,i) {
						return "bar" + i;
					})
					.attr("y", dvc.yScale(0))
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("width", dvc.cellWidth)
					.attr("height", 0);
		

			//If it's an existing selection just change these attributes - UPDATE - Do the things here you want to do apply to every element	
			bar.transition()
  		       		.duration(2000)
					.attr("y", function(d) { 
						return dvc.yScale(Math.max(0, d));
					})
					.attr("transform", function(d, i) {
						return "translate(" + dvc.cellWidth* i +"," + 0  + ")";
					})
					.attr("height", function(d)	{
						return Math.abs(dvc.yScale(d) - dvc.yScale(0));
					})
					.style("opacity",1);
					
				
			//If it's a selection that is no longer needed (ie there isn't a data point in the array for an existing bar) then remove it - REMOVE		
			bar.exit().remove();
				
				
			},1200)
			
		
		
		}



		function addbars3(array)
	
		{


		mainChart.select("#grpBars").selectAll(".chartBen")
			.data(dvc.notaxorben)
			.transition()
			.duration(1000)
			.attr("y", function(d,i) { 
					return dvc.yScale(Math.max(0, d));
			})
			.attr("height","3")
			.style("fill","#f93c52");

				
		}

	if (pymChild) {
        pymChild.sendHeight();
  	}


		//plugin bootstrap minus and plus
		//http://jsfiddle.net/laelitenetwork/puJ6G/
		$('.btn-number').click(function(e){
		    e.preventDefault();
		    
		    fieldName = $(this).attr('data-field');
		    type      = $(this).attr('data-type');
		    var input = $("input[name='"+fieldName+"']");
		    var currentVal = parseInt(input.val());
		    if (!isNaN(currentVal)) {
		        if(type == 'minus') {
		            
		            if(currentVal > input.attr('min')) {
		                input.val(currentVal - 1).change();
		            } 
		            if(parseInt(input.val()) == input.attr('min')) {
		                $(this).attr('disabled', true);
		            }

		        } else if(type == 'plus') {

		            if(currentVal < input.attr('max')) {
		                input.val(currentVal + 1).change();
		            }
		            if(parseInt(input.val()) == input.attr('max')) {
		                $(this).attr('disabled', true);
		            }

		        }
		    } else {
		        input.val(0);
		    }
		});
		$('.input-number').focusin(function(){
		   $(this).data('oldValue', $(this).val());
		});
		$('.input-number').change(function() {
		    
		    minValue =  parseInt($(this).attr('min'));
		    maxValue =  parseInt($(this).attr('max'));
		    valueCurrent = parseInt($(this).val());
		    
		    name = $(this).attr('name');
		    if(valueCurrent >= minValue) {
		        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
		    } else {
		        //alert('Sorry, the minimum value was reached');
		        $(this).val($(this).data('oldValue'));
		    }
		    if(valueCurrent <= maxValue) {
		        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
		    } else {
		        //alert('Sorry, the maximum value was reached');
		        $(this).val($(this).data('oldValue'));
		    }
		    
		    
		});
		$(".input-number").keydown(function (e) {
		        // Allow: backspace, delete, tab, escape, enter and .
		        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
		             // Allow: Ctrl+A
		            (e.keyCode == 65 && e.ctrlKey === true) || 
		             // Allow: home, end, left, right
		            (e.keyCode >= 35 && e.keyCode <= 39)) {
		                 // let it happen, don't do anything
		                 return;
		        }
		        // Ensure that it is a number and stop the keypress
		        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		            e.preventDefault();
		        }
		    });





	}
	) 
} else {

	if (pymChild) {
		pymChild.sendHeight();
	}
	
	$(".splash").hide();
	
}

