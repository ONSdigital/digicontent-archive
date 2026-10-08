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
  var height = (config.optional.seriesHeight[size] * graphic_data.length) + (10 * (graphic_data.length - 1)) + 12

  // clear out existing graphics
  graphic.selectAll("*").remove();

  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width]);

  const z = d3.scaleLinear()
    .range([0, chart_width]);

  const y = d3.scaleBand()
    .paddingOuter(0.2)
    .paddingInner((graphic_data.length - 1) * 10 / (graphic_data.length * 30))
    .range([0, height])
    .round(true)

  const colour = d3.scaleOrdinal()
    .domain(Object.keys(graphic_data[0]).slice(1))
    .range(config.essential.colour_palette)

  //use the data to find unique entries in the name column
  //y.domain([...new Set(graphic_data.map(d => d.name))]);

  y.domain([...new Set(graphic_data.map(d => d.name))]);

  //(graphic_data.map(d => d.name)
  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(0)
    .tickPadding(10)

  const stack = d3.stack()
    .keys(Object.keys(graphic_data[0]).slice(1).filter((el) => !["yPosition", "labelOnly"].includes(el)))
    .offset(config.essential.stackOffset)
    .order(config.essential.stackOrder)

  const series = stack(graphic_data)


  //set up xAxis generator
  var xAxis = d3.axisTop(x)
    .tickSize(-height)
    .tickFormat(function (d) { return d * 100 + "%" })
    .ticks(config.optional.xAxisTicks[size]);

  var topAxis = d3.axisBottom(z)
    .tickSize(height)
    .tickFormat(function (d) { return d * 100 + "%" })
    .ticks(config.optional.xAxisTicks[size]);

  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")

  if (config.essential.xDomain == "auto") {
    x.domain(d3.extent(series.flat(2))); //flatten the arrays and then get the extent
  } else {
    x.domain(config.essential.xDomain);
  }

  if (config.essential.zDomain == "auto") {
    z.domain(d3.extent(series.flat(2))); //flatten the arrays and then get the extent
  } else {
    z.domain(config.essential.xDomain);
  }

  // Set up the legend
  var legenditem = d3.select('#legend')
    .selectAll('div.legend--item')
    .data(d3.zip(Object.keys(graphic_data[0]).slice(1).filter((el) => !["yPosition", "labelOnly"].includes(el)), config.essential.colour_palette))
    .enter()
    .append('div')
    .attr('class', 'legend--item')

  legenditem.append('div').attr('class', 'legend--icon')
    .style('background-color', function (d) {
      return d[1]
    })

  legenditem.append('div')
    .append('p').attr('class', 'legend--text').html(function (d) {
      return d[0]
    })

  svg
    .append('g')
    .attr('transform', 'translate(0,' + 0 + ')')
    .attr('class', 'x axis')
    .call(xAxis).selectAll('line').each(function (d) {
      if (d == 0) {
        d3.select(this)
          .attr('class', 'zero-line');
      }
    });

  svg
    .append('g')
    .attr('transform', 'translate(0,' + 0 + ')')
    .attr('class', 'top axis')
    .call(topAxis).selectAll('line').each(function (d) {
      if (d == 0) {
        d3.select(this)
          .attr('class', 'zero-line');
      }
    });

  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('text').call(wrap, margin.left - 10)

  let positionObj = {};

  if (config.essential.repositionUsingCSVValues) {

    let yPositionRanges = Array.isArray(config.essential.repositioningScale) ? config.essential.repositioningScale : [Math.min(...graphic_data.map(o => o.yPosition)), Math.max(...graphic_data.map(o => o.yPosition))];

    graphic_data.forEach((el) => positionObj[el.name] = (el.yPosition - yPositionRanges[0]) * height / (yPositionRanges[1] - yPositionRanges[0]))

    svg.append("g")
      .attr("class", "yLabelsGroup")
      .selectAll("g")
      .data(labels_data)
      .enter()
      .append("g")
      .attr("class", "labelsTick")
      .attr("transform", (e) => "translate(0," + (e.yPosition - yPositionRanges[0]) * height / (yPositionRanges[1] - yPositionRanges[0]) + ")")
      .append("text")
      .text((e) => e.name)
      .call(wrap, margin.left - 10)

    svg.select(".yLabelsGroup")
      .selectAll("tspan")
      .attr("text-anchor", "end")
      .attr("x", -10)

    svg.select(".y")
      .selectAll("tspan")
      .attr("x", -10)

    svg.select(".y").selectAll(".tick")
      .attr("transform", function (d, i) {
        return "translate(0," + positionObj[d] + ")"
      })

  }

  //select tick labels + move to left
  svg.selectAll("g.y.axis")
    .selectAll("tspan")
    .attr("id", function (d, i) { return "ticky" + i })

  series.forEach(function (a, i) {

    a.forEach(function (b) {

      b["index"] = i
    })
  })

  var tooltipGroup = svg.append("g")
    .attr("class", "tooltipGroup")
    .attr("transform", "scale(0)")

  let comparisonName = "Overall (England and Wales)";

  svg.append('g')
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d, i) => config.essential.colour_palette[i])
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("class", "stackRects")
    .attr("x", function (d, i) { return Math.min(x(d[0]), x(d[1])) })
    .attr("y", (d) => y(d.data.name))
    .attr("width", (d) => Math.abs(x(d[0]) - x(d[1])))
    .attr("height", y.bandwidth())
    .on("mouseenter", function (event, data) {

      let yValue = parseFloat(d3.select(this).attr("y")) + d3.select(this).attr("height") / 2

        
      let comparisonDisplacementValue = (data.data.name == "Other Black" || data.data.name == "Caribbean" || data.data.name == "White and Asian"  ? 1 : -1)* config.optional.seriesHeight[size] * 2.5;


      tooltipGroup = svg.select(".tooltipGroup")
        .attr("transform", "scale(1)")

      let categoryIndex = data.index;
      let seriesName = data.data.name;

      let selectedRow = svg.selectAll(".stackRects")
        .filter((d) => d.data.name == seriesName)

      let comparisonRow = svg.selectAll(".stackRects")
        .filter((d) => d.data.name == comparisonName)
        .style("y", comparisonDisplacementValue + (config.essential.repositionUsingCSVValues ? positionObj[seriesName] - y.bandwidth() / 2 : y(seriesName)));


      // [...selectedRow].forEach(function (el) {

        let textValue;

        d3.select(this).attr("cursor", function (d, i) { textValue = d[1] - d[0]; return null })

        tooltipGroup.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("fill", "#414042")
          .style("stroke", "none")
          .text((textValue * 100).toFixed(0) + "%")
          .attr("x", parseFloat(d3.select(this).attr("x")) + (parseFloat(d3.select(this).attr("width")) / 2)) //+
          .attr("y", parseFloat(d3.select(this).attr("y")) - 6);
   








      [...comparisonRow].forEach(function (el, ind, arr) {


        let textValue;

        d3.select(el).attr("cursor", function (d, i) { textValue = d[1] - d[0]; return null })

        tooltipGroup.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .style("fill", "#414042")
          .style("stroke", "none")
          .text((textValue * 100).toFixed(0) + "%")
          .attr('text-anchor',()=>{if(ind==arr.length-1){return 'start'}else{return 'end'}})
          .attr("x", (d, i) => {
            if (ind == arr.length - 1) { 
                return x(1)
            } else {
              return parseFloat(d3.select(el).attr("x")) + d3.select(el).attr("width") / 2 
            }
          })
          .attr("y", (comparisonDisplacementValue + (config.essential.repositionUsingCSVValues ? positionObj[seriesName] : y(seriesName))) - 20)
      });

      /*let selectedCategory = svg.selectAll(".stackRects")
        .filter((d) => d.index == categoryIndex)*/

      /*let selectedRect = svg.selectAll(".stackRects")
        .filter((d) => d.data.name == seriesName && d.index == categoryIndex)*/

      let otherRow = svg.selectAll(".stackRects")
        .filter((d) => ![seriesName, comparisonName].includes(d.data.name))
        .style('pointer-events', 'none')
        .transition()
        .duration(100)
        .attr("opacity", 0)

      let selectedTick = svg.select(".y")
        .selectAll(".tick")
        .filter((d) => d == seriesName)
        .attr("opacity", 1)

      let comparisonTick = svg.select(".y")
        .selectAll(".tick")
        .filter((d) => d == comparisonName)
        .attr("transform", "translate(0," + (comparisonDisplacementValue + (config.essential.repositionUsingCSVValues ? positionObj[seriesName] : y(seriesName))) + ")")

      let otherTicks = svg.select(".y")
        .selectAll(".tick")
        .filter((d) => ![seriesName, comparisonName].includes(d))
        .attr("opacity", 0)

      // let labels = svg.select(".yLabelsGroup")
      //   .selectAll(".labelsTick")
      //   .attr("opacity", 0)

    })
  .on("mouseleave", function(event, data) {

    let seriesName = data.data.name;

    let otherRow = svg.selectAll(".stackRects")
      .filter((d) => ![seriesName, comparisonName].includes(d.data.name))
      .style('pointer-events','auto')
      .transition()
      .duration(100)
      .attr("opacity", 1)

    let comparisonRow = svg.selectAll(".stackRects")
      .filter((d) => d.data.name == comparisonName)
      .style("y", null);

    svg.select(".tooltipGroup")
        .selectAll("*")
        .remove()

    svg.select(".tooltipGroup")
        .attr("transform", "scale(0)")

    // svg.select(".yLabelsGroup")
    //     .selectAll(".labelsTick")
    //     .attr("opacity", 1)

    svg.select(".y")
        .selectAll(".tick")
        .attr("opacity", 1)
        .attr("transform", function(d,i) {return "translate(0,"+(config.essential.repositionUsingCSVValues ? positionObj[d] : y(d))+")" })

    /*svg.selectAll(".labelRects")
        .attr("opacity", 0)*/

  })

  if (config.essential.repositionUsingCSVValues) {

    svg.selectAll(".stackRects")
      .attr("y", function (d, i) { return positionObj[d.data.name] - y.bandwidth() / 2 })

  }

  // This does the x-axis label
  svg
    .append('g')
    .attr('transform', 'translate(0,' + -65 + ')')
    .append('text')
    .attr('x', chart_width / 2)
    .attr('y', 35)
    .attr('class', 'axis--label')
    .text(config.essential.xAxisLabel)
    .attr('text-anchor', 'middle');

  //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)

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
    graphic_data = data.filter((el) => el.labelOnly == "F")
    labels_data = data.filter((el) => el.labelOnly == "T")



    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
