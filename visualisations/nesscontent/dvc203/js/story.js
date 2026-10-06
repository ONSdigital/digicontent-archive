function showStoryHideIcons (){
		//hide icons
		d3.selectAll(".iconRow")
				/*.transition()
				.duration(500)
				.style("opacity", "0.0")
				.style("pointer-events", "none")
				.transition()
				.delay(500)*/
				.style("display", "none");
				
		//hide carousel
		d3.select("#carousel")
				.transition()
				.duration(500)
				.style("opacity", "0.6")
				.style("pointer-events", "none")
				
				
		d3.select(".owl-stage-outer").style("height", "0px");		
		d3.select(".owl-dots").style("display", "none");	
		d3.select("#howmuch").style("display", "none");	
				
		//show story		
		d3.selectAll(".story")
				.transition()
				.delay(500)
				.duration(500)
				.style("opacity", "1")
				.style("pointer-events", "auto")
				.style("display", "block");
				
		//hide button
		d3.selectAll(".nav")
				.style("pointer-events", "none")
				.transition()
				.duration(500)
				.style("opacity", "0.0")
};

function hideStoryShowIcons (){
		//show icons
		d3.selectAll(".iconRow")
					.transition()
					.duration(500)
					.style("opacity", "1")
					.style("pointer-events", "auto")
					.style("display", "block");

		//show carousel
		d3.select("#carousel")
				.transition()
				.duration(500)
				.style("opacity", "1")
				.style("pointer-events", "auto")
				
		d3.select(".owl-stage-outer").style("height", "140px");		
		d3.select(".owl-dots").style("display", "inline-block");	
		d3.select("#howmuch").style("display", "block");	
		
		//hideStory			
		d3.selectAll(".story")
					.style("display", "block")
					.transition().duration(500)
					.style("opacity", "0")
					.style("pointer-events", "none")
					.style("display", "none");
		
		//show button
		d3.selectAll(".nav")
				.style("pointer-events", "auto")
				.transition()
				.duration(500)
				.style("opacity", "1")
		
		
}

function changeStory(storyIndex){
	d3.selectAll(".chosenIcon").attr("src",imgsdata.imageSrc[storyIndex]);
	
	d3.selectAll(".storyHeading").text(imgsdata.topicName[storyIndex]);
	d3.selectAll(".weeklyAmount").text("The amount spent on "+ imgsdata.topicName[storyIndex] +" each week was:");
	d3.selectAll(".weeklyAmountVal").text(imgsdata.topicValue[storyIndex])
	
	
};

function backToTop (){
				
			$(levelArray).each(function(i){		
				setTimeout(function(){
					simulateClick(grandparent[0][0]);
				},760*i);
			});
};

function iconStory(storyIndex){
			//zoom in functionality
			showStoryHideIcons ();
			
			changeStory(storyIndex);
			
			var storyArray = imgsdata.storyIds[storyIndex];
			$(storyArray).each(function(i){
					
					setTimeout(function(){
						storyId = "#"+storyArray[i];
						simulateClick(d3.select(storyId)[0][0]);
						
						d3.selectAll(".child").style("opacity", 0.5);	
						selection = imgsdata.highlightId[storyIndex]
						d3.selectAll("#"+selection).style("opacity", 1);
						if(selection == "c2_1_2"){
							d3.select("#c2_1_2_1").style("opacity", 1);
							d3.select("#c2_1_2_2").style("opacity", 1);
							d3.select("#c2_1_2_3").style("opacity", 1);
						}						
					 }, 760*i); 
			});
			
			//zoom out functionality
			d3.selectAll(".closeStory").on('click', function() {
					hideStoryShowIcons();
					backToTop();
					d3.selectAll(".child").style("opacity", 1);	
					if (pymChild) {
						pymChild.sendHeight(); 
					}
			});
			
			
}

//Story panel function
function storyIn() {
		iconId = $(this).attr("id");
		if (iconId.length > 3 ) { 
			 storyIndex =iconId.substring(5,iconId.length);
		} else {
			 storyIndex =iconId.substring(1,iconId.length)-1;		
		}
		
		if(atTop==false){
				backToTop();
				setTimeout( function () { iconStory(storyIndex);} , level*760)		
		} else {
		 		iconStory(storyIndex);
		}

		};
		
