dvc = {};

pymChild = new pym.Child();

if (pymChild) {
    pymChild.sendHeight();
}

clicked1 = false;
clicked2 = false;
clicked3 = false;
clicked4 = false;
clicked5 = false;
clicked6 = false;

d3.selectAll(".gender").on("click",function(){

		d3.selectAll(".gender").classed("active" ,false);
		d3.select(this).classed("active" ,true);
		
		if (this.id == "man") {
		d3.select("#manpic").attr('src','images/man2.png');
		d3.select("#womanpic").attr('src','images/woman.png');
		} else {
 		d3.select("#womanpic").attr('src','images/woman2.png');
		d3.select("#manpic").attr('src','images/man.png');
		} 
			
		d3.selectAll(".gender").classed("franksbutton" ,false);
		d3.select(this).classed("franksbutton",true);
		dvc.qfiveOdds = d3.select(this).attr("data-nm");
		//Selection checker 
		clicked1 = true;
		checkIfFinished();	
})

d3.selectAll(".age").on("click",function(){

		d3.selectAll(".age").classed("active" ,false);
		d3.select(this).classed("active" ,true);
		d3.selectAll(".age").classed("franksbutton" ,false);
		d3.select(this).classed("franksbutton",true);
		dvc.qsixOdds = d3.select(this).attr("data-nm");
		//Selection checker 
		clicked2 = true;
		checkIfFinished();
})

d3.select("#qonelist").selectAll("a").on("click",function(){
		var eleText = $(this).text()
		d3.select("#qone").html(eleText + " <span class='caret'></span>");
		d3.selectAll(".qonelist").classed("franksdropdown" ,false);
		d3.select("#qone").classed("franksdropdown",true);
		dvc.qoneOdds = d3.select(this).attr("data-nm");
		//Selection checker 
		clicked3 = true;
		checkIfFinished();
})

d3.select("#qtwolist").selectAll("a").on("click",function(){
		var eleText = $(this).text()
		d3.select("#qtwo").html(eleText + " <span class='caret'></span>");
		d3.selectAll(".qtwolist").classed("franksdropdown" ,false);
		d3.select("#qtwo").classed("franksdropdown",true);
		dvc.qtwoOdds = d3.select(this).attr("data-nm");
		//Selection checker 
		clicked4 = true;
		checkIfFinished();
})

d3.select("#qthreelist").selectAll("a").on("click",function(){
		var eleText = $(this).text()
		d3.select("#qthree").html(eleText + " <span class='caret'></span>");
		d3.selectAll(".qthreelist").classed("franksdropdown" ,false);
		d3.select("#qthree").classed("franksdropdown",true);
		dvc.qthreeOdds = d3.select(this).attr("data-nm");
		//Selection checker 
		clicked5 = true;
		checkIfFinished();
})

d3.select("#qfourlist").selectAll("a").on("click",function(){
		var eleText = $(this).text()
		d3.select("#qfour").html(eleText + " <span class='caret'></span>");
		d3.selectAll(".qfourlist").classed("franksdropdown" ,false);
		d3.select("#qfour").classed("franksdropdown",true);
		dvc.qfourOdds = d3.select(this).attr("data-nm");
		//Selection checker 
		clicked6 = true;
		checkIfFinished();
})

d3.select(".submit").on("click",function(){
		dvc.oddsMult = (0.065*dvc.qoneOdds*dvc.qtwoOdds*dvc.qthreeOdds*dvc.qfourOdds*dvc.qfiveOdds*dvc.qsixOdds);
		d3.select("#finalpara1").html("The chance of somebody with these childhood circumstances experiencing relative income poverty now is <span id='finalNumber'>" + (d3.format(",%")((dvc.oddsMult/(1 + dvc.oddsMult)))) + " </span>");
		d3.select("#finalpara2").style("opacity",0).text(d3.format(",%")((dvc.oddsMult/(1 + dvc.oddsMult))));
		d3.select("#finalpara2").transition().duration(750).style("opacity",1).text(d3.format(",%")((dvc.oddsMult/(1 + dvc.oddsMult))));
		d3.select(".povertybar").style("width",0 + "%");
		d3.select(".povertybar").transition().duration(1200).ease("sin").style("width",(dvc.oddsMult/(1 + dvc.oddsMult))*100 + "%");
		$("#povertybarrow").show();
		$("#share1").empty();
		$("#share2").empty();
		d3.select("#share").style("display","block");
		fireSocial();
		

	
		
	if (pymChild) {
        pymChild.sendHeight();
  	}


});

function checkIfFinished() {
	if(clicked1 == true && clicked2 == true && clicked3 == true && clicked4 == true && clicked5 == true && clicked6 == true) {
		d3.select(".submit").classed("disabled", false);	
	}
}

function fireSocial() {
	
d3.select("#share1").append("a")
	.attr("href","https://www.facebook.com/sharer/sharer.php?u=" + "http://visual.ons.gov.uk/what-are-your-chances-of-experiencing-poverty-in-adulthood/")
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
	.attr("href",encodeURI("https://twitter.com/intent/tweet?text=I have a " + (d3.format(",%")((dvc.oddsMult/(1 + dvc.oddsMult)))) + " chance of experiencing poverty in adulthood. " + " What is yours? " + "http://visual.ons.gov.uk/what-are-your-chances-of-experiencing-poverty-in-adulthood/"))
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

}

d3.select("#AboutCalculator").on("click",function() {
	d3.select("#GetHelpDiv").style("display","block");
	if (pymChild) {
    pymChild.sendHeight();
}
});

d3.select("#ReadBut").on("click",function() {
	d3.select("#GetHelpDiv").style("display","none");
	if (pymChild) {
    pymChild.sendHeight();
}
});
	

