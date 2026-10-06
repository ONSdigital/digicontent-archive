// https://bl.ocks.org/mbostock/1341021


pymChild = new pym.Child();
// global variables that hold data
var prices;
var clickValue;
var country;

var margin = {top: 180, right: 20, bottom: 20, left: 30},
    width = document.getElementById('chart').clientWidth-margin.left - margin.right,
    height = 290;


var x = d3.scaleBand().rangeRound([0,width]).padding(0.2);
var y = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function draw () {

  // delete falback image
  d3.select('#fallback').remove();

  // changing string to integers for the colour scale
  var columns = d3.keys(prices[0])
  prices.forEach(function(d) {
    for (i = 0; i < columns.length; i++) {
      if (columns[i] === 'name') { continue }
      else {d[columns[i]] = +d[columns[i]]
}
    }

  })

  // pushing the values to an array to get overall min and max for scale
  var values = [];

  prices.forEach(function(d) {
    for (i = 0; i < columns.length; i++) {
      if (columns[i] === 'name') { continue }
      else {values.push(d[columns[i]])
}
    }

  })

  // calculate the min and max for the colour scale domain
  var max = d3.max(prices, function(d) { return d[columns[1]]});

  var min = d3.min(prices, function(d) { return d[columns[1]]});

  var max_val = d3.max(values);

  var min_val = d3.min(values);

  // colour scale for the lines
  var colourScale = d3.scaleLinear()
        .domain([min, max])
        .range(["#aa6ac7", "#79cf70"])
        .interpolate(d3.interpolateLab);

  // Extract the list of dimensions and create a scale for each.
  dimensions = d3.keys(prices[0]).filter(function(d) {
    return d != "name" && (y[d] = d3.scaleLinear()
        .domain([min_val-7, max_val+5])
        .range([height,0]));
  });
  x.domain(dimensions);

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(prices)
    .enter().append("path")
      .attr("id", function(d) { return d.name.replace(/\s/g,'').replace('.','').replace(',','').replace("-",'').replace(";",'').replace("'",'').replace("-",'') })
      .attr("d", path)
      .style('stroke', 'none')
      // .style('pointer-events', 'stroke')
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 20; }
      })
      // .style('fill', 'none');

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(prices)
    .enter().append("path")
      .attr("id", function(d) { return d.name.replace(/\s/g,'').replace('.','').replace(',','').replace("-",'').replace(";",'').replace("'",'').replace("-",'') })
      .style("stroke", function(d) {
        if (d[columns[0]] === "United Kingdom") {
          return "#515151";
        } else {
        // return colourScale(d[columns[1]]);
        return "#ccc";}
      })
      // .style('stroke-opacity', 0.9)
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 1.5; }
      })
      .style('fill', 'none')
      // .style('stroke-width', '1.5px')
      .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .attr("id", function(d,i) { return i})
      .each(function(d,i) {
        if (i===0) {
          d3.select(this).call(axis.scale(y[d]))

        } else {
          d3.select(this).call(axis.scale(y[d]).tickFormat(''))
        }
      })
    .append("text")
      // .attr('id', function(d,i) { return i })
      .style("text-anchor", "start")
      // .style('font-size', '16px')
      .attr("x", -2)
      .attr('y', function (d,i) { return ((i*22)-165)})
      .text(function(d) { return d; });

// lines for axis labels
  g.append('line')
    .each(function(d) {d3.select(this)})
    .style('stroke', '#D9D9D9')
    .style('stroke-width', 0.5)
    .attr('x', 0)
    .attr('y2', function (d,i) { return ((i*22)-160)})
    .attr('y', height);

  // var element = d3.select('.foreground').node();
  // var chart_width = element.getBoundingClientRect().width

  var y_average = d3.scaleLinear().range([height, 0]);
  var x_average = d3.scaleLinear().range([0, width]);

// % sign for the ticks
  svg.append('text')
      .attr('class', 'ticks_label')
      .attr('x', x_average(-0.01))
      .attr('y', y_average(1.05))
      .text('%');


// line for Europe
  svg.append('line')
      .attr('class', 'average')
      .attr("stroke", "#807c7c")
      .attr("stroke-width", 3)
      .style("stroke-dasharray", "8,2")
      .attr('y1',y_average(0.3333))
      .attr('y2',y_average(0.3333))
      .attr('x1',x_average(0.027))
      .attr('x2',x_average(0.875))

  svg.append('text')
      .attr('class', 'average_text')
      .attr('x', x_average(0.88))
      .attr('y', y_average(0.35))
      .text('EU');

  svg.append('text')
      .attr('class', 'average_text')
      .attr('x', x_average(0.88))
      .attr('y', y_average(0.29))
      .text('average');

  svg.append('text')
      .attr('class', 'uk_text')
      .attr('x', x_average(0.88))
      .attr('y', y_average(0.76))
      .text('UK');
      // move uk to front
      d3.select('.foreground path#UnitedKingdom').each(moveToFront);

  // select paths for mouseover interaction
  var projection_back = svg.selectAll(".background path");
  var projection_fore = svg.selectAll(".foreground path");

  projection_back
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  projection_fore
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);


  // Create a chosen drop down to show the list of occupations

  allOcc = [];
  //Create an array for each occupation title

  var codeoccyzip = prices.forEach(function(d,i){
    if (prices[i].name !== "United Kingdom"){
      allOcc.push(prices[i].name);}
  });

  // sort occupation list alphabetically - not working with
  // allOcc= allOcc.sort(function(a){ return d3.ascending(a[0])});
d3.select('#chosen-select').selectAll("*").remove();
  // Build option menu for occupations
  var optns = d3.select("#chosen-select").append("div").attr("id","sel").append("select")
    .attr("id","lineselect")
    // .attr("style","width:62%")
    .style("margin-bottom","20px");
    // .attr("class","chosen-ch");

  //append message
  optns.append("option")
    .attr("value","first")
    .text("");

  optns.selectAll("p").data(allOcc).enter().append("option")
    .attr("value", function(d){ return d.replace(/\s/g,'').replace('.','').replace(',','').replace("-",'').replace(";",'').replace("'",'').replace("-",'');})
    .attr("class", function(d){ return d.replace(/\s/g,'').replace('.','').replace(',','').replace("-",'').replace(";",'').replace("'",'').replace("-",'');})
    .text(function(d){ return d});


  // // Little function to bring objects to the front
  // d3.selection.prototype.moveToFront = function() {
  //   return this.each(function() {
  //   this.parentNode.appendChild(this)
  //   });
  // };

  $('#lineselect').chosen({allow_single_deselect:true, placeholder_text_single:"Choose your country"}).on('change', function() {
    clickValue = this.value;
    if (clickValue !== 'first') {
      country = clickValue.replace(/\s/g,'').replace('.','').replace(',','').replace("-",'').replace(";",'').replace("'",'').replace("-",'');
      filterData = prices.filter(function(d) { return d.name.replace(/\s/g,'').replace('.','').replace(',','').replace("-",'').replace(";",'').replace("'",'').replace("-",'') === clickValue })[0];
      d3.select(".foreground").selectAll("path").style("pointer-events","none");
      d3.select(".background").selectAll("path").style("pointer-events","none");
      mouseover(filterData);
    } else {
      // d3.select(".foreground").selectAll("path").style("pointer-events","stroke");
      d3.select(".background").selectAll("path").style("pointer-events","stroke");
      d3.select("#text").html("");
      projection_back.classed("active", false);
      projection_fore.classed("active", false);

      projection_back.classed("inactive", false);
      projection_fore.classed("inactive", false);

    }
  })

  function mouseover(d) {
    projection_fore.classed("active", true);
    projection_back.classed("active", true);
    // var uk_fore = d3.select('.foreground path#UnitedKingdom');
    // var uk_back = d3.select('.background path#UnitedKingdom');


    projection_back.classed("inactive", function(p) { return p !== d; })
      .style("stroke", function(d) {
        if (d[columns[0]] === "United Kingdom") {
          return "#515151";
        } else {
        return "none";}
        // return "#ccc";}
      })
      // .style('stroke-opacity', 0.5)
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 20; }
      });

    projection_fore.classed("inactive", function(p) { return p !== d; })
      .style("stroke", function(d) {
        if (d[columns[0]] === "United Kingdom") {
          return "#515151";
        } else {
        return "#ccc";}
        // return "#ccc";}
      })
      // .style('stroke-opacity', 0.5)
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 1.5; }
      });

    // projection_fore.select('.UnitedKingdom').moveToFront();
    projection_fore.filter(function(p) { return p === d; }).each(moveToFront)
      .style("stroke", function(d) {
        if (d[columns[0]] === "United Kingdom") {
          return "#515151";
        } else {
        return colourScale(d[columns[1]]);}
        // return "#ccc";}
      })
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 3; }
      });





    // projection_back.filter(function(p) { return p === d; }).each(moveToFront)
    //   .style("stroke", function(d) {
    //     if (d[columns[0]] === "United Kingdom") {
    //       return "black";
    //     } else {
    //     return "none";}
    //     // return "#ccc";}
    //   });
      // .style('stroke-opacity', 0.9)
      // .style('stroke-width', function (d) {
      //   if (d[columns[0]] === "United Kingdom") {
      //     return 5.5;
      //   } else { return 3; }
      // });

    // d3.select("#text").html(d.name);
    // d3.select('.foreground').select("path#UnitedKingdom").moveToFront();
    // d3.select('.background').select("path#UnitedKingdom").moveToFront();
    try {
      var selectedValue = d3.select(this).attr("id");
      $('#lineselect').val(selectedValue);
      $('#lineselect').trigger("chosen:updated")

    }
    catch (e) {}
  }

  function mouseout(d) {

    d3.select('.foreground path#UnitedKingdom').each(moveToFront);

    projection_fore.classed("active", false)
      .style("stroke", function(d) {
        if (d[columns[0]] === "United Kingdom") {
          return "#515151";
        } else {
        return "#ccc";}
        // return "#ccc";}
      })
      // .style('stroke-opacity', 0.5)
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 1.5; }
      });

    projection_back.classed("active", false)
      .style("stroke", 'none')
      // .style('stroke-opacity', 0.5)
      .style('stroke-width', function (d) {
        if (d[columns[0]] === "United Kingdom") {
          return 3;
        } else { return 20; }
      });

    projection_fore.classed("inactive", false);
    projection_back.classed("inactive", false);

    $('#lineselect').val("Choose your area");
    $('#lineselect').trigger("chosen:updated");
    // d3.select("#text").html("");


  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }

  if (pymChild) {
    pymChild.sendHeight();
  }


};

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}


if (Modernizr.svg) {
  d3.csv('data.csv', function(error, data) {
    prices = data;
    pymChild = new pym.Child({ renderCallback: draw});
    // options();
  });
} else {

  pymChild.senHeight();

}
