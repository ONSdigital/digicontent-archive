var graphic2 = d3.select('#graphic2');
var dropdown = d3.select("#dropdown");
var legend = d3.select("#legend");

var pymChild = null;

function drawGraphic(width) {

  // clear out existing graphics
  graphic2.selectAll("*").remove();

  //get the breakpoints from the config
  var threshold_md = dvc.optional.mediumBreakpoint;
  var threshold_sm = dvc.optional.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic2.style("width")) < threshold_sm) {
    size = "sm";
    graphic2.style('max-width','100%')
  } else if (parseInt(graphic2.style("width")) < threshold_md) {
    size = "md";
    graphic2.style('max-width','50%')
    graphic2.style('float','right')
  } else {
    size = "lg";
    graphic2.style('max-width','50%')
    graphic2.style('float','right')
  }

  var margin = dvc.optional.margin[size];
  var chart_width = parseInt(graphic2.style("width")) - margin.left - margin.right;
  var height = Math.ceil((chart_width * dvc.optional.aspectRatio[size][1]) / dvc.optional.aspectRatio[size][0]);



  //set up scales
  var x = d3.scaleTime()
    .range([0, chart_width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

  x.domain(d3.extent(graphic_data, function(d) {
    return d.date;
  }));

  var xAxis = d3.axisBottom(x)
    .tickValues(graphic_data.map(function(d) {
      return d.date;
    }).filter(function(d, i) {
      var ticksEvery = dvc.optional.x_ticks_every[size];
      return i % ticksEvery === 0 && i < graphic_data.length - ticksEvery || i == graphic_data.length - 1; //Rob's fussy comment about labelling the last date
    }))
    .tickFormat(d3.timeFormat("%b-%Y"))
    .tickPadding(5);


  var yAxis = d3.axisLeft(y)
    .tickFormat(function(d) {
      return d * 100;
    })
    .tickSize(-chart_width);


  //suggest number or ticks on y axis
  yAxis.ticks(dvc.optional.y_num_ticks[size])

  // parse data into columns
  var lines = {};
  for (var column in graphic_data[0]) {
    if (column == 'date') continue;
    lines[column] = graphic_data.map(function(d) {
      return {
        'date': d.date,
        'amt': d[column]
      };
    });
  }


  //define line generator
  var line = d3.line()
    .defined(function(d) {
      return d.amt !== '0'; // this will not draw the line if the value is 0
    })
    .curve(d3.curveLinear)
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.amt);
    });




  // do some code to overwrite blanks with the last known point
  var counter;

  keys = d3.keys(lines)
  for (i = 0; i < keys.length; i++) {
    // console.log(lines[keys[i]])
    lines[keys[i]].forEach(function(d, j) {
      if (d.amt != "") {
        counter = j;
      } else {
        d.date = lines[keys[i]][counter].date
        d.amt = lines[keys[i]][counter].amt
      }

    })

  }


  //y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
  if (dvc.essential.yAxisScale == "auto_zero_max") {
    var yDomain = [
      0,
      d3.max(d3.entries(lines), function(c) {
        return d3.max(c.value, function(v) {
          var n = v.amt;
          return Math.ceil(n);
        });
      })
    ];
  } else if (dvc.essential.yAxisScale == "auto_min_max") {
    var yDomain = [
      d3.min(d3.entries(lines), function(c) {
        return d3.min(c.value, function(v) {
          var n = v.amt;
          return Math.floor(n);
        });
      }),

      d3.max(d3.entries(lines), function(c) {
        return d3.max(c.value, function(v) {
          var n = v.amt;
          return Math.ceil(n);
        });
      })
    ];
  } else {
    var yDomain = dvc.essential.yAxisScale;
  }

  y.domain(yDomain);

  //create svg for chart
  var svg = d3.select('#graphic2').append('svg')
    .attr("id", "chart")
    .style("background-color", "#fff")
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) //+30)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("rect")
    .style("fill", "#fff")
    .attr("width", chart_width)
    .attr("height", height);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  //y axis label
  svg.append("text")
    //.attr('class', 'unit')
    .attr('transform', 'translate(' + -margin.left + ',-15)') // " + eval(-margin.top + (lineNo+1)*20) + "
    .attr("font-size", "14px")
    .attr("fill", "#666")
    .text(function(d, i) {
      return dvc.essential.yAxisLabel
    });

  //create x axis, if y axis doesn't start at 0 drop x axis accordingly
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', function(d) {
      if (yDomain[0] != 0) {
        return 'translate(0,' + (height + 30) + ')'
      } else {
        return 'translate(0,' + height + ')'
      }
    })
    .call(xAxis);


  //create background lines
  svg.append('g').selectAll('path')
    .data(d3.entries(lines))
    .enter()
    .append('path')
    .attr('class', function(d, i) {
      return 'backlines'
    })
    .style("stroke", "#e7e7e7")
    .style("stroke-width", 2)
    .style("stroke-linecap", 'round')
    .style("stroke-linejoin", 'round')
    .attr('d', function(d) {
      return line(d.value);
    });

  //create top layer lines
  svg.append('g').selectAll('path')
    .data(d3.entries(lines))
    .enter()
    .append('path')
    .attr('class', function(d, i) {
      return 'frontlines frontlines' + d.key.replace(/ /g, '');
    })
    .attr("data-last", function(d) {
      return d.value[d.value.length - 1].amt
    })
    .attr("data-date", function(d) {
      return d3.timeFormat("%d %B %Y")(d.value[d.value.length - 1].date)
    })
    .style("stroke", "#D2376D")
    .style("fill", 'none')
    .style("opacity", 0)
    .style("stroke-width", 2)
    .style("stroke-linecap", 'round')
    .style("stroke-linejoin", 'round')
    .attr('d', function(d) {
      return line(d.value);
    });

  //create reference line
  if (dvc.optional.referenceline.display) {
    svg.append('g').selectAll('path')
      .data(d3.entries(lines).filter(function(d) {
        return d.key == dvc.optional.referenceline.series
      }))
      .enter()
      .append('path')
      .attr('class', function(d, i) {
        return 'reflines'
      })
      .style("stroke", dvc.optional.referenceline.colour)
      .style("opacity", 1)
      .style("stroke-width", 2)
      .style("stroke-linecap", 'round')
      .style("stroke-linejoin", 'round')
      .attr('d', function(d) {
        return line(d.value);
      });
  }

  //create link to source
  d3.select('#source')
    .text('Source: ' + dvc.essential.sourceText);

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
} // ends draw graphic


//check whether browser can cope with svg
if (Modernizr.svg) {
  //load chart data
  d3.csv("data2.csv", function(error, data) {
    graphic_data = data;
    //reformat date column as date objects
    graphic_data.forEach(function(d) {
      d.date = d3.timeParse(dvc.essential.dateFormat)(d.date);

    });

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
} else {
  //use pym to create iframe containing fallback image (which is set as default)
  pymChild = new pym.Child();
  if (pymChild) {
    pymChild.sendHeight();
  }
}
