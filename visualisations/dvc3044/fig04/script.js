var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  // clear out existing graphics
  graphic.selectAll("*").remove();


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

  groups = d3.groups(graphic_data, (d) => d.group)

  if (config.essential.xDomain == "auto") {
    let min = 1000000
    let max = 0
    for (i = 2; i < graphic_data.columns.length; i++) {
      min = d3.min([min, d3.min(graphic_data, (d) => +d[graphic_data.columns[i]])])
      max = d3.max([max, d3.max(graphic_data, (d) => +d[graphic_data.columns[i]])])
    }
    xDomain = [min, max]
  } else {
    xDomain = config.essential.xDomain
  }


  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width])
    .domain(xDomain);

  const colour = d3.scaleOrdinal()
    .range(config.essential.colour_palette)
    .domain(Object.keys(config.essential.legendLabels))

  // create the y scale in groups
  groups.map(function (d) {
    //height
    d[2] = config.optional.seriesHeight[size] * d[1].length

    // y scale
    d[3] = d3.scaleBand()
      .paddingInner(0.3)
      .paddingOuter(0.1)
      .range([0, d[2]])
      .domain(d[1].map(d => d.name));
    //y axis generator
    d[4] = d3.axisLeft(d[3])
      .tickSize(0)
      .tickPadding(10);
    d[5] = d3.scaleBand()
      .range([0, d[3].bandwidth()])
      .domain([...new Set(graphic_data.map(d => d.series)) ])
  });

 

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .ticks(config.optional.xAxisTicks[size])
    .tickFormat(function (d) {
      var ticky = d3.format(config.essential.numberFormat)(d);
      return ticky // + "x the rate"
    })

  divs = graphic.selectAll('div.categoryLabels')
    .data(groups)
    .join('div')

  divs.append('p').attr('class', 'groupLabels').html((d) => d[0])

  svgs = divs.append('svg')
    .attr('class', 'chart')
    .attr('height', (d) => d[2] + margin.top + margin.bottom)
    .attr('width', chart_width + margin.left + margin.right)

  charts = svgs.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('id', (d,i) => "chart" + i)

  charts.each(function (d) {
    d3.select(this)
      .append('g')
      .attr('class', 'y axis')
      .call(d[4])
      .selectAll('text')
      .call(wrap, margin.left - 15, 0.5);

    d3.select(this)
      .append('g')
      .attr('transform', (d) => 'translate(0,' + d[2] + ')')
      .attr('class', 'x axis')
      .each(function () {
        d3.select(this).call(xAxis.tickSize(-d[2]))
          .selectAll('line').each(function (e) {
            if (e == 1) {
              d3.select(this)
                .attr('class', 'zero-line')
            };
          })
      })

  })

  // console.log(graphic_data)


  charts.selectAll('confidenceBand')
    .data((d) => d[1])
    .join('rect')
    .attr('class', 'confidenceBand')
    .attr('x', (d) => x(d.min))
    .attr('y', (d, i) => groups.filter(e => e[0] == d.group)[0][3](d.name) )
    .attr('height', d => groups.filter(e => e[0] == d.group)[0][3].bandwidth())
    .attr('width', (d) => x(d.max) - x(d.min))
    .attr('fill', (d) => colour(d.series))


    charts.selectAll('middleLine')
    .data((d) => d[1])
    .join('line')
    .attr('class', 'middleLine')
    .attr('x1', (d) => x(d.value))
    .attr('x2', (d) => x(d.value))
    .attr('y1', (d, i) => groups.filter(e => e[0] == d.group)[0][3](d.name))
    .attr('y2', (d, i) => groups.filter(e => e[0] == d.group)[0][3](d.name) + groups.filter(e => e[0] == d.group)[0][3].bandwidth())
    .attr('stroke', (d) => colour(d.series))
    .attr('stroke-width', '3px')


  // This does the x-axis label
  charts.each(function (d, i) {
    // if (i == groups.length - 1) {
    d3.select(this)
      .append('text')
      .attr('x', chart_width)
      .attr('y', (d) => d[2] + 42)
      .attr('class', 'axis--label')
      .text(config.essential.xAxisLabel)
      .attr('text-anchor', 'end')
    // }
  })

  d3.selectAll('g.x.axis')
    .selectAll('text')
    .call(wrap, 80, 0.35)
    .attr('transform', 'translate(0, 10)')


  // addAnnotationLineVertical(
  //   charts,
  //   (d) => d[2],
  //   x(0),
  //   function (d, i) {return config.essential.compareLabels[i]},
  //   "middle",
  //   -20,
  //   250
  // )



  // Set up the legend
  var legenditem = d3.select('#legend')
    .selectAll('div.legend--item')
    .data(d3.zip(Object.values(config.essential.legendLabels), config.essential.colour_palette))
    .enter()
    .append('div')
    .attr('class', 'legend--item')

  legenditem.append('div').attr('class', 'legend--icon--circle')
    .style('background-color', function (d) {
      return d[1]
    })

  legenditem.append('div')
    .append('p').attr('class', 'legend--text').html(function (d) {
      return d[0]
    })

  //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

function wrap(
  text,
  width,
  dyAdjust,
  lineHeightEms,
  lineHeightSquishFactor,
  splitOnHyphen,
  centreVertically
) {
  // Use default values for the last three parameters if values are not provided.
  if (!lineHeightEms) lineHeightEms = 1.05;
  if (!lineHeightSquishFactor) lineHeightSquishFactor = 1;
  if (splitOnHyphen == null) splitOnHyphen = true;
  if (centreVertically == null) centreVertically = true;

  text.each(function () {
    var text = d3.select(this),
      x = text.attr("x"),
      y = text.attr("y");

    if (x == null) x = 0;

    var words = [];
    text
      .text()
      .split(/\s+/)
      .forEach(function (w) {
        if (splitOnHyphen) {
          var subWords = w.split("-");
          for (var i = 0; i < subWords.length - 1; i++)
            words.push(subWords[i] + "-");
          words.push(subWords[subWords.length - 1] + " ");
        } else {
          words.push(w + " ");
        }
      });

    text.text(null); // Empty the text element

    // `tspan` is the tspan element that is currently being added to
    var tspan = text.append("tspan");

    var line = ""; // The current value of the line
    var prevLine = ""; // The value of the line before the last word (or sub-word) was added
    var nWordsInLine = 0; // Number of words in the line
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      prevLine = line;
      line = line + word;
      ++nWordsInLine;
      tspan.text(line.trim());
      if (tspan.node().getComputedTextLength() > width && nWordsInLine > 1) {
        // The tspan is too long, and it contains more than one word.
        // Remove the last word and add it to a new tspan.
        tspan.text(prevLine.trim());
        prevLine = "";
        line = word;
        nWordsInLine = 1;
        tspan = text.append("tspan").text(word.trim());
      }
    }

    var tspans = text.selectAll("tspan");

    var h = lineHeightEms;
    // Reduce the line height a bit if there are more than 2 lines.
    if (tspans.size() > 2)
      for (var i = 0; i < tspans.size(); i++) h *= lineHeightSquishFactor;

    tspans.each(function (d, i) {
      // Calculate the y offset (dy) for each tspan so that the vertical centre
      // of the tspans roughly aligns with the text element's y position.
      var dy = i * h + dyAdjust;
      if (centreVertically) dy -= ((tspans.size() - 1) * h) / 2;
      d3.select(this)
        .attr("y", y)
        .attr("x", x)
        .attr("dy", dy + "em");
    });
  });
} //end wrap




d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data
    




    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });