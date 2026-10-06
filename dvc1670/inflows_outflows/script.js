var graphic = d3.select('#graphic');
var graphic2 = d3.select('#graphic2');
var dropdown = d3.select("#dropdown");
var legend = d3.select("#legend");

var pymChild = null;

function drawGraphic(width) {

  // clear out existing graphics
  graphic.selectAll("*").remove();
  graphic2.selectAll("*").remove();
  dropdown.selectAll("*").remove();
  legend.selectAll("*").remove();

  //set up a legend
  item = legend.selectAll('div.legenditem')
  .data(d3.zip(dvc.essential.legendLabels,dvc.essential.colour_palette))
  .enter()
  .append('div')
  .attr('class','legenditem')
  .style('display','flex')

  item.append('div')
  .attr('class','square')
  .style('background-color',function(d){return d[1]})

  item.append('p')
  .text(function(d){return d[0]})


  //set up the dropdown and make it a chosen dropdown
  // select = dropdown.attr('class','dropdown').append('select').attr('id', "select").attr("class", "chosen-select");
  // select.insert('label')
  //   .attr('class', 'visuallyhidden')
  //   .attr('for', 'select')
  //   .text("This input has been hidden and replaced with another more useable input");
  //
  // select.append('option').property('selected', true).property('disabled', true).text("Select an occupation");
  // select.selectAll('option .options')
  //   .data(graphic_data.columns.slice(dvc.optional.referenceline.display ? 3 : 1))
  //   .enter()
  //   .append('option')
  //   .attr('value', function(d) {
  //     return d.replace(/ /g, "");
  //   })
  //   .text(function(d) {
  //     return d;
  //   });
  //
  // $('#select').chosen({
  //   allow_single_deselect: true,
  //   disable_search: true,
  //   width:"99%"
  // }).on('change',function(evt,params){
  //   revealline(params.selected)
  // });
  //
  // // add a label to the input for accessibility reasons
  // d3.select(".chosen-drop").select("input").attr("id", "chosensearchinput");
  //
  // d3.select(".chosen-drop").select("div.chosen-search")
  //   .insert("label", "input.chosen-search-input")
  //   .attr("class", "visuallyhidden")
  //   .attr("for", "chosensearchinput")
  //   .html("Choose an area");

  createDropdown(graphic_data)

  //get the breakpoints from the config
  var threshold_md = dvc.optional.mediumBreakpoint;
  var threshold_sm = dvc.optional.mobileBreakpoint;

  charts = d3.map(graphic_data, function(d){return d.category;}).keys()

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
    // graphic.style('max-width','100%')
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
    // graphic.style('max-width','100%')
  } else {
    size = "lg"
    // graphic.style('max-width','50%')
    // graphic.style('float','left')
  }

  var margin = dvc.optional.margin[size];
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  var height = Math.ceil((chart_width * dvc.optional.aspectRatio[size][1]) / dvc.optional.aspectRatio[size][0]);

  //set up scales
  var x = d3.scaleTime()

  if (size == "sm" | size == "md"){
    x.range([0, chart_width]);
  }
  else{
    x.range([0, (chart_width/2)-margin.left]);
  }

  var y = d3.scaleLinear()
    .range([height+60, 0]);

  x.domain(d3.extent(graphic_data, function(d) {
    return d.date;
  }));

  var xAxis = d3.axisBottom(x)
    // .tickValues(graphic_data.map(function(d) {
    //   return d.date;
    // }).filter(function(d, i) {
    //   var ticksEvery = dvc.optional.x_ticks_every[size];
    //   return i % ticksEvery === 0 && i < graphic_data.length - ticksEvery || i == graphic_data.length - 1; //Rob's fussy comment about labelling the last date
    // }))
    .tickFormat(d3.timeFormat("%b-%Y"))
    .tickPadding(5)

  if (parseInt(graphic.style("width")) >= threshold_sm){
    xAxis.tickValues([new Date(2016,5,1), new Date(2017,5,1), new Date(2018,5,1), new Date(2019,5,1), new Date(2020,5,1), new Date(2021,5,1)])
  }
  else{
    xAxis.tickValues([new Date(2016,5,1), new Date(2021,5,1)])
  }



  var yAxis = d3.axisLeft(y)
    .tickFormat(function(d) {
      return d * 100;
    })


  //suggest number or ticks on y axis
  yAxis.ticks(dvc.optional.y_num_ticks[size])

  charts.forEach(function(chart){

  filtereddata = graphic_data.filter(function(d){return d.category == chart})

  // parse data into columns
  var lines = {};
  for (var column in filtereddata[0]) {
    if (column == 'date' | column == "category") continue;
    lines[column] = filtereddata.map(function(d) {
      return {
        'date': d.date,
        'amt': d[column]
      };
    });
  }

    if (size == "sm" | size == "md"){
      yAxis.tickSize(-chart_width)
    }
    else{
      yAxis.tickSize((-chart_width+margin.right+margin.left)/2)
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
  var svg = d3.select('#graphic').append('svg')
    .attr("id", "chart")
    .style("background-color", "#fff")
    .attr("width", function(d){
      if (size == "sm" | size == "md"){
        return chart_width + margin.left + margin.right
      }
      else{
        return (chart_width + margin.left + margin.right)/2
      }
    })
    .attr("height", height + margin.top + margin.bottom+60)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("rect")
    .style("fill", "#fff")
    .attr("width", chart_width)
    .attr("height", height);


  svg.append('g')
    .attr('class','chartlabel')
    .attr('transform','translate('+(-margin.right)+','+(30-margin.top)+')')
    .append('text')
    .text(function(d){
      if (chart == "Inflows"){
        return "Entered the workforce"
      }
      else{
        return "Left the workforce"
      }
    })


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
      // if (yDomain[0] != 0) {
      //   return 'translate(0,' + (height + 30) + ')'
      // } else {
        return 'translate(0,' + (height+60) + ')'
      // }
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
  })

  function revealline(selection) {
    t=d3.transition().duration(500)

    d3.selectAll(".frontlines")
      .transition(t)
      .style("opacity", 0)
    d3.selectAll(".frontlines" + selection.replace(/ /g,""))
      .raise()
      .transition(t)
      .style("opacity", 1)


    current_value = d3.select(".frontlines" + selection.replace(/ /g,"")).node().getAttribute("data-last")
    current_year = d3.select(".frontlines" + selection.replace(/ /g,"")).node().getAttribute("data-date")
    current_area = selection

    d3.select("#infohidden").text("On " + current_year + " in " + selection + " the most recent index value was " + current_value + ". The index is based on "+dvc.essential.yAxisLabel+".")
  }
  //create link to source
  d3.select('#source')
    .text('Source: ' + dvc.essential.sourceText);

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
} // ends draw graphic


  function revealline(selection) {
    t=d3.transition().duration(500)

    d3.selectAll(".frontlines")
      .transition(t)
      .style("opacity", 0)
    d3.selectAll(".frontlines" + selection.replace(/ /g,""))
      .raise()
      .transition(t)
      .style("opacity", 1)


    current_value = d3.select(".frontlines" + selection.replace(/ /g,"")).node().getAttribute("data-last")
    current_year = d3.select(".frontlines" + selection.replace(/ /g,"")).node().getAttribute("data-date")
    current_area = selection

    d3.select("#infohidden").text("On " + current_year + " in " + selection + " the most recent index value was " + current_value + ". The index is based on "+dvc.essential.yAxisLabel+".")
  }

  function createDropdown(graphic_data) {
    var menuarea = graphic_data.columns.slice(dvc.optional.referenceline.display ? 3 : 1)

    //clear dropdown
    d3.select("#dropdown").selectAll("*").remove()

    // Build option menu for dropdown
    var optns = d3.select("#dropdown").append("div").attr("id", "sel").append("select")
      .attr("id", "dropselect")
      .attr("class", "chosen-select");

    optns.append("option") //blank option for placeholder

      optns
        .selectAll("option").data(menuarea)
        .enter()
        .append("option")
        .attr("id", function(d) {
          return d.replace(/[,.' ]/g, "").trim()
        })
        .attr("value", function(d) {
          return d
        })
        .text(function(d) {
          return d
        });

    $('#dropselect').chosen({
      width: "98%",
      allow_single_deselect: true,
      placeholder_text_single: "Choose an occupation"
    }).on('change', function(evt, params) {
      if (typeof params != 'undefined') {
        // areaLocked = true;
        // disableMouseover();
        revealline(params.selected);
        addClearBehaviour();
      }else{
        hideline()
      }
    });

    //label for option
    d3.select('input.chosen-search-input').attr('id', 'chosensearchinput')
    d3.select('div.chosen-search').insert('label', 'input.chosen-search-input').attr('class', 'visuallyhidden').attr('for', 'chosensearchinput').html("Type to select an area")

  } //end createDropdown

  function addClearBehaviour() {
    d3.select('abbr').on('keypress', function() {
      if (d3.event.keyCode == 13 || d3.event.keyCode == 32) {
        d3.event.preventDefault();
        //clear behaviour
        hideline();
        // mouseOff(circleRadius);
        // enableMouseover();
        $('#dropselect').val("").trigger('chosen:updated')
      }
    })
  }

  function hideline() {
    t=d3.transition().duration(500)

    d3.selectAll(".frontlines")
      .transition(t)
      .style("opacity", 0)

    d3.select("#infohidden").text("")
  }


//check whether browser can cope with svg
if (Modernizr.svg) {
  //load chart data
  d3.csv("data.csv", function(error, data) {
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
