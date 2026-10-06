var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.essential.accessibleSummary)

  var threshold_md = config.optional.mediumBreakpoint;
  var threshold_sm = config.optional.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  var margin = config.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  //height is set by unique options in column name * a fixed height + some magic because scale band is all about proportion
  var height = (config.optional.seriesHeight[size] * graphic_data.length) + (10*(graphic_data.length-1)) + 12

  // clear out existing graphics
  graphic.selectAll("*").remove();

  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width]);

  const z = d3.scaleLinear()
  .range([0, chart_width]);

  const y = d3.scaleBand()
    .paddingOuter(0.2)
    .paddingInner((graphic_data.length-1)*10/(graphic_data.length*30))
    .range([0, height])
    .round(true);


  //use the data to find unique entries in the name column
  y.domain([...new Set(graphic_data.map(d => d.name))]);

  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(0)
    .tickPadding(10)

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .tickSize(-height)
    .tickFormat(d3.format(".0%"))
    .ticks(config.optional.xAxisTicks[size]);

  // //set up asecondary xAxis at the top
  var topAxis = d3.axisTop(z)
    .tickSize(height)
    .tickFormat(d3.format(".0%"))
    .ticks(config.optional.xAxisTicks[size]);

  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


  if(config.essential.xDomain=="auto"){
    x.domain([0, d3.max(graphic_data,function(d){return d.value})]);
    }else{
      x.domain(config.essential.xDomain)
    }
    if(config.essential.zDomain=="auto"){
      z.domain([0, d3.max(graphic_data,function(d){return d.value})]);
    }else{
      z.domain(config.essential.zDomain)
  }

  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x axis')
    .call(xAxis).selectAll('line').each(function(d)
      {
        if (d == 0) {
          d3.select(this)
          .attr('class','zero-line')
        };
      })

  //create vertical line if required
  if (size != "sm" && config.optional.vertical_line == true){

    config.optional.annotateLineX1_Y1_X2_Y2.forEach(function(d,i) {

    svg.append("line")
      .attr('x1',x(config.optional.annotateLineX1_Y1_X2_Y2[i][0][0]))
      .attr('x2',x(config.optional.annotateLineX1_Y1_X2_Y2[i][1][0]))
      .attr('y1',y(config.optional.annotateLineX1_Y1_X2_Y2[i][0][1]))
      .attr('y2',y(config.optional.annotateLineX1_Y1_X2_Y2[i][1][1]))
      .style('stroke', '#888')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5 5');
    })
  }

  svg
  .append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('class', 'top axis')
  .call(topAxis).selectAll('line').each(function(d)
    {
      if (d == 0) {
        d3.select(this)
        .attr('class','zero-line')
      };
    })

  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('text').call(wrap,margin.left-10)


  svg.selectAll('rect')
      .data(graphic_data)
      .join('rect')
      .attr('x',x(0))
      .attr('y',(d) => y(d.name))
      .attr('width',(d) => x(d.value)-x(0))
      .attr('height',y.bandwidth())
      .attr('fill',config.essential.colour_palette);


    if(config.essential.dataLabels.show==true){
      svg.selectAll('text.dataLabels')
      .data(graphic_data)
      .join('text')
      .attr('class','dataLabels')
      .attr('x',(d) => x(d.value))
      .attr('dx',(d) => x(d.value)-x(0)<chart_width/10 ? -30000 : -3)
      .attr('y',(d)=> y(d.name)+19)
      .attr('text-anchor',(d) => x(d.value)-x(0)<chart_width/10 ? "start" : "end")
      .attr('fill',(d) => x(d.value)-x(0)<chart_width/10 ? "#414042" : "#ffffff")
      .text((d)=>d3.format(config.essential.dataLabels.numberFormat)(d.value))
    }//end if for datalabels



// This does the x-axis label
  svg
  .append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .append('text')
  .attr('x',chart_width)
  .attr('y',35)
  .attr('class','axis--label')
  .text(config.essential.xAxisLabel)
  .attr('text-anchor','end');


//select tick labels, make headers bold + move to left. Very inefficient, better solutions available!
if (size == "sm"){
  d3.selectAll("g.y.axis")
  .selectAll("tspan")
  .attr("id",function(d,i){return "ticky" +i})
    d3.select("#ticky0").attr("transform","translate(-50,5)").attr("font-weight", 600)
    d3.select("#ticky1").attr("transform","translate(-10,5)").attr("font-weight", 600)
    d3.select("#ticky5").attr("transform","translate(-10,5)").attr("font-weight", 600)
    d3.select("#ticky12").attr("transform","translate(-10,5)").attr("font-weight", 600)
    d3.select("#ticky13").attr("transform","translate(-10,5)").attr("font-weight", 600)
    d3.select("#ticky19").attr("transform","translate(-10,5)").attr("font-weight", 600)
    d3.select("#ticky20").attr("transform","translate(-10,5)").attr("font-weight", 600)
    d3.select("#ticky26").attr("transform","translate(-10,5)").attr("font-weight", 600)
} else {

  d3.selectAll("g.y.axis")
  .selectAll("tspan")
  .attr("id",function(d,i){return "ticky" +i})

 //defines the arrowhead marker
 d3.select("#ticky0").attr("transform","translate(-10,5)").attr("font-weight", 600)
 d3.select("#ticky1").attr("transform","translate(-10,5)").attr("font-weight", 600)
 d3.select("#ticky5").attr("transform","translate(-10,5)").attr("font-weight", 600)
 d3.select("#ticky12").attr("transform","translate(-10,5)").attr("font-weight", 600)
 d3.select("#ticky17").attr("transform","translate(-10,5)").attr("font-weight", 600)
 d3.select("#ticky23").attr("transform","translate(-10,5)").attr("font-weight", 600)

 svg
 .append("svg:defs").append("svg:marker")
 .attr("id", "annotation_arrowhead")
 .attr("class","annotation_arrow")
 .attr("refX", 9)
 .attr("refY", 10)
 .attr("markerWidth", 40)
 .attr("markerHeight", 40)
 .attr("orient", "auto")
 .append("path")
 .attr("d", "M2,5 L10,10 L2,15")  

//draws annoation arrow
 svg.append("path")
 .attr("class","annotation_arrow")
 .data(graphic_data)
 .attr("d", function(d) {
 return draw_curve(
 x(0.469),
 y("African"),
 x(0.46),
 y("English, Welsh, Scottish, Northern Irish or British"),
 true);
 })
 .attr("marker-end", "url(#annotation_arrowhead)");

//adds annotation text
svg
 .append("text")
 .data(graphic_data)
 .text("Almost half of people identifying as 'Other Black' live in social rented housing")
 .attr("class","annotation-text")
 .attr("x",x(0.36))
 .attr("y",y(0))
 .attr("dy",290)
 .style("text-anchor","middle")
 .call(wrap, 230, .35, 50, 1, false)

  //defines the arrowhead marker
  svg
  .append("svg:defs").append("svg:marker")
  .attr("id", "annotation_arrowhead")
  .attr("class","annotation_arrow")
  .attr("refX", 9)
  .attr("refY", 10)
  .attr("markerWidth", 40)
  .attr("markerHeight", 40)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M2,5 L10,10 L2,15")  
 
  // //draws annoation arrow
  svg.append("path")
  .attr("class","annotation_arrow")
  .data(graphic_data)
  .attr("d", function(d) {
  return draw_curve(
  x(0.185),
  y("Other ethnic group"),
  x(0.30),
  y("Chinese"),
  false);
  })
  .attr("marker-end", "url(#annotation_arrowhead)");

  //adds annotation text
svg
.append("text")
.data(graphic_data)
.text("17% of all usual residents live in social rented housing")
.attr("class","annotation-text")
.attr("x",x(0.34))
.attr("y",y(0))
.attr("dy",727)
.style("text-anchor","middle")
.call(wrap, 230, .35, 50, 1, false)

  }
 
 //create link to source
  d3.select("#source")
  .text("Source: " + config.essential.sourceText)

 //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            // y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr('x',x);
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr('x',x).attr("dy", lineHeight + "em").text(word);
            }
         }
          var breaks = text.selectAll("tspan").size();
          text.attr("y", function(){return -6 * (breaks-1);});
        });

}


d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
