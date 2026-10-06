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




	});
	

d3.select("#share1").append("a")
	.attr("href","https://www.facebook.com/sharer/sharer.php?u=" + "http://visual.ons.gov.uk/uk-perspectives-2016-international-migration-to-and-from-the-uk")
	.attr("target","_blank")
	.attr("class","share")
	.style("display","block")
	.style("height","25px")
	.style("width","25px")
	.style("background","#3B5998")
	.style("margin-top","5px")
	.style("margin-bottom","10px")
	.append("img")
	.style("padding-left","5px")
	.style("padding-top","5px")
	.attr("src","./images/facebook.svg");
	
d3.select("#share2").append("a")
	.attr("href",encodeURI("https://twitter.com/intent/tweet?text=Test how much you know about migration "+ "http://visual.ons.gov.uk/uk-perspectives-2016-international-migration-to-and-from-the-uk"))
	.attr("target","_blank")
	.attr("class","share")
	.style("display","block")
	.style("height","25px")
	.style("width","25px")
	.style("background","#4099FF")
	.append("img")
	.style("height","22px")
	.style("width","22px")
	.style("padding-left","3px")
	.style("padding-top","3px")
	.attr("src","./images/twitter.svg");