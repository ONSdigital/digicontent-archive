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
  var height = config.essential.chart_height * chart_width

  // clear out existing graphics and menu 
  graphic.selectAll("*").remove();
  d3.select('#selectButton').selectAll("*").remove();

  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width]);

  const y = d3.scaleLinear()
    .range([height, 0])

  let colours = [...new Set(graphic_data.map(d => d.age))]
  // console.log(colours)

  const colour = d3
    .scaleOrdinal()
    .domain(colours)
    .range(config.essential.colour_palette);

  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(chart_width + 5)
    .tickPadding(5)
    .tickFormat(d3.format(".0f"))
    .ticks(config.optional.xAxisTicks[size])

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .tickSize(-height - 5)
    .tickPadding(5)
    .tickFormat(d3.format(".0f"))
    .ticks(config.optional.xAxisTicks[size]);

  //find unique groups in the group column
  groupsUnique = [...new Set(graphic_data.map(d => d.name))]


  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(groupsUnique)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text shown in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button


  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


  if (config.essential.xDomain == "auto") {
    x.domain([0, d3.max(graphic_data, function (d) { return d.value })]);
  } else {
    x.domain(config.essential.xDomain)
  }



  if (config.essential.yDomain == "auto") {
    y.domain([0, d3.max(graphic_data, function (d) { return d.value2 })]);
  } else {
    y.domain(config.essential.yDomain)
  }

  svg
    .append('g')
    .attr('transform', 'translate(0,' + (height + 5) + ')')
    .attr('class', 'x axis')
    .call(xAxis).selectAll('line').each(function (d) {
      if (d == 0) {
        d3.select(this)
          .attr('class', 'zero-line')
      };
    })

  svg
    .append('g')
    .attr('class', 'y axis numeric')
    .call(yAxis)
    // .selectAll('text').call(wrap,margin.left-10)
    .attr("transform", "translate (" + chart_width + ",0)")
    .selectAll('line').each(function (d) {
      if (d == 0) {
        d3.select(this)
          .attr('class', 'zero-line')
      };
    })

  //Marking the groups with shaded areas - check the css for styling

  let hulls = svg.append('g')
    .attr('class', 'hulls')

  vertices = [];
  hullVertices = []

  // draw convex hulls
  for (j = 0; j < groupsUnique.length; j++) {
    // console.log(groupsUnique[j])

    vertices[j] = [];


    filtered = graphic_data.filter(function (d) { return d.name == groupsUnique[j] })

    for (i = 0; i < filtered.length; i++) {
      vertices[j].push([x(filtered[i].value), y(filtered[i].value2)])
    }

    hullVertices[j] = d3.polygonHull(vertices[j])

    hulls.append("path")
      .attr("class", "hull " + groupsUnique[j].replace(/[, ]+/g, "").trim())
      .attr("fill", '#ebebeb')
      .attr("stroke", '#ebebeb')
      .datum(hullVertices[j])
      .attr("d", function (d) { return "M" + d.join("L") + "Z"; });
  }

  // //draw the initial circles
  // svg.selectAll('circle')
  //   .data(graphic_data)
  //   .join('circle')
  //   .attr('cx', (d) => x(d.value))
  //   .attr('cy', (d) => y(d.value2))
  //   .attr('r', config.essential.radius)
  //   .attr("fill", "grey")
  //   .attr('fill-opacity', '0.2')
  //   .attr('stroke', "grey")
  //   .attr('stroke-opacity', '0.5')
  //   .attr("class", function (d, i) { return "circle" + d.age.replace(/[, ]+/g, "").trim() + " " + d.name.replace(/[, ]+/g, "").trim() + " cell cell" + (i) })


  // This does the x-axis label
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .append('text')
    .attr('x', chart_width)
    .attr('y', 40)
    .attr('class', 'axis--label')
    .text(config.essential.xAxisLabel)
    .attr('text-anchor', 'end');

  // This does the y-axis label
  svg
    .append('g')
    .attr('transform', 'translate(0,0)')
    .append('text')
    .attr('x', -(margin.left - 5))
    .attr('y', -10)
    .attr('class', 'axis--label')
    .text(config.essential.yAxisLabel)
    .attr('text-anchor', 'start');


  //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)


  // Interactivity
  // A function that updates the chart
  function update(selectedGroup) {
    svg.selectAll('circle').remove()
    svg.selectAll('path.pathClass').remove()

    let inverse = graphic_data.filter(d => d.name !== selectedGroup)
    // console.log(inverse)

    svg.selectAll('circle')
      .data(inverse)
      .join('circle')
      .attr('cx', (d) => x(d.value))
      .attr('cy', (d) => y(d.value2))
      .attr('r', config.essential.radius)
      .attr("fill", "grey")
      .attr('fill-opacity', '0.2')
      .attr('stroke', "grey")
      .attr('stroke-opacity', '0.5')
      .attr("class", function (d, i) { return "circle" + d.age.replace(/[, \W]+/g, "").trim() + " " + d.name.replace(/[, \W]+/g, "").trim() + " cell cell" + (i) })


    function filterCriteria(d) {
      return d.name == selectedGroup
    }

    const filteredData = graphic_data.filter(filterCriteria);


    // console.log(filteredData)

    const maxRadius = 30; // You can adjust this value to your desired maximum radius

    const delaunay_data = [...filteredData]
    const delaunay = d3.Delaunay.from(delaunay_data, d => x(d.value), d => y(d.value2));
    const voronoi = delaunay.voronoi([0, 0, chart_width, height]); // Replace 'width' and 'height' with the dimensions of your SVG container

    // console.log(Array.from(voronoi.cellPolygons()))


    var cell = svg.append("g")
      .attr("class", "cells")
      .selectAll("g")
      .data(Array.from(voronoi.cellPolygons()))
      .enter()
      .append("g")
      .attr("class", function (d, i) { /*console.log(d, i);*/ return "cells" + i })


    // console.log(filteredData)


    cell.append("circle")
      .data(filteredData)
      .join('circle')
      .attr('cx', (d) => x(d.value))
      .attr('cy', (d) => y(d.value2))
      .attr('r', config.essential.radius)
      .attr('fill', d => colour(d.age))
      .attr('stroke', d => colour(d.age))
      .attr("fill-opacity", "0.3")
      .attr("stroke-opacity", "0.9")
      .attr("class", function (d, i) { return "circle" + d.age.replace(/[, \W]+/g, "").trim() + " " + d.name.replace(/[, \W]+/g, "").trim() })

    // creates voronoi    		  
    cell.append("path")
      .attr("fill", "none")
      // .attr("stroke", "red")
      .attr('pointer-events', 'all')
      .attr("d", (d) => `M${d.join("L")}Z`)
      .attr("class", function (d, i) { return "pathClass path" + (i) + " " + filteredData[i].name.replace(/[, \W]+/g, "").trim() + " " + filteredData[i].age.replace(/[, \W]+/g, "").trim() })



    d3.selectAll('path.pathClass')
      .on('mouseover', function (d, i) {

        let this_data = filteredData[i.index]
        d3.select(`circle.circle${(this_data.age).replace(/[, \W]+/g, "").trim()}.${(this_data.name).replace(/[, \W]+/g, "").trim()}`)
          .classed('cellsselected', true)

        d3.selectAll(`.hull.${this_data.name.replace(/[, \W]+/g, "").trim()}`)
          .classed('hullselected', true)

        let xValue = 3;
        let yValue;

        if (y(this_data.value2) > 80) {
          yValue = y(this_data.value2) - 80
        } else {
          yValue = y(this_data.value2) + 45
        }

        d3.select(".tooltipGroup")
          .attr("transform", "translate(" + xValue + "," + yValue + ")")

        d3.select(".tooltipGroup")
          .select("text")
          // .text(d3.format(config.essential.tooltipFormat)((i[1] - i[0])))
          .html(`<tspan dy=0 style="font-weight:700">${this_data.name}</tspan>
          <tspan x=0 dy=20>Age group: ${this_data.age} years</tspan> 
          <tspan x=0 dy=20>${config.essential.xAxisLabel}: ${d3.format('.1f')(this_data.value)}%</tspan>
          <tspan x=0 dy=20>${config.essential.yAxisLabel}: £${d3.format('.2f')(this_data.value2)}</tspan>`)
        // .call(wrap, chart_width - 40)

        //setup the arrowhead marker
        // ("svg") is the reference for the object you are appending to. In most of our templates it will be svg 
        setupArrowhead(d3.select("svg"));


        // adds annoation arrow and text 
        // note - you need to add the setupArrowhead line above
        addAnnotationArrow(

          //name of the svg you're adding to 
          svg,

          //x and y values of your data point
          x(this_data.value),
          y(this_data.value2),
          //offset from your data point to arrowhead (x and y values)
          calculateOffset(), 0,
          //arrow length x and y
          (x(20) - x(this_data.value)), calculateCurveEnd(),
          //curve direction (choose 'left' or 'right'). If blank the default is left
          calculateCurve(),
          //annotation text
          "",
          //annotation text position - 'above', 'left', 'below' or 'right' 
          //this determines the position and alignment of the text relative to the arrow
          "below",
          //wrap width
          x(1) - x(0.5)
        );

        function calculateOffset() {
          if (this_data.value < 20) {
            return 10
          } else {
            return -10
          }
        }

        function calculateCurve() {
          if (y(this_data.value2) < 80) {
            if (this_data.value > 20) {
              return "right"
            } else {
              return "left"
            }
          } else {
            if (this_data.value < 20) {
              return "right"
            } else {
              return "left"
            }
          }


        }

        function calculateCurveEnd() {
          if (y(this_data.value2) > 80) {
            // console.log("hi")
            return -40
          } else {
            return 5
          }
        }


      })
      .on("mouseout", function (d, i) {

        un_highlight_circle();

        d3.selectAll(`.hull`)
          .classed('hullselected', false);

        d3.select(".tooltipGroup")
          .attr("transform", "scale(0)");

        d3.selectAll('.annotation_arrow').remove()
        d3.selectAll('.annotation-text').remove()
        d3.selectAll('.annotation-g').remove()
        d3.selectAll('.direction-arrow').remove()
        d3.selectAll('defs').remove()

        addGlobalAnnotations()
        d3.selectAll(".tooltipGroup").raise()

      })
      .on('click', highlight_circle)

    d3.selectAll('circle')
      // .raise()
      .on('click', highlight_circle)

    function highlight_circle(d, i) {

      let category = d3.select(this).attr('class').split(" ")[2]
      let age_group = d3.select(this).attr('class').split(" ")[3]
      // console.log(category)
      d3.selectAll('circle')
        .classed('cellsselected', false)
      d3.selectAll('circle.' + "circle" + age_group + "." + category)
        .classed('cellsselected', true)



    }

    // function highlight_circle(d, i) {

    //   console.log(this)

    //   svg.selectAll('circle').remove()
    //   // svg.selectAll('path').remove()


    //   svg.selectAll('circle')
    //     .data(graphic_data)
    //     .join('circle')
    //     .attr('cx', (d) => x(d.value))
    //     .attr('cy', (d) => y(d.value2))
    //     .attr('r', config.essential.radius)
    //     .attr("fill", "grey")
    //     .attr('fill-opacity', '0.2')
    //     .attr('stroke', "grey")
    //     .attr('stroke-opacity', '0.5')
    //     .attr("class", function (d, i) { return "circle" + d.age.replace(/[, \W]+/g, "").trim() + " " + d.name.replace(/[, \W]+/g, "").trim() + " cell cell" + (i) })

    //   cell.append("circle")
    //     .data(filteredData)
    //     .join('circle')
    //     .attr('cx', (d) => x(d.value))
    //     .attr('cy', (d) => y(d.value2))
    //     .attr('r', config.essential.radius)
    //     .attr('fill', d => colour(d.age))
    //     .attr('stroke', d => colour(d.age))
    //     .attr("fill-opacity", "0.3")
    //     .attr("stroke-opacity", "0.9")
    //     .attr("class", function (d, i) { return "cell cell" + (i) + " " + d.name.replace(/[, \W]+/g, "").trim() + " " + d.age.replace(/[, \W]+/g, "").trim() })


    //   d3.selectAll('circle.' + filteredData[i.index].name.replace(/[, \W]+/g, "").trim())
    //     .classed('cellsselected', true)

    // }

    function un_highlight_circle() {
      d3.selectAll('circle')
        .classed('cellsselected', false)
    }



    d3.selectAll('.hull')
      .classed('hullselected', false)

    d3.select('.hull.' + selectedGroup.replace(/[, \W]+/g, "").trim())
      .classed('hullselected', true)

  } //End update function

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {

    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")

    // run the updateChart function with this selected option
    update(selectedOption)
  })

  var tooltipGroup = svg.append("g")
    .attr("class", "tooltipGroup")
    .attr("transform", "scale(0)")

  tooltipGroup.append("rect")
    .attr("x", 0)
    .attr("width", chart_width - 5)
    .attr("y", -40)
    .attr("height", 80)
    .attr("stroke", "none")
    .attr("fill", "white")
    .attr("opacity", 0.9)
    .attr("pointer-events", "none")
    .attr("rx", "4px")

  tooltipGroup.append("text")
    .attr("x", 0)
    .attr("y", -25)
    .attr('dy', 0)
    .attr("text-anchor", "start")
    .text("32.5%")
    .attr("stroke", "#414042")
    .attr("stroke-width", "0.5px")
    .attr("fill", "#414042")
    .attr("font-size", "14px")
    .attr("pointer-events", "none")


  update('Managers, directors and senior officials')

  function addGlobalAnnotations() {
    //adds direction arrow
    addDirectionArrow(
      //name of your svg, normally just SVG
      svg,
      //direction of arrow: left, right, up or down
      'right',
      //anchor end or start (end points the arrow towards your x value, start points away)
      'end',
      //x value
      x(73),
      //y value
      y(2.5),
      //alignment - left or right for vertical arrows, above or below for horizontal arrows
      'right',
      //annotation text
      "More women working in occupation",
      //wrap width
      x(73) - x(0),
      //text adjust y
      0,
      //Text vertical align: top, middle or bottom (default is middle)
      'bottom',
      //
      // you can also optionally add a colour here to make the arrow (but not text) a different colour
    )

    //adds direction arrow
    addDirectionArrow(
      //name of your svg, normally just SVG
      svg,
      //direction of arrow: left, right, up or down
      'up',
      //anchor end or start (end points the arrow towards your x value, start points away)
      'end',
      //x value
      x(1),
      //y value
      y(28),
      //alignment - left or right for vertical arrows, above or below for horizontal arrows
      'left',
      //annotation text
      "Increased earnings",
      //wrap width
      100,
      //text adjust y
      0,
      //Text vertical align: top, middle or bottom (default is middle)
      'bottom',
      //
      // you can also optionally add a colour here to make the arrow (but not text) a different colour
    )
  }

  addGlobalAnnotations()

  // Set up the legend
  var legenditem = d3.select('#legend')
    .selectAll('div.legend--item')
    .data(d3.zip(colours, config.essential.colour_palette))
    .enter()
    .append('div')
    .attr('class', 'legend--item')


  legenditem.append('div').attr('class', 'legend--icon--circle')
    .style('background-color', d => d[1])
    .on('mouseover', (d) => {
      d3.selectAll(`circle.circle${(d.toElement.__data__[0]).replace(/[, \W]+/g, "").trim()}`)
        .classed('cellsselected', true)
      // console.log(d.fromElement.__data__[0], colours.indexOf(d.toElement.__data__[0]))
    })
    .on('mouseout', (d) => {
      d3.selectAll(`circle`)
        .classed('cellsselected', false)
      // console.log(d.fromElement.__data__[0], colours.indexOf(d.toElement.__data__[0]))
    })

  legenditem.append('div')
    .append('p').attr('class', 'legend--text').html(d => d[0] + " years")

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      // y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr('x', x);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr('x', x).attr("dy", lineHeight + "em").text(word);
      }
    }
    var breaks = text.selectAll("tspan").size();
    text.attr("y", function () { return -6 * (breaks - 1); });
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
