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


  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('text').call(wrap,margin.left-10)

    d3.selectAll("g.tick").attr("class",function(d,i) {return "ticky"+i});




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
  // .attr("class",function(d,i) {return "data_labels"+i})
  .attr('x',(d) => x(d.value))
  .attr('dx',(d) => d.value < 0.4 && size == "sm"   ? 30 : -3)
  .attr('y',(d)=> y(d.name)+19)
  .attr('text-anchor',(d) => x(d.value)-x(0)<chart_width/10 ? "start" : "end")
  // .attr('fill',(d) => x(d.value)-x(0)<chart_width/10 ? "#414042" : "#ffffff")
  .attr('fill',(d) => d.value < 0.4 && size == "sm" ? "#414042" : "#ffffff")
  .text((d)=>d3.format(config.essential.dataLabels.numberFormat)(d.value))
  .style('opacity', (d) => d.value == 0 ? 0 : 1)          
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

    drawD3Annotations = function() {

      console.log(y.domain());
      console.log(x.domain());
      var annotations = [
        {
          type:d3.annotationLabel,
          note: {
            label: "My label",
            bgPadding: 0,
            wrap: 200,
            // align: "right"
          },
          //can use x, y directly instead of data
          x:x(0.5),
          y:y("Manufacture of beverages"),
          // className: "show-bg",
          dx: -80,
          dy: 0,
          disable: "connector"
          // connector:{
          //   end:"arrow",
          //   type:"curve",
          //   points:[[-3, -3],[-5,-10],[-60,-10]]
          // }
        },
        {
          type:d3.annotationLabel,
          //can use x, y directly instead of data
          x:x(0.5),
          y:y("Accommodation") - y("All businesses"),
          dx: x(0.5)
              - x(0.1),
          dy: 0,
          connector:{
            end:"arrow",
            type:"curve",
            points:[[10, 0]]
          }
        }

      ]


      var makeAnnotations = d3.annotation()
        // .notePadding(15)
        .accessors({
          x: function(d){return x(0.5)},
          y: function(d){return y("Accommodation")},
          // dx: function(d){console.log(d); return x(d3.timeParse(dvc.essential.dateFormat)("1/10/2020"))-x(d3.timeParse(dvc.essential.dateFormat)(d.dx))}
        })
        .annotations(annotations)

        if (parseInt(graphic.style("width")) > threshold_sm) {
            svg.append("g")
              .attr("class", "annotation-group")
              .call(makeAnnotations)
        }
        // else {
        //   d3.select("#keypoints").append("p")
        //     .text(annotations[0].note.label)
        //     .attr("font-family", "'Open Sans', sans-serif")
        //     .attr("font-size", "16px")
        //     .attr("color", "#666")
        //     .attr("font-weight", 500)
        //
        // }
    }

    // drawD3Annotations()
  


1

  //create link to source
  d3.select("#source")
    .text("Source – " + config.essential.sourceText)

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

      //ticky trick to bold one of the y axis labels




d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
