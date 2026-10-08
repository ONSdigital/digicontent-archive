var graphic = d3.select('#graphic');
let select = d3.select('#select');
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
  if (size!="sm") {var height = config.essential.chart_height * chart_width} else {var height = 1.4 *chart_width}

  // clear out existing graphics and menu
  graphic.selectAll("*").remove();
  d3.select('#selectButton').selectAll("*").remove();
  select.selectAll('*').remove();

  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width]);

  const y = d3.scaleLinear()
    .range([height, 0])


  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(chart_width + 5)
    .tickPadding(5)
    .tickFormat(d3.format(",.0f"))
    .ticks(config.optional.yAxisTicks[size])

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .tickSize(-height - 5)
    .tickPadding(5)
    .tickFormat(d3.format(",.0f"))
    .ticks(config.optional.xAxisTicks[size]);

  //find unique groups in the group column
  groupsUnique = [...new Set(graphic_data.map(d => d.group))]


  // add the options to the button

d3.select("#selectButton")
  // .selectAll('myOptions')
  .append("option")
  .text("All")
  .attr("value", "all")

  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(groupsUnique)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button


    //select container - update width

    d3.select("#select-container")
      .attr('style', 'width:calc(100% - ' + margin.right + 'px)')

    //chosen.js select box stuff

    const optns = select
    .append('div')
    .attr('id', 'sel')
    .append('select')
    .attr('id', 'optionsSelect')
    .attr('style', 'width:calc(100% - 6px)')
    .attr('class', 'chosen-select');

    	// Add the placeholder option
// old code  optns.append('option').attr('value', 'all').text('Select an area'); // Placeholder text
optns.append('option').attr('value', 'all').text(''); // Placeholder text
  optns
    .selectAll('option.option')
    .data(groupsUnique)
    .enter()
    .append('option')
    .attr('value', (d) => d)
    .text((d) => d);

  //add some more accessibility stuff
	d3.select('input.chosen-search-input').attr('id', 'chosensearchinput');
	d3.select('div.chosen-search')
		.insert('label', 'input.chosen-search-input')
		.attr('class', 'visuallyhidden')
		.attr('for', 'chosensearchinput')
		.html('Type to select an area');


  $(".chosen-select").chosen({allow_single_deselect: true});

  $('#optionsSelect').trigger('chosen:updated');  // Initialize Chosen

  $('#optionsSelect').chosen().change(function () {
    const selectedOption = $(this).val();
    console.log(`Selected option: ${selectedOption}`);
    update(selectedOption);
  })


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


    //setup the arrowhead marker
    // ("svg") is the reference for the object you are appending to. In most of our templates it will be svg
    setupArrowhead(d3.select("svg"));

midpointx=x.domain()[0] + (0.5*(x.domain()[1]-x.domain()[0]))
midpointy=y.domain()[0] + (0.5*(y.domain()[1]-y.domain()[0]))

    //adds direction arrow
    addDirectionArrow(
      //name of your svg, normally just SVG
      svg,
      //direction of arrow: left, right, up or down
      'right',

      //anchor end or start (end points the arrow towards your x value, start points away)
      'start',

      //x value
      x(35),

      //y value
      +y(16000),

      //alignment - left or right for vertical arrows, above or below for horizontal arrows
      'right',

      //annotation text
      "Better access to childcare",

      //wrap width
      90,

      //text adjust y (probably not needed but if you need to adjust the vertical position of the text if it's not looking aligned)
      0,

      //Text vertical align: top, middle or bottom (default is middle)
      'middle',
      //

      // you can also optionally add a colour here to make the arrow a different colour. This won't change the text colour
    )

if (size!="sm"){
    //adds direction arrow
    addDirectionArrow(
      //name of your svg, normally just SVG
      svg,
      //direction of arrow: left, right, up or down
      'up',

      //anchor end or start (end points the arrow towards your x value, start points away)
      'end',

      //x value
      x(x.domain()[0]),

      //y value
      y(32000),

      //alignment - left or right for vertical arrows, above or below for horizontal arrows
      'left',

      //annotation text
      "Higher disposable income",

      //wrap width
      150,

      //text adjust y (probably not needed but if you need to adjust the vertical position of the text if it's not looking aligned)
      0,

      //Text vertical align: top, middle or bottom (default is middle)
      'middle',
      //

      // you can also optionally add a colour here to make the arrow a different colour. This won't change the text colour
    )
}

        // Add annotation line and text
        svg.append("line").attr("x1", x(0.12)).attr("x2", x(0.43)).attr("y1", y(0.276228)).attr("y2", y(0.637192)).attr("stroke", "white").attr("stroke-width", 1.2).attr("stroke-dasharray", "5,3");
        svg.append("line").attr("x1", x(0.12)).attr("x2", x(0.43)).attr("y1", y(0.276228)).attr("y2", y(0.637192)).attr("stroke", "#adadad").attr("stroke-width", 1).attr("stroke-dasharray", "5,3");
        // Add label and reformat it so it's essentially wrapped
        svg.append("text")
        .attr("x", x(0.65) - 5)
        .attr("y", y(0.34) - 5)
        .attr("font-size", 14)
        .attr("fill", "#666")
        .attr("text-anchor", "start")
        .html(function() {
            //return "Equivalence <tspan x='" + (x(0.4803) +0.0476 ) + "' dy='1.0em'>line</tspan>";
            return "Equivalence line";
        });


  svg.selectAll('circle')
    .data(graphic_data)
    .join('circle')
    .attr('cx', (d) => x(d.value))
    .attr('cy', (d) => y(d.value2))
    .attr('r', config.essential.radius)
    .attr("fill", config.essential.colour_palette)
    .attr('fill-opacity', '1')
    // .attr('stroke', "grey")
    // .attr('stroke-opacity', '0.5')
    .attr("class", function (d, i) { return d.group.replace(/[, ]+/g, "").trim() + " " + d.name.replace(/[, ]+/g, "").trim() + " cell cell" + (i) })


  // .attr("stroke", (d) => colour(d.colour));
if(size!="sm") {xlabelypos=-20} else (xlabelypos=-25)

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
    .attr('y', xlabelypos)
    .attr('class', 'axis--label')
    .text(config.essential.yAxisLabel)
    .attr('text-anchor', 'start')
    .call(wrap2,(chart_width+margin.left));





  //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)


  // Interactivity
  // A function that updates the chart
  function update(selectedGroup) {

    // console.log("selectedGroup: " + selectedGroup);

    svg.selectAll('circle').remove()
    svg.selectAll('path').remove()
    svg.selectAll(".tooltipGroup").remove()
    svg.selectAll(".htmlTooltip").remove()


    svg.selectAll('circle')
      .data(graphic_data)
      .join('circle')
      .attr('cx', (d) => x(d.value))
      .attr('cy', (d) => y(d.value2))
      .attr('r', config.essential.radius)
      .attr("fill", config.essential.colour_palette)
      .attr('fill-opacity', '1')
      // .attr('stroke', "grey")
      // .attr('stroke-opacity', '0.5')
      .attr("class", function (d, i) { return d.group.replace(/[, \W]+/g, "").trim() + " " + d.name.replace(/[, \W]+/g, "").trim() + " cell cell" + (i) })



    // console.log(graphic_data)

    function filterCriteria(d) {

      return d.group == selectedGroup
    }

    var filteredData = ""

    if (selectedGroup == "all") {

       filteredData = graphic_data

    } else {

       filteredData = graphic_data.filter(filterCriteria);

    }

  //  console.log(filteredData)

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
      .attr("class", function (d, i) { /*console.log(d, i);*/ return i })


    // svg.selectAll('circle2')
    // .data(graphic_data)
    // .join('circle')
    // .attr('class','circle2')
    // .attr('cx',(d) => x(d.value))
    // .attr('cy',(d) => y(d.value2))
    // .attr('r',config.essential.radius)
    // // .attr('width',(d) => x(d.value)-x(0))
    // // .attr('height',y.bandwidth())
    // .attr('fill',config.essential.colour_palette)
    // .attr('stroke',config.essential.colour_palette)
    // .attr("fill-opacity","0.3")
    // .attr("stroke-opacity","0.9")
    // .attr("display", function(d) {
    //   if (d.group == selectedGroup) {
    //     return "block"
    //   } else {
    //     return "none"
    //   }
    // })
    //   }



    cell.append("circle")
      .data(filteredData)
      .join('circle')
      .attr('cx', (d) => x(d.value))
      .attr('cy', (d) => y(d.value2))
      .attr('r', config.essential.radius)
      .attr('fill', config.essential.colour_palette)
      .attr('stroke', "#222222")
      .attr("stroke-width","1.5px")
      .attr("fill-opacity", "1")
      .attr("stroke-opacity", function () {if (selectedGroup == "all") { return "0" } else { return "0.9" }})
      .attr("class", function (d, i) { return "cell cell" + (i) + " " + "circle" + d.name.replace(/[, \W]+/g, "").trim() + " " + d.group.replace(/[, \W]+/g, "").trim() })

      d3.selectAll("circle")
        .on("mouseover", mouseHighlight)
        .on("mouseleave", mouseLeave)

    // creates voronoi
    cell.append("path")
      .attr("fill", "none")
      //  .attr("stroke", "red")
      .attr('pointer-events', 'all')
      .attr("d", (d) => `M${d.join("L")}Z`)
      .attr("class", function (d, i) { return "pathClass path" + (i) + " " + filteredData[i].name.replace(/[, \W]+/g, "").trim() + " " + filteredData[i].group.replace(/[, \W]+/g, "").trim() })

    d3.selectAll('path.pathClass')
       .on('mouseover', mouseHighlight)
      .on("mouseleave", mouseLeave)

      // .on('click', highlight_circle)

      d3.selectAll('circle')
        // .raise()
        // .on('click', highlight_circle)

    function mouseHighlight(d, i) {

      // console.log(d, filteredData[i.index])

      // let xValue = parseFloat(d.x)
      // let yValue = parseFloat(d.y)

      let this_data = d.target.__data__

      if(this_data.index >= 0) {
         this_data = filteredData[i.index]
      }

      let xValue = x(this_data.value);
      let yValue = 3;


// handle if the tooltip overlaps the edge

      if (y(this_data.value2) > (height - 120)) {
        yValue = y(this_data.value2) - 110
        // console.log("bottom")
      } else if (y(this_data.value2) > 30) {
        yValue = y(this_data.value2) - 30
        // console.log("in middle")
      } else {
        yValue = y(this_data.value2) + 10
        // console.log("top")
      }

      if (x(this_data.value) > (chart_width - 230)) {
        xValue = x(this_data.value) - 230
      } else {
        xValue = x(this_data.value) + 20
      }

      if ((x(this_data.value)-230+margin.left)<0) {
        xValue = 20 - margin.left
        if (y(this_data.value2) < 120) {

          yValue = y(this_data.value2)+10;
        } else {
          yValue = y(this_data.value2)-150;
        }
      } else {
      }

       svg.selectAll(".circle"+ this_data.name)
        .attr("fill",config.essential.colour_highlight)
        .attr("fill-opacity", "1")
        .attr("stroke-opacity","0.9")
        .attr("r", config.essential.radius * 1.8)
        .raise()


      // svg.select(".tooltipGroup")
      //   .attr("transform", "translate(" + xValue + "," + yValue + ")")
      //   .attr("opacity", "1")

      svg.select(".htmlTooltip")
        // .attr("transform", "translate(" + xValue + "," + yValue + ")")
        .attr("opacity", "1")

      // svg.select(".tooltipGroup")
      //   .select("text")
      //   // .text(d3.format(config.essential.tooltipFormat)((i[1] - i[0])))
      //   .html(`<tspan dy=0 style="font-weight:700" width="100">${this_data.friendly_name}</tspan>
      //   <tspan x=0 dy=20>(${this_data.name})</tspan>
      //   <tspan x=0 dy=20>SAIE: £${d3.format(",.2r")(this_data.value)}</tspan>
      //   <tspan x=0 dy=20>ABIS: £${d3.format(",.2r")(this_data.value2)}</tspan>`)
      //   // .html(`<tspan dy=0 style="font-weight:700" width="100">${this_data.friendly_name}</tspan>
      //   // <tspan x=0 dy=20>${config.essential.xAxisLabel}: ${this_data.value},</tspan>
      //   // <tspan x=0 dy=20>${config.essential.yAxisLabel}: ${this_data.value2}</tspan>`)
      //   // .call(wrap, chart_width - 40)


        svg.select(".htmlTooltip")
        .attr("width", 240)
        .attr("height", "100%")
        .attr("x", xValue)
        .attr("y", yValue)

        .html(`<div style="" class="innerTooltip"><span dy=0 style="font-weight:700;"; >${this_data.friendly_name}</span>
        <span x=0 dy=20 style="margin-bottom: 18px;">(${this_data.name})</span><br/>
        <p style="margin-top: 5px; margin-bottom: 5px" ></p>
        <span x=0 dy=20 style="font-size:14px; margin-top:20px;">Equivalent places: ${d3.format(",.2r")(this_data.value)} per 100 children</span><br/>
        <span x=0 dy=20 style="font-size:14px">Gross disposable income per head: £${d3.format(",.2r")(this_data.value2)}</span>
        <div>`)
    }



    function mouseLeave (d,i) {
        if (selectedGroup=="all"){

          let this_data = d.target.__data__

          if(this_data.index >= 0) {
            this_data = filteredData[i.index]
          }

          svg.selectAll(".circle"+ this_data.name).attr("fill", "#3B7A9E").attr('fill-opacity', '0.25').attr("r", config.essential.radius).attr("stroke-opacity",0)

          // svg.select(".tooltipGroup")
          //   // .attr("transform", "scale(0)")
          //   .attr("opacity", "0")

          svg.select(".htmlTooltip")
            .attr("opacity", "0")
          }
    }

    function highlight_circle(d, i) {

      // console.log('clicked')

      svg.selectAll('circle').remove()
      // svg.selectAll('path').remove()


      svg.selectAll('circle')
        .data(graphic_data)
        .join('circle')
        .attr('cx', (d) => x(d.value))
        .attr('cy', (d) => y(d.value2))
        .attr('r', config.essential.radius)
        .attr("fill", config.essential.colour_palette)
        .attr('fill-opacity', '1')
        .attr('stroke', "#222222")
        .attr('stroke-opacity', '1')
        .attr("class", function (d, i) { return d.group.replace(/[, \W]+/g, "").trim() + " " + d.name.replace(/[, \W]+/g, "").trim() + " cell cell" + (i) })

      cell.append("circle")
        .data(filteredData)
        .join('circle')
        .attr('cx', (d) => x(d.value))
        .attr('cy', (d) => y(d.value2))
        .attr('r', config.essential.radius)
        .attr('fill', config.essential.colour_palette)
        .attr('stroke', "#222222")
        .attr("fill-opacity", "1")
        .attr("stroke-opacity", "1")
        .attr("class", function (d, i) { return "cell cell" + (i) + " " + d.name.replace(/[, \W]+/g, "").trim() + " " + d.group.replace(/[, \W]+/g, "").trim() })


      d3.selectAll('circle.' + filteredData[i.index].name.replace(/[, \W]+/g, "").trim())
        .attr('class', 'cellsselected')

    }
    // var tooltipGroup = svg.append("g")
    //   .attr("class", "tooltipGroup")
    //   // .attr("transform", "scale(0)")
    //    .attr("opacity", "0")

    var htmlTooltip =  svg.append("foreignObject")
      .attr("class", "htmlTooltip")
      .attr("opacity", "1")

    // tooltipGroup.append("rect")
    //   .attr("x", 0)
    //   .attr("width", "140px")
    //   .attr("y", -10)
    //   .attr("height", 75)
    //   .attr("stroke", "none")
    //   .attr("fill", "#EAEAEA")
    //   .attr("opacity", 0.9)
    //   .attr("pointer-events", "none")
    //   .attr("rx", "4px")

    // tooltipGroup.append("text")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr('dy', 20)
    //   .attr("text-anchor", "start")
    //   .text("")
    //   .attr("stroke", "#414042")
    //   .attr("stroke-width", "0.5px")
    //   .attr("fill", "#414042")
    //   .attr("font-size", "14px")
    //   .attr("pointer-events", "none")

    //adds direction arrow
    addDirectionArrow(
      //name of your svg, normally just SVG
      svg,
      //direction of arrow: left, right, up or down
      'right',

      //anchor end or start (end points the arrow towards your x value, start points away)
      'start',

      //x value
      x(35),

      //y value
      +y(16000),

      //alignment - left or right for vertical arrows, above or below for horizontal arrows
      'right',

      //annotation text
      "",

      //wrap width
      150,

      //text adjust y (probably not needed but if you need to adjust the vertical position of the text if it's not looking aligned)
      0,

      //Text vertical align: top, middle or bottom (default is middle)
      'middle',
      //

      // you can also optionally add a colour here to make the arrow a different colour. This won't change the text colour
    )

if (size!="sm"){
    //adds direction arrow
    addDirectionArrow(
      //name of your svg, normally just SVG
      svg,
      //direction of arrow: left, right, up or down
      'up',

      //anchor end or start (end points the arrow towards your x value, start points away)
      'end',

      //x value
      x(x.domain()[0]),

      //y value
      y(32000),

      //alignment - left or right for vertical arrows, above or below for horizontal arrows
      'left',

      //annotation text
      "",

      //wrap width
      150,

      //text adjust y (probably not needed but if you need to adjust the vertical position of the text if it's not looking aligned)
      0,

      //Text vertical align: top, middle or bottom (default is middle)
      'middle',
      //

      // you can also optionally add a colour here to make the arrow a different colour. This won't change the text colour
    )
}


  }
  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {

    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")

    // console.log(selectedOption)

    // run the updateChart function with this selected option
    update(selectedOption)
  })



  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }

update("all")

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

function wrap2(text, width) {
  text.each(function() {
   var text = d3.select(this),
     words = text.text().split(/\s+/).reverse(),
     word,
     line = [],
     lineNumber = 0,
     lineHeight = 1.1, // ems
     y = text.attr("y"),
     x = text.attr("x")
     dy = 0,
     tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
   while (word = words.pop()) {
     line.push(word);
     tspan.text(line.join(" "));
     if (tspan.node().getComputedTextLength() > width) {
       line.pop();
       tspan.text(line.join(" "));
       line = [word];
       tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
     }
   }
  });
} // end wrap function


d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
