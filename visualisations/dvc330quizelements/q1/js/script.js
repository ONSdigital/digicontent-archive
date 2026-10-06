//namespace any global variables
var dvc = {}; 



	pymChild = new pym.Child();
	//remove preview image/message if browser suppports SVG
	$("#altern").remove();

	//Load main script/data
	$(document).ready(function()
	{	
		
//		if (window.innerHeight > window.innerWidth) {
//			alert("hello");
//			$(".container-fluid").hide();
//			
//		}

d3.json("./assets/config.json", function(error, config) {
			dvc=config
			
			console.log(dvc.essential.Labels);
					
					//use pym to create iframed chart dependent on specified variables
					//pymChild = new pym.Child({ renderCallback: drawGraphic});
					
					buildInterface();
					
					
				});
				
function buildInterface() {
	
	
	//Work out how many columns each cat should take up
	
	if(dvc.essential.Labels.length == 2) {
		numCols = 6;	
	} else if(dvc.essential.Labels.length == 3) {
		numCols = 4;	
	} else if (dvc.essential.Labels.length == 4) {
		numCols = 3;	
	} else if (dvc.essential.Labels.length == 5) {
		numCols = 2;	
	} else if (dvc.essential.Labels.length == 6) {
		numCols = 2;	
	}
	
	//Create question text
	
	var QuestionText = d3.select("#QuestionMain")
		.text(dvc.essential.Question)
		
	var RevealAnswerText = d3.select("#revealTextpara")
		.text(dvc.essential.Reveal)
	
			//create link to source				
		d3.select("#sourceInfo").append("p")
			.text("Source: ")
			.append("a")
			.attr("href", dvc.essential.sourceURL)
			.attr("target", "_blank")
			.html(dvc.essential.sourceText);
	
	// Draw labels and legend dots

	var firstDiv = d3.select("#textLabels")
		.selectAll("div")
		.data(dvc.essential.Labels)
		.enter()
		.append("div")
		.attr("id",function(d,i){return "text" + i})
		.attr("class",function(d,i) {return "textsec col-sm-" + numCols + " col-xs-" + numCols});
		
	firstDiv.append("div")
		.attr("class", function(d,i){return "box" + (i+1) + " box"})
		
	firstDiv.append("div")
		.attr("id", function(d,i){return "textx" + i})
		.html(function(d){return d;});
		
		
		
		
		

	var firstDiv2 = d3.select("#textResult")
		.selectAll("div")
		.data(dvc.essential.Labels)
		.enter()
		.append("div")
		.attr("id",function(d,i){return "text" + i})
		.attr("class",function(d,i) {return "textsec col-sm-" + numCols + " col-xs-" + numCols});
		
	firstDiv2.append("div")
		.attr("class", function(d,i){return "box" + (i+1) + " box"})
		
	firstDiv2.append("div")
		.attr("id", function(d,i){return "textx" + i})
		.html(function(d){return d;});
		
		
	// Draw percentage labels
	
	var secondDiv = d3.select("#textNums")
		.selectAll("div")
		.data(dvc.essential.Values)
		.enter()
		.append("div")
		.attr("id",function(d,i){return "text" + i})
		.attr("class",function(d,i) {return "textsec col-sm-" + numCols + " col-xs-" + numCols});
		
	secondDiv.append("div")
		.attr("id", function(d,i){return "textnx" + i})

	
	// experimental..............................
	
	var seconddiv2 = d3.select(".textResult2")
		.selectAll("div")
		.data(dvc.essential.Labels)
		.enter()
		.append("div")
		.attr("id",function(d,i){return "textrev" + i})
		.attr("class",function(d,i) {return "textsec col-sm-" + numCols + " col-xs-" + numCols});
		
	
	
		
	handleOrientation();
	$(window).resize(handleOrientation);
	
	drawBars();
}


function handleOrientation() {
	
	width = $(".container-fluid").width();
	
	if(window.innerHeight > window.innerWidth){
		if(width<=499){
				$("#main").hide(); 
				$("#rotate").show();
			} else { 
				$("#main").show();
				$("#rotate").hide();
			}
	
	} else {
		$("#main").show();
		$("#rotate").hide();
	}
	
}
	


function drawBars() {
	
	

		//main script
		Totalspent = d3.sum(dvc.essential.Values);
		
		ActualSplit = dvc.essential.Values;
		
		//classes = ["box1","box2","box3"];
		
//Pensions	83,527	87,306	93,699	100,939	104,442	41.6
//Incapacity, disability and injury benefits	30,626	32,372	33,916	36,416	37,537	14.9
//Unemployment benefits	5,533	5,231	5,633	5,939	4,945	2.0
//Housing benefits	22,812	24,399	25,366	26,360	26,386	10.5
//family benefits, income support and tax credits	21,943	21,282	20,308	18,484	16,134	6.4
//Personal social services and other benefits	58,560	59,807	61,075	62,336	61,828	24.6
		
		$("#revealslide").css({ opacity: 0 });
		$(".textResult").css({ opacity: 0 });
		$(".textResult2").css({ opacity: 0 });
		
		categories = ["Pensions","Incapacity, disability & injury benefits","other thing"];
		
		$.fn.digits = function(){ 
			return this.each(function(){ 
				$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
			})
		}
		
		console.log(dvc);
		
		
		$("#submitbut").click(revealresult);
		
		for(i = 0; i < dvc.essential.Labels.length; i++) {
			
			var percentshare =  Math.round((ActualSplit[i] / Totalspent)*100);
			var startshare = Math.round(Totalspent/dvc.essential.Labels.length);
			var startshareper = Math.round(100/dvc.essential.Labels.length);
	
			
			$("#revealrow").append('<td class="box' + (i+1) + '" width=' + percentshare + '%</td>');
			$("#textrev" + i).append("<span>" + ActualSplit[i].toLocaleString("en") + "</span><br>" + percentshare + "%");
			$("#initialrow").append('<td class="box' + (i+1) + '" width=' + startshareper + '%</td>');
			$("#textnx" + i).append("<span>" + startshare.toLocaleString("en") + "</span><br>" + Math.round(startshareper) + "%");

		};
			

				
	function revealresult() {
		$("#revealslide").show().animate({
        opacity: '1',
        }, "slow");
		$("#textResult").show().animate({
        opacity: '1',
        }, "slow");
		$(".textResult2").show().animate({
        opacity: '1',
        }, "slow");
		$("#AnswerDescription").show().animate({
        opacity: '1',
        }, "slow");
		$(".instructionparaGo").html("You guessed");
		$("#submitbut").addClass("hidden");
		$('#slider').attr("disabled",'disabled');
		$('#slider').css("pointer-events","none");
		$(".JCLRgrip").addClass("hidden");
			if (pymChild) {
		        pymChild.sendHeight();
		    }

	}

	$(function(){	

	
		//callback function
			var onSlide = function(e){
				 
			$('.rangeGrip').css("animation-iteration-count","0");
				
			var columns = $(e.currentTarget).find("td");
			
			var ranges = [], total = 0, i, s ="Ranges: ", w;
			for(i = 0; i<columns.length; i++){
				w = columns.eq(i).width()-10 - (i==0?1:0);
				ranges.push(w);
				total+=w;
			}		 
			for(i=0; i<columns.length; i++){	
			
				ranges[i] = 100*(ranges[i]/total);
				carriage = ranges[i]-w
				
				s =Math.round(ranges[i]) + "%";	
				number = Math.round((ranges[i]/100)*Totalspent)
				numberfmt = number.toLocaleString("en");
				
				$("#textnx" + i).html("<span>" + numberfmt + "</span><br>"+ s);
		
			}
			
			if (pymChild) {
		        setTimeout(function(){pymChild.sendHeight()},5000);
		    }		
			//s=s.slice(0,-1);			
		}
		
		//colResize the table
		$("#range").colResizable({
			liveDrag:true, 
			draggingClass:"rangeDrag", 
			gripInnerHtml:"<div class='rangeGrip'></div>", 
			onResize:onSlide,
			minWidth:8
			});
	
	});	

			if (pymChild) {
		       pymChild.sendHeight();
		    }	
	}
	
	
	
} // end drawBars

	
	)
