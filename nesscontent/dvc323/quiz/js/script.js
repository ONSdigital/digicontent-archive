
// ____                 _               ____            _                 
/// ___|  ___ ___  _ __(_)_ __   __ _  / ___| _   _ ___| |_ ___ _ __ ___  
//\___ \ / __/ _ \| '__| | '_ \ / _` | \___ \| | | / __| __/ _ \ '_ ` _ \ 
// ___) | (_| (_) | |  | | | | | (_| |  ___) | |_| \__ \ ||  __/ | | | | |
//|____/ \___\___/|_|  |_|_| |_|\__, | |____/ \__, |___/\__\___|_| |_| |_|
//                              |___/         |___/                       


//Q1
var q1score = 4;

//Q2
var q2score = 4;

//Q3
var q3score = 3;

//Q4
var q4score = 1;




//namespace any global variables
var dvc = {}; 


d3.select(".start").on("click",function(){		
		$("#landing").hide();
		$("#question1").show();
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});


d3.select(".q1a1").on("click",function(){	
		d3.selectAll(".q1").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q1answer2").hide();
		$("#q1answer3").hide();
		$("#q1answer4").hide();
		$("#q1answer1").show();
				
				//Disables the answer 
				$(".q1a1").addClass("disabled");
				
				//score change
				q1score = q1score - 1;
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});


d3.select(".q1a2").on("click",function(){	
		d3.selectAll(".q1").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q1answer1").hide();
		$("#q1answer3").hide();
		$("#q1answer4").hide();
		$("#q1answer2").show();
				//Disables the answer 
				$(".q1a2").addClass("disabled");
				
				//score change
				q1score = q1score - 1;
				
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});


d3.select(".q1a3").on("click",function(){	
		d3.selectAll(".q1").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q1answer1").hide();
		$("#q1answer2").hide();
		$("#q1answer4").hide();
		$("#q1answer3").show();
				//Disables the answer 
				$(".q1a3").addClass("disabled");

				//score change
				q1score = q1score - 1;
				
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});


d3.select(".q1a4").on("click",function(){	
		d3.selectAll(".q1").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q1answer1").hide();
		$("#q1answer2").hide();
		$("#q1answer3").hide();
		$("#q1answer4").show();
				//Disables the answer 
				$(".q1a1").addClass("disabled");
				$(".q1a2").addClass("disabled");
				$(".q1a3").addClass("disabled");
				$(".q1a4").addClass("disabled");

				//score change
				q1score = q1score - 1;
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});



		
				d3.select(".goto2").on("click",function(){		
						$("#question1").hide();
						$("#question2").show();
						if (pymChild) {
								pymChild.sendHeight();
						}
				});





d3.select(".q2a1").on("click",function(){	
		d3.selectAll(".q2").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q2answer2").hide();
		$("#q2answer3").hide();
		$("#q2answer4").hide();
		$("#q2answer1").show();
				//Disables the answer 
				$(".q2a1").addClass("disabled");
				$(".q2a2").addClass("disabled");
				$(".q2a3").addClass("disabled");
				$(".q2a4").addClass("disabled");
				
				//score change
				q2score = q2score - 1;

		if (pymChild) {
		        pymChild.sendHeight();
	    }
});

d3.select(".q2a2").on("click",function(){	
		d3.selectAll(".q2").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q2answer1").hide();
		$("#q2answer3").hide();
		$("#q2answer4").hide();
		$("#q2answer2").show();
				//Disables the answer 
				$(".q2a2").addClass("disabled");

				//score change
				q2score = q2score - 1;
		
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});

d3.select(".q2a3").on("click",function(){	
		d3.selectAll(".q2").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q2answer1").hide();
		$("#q2answer2").hide();
		$("#q2answer4").hide();
		$("#q2answer3").show();
				//Disables the answer 
				$(".q2a3").addClass("disabled");
				
				//score change
				q2score = q2score - 1;
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});

d3.select(".q2a4").on("click",function(){	
		d3.selectAll(".q2").classed("active" ,false);
		d3.select(this).classed("active" ,true);	
		$("#q2answer1").hide();
		$("#q2answer2").hide();
		$("#q2answer3").hide();
		$("#q2answer4").show();
				//Disables the answer 
				$(".q2a4").addClass("disabled");
		
				//score change
				q2score = q2score - 1;
		if (pymChild) {
		        pymChild.sendHeight();
	    }
});


				d3.select(".goto3").on("click",function(){		
						$("#question2").hide();
						$("#question3").show();
						draw_q3_slider();
				});
				


	pymChild = new pym.Child();
	//remove preview image/message if browser suppports SVG
	$("#altern").remove();
	
	var q3slidervals = [25,25,25,25];	//default score thing

	//Load main script/data
	
	function draw_q3_slider(){
		
	width = $(".container-fluid").width();
	
		//main script
		Totalspent = 13679;
		
		ActualSplit = [5411,1426,3434,3408];
		
		actualansq3 = [40,10,25,25];
		
		classes = ["first","second","third","fourth"];
		
		
		$("#revealslide").hide();
		$(".textResult").hide();
		
		//categories = ["Detached","Semi-detached","Terraced","Flats/Maisonettes"];
		
		$.fn.digits = function(){ 
			return this.each(function(){ 
				$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
			})
		}
		
		$("#submitbutton").click(revealresult);
	
		
		for(i = 0; i < classes.length; i++) {
			
			var percentshare =  Math.round((ActualSplit[i] / Totalspent)*100);
			var startshare = Math.round(Totalspent/classes.length);
			var startshareper = Math.round(100/classes.length);
			
			$("#revealrow").append('<td class="' + classes[i] + '" width=' + percentshare + '%</td>');
			$("#q3_textrev" + i).append("<span>" + ActualSplit[i].toLocaleString("en") + "</span><br>" + percentshare + "%");
			$("#initialrow").append('<td class="' + classes[i] + '" width=' + startshare + '%</td>');
			$("#q3_textnx" + i).append("<span>" + startshare.toLocaleString("en") + "</span><br>" + Math.round(startshareper) + "%");

		};
		
		
	function revealresult() {
		$("#revealslide").show();
		$(".textResult").show();
		$("#submitbutton").addClass("hidden");
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
			var columns = $(e.currentTarget).find("td");
			d3.select("#submitbutton").style( "visibility","visible");//prompts user to know that the sliders are a thing that need to be used"
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
				
								
				// this next if statement will give the users guessed array in % terms. 
				// this can then be compared with the "actual" in absolute terms for a degree of wrongness 
				if (i==0){
					q3slidervals[i]=parseInt(s.replace("%",""));
				} else if (i==1){
				    q3slidervals[i]=parseInt(s.replace("%",""));
				} else if (i==2){
				    q3slidervals[i]=parseInt(s.replace("%",""));
				} else {
				    q3slidervals[i]=parseInt(s.replace("%",""));
				}
				
				
				//these calculate the absolute difference between each guess ands its actual figure
						
				q3dif1 = Math.abs(q3slidervals[0] - actualansq3[0]);
				q3dif2 = Math.abs(q3slidervals[1] - actualansq3[1]);
				q3dif3 = Math.abs(q3slidervals[2] - actualansq3[2]);
				q3dif4 = Math.abs(q3slidervals[3] - actualansq3[3]);
				
				//these differences are then summed to form a total "wrongness" figure
				wrongness3 = (q3dif1 + q3dif2 + q3dif3 + q3dif4);
				
				//now we finally give a score for the question based on wrongness

					if (wrongness3 >=60) {
						q3score = 0;
					} else if (wrongness3 >=31){
						q3score = 1;
					} else if (wrongness3 >=15){
						q3score = 2;
					} else { 
					    q3score = 3;
					} 
					


				number = Math.round((ranges[i]/100)*Totalspent)
				numberfmt = number.toLocaleString("en");
				
				$("#q3_textnx" + i).html("<span>" + numberfmt + "</span><br>"+ s);
		
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
	 

//shows the final "next" button on clicking "show me the actual split"

  $("#submitbutton").click(function() {
    $("#gotofour").show();
	$("#q3nugget").show();
	
  });





  
  
	
				d3.select(".goto4").on("click",function(){		
						$("#question3").hide();
						$("#question4").show()
						$(".JCLRgrip").removeClass("hidden");
						draw_q4_slider();
				});
				
				




//##### Q4 ########## Q4 ########## Q4 ########## Q4 ########## Q4 #####



	pymChild = new pym.Child();
	//remove preview image/message if browser suppports SVG
	$("#altern").remove();

	
	var q4slidervals = [25,25,25,25];	//default score thing
	
	
	//Load main script/data
	function draw_q4_slider()
	{	
		

	
	width2 = $(".container-fluid").width();
	
		//main script
		Totalspent2 = 1306;
		
		ActualSplit2 = [296,48,158,804];
		
		actualansq4 = [23,4,12,62];

		
		classes2 = ["first","second","third","fourth"];
		
		
		$("#revealslide2").hide();
		$(".textResult2").hide();
		
		//categories2 = ["Detached","Semi-detached","Terraced","Flats/Maisonettes"];
		
		$.fn.digits2 = function(){
			return this.each(function(){ 
				$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
			})
		}
		
		$("#submitbutton2").click(revealresult);
	
		
		for(i = 0; i < classes2.length; i++) {
			
			var percentshare2 =  Math.round((ActualSplit2[i] / Totalspent2)*100);
			
			var startshare2 = Math.round(Totalspent2/classes2.length);
			var startshareper2 = Math.round(100/classes2.length);
			
			$("#revealrow2").append('<td class="' + classes2[i] + '" width=' + percentshare2 + '%</td>');
			$("#q4_textrev2" + i).append("<span>" + ActualSplit2[i].toLocaleString("en") + "</span><br>" + percentshare2 + "%");
			$("#initialrow2").append('<td class="' + classes2[i] + '" width=' + startshare2 + '%</td>');
			$("#q4_textnx2" + i).append("<span>" + startshare2.toLocaleString("en") + "</span><br>" + Math.round(startshareper2) + "%");

		};
		
		
	function revealresult() {
		$("#revealslide2").show();
		$(".textResult2").show();
		$("#submitbutton2").addClass("hidden");
		$('#slider2').attr("disabled",'disabled');
		$('#slider2').css("pointer-events","none");
		$(".JCLRgrip").addClass("hidden");
			if (pymChild) {
		        pymChild.sendHeight();
		    }
	}


	$(function(){	
		//callback function
		var onSlide = function(e){
			var columns = $(e.currentTarget).find("td");
			d3.select("#submitbutton2").style( "visibility","visible");//prompts user to know that the sliders are a thing that need to be used"
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
				
				
				// this next if statement will give the users guessed array in % terms. 
				// this can then be compared with the "actual" in absolute terms for a degree of wrongness 
				if (i==0){
					q4slidervals[i]=parseInt(s.replace("%",""));
				} else if (i==1){
				    q4slidervals[i]=parseInt(s.replace("%",""));
				} else if (i==2){
				    q4slidervals[i]=parseInt(s.replace("%",""));
				} else {
				    q4slidervals[i]=parseInt(s.replace("%",""));
				}
				
				
				//these calculate the absolute difference between each guess ands its actual figure
						
				q4dif1 = Math.abs(q4slidervals[0] - actualansq4[0]);
				q4dif2 = Math.abs(q4slidervals[1] - actualansq4[1]);
				q4dif3 = Math.abs(q4slidervals[2] - actualansq4[2]);
				q4dif4 = Math.abs(q4slidervals[3] - actualansq4[3]);
				
				//these differences are then summed to form a total "wrongness" figure
				wrongness4 = (q4dif1 + q4dif2 + q4dif3 + q4dif4);
				
				//now we finally give a score for the question based on wrongness

					if (wrongness4 >=60) {
						q4score = 0;
					} else if (wrongness4 >=31){
						q4score = 1;
					} else if (wrongness4 >=15){
						q4score = 2;
					} else { 
					    q4score = 3;
					} 
					
				
					







				
				number = Math.round((ranges[i]/100)*Totalspent2)
				numberfmt = number.toLocaleString("en");
				
				$("#q4_textnx2" + i).html("<span>" + numberfmt + "</span><br>"+ s);
		
			}
			
			if (pymChild) {
		        setTimeout(function(){pymChild.sendHeight()},5000);
		    }		
			//s=s.slice(0,-1);			
		}
		
		//colResize the table
		$("#range2").colResizable({
			liveDrag:true, 
			draggingClass:"rangeDrag2", 
			gripInnerHtml:"<div class='rangeGrip2'></div>", 
			onResize:onSlide,
			minWidth:8
			});
	
	});	

			if (pymChild) {
		       pymChild.sendHeight();
		    }	
	}
	

//shows the final "next" button on clicking "show me the actual split"

  $("#submitbutton2").click(function() {
	$("#q4nugget").show();
  });

  
  				d3.select("#finishbtn").on("click",function(){
					
						
					
						var wholenumberfmt = d3.format(".0f");
					
						$("#question4").hide();
						$("#finish").show();
						//Final score
					    finalscore = (q1score + q2score + q3score + q4score);
						percentagescore = (finalscore / 12);
						percentagescore2 = wholenumberfmt(percentagescore*100);
					
						//this if statement decides the final message
										if (percentagescore2 >=99){
											d3.select("#scoretext").text("Excellent!");
											//d3.select("#scoredescription").text("Your answers were spot on. Your knowledge of the £1m+ property market is very impressive!");
										} else if (percentagescore2 >=75){
											d3.select("#scoretext").text("Very good");
											//d3.select("#scoredescription").text("Your answers were close. Your knowledge of the £1m+ property market is impressive.");
										} else if (percentagescore2 >=49){
											d3.select("#scoretext").text("Not bad");
											//d3.select("#scoredescription").text("Your answers were OK. You have some knowledge of the £1m+ property market.");
										} else { 
											d3.select("#scoretext").text("Poor");
											d3.select("#scoredescription").text("Better luck next time.");
										}
				
		
						if (pymChild) {
								pymChild.sendHeight();
						}
				});







