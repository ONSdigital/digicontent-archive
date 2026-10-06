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
  //height is set by unique options in column name * a fixed height
  var height = config.optional.seriesHeight[size] * graphic_data.length

  // clear out existing graphics
  graphic.selectAll("*").remove();

  //set up scales
  var x = d3.scaleLinear()
    .range([0, chart_width]);

  var y = d3.scalePoint()
    .padding(0.5)
    .range([0, height]);

  //use the data to find unique entries in the name column
  y.domain(graphic_data.map(d => d.name));

  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(-chart_width)
    .tickPadding(10)

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .tickSize(-height)
    .ticks(config.optional.xAxisTicks[size]);

  // Set up the legend
  var legenditem = d3.select('#legend')
    .selectAll('div.legend--item')
    .data(d3.zip(config.essential.legendLabels, config.essential.colour_palette))
    .enter()
    .append('div')
    .attr('class', 'legend--item')

  legenditem.append('div').attr('class', 'legend--icon--circle')
    .style('background-color', function(d) {
      return d[1]
    })

  legenditem.append('div')
    .append('p').attr('class', 'legend--text').html(function(d) {
      return d[0]
    })



  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


  if(config.essential.xDomain=="auto"){
    var max = d3.max(graphic_data, function(d) {
      return d3.max([+d.min, +d.max]);
    });
    x.domain([-4, 6]);
  }else{
    x.domain(config.essential.xDomain)
  }

  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x axis')
    .call(xAxis).selectAll('line').each(function(d)
      {
        if (d == 0) {
          d3.select(this)
          .attr('class', 'zero-line')
            };
      })



  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .attr('stroke-dasharray','2 2')
    .selectAll('text').call(wrap,margin.left-5);

  svg.selectAll('circle.min')
    .data(graphic_data)
    .enter()
    .append('circle')
    .attr('class', 'min')
    .attr('r', 6)
    .attr('fill', config.essential.colour_palette[0])
    .attr('stroke', config.essential.colour_palette_stroke[0])
    .attr('cx', function(d) {
      return x(d.min)
    })
    .attr('cy', function(d) {
      return y(d.name)
    })


    // svg.selectAll('text.min')
    // .data(graphic_data)
    // .enter()
    // .append('text')
    // .text(function(d) {
    //   return d3.format(".1f")(d.min)
    // })
    // .attr('class', 'min-text dataLabels')
    // .attr('fill', config.essential.colour_palette[0])
    // .attr('x', function(d) {
    //   return x(d.min)-10
    // })
    // .attr('y', function(d) {
    //   return y(d.name)+4
    // })
    // .attr('text-anchor','end')
  
    // svg.selectAll('text.max')
    // .data(graphic_data)
    // .enter()
    // .append('text')
    // .text(function(d) {
    //   return d3.format(".1f")(d.max)
    // })
    // .attr('class', 'max-text dataLabels')
    // .attr('fill', "grey")
    // .attr('x', function(d) {
    //   return x(d.max)+10
    // })
    // .attr('y', function(d) {
    //   return y(d.name)+4
    // })
    // .attr('text-anchor','start')
  

    // svg.selectAll('text.other')
    // .data(graphic_data)
    // .enter()
    // .append('text')
    // .text(function(d) {
    //   return d3.format(".1f")(d.other)
    // })
    // .attr('class', 'max-text dataLabels')
    // .attr('fill', config.essential.colour_palette[2])
    // .attr('x', function(d) {
    //   return x(d.other)+10
    // })
    // .attr('y', function(d) {
    //   return y(d.name)+4
    // })
    // .attr('text-anchor','start')
  

  svg.selectAll('circle.max')
    .data(graphic_data)
    .enter()
    .append('circle')
    .attr('class', 'max')
    .attr('r', 6)
    .attr('fill', config.essential.colour_palette[1])
     .attr('stroke', config.essential.colour_palette_stroke[1])
    .attr('cx', function(d) {
      return x(d.max)
    })
    .attr('cy', function(d) {
      return y(d.name)
    })



    svg.selectAll('circle.other')
    .data(graphic_data)
    .enter()
    .append('circle')
    .attr('class', 'other')
    .attr('r', 6)
    .attr('fill', config.essential.colour_palette[2])
    .attr('stroke', config.essential.colour_palette_stroke[2])
    .attr('cx', function(d) {
      return x(d.other)
    })
    .attr('cy', function(d) {
      return y(d.name)
    })


    svg.append("svg:defs").append("svg:marker")
    .attr("id", "annotation_arrowhead2")
    .attr("class","annotation_arrow")
    .attr("refX", 9)
    .attr("refY", 10)
    .attr("markerWidth", 20)
    .attr("markerHeight", 20)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M2,7 L8,10 L2,13")  

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

//draws annoation arrow

// svg.append("path")
// .attr("class","annotation_arrow")
// .attr("id","annotation-arrow-south-west")
// .data(graphic_data)
// .attr("d", function(d) {
// return draw_curve(
//   x(3),
//   y("South West")+5,
//   x(1)+12,
//   y("South West"),
//   true);
// })
// .attr("marker-end", "url(#annotation_arrowhead)");

// //adds annotation text

// svg.append("text")
// .data(graphic_data)
// .text("Better-off towns in the South West scored less than mid-income towns in the North West")
// .attr("class","annotation-text")
// .attr("id","annotation-south-west")
// .attr("x",x(3)+5)
// .attr("y",y("South West")-30)
// .attr("dy",y("South West")-30)
// .style("text-anchor","start")
// .call(wrap,chart_width-x(3)-9);



//adds annotation text

// svg.append("circle")
// .data(graphic_data)
//     .attr('class', 'max')
//     .attr('r', 6)
//     .attr('fill', config.essential.colour_palette[1])
//     .attr('stroke', config.essential.colour_palette_stroke[1])
// .attr("cx",x(1.7)-15)
// .attr("cy",y("North West")-55)
// // .attr("dy",y("South West"))
// .style("text-anchor","end")
// // .call(wrap,150);


// svg.append("circle")
// .data(graphic_data)
//     .attr('class', 'min')
//     .attr('r', 6)
//     .attr('fill', config.essential.colour_palette[0])
//     .attr('stroke', config.essential.colour_palette_stroke[0])
// .attr("cx", x(-1.2)-90)
// .attr("cy",y("North West")-55)
// // .attr("dy",y("South West"))
// .style("text-anchor","end")
// // .call(wrap,150);


// svg.append("text")
// .data(graphic_data)
// .text("Medium")
// .attr("class","legend--text")
// .attr("x",x(1.7)+25)
// .attr("y",y("North West")-50)
// // .attr("dy",y("South West"))
// .style("text-anchor","middle")
// .call(wrap,150);



// svg.append("text")
// .data(graphic_data)
// .text("High deprivation")
// .attr("class","legend--text")
// .attr("x", x(-1.2)+30)
// .attr("y",y("North West")-50)
// // .attr("dy",y("South West"))
// .style("text-anchor","end")
// .call(wrap,150);


// svg.append("path")
// .attr("class","annotation_arrow")
// .data(graphic_data)
// .attr("d", function(d) {
// return draw_curve(
//   x(1.8)+20,
//   y("North West")-40,
//   x(1.8)+10,
//   y("North West")-10,
//   true);
// })
// .attr("marker-end", "url(#annotation_arrowhead)");


// svg.append("path")
// .attr("class","annotation_arrow")
// .data(graphic_data)
// .attr("d", function(d) {
// return draw_curve(
//   x(5)-20,
//   y("North West")-40,
//   x(5)-10,
//   y("North West")-10,
//   false);
// })
// .attr("marker-end", "url(#annotation_arrowhead)");


//low

// svg.append("circle")
// .data(graphic_data)
//     .attr('class', 'other')
//     .attr('r', 6)
//     .attr('fill', config.essential.colour_palette[2])
//     .attr('stroke', config.essential.colour_palette_stroke[2])
// .attr("cx",chart_width -50)
// .attr("cy",y("North West")-55)
// .attr("dy",y("South West"))
// .style("text-anchor","end")
// .call(wrap,150);


svg.append("text")
.data(graphic_data)
.text("Lower")
.attr("class","legend--text")
.attr("x",x(5))
.attr("y",y("North West")-50)
// .attr("dy",y("South West"))
.style("text-anchor","middle");
// .call(wrap,150);

svg.append("text")
.data(graphic_data)
.text("Higher income deprivation")
.attr("class","legend--text")
.attr("x",x(-1.3))
.attr("y",y("North West")-50)
.attr("dy",y("North West")-50)
.style("text-anchor","middle")
.call(wrap, chart_width/2)
.style("background-colour","white");
svg.append("text")
.data(graphic_data)
.text("Mid")
.attr("class","legend--text")
.attr("x",x(1.7))
.attr("y",y("North West")-50)
// .attr("dy",y("South West"))
.style("text-anchor","middle")
// .call(wrap,150)

-1.302,1.721,5.005

svg.append("line")
.attr("class","annotation_arrow")
.data(graphic_data)
.attr("x1", x(5.005))
.attr("y1",y("North West")-40)
.attr("x2", x(5.005))
.attr("y2",y("North West")-12)
.attr("marker-end", "url(#annotation_arrowhead2)");
svg.append("line")
.attr("class","annotation_arrow")
.data(graphic_data)
.attr("x1", x(-1.302))
.attr("y1",y("North West")-40)
.attr("x2", x(-1.302))
.attr("y2",y("North West")-12)
.attr("marker-end", "url(#annotation_arrowhead2)");
svg.append("line")
.attr("class","annotation_arrow")
.data(graphic_data)
.attr("x1", x(1.721))
.attr("y1",y("North West")-40)
.attr("x2", x(1.721))
.attr("y2",y("North West")-12)
.attr("marker-end", "url(#annotation_arrowhead2)");


// svg.append("path")
// .attr("class","annotation_arrow")
// .data(graphic_data)
// .attr("d", function(d) {
// return draw_curve(
//   x(-1.2)-30,
//   y("North West")-40,
//   x(-1.2)-10,
//   y("North West")-10,
//   false);
// })
// .attr("marker-end", "url(#annotation_arrowhead)");




//draws annoation arrow


//adds annotation text





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
