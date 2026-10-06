let graphic = d3.select('#graphic');
let pymChild = null;
let legend = d3.select('#legend');

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.essential.accessibleSummary)

  let threshold_md = config.optional.mediumBreakpoint;
  let threshold_sm = config.optional.mobileBreakpoint;
  let colour = d3.scaleOrdinal(config.essential.colour_palette); //
  let colour2 = d3.scaleOrdinal(config.essential.colour_palette_stroke); //



  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  const chartEvery = config.optional.chartEvery[size];

  var margin = config.optional.margin[size]
  var chart_width = (parseInt(graphic.style("width"))/chartEvery) - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // clear out existing graphics
  graphic.selectAll("*").remove();
  legend.selectAll("*").remove();



  // lets move on to setting up the legend for this chart. 
let legendGroups = [...new Set(graphic_data.map(item => item.group))]; // this will extract the unique groups from the data.csv



let legenditem = legend
.selectAll('div.legend-item')
.data(legendGroups)
.enter()
.append('div')
.attr('class', 'legend--item');

legenditem 
 .append('div')
 .attr('class', 'legend--icon--circle')
 .style('background-color', (d) => colour(d) );

legenditem
 .append('div')
 .append('p')
 .attr('class', 'legend--text')
 .html((d) => d);


 // running the time parse here
 

   
  //lets also try a new smallmultiple version here which will group data on the basis of series
 grouped_data = d3.group(graphic_data, d => d.series)  


//  let xMin = d3.min(graphic_data, d => d.date);
//  let xMax = d3.max(graphic_data, d => d.date);
 

// let intermediateTicks = x.ticks(config.optional.xAxisTicks[size]);

// let allTicks = [xMin, ...intermediateTicks, xMax]

  //set up scales

const x = d3.scalePoint()
  .range([0, chart_width])
  .padding(0.2);

  x.domain(["Key Stage 2","Key Stage 4","Level 3 at age 18"]);
    // .range([0, chart_width])
    // .nice();

// console.log("x",d3.extent(graphic_data, (d) => d.date))

  const y = d3.scaleLinear()
     .range([height, 0])

  //create svg for chart
  svg = d3.select('#graphic')
     .selectAll('div')
     .data(grouped_data)
     .enter()
     .append('svg')
     .attr("width", chart_width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .attr("class", "chart")
     .style("background-color", "#fff")
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")

    // both of these are need to be looked at.

  if(config.essential.xDomain=="auto"){
    y.domain([0, d3.max(graphic_data,function(d){return d.xvalue})]);
  }else{
    y.domain(config.essential.xDomain)
  }

  var xAxis = d3.axisBottom(x)
  .tickSize(-height)
  .tickPadding(10);

  
var yAxis =     d3.axisLeft(y)
    .ticks(config.optional.yAxisTicks[size])
    .tickSize(-chart_width)
    .tickPadding(10)
    .tickFormat(d3.format(config.essential.yAxisFormat));

  svg
  .append('g')
  .attr('class', 'x axis guideline')
  .attr('transform', `translate(0,${height})`)
  .call(xAxis)
  .attr('stroke-dasharray','2 2')


  svg
.append('g')
.attr('class','axis numeric')
.call(yAxis).selectAll('line').each(function(d)
      {
        if (d == 0) {
          d3.select(this)
          .attr('class','zero-line');
        }
      });
      
;

//adding ci's to each of the charts.

// svg.append('g')
// .selectAll('line')
// .data((d) => d[1])
// .join('line')
// .attr('x1', d => x(d.date))
// .attr('y1', d => y(d.lowerCI))
// .attr('x2', d => x(d.date))
// .attr('y2', d => y(d.upperCI))
// .attr("stroke", d => colour(d.group))
// .attr('stroke-opacity')

// let capWidth = 10;

// svg.append('g')
// .selectAll('line.lower')
// .data((d) => d[1])
// .join('line')
// .attr('class', 'lower')
// .attr('x1', d=> x(d.date) - capWidth/2)
// .attr('y1', d => y(d.lowerCI))
// .attr('x2', d => x(d.date) + capWidth/2)
// .attr('y2', d => y(d.lowerCI))
// .attr("stroke", d => colour(d.group))

// svg.append('g')
// .selectAll('line.upper')
// .data((d) => d[1])
// .join('line')
// .attr('class', 'upper')
// .attr('x1', d => x(d.date) - capWidth/2)
// .attr('y1', d=> y(d.upperCI))
// .attr('x2', d => x(d.date) + capWidth/2)
// .attr('y2', d => y(d.upperCI))
// .attr("stroke", d => colour(d.group))
// //add dots to the plot.

  svg.selectAll('circle')
      .data((d) => d[1])
      .join('circle')
      .attr('cx',(d) => x(d.date))
      .attr('cy',(d) => y(d.xvalue))
      .attr('r',config.essential.radius)
      .attr("fill", (d) => colour(d.group)) // This adds the colour to the circles based on the group
      .attr('fill-opacity',config.essential.fillOpacity)
      .attr('stroke',(d)=> colour2(d.group))
      .attr('stroke-opacity',config.essential.strokeOpacity);

      // svg.selectAll('line')
      // .data((d) => d[1])
      // .join('circle')
      // .attr('x1',x("Key Stage 2"))
      // .attr('x2',x("Key Stage 2"))
      // .attr()
      // .attr('r',config.essential.radius)
      // .attr("fill", (d) => colour(d.group)) // This adds the colour to the circles based on the group
      // .attr('fill-opacity',config.essential.fillOpacity)
      // .attr('stroke',(d)=> colour2(d.group))
      // .attr('stroke-opacity',config.essential.strokeOpacity);


    svg.append("svg:defs").append("svg:marker")
    .attr("id", "annotation_arrowhead")
    .attr("class","annotation_arrow")
    .attr("refX", 9)
    .attr("refY", 10)
    .attr("markerWidth", 20)
    .attr("markerHeight", 20)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M2,5 L10,10 L2,15")  


    var gap = x("Key Stage 4")-x("Key Stage 2")
    var halfGap =gap/2
    var quarterGap = gap/4
    svg.append("text")
    .data(graphic_data)
    .text("At age 11, the gap is 9 percentage points")
    .attr("class","legend--text")
    .attr("x", x("Key Stage 2")+quarterGap)
    .attr("y", y(-15))
    .attr("dy", y(-15))
    .style("text-anchor","middle")
    .call(wrap,gap);



  //   svg.append("line")
  //   .attr("class","annotation_arrow")
  //   .data(graphic_data)
  //  .attr("x1", x("Key Stage 2"))
  // .attr("x2", chart_width -20)
  //       .attr("y1", y(-2))
  //     .attr("y2",y(-23))
  //   .attr("marker-end", "url(#annotation_arrowhead)");
    

    svg.append("path")
    .attr("class","annotation_arrow")
    .attr("id","annotation-arrow-south-west")
    .data(graphic_data)
    .attr("d", function(d) {
    return draw_curve(
      x("Key Stage 2")+quarterGap,
      y(-9)+32,
      x("Key Stage 2")+17,
      y(-9),
      false);
    })
    .attr("marker-end", "url(#annotation_arrowhead)");
    

    svg.append("path")
    .attr("class","annotation_arrow")
    .attr("id","annotation-arrow-south-west")
    .data(graphic_data)
    .attr("d", function(d) {
    return draw_curve(
      x("Level 3 at age 18")-halfGap+5,
      y(-14)+50,
      x("Level 3 at age 18")-25,
      y(-14)+10,
      true);
    })
    .attr("marker-end", "url(#annotation_arrowhead)");
    



    svg.append("text")
    .data(graphic_data)
    .text("By age 18 the gap reached 15 percentage points")
    .attr("class","legend--text")
    .attr("x",x("Level 3 at age 18")-halfGap)
    .attr("y", y(-20)+9)
    .attr("dy", y(-20)+9)
    .style("text-anchor","middle")
    .call(wrap,gap-40);

      


      // svg.selectAll('dataLabels')
      // .data((d) => d[1])
      // .join('text')
      // .text(function(d) {
      //   return d3.format(".1f")(d.xvalue)
      // })
      // .attr('x',(d) => x(d.date)+11)
      // .attr('y',(d) => y(d.xvalue)+5)
      // .attr('class', 'dataLabels')
      // .attr('r',config.essential.radius)
      // .attr("fill", (d) => colour(d.group)) // This adds the colour to the circles based on the group
      // .attr('text-anchor','start')



		// This does the chart title label
		svg
			.append('g')
			.attr('transform', 'translate(0, 0)')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.attr('dy', -15)
			.attr('class', 'title')
			.text(d => d[0])
			.attr('text-anchor', 'start')
			.call(wrap, chart_width);

// This does the x-axis label
    svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .append('text')
    .attr('x',chart_width)
    .attr('y',40)
    .attr('class','axis--label')
    .text(config.essential.xAxisLabel)
    .attr('text-anchor','end');

// This does the y-axis label
svg
.append('g')
.attr('transform', 'translate(0,0)')
.append('text')
.attr('x',-(margin.left-5))
.attr('y',-10)
.attr('class','axis--label')
.text(config.essential.yAxisLabel)
.attr('text-anchor','start');


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
  .then((data) => {

    // let parseTime = d3.timeParse(config.essential.dateFormat);
    //load chart data
    graphic_data = data;

    // data.forEach((d) => {d.date = parseTime(d.date) });


    console.log(graphic_data);
    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
