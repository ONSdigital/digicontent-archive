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
  var height = (config.optional.seriesHeight[size] * graphic_data.length) + 20

  // clear out existing graphics
  graphic.selectAll("*").remove();

  series = graphic_data.map(d => d.name)
  columns = graphic_data.columns.slice(1,3)

  // pivot data wide to long
  dataPivoted = Array.from(pivot(graphic_data, graphic_data.columns.slice(1,3), "category", "value"))

  // get ranks for the data
  ranks = {};
  columns.forEach((item, i) => {
    ranks[item] = d3.rank(graphic_data, function(d){
      // console.log(d)
      return -d[item]
    })
  });
  //
  // Object.entries(ranks).forEach(function(group){
  //   group[1].forEach(function(d){
  //     console.log(d)
  //     if(d > config.optional.rankCutOff){
  //       d = d+1
  //     }
  //   })
  // })
  //
  // console.log(ranks)
  //pivot wide to tidy data and include ranks
  // dataPivoted = dataPivoted.map((d, i) => ({
  //   ...d,
  //   rank: ranks[d.category][series.indexOf(d.name)],
  // }))

  if(config.optional.properPositions != true){
    dataPivoted.forEach(function(d){
      if(d.rankMinCustom > config.optional.rankCutOff & d.category == columns[0]){
        d.rank = ranks[d.category][series.indexOf(d.name)]
      } else if(d.rankMaxCustom > config.optional.rankCutOff & d.category == columns[1]){
        d.rank = ranks[d.category][series.indexOf(d.name)]
      } else{
        d.rank = ranks[d.category][series.indexOf(d.name)]
      }
    })
  }
  else{
    dataPivoted.forEach(function(d){
      if(d.rankMinCustom > config.optional.rankCutOff & d.category == columns[0]){
        d.rank =  ranks[d.category][series.indexOf(d.name)]
      } else if(d.rankMaxCustom > config.optional.rankCutOff & d.category == columns[1]){
        d.rank = ranks[d.category][series.indexOf(d.name)]
      } else{
        d.rank = ranks[d.category][series.indexOf(d.name)]
      }
    })
  }

  nested = d3.group(dataPivoted, d => d.name)

  nested.forEach(function(d){
    var change = d[0].rank-d[1].rank
    d[0].change = change
    d[1].change = change
  })


  //set up scales
  x = d3.scalePoint()
    .range([0, chart_width])
    .domain(graphic_data.columns.slice(1,3))
    .round(true);

  if(config.optional.properPositions != true){
    y = d3.scalePoint()
      .range([height, 0])
      .domain(d3.range(graphic_data.length, -1, -1))
      .round(true);
    }
    else{
      rankValues = []
      graphic_data.forEach(function(d){
        if(d.rankMinCustom != ""){
          rankValues.push(d.rankMinCustom)
        }
        if(d.rankMaxCustom != ""){
          rankValues.push(d.rankMaxCustom)
        }
      })
      var yDomain = []
      for (let i = 0; i <= d3.max(rankValues); i++){
        yDomain.push(i)
      }
      yDomain.reverse()
      y = d3.scalePoint()
        .range([height, 0])
        .domain(yDomain)
        .round(true);
    }

  colour = d3.scaleOrdinal()
    .domain(series)

  // if (config.essential.colour_palette.type == "custom") {
  //   colour.range(config.essential.colour_palette.palette)
  // } else if (config.essential.colour_palette.type == "sequential") {
  //   colour.range(chroma.scale(chroma.brewer[config.essential.colour_palette.palette]).colors(series.length+1))
  //   colour.domain(d3.range(graphic_data.length, -1, -1).reverse())
  // } else if (config.essential.colour_palette.type == "qualitative") {
  //   colour.range(chroma.brewer[config.essential.colour_palette.palette])
  // }

  // line generator
  line = d3.line()
    .x(d => x(d.category))
    .y(d => y(d.rank))

  //set up xAxis generator
  const xAxis = d3.axisTop(x)
    .tickPadding(23)
    .tickSize(0);


  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")

  svg
    .append('g')
    .attr('class', 'x axis categorical')
    .call(xAxis)
    .selectAll('text')

  if (config.optional.properPositions == true){
    columns.forEach(function(column){
      var blankCircles = svg.append("g")
      for (let i = 0; i <= d3.max(rankValues); i++){
        if(i != config.optional.rankCutOff){
          blankCircles.append("circle")
          .attr('r', config.essential.circleRadius)
          .attr('cy', y(i))
          .attr('cx', x(column))
          .attr('fill','#C6C6C6')
          .attr("opacity",0.5)
        }
      }
    })
  }

  series = svg.selectAll('g.series')
    .data(Array.from(nested))
    .join('g')
    .attr('class', 'series')

  series.append('path')
    .attr('class', 'between')
    .attr('d', d => line(d[1]))
    .attr('stroke',function(d){
      // console.log(d)
      if(d[1][1].change > 0){
        return config.essential.pos_neg_colour[0]
      } else if(d[1][1].change < 0){
        return config.essential.pos_neg_colour[1]
      } else{
        return config.essential.pos_neg_colour[2]
      }
    })



  // add in the circles
  series.selectAll('circle.ranks')
    .data(d => d[1])
    .join('circle')
    .attr('r', config.essential.circleRadius)
    .attr('fill',function(d){
      if(d.change > 0){
        return config.essential.pos_neg_colour[0]
      } else if(d.change < 0){
        return config.essential.pos_neg_colour[1]
      } else{
        return config.essential.pos_neg_colour[2]
      }
    })
    // .attr('fill', d => config.essential.colour_palette.type == "sequential" ? colour(d.rank) : colour(d.name))
    .attr('cy', function(d) {
      return y(d.rank)
    })
    .attr('cx', function(d) {
      return x(d.category)
    })

  // add in the rank numbers in the circle
  series.selectAll('text.rankNum')
    .data(d => d[1])
    .join('text')
    .attr('class', 'rankNum')
    .text(function(d){
      if(d.category == columns[1]){
        if(d.rank+1 > config.optional.rankCutOff){
          return +d.rankMaxCustom
        } else{
          return +d.rank + 1
        }
      }
      else if (d.category == columns[0]){
        if(d.rank+1 > config.optional.rankCutOff){
          return +d.rankMinCustom
        } else{
          return +d.rank + 1
        }
      }
    })
    .attr('y', d => y(d.rank))
    .attr('x', d => x(d.category))
    .attr('text-anchor', "middle")
    .attr('dy', 5)
    // .attr('fill', (d) => chroma.contrast(config.essential.colour_palette.type == "sequential" ? colour(d.rank) : colour(d.name), "#fff") < 4.5 ? "#414042" : "#fff")
    .attr('fill',function(d){
      if(d.change > 0 | d.change ==0| d.change < 0){
        return "white"
      } else{
        return "#222222"
      }
    })

  //replace specific rank numbers but maintain position
  d3.selectAll("g.series").selectAll("text")
  .attr("id",function(d,i){return "ranky" + d.rank})

  d3.select("#ranky9").text("15")


  // if(size == "lg"){
  //   createPreviousLabels();
  // }
  createCurrentLabels();

  function createPreviousLabels(){
    // // Add in the line labels
    series.selectAll('text.categoryLabelPrev')
      .data(function(d){
         return d[1].filter(d => d.category == columns[columns.length - 2])
       })
      .join('text')
      .attr('class', 'categoryLabel')
      .attr('x', x(columns[columns.length - 2]))
      .attr('y', (d) => y(d.rank))
      .text(function(d){
        return d.name + "  (" + d3.format(",.0f")(d.value)
        //(d.value/1000)+",000)"
        // return d.name
      })
      // .text((d) => d.name + " - " + d3.format(",.0f")(d.value/1000))
      .call(wrap, margin.left - 10)

    // create new array from labels and select particular attributes
    labels = Array.from(d3.selectAll('.categoryLabel')._groups[0]).map(function(d) {
      bbox = d.getBBox()
      return {
        targetY: +d3.select(d).attr('y'),
        label: d.__data__.name,
        height: bbox.height,
        value: d.__data__.value
      }
    })
    // Use James T's code to get new positions
    newPositions = positionLabels(labels, y.range().reverse, d => d.targetY, d => d.height, d => d.value);

    // remove existing labels
    d3.selectAll('text.categoryLabelPrev').remove()

    // add labels into their new positions
    svg.selectAll('text.categoryLabelPrev')
      .data(newPositions)
      .join('text')
      .attr('class', 'categoryLabelPrev')
      .attr('y', (d) => Math.round(d.y))
      .attr('x', x(columns[columns.length - 2])-config.essential.circleRadius-5)
      .attr("text-anchor","end")
      // .attr('dx', "px")
      .attr('dy', "6px")
      // .text((d) => d.datum.label)
      .text(function(d){
        return d.datum.label + "  (" + d3.format(",.0f")(d.datum.value)
        //(d.datum.value/1000)+",000)"
        // return d.datum.label
      })
      .call(wrap, margin.left - 10)
      // .call(bold)
  }

  function createCurrentLabels(){
    // // Add in the line labels
    series.selectAll('text.categoryLabel')
      .data(d => d[1].filter(d => d.category == columns[columns.length - 1]))
      .join('text')
      .attr('class', 'categoryLabel')
      .attr('x', x(columns[columns.length - 1]))
      .attr('y', (d) => y(d.rank))
      .text(function(d){
        return d.name + "  (" + d3.format(",.0f")(d.value)
        d3.format("0,000")
        //(d.value/1000)+",000)"
        // return d.name
      })
      // .text((d) => d.name + " - " + d3.format(",.0f")(d.value/1000))
      .call(wrap, margin.right - 20)


    // create new array from labels and select particular attributes
    labels = Array.from(d3.selectAll('.categoryLabel')._groups[0]).map(function(d) {
      bbox = d.getBBox()
      return {
        targetY: +d3.select(d).attr('y'),
        label: d.__data__.name,
        height: bbox.height,
        value: d.__data__.value
      }
    })
    // Use James T's code to get new positions
    newPositions = positionLabels(labels, y.range().reverse, d => d.targetY, d => d.height, d => d.value);

    // remove existing labels
    d3.selectAll('text.categoryLabel').remove()

    // add labels into their new positions
    svg.selectAll('text.categoryLabel')
      .data(newPositions)
      .join('text')
      .attr('class', 'categoryLabel')
      .attr('y', (d) => Math.round(d.y))
      .attr('x', x(columns[columns.length - 1]))
      .attr('dx', "19px")
      .attr('dy', "6px")
      // .text((d) => d.datum.label)
      // .text(function(d){
      //   return d.datum.label + "  (" + d3.format(",.0f")(d.datum.value)
        //(d.datum.value/1000)+",000)"
        // return d.datum.label
      //})
      .text( function (d){
        //return d.datum.label +  "  (" + (d.datum.value/1000)+"00)"
        //Math.round(d.datum.value/1000)*100 +")";

        return d.datum.label + "  (" + d3.format(",")(d.datum.value) + ")"
    
      })


      .call(wrap, margin.right - 20)
      // .call(bold)
    }

  // svg.append("line")
  //   .attr("y1",y(config.optional.rankCutOff))
  //   .attr("y2",y(config.optional.rankCutOff))
  //   .attr("x1",x(columns[0]) - config.essential.circleRadius)
  //   .attr("x2",x(columns[1]) + config.essential.circleRadius)
  //   .attr("stroke","#707070")
  //   .attr("stroke-width",2)
  //   .attr("stroke-dasharray","5 5")

  // svg.append("text")
  // .attr("x",x(columns[1]) + config.essential.circleRadius+5)
  // .attr("y",y(config.optional.rankCutOff))
  // .attr("dy",y.bandwidth() + 5)
  // .attr("class","divider-text")
  // .text(function(){
  //   return "Top "+ config.optional.rankCutOff
  // })



  //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

// This is from bostock's notebook https://observablehq.com/d/ac2a320cf2b0adc4
// which is turn comes from this thread on wide to long data https://github.com/d3/d3-array/issues/142
function* pivot(data, columns, name, value, opts) {
  const keepCols = columns ?
    data.columns.filter(c => !columns.includes(c)) :
    data.columns;
  for (const col of columns) {
    for (const d of data) {
      const row = {};
      keepCols.forEach(c => {
        row[c] = d[c];
      });
      // TODO, add an option to ignore if fails a truth test to approximate `values_drop_na`
      row[name] = col;
      row[value] = d[col];
      yield row;
    }
  }
}

function bold(text) {
  text.each(function() {
    var text = d3.select(this)
    words = text.text().split(/\s+/)
    var x = text.attr("x")
    text.text("")
    words.forEach(function(word, i){
      text.append("tspan").text(word + " ")
        .attr("font-weight",function(){
          if(i >= words.length-1){
            return "400"
          }
          else{
            return "600"
          }
      })
    })
  })
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      x = text.attr("x"),
      dx = text.attr('dx'),
      tspan = text.text(null).append("tspan").attr('x', x);
    while (word = words.pop()) {
      var number = "0"
      var extra = 0
      if(word.includes("(") == false){
        line.push(word);
      } else{
        var number = word
      }
      tspan.text(line.join(" "))
      if (number != "0"){
        numbertspan = text.append("tspan").attr("class","number").text(" "+number).attr("font-weight",400)
        if (tspan.node().getComputedTextLength()+numbertspan.node().getComputedTextLength() > width) {
          numbertspan.remove()
          tspan = text.append("tspan").attr('x', x).attr('dx', dx).attr("dy", lineHeight + "em").text(number);
          tspan.attr("font-weight",400)
          extra = 1
        }
      }
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr('x', x).attr('dx', dx).attr("dy", lineHeight + "em").text(word);
      }
    }
    var breaks = text.selectAll("tspan").size();
    if(extra > 0){
      breaks = breaks + 1
    }
    text.attr("y", function() {
        return +y + -6 * (breaks - 1) + 6
    });
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
