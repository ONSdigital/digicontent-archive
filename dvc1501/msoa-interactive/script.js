var graphic = d3.select('#graphic');
var svg = graphic.select("svg");
var chart = svg.select("g#chart");
var pymChild = null;
var size = "";
var currentWaveNumber = null;
var boundaryData = null;
var centroids = null;
var path = d3.geoPath();
var spikeWidthScaling = 6/700;
var spikeHeightScaling = 3/700;
var spikeLine = d3.line();
var spikeColours = {
  1: "#56C0E6",
  2: "#F4A858"
}
var outlineColours = {
  1: "#004862",
  2: "#5A2E00"
}
var old_lacd = null;
var old_msoacd = null;
var msoasNeedingDeselect = [];
var legendDrawn = false;
var centreLat = 50.917;
var centreLng = -1.12;
var timeParse = d3.timeParse("%B %Y");
var covid_data;
var noncovid_data;
var average_data;

function drawGraphic() {

  function onSearch() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    searchPostcodesIO(d3.select(".search-control").node().value);
  }

  d3.select(".search-control").on("keydown", function() {
    if (d3.event.keyCode === 13) {
      onSearch();
    }
  });
  //if you click on the search icon, find the postcode
  d3.select("#submitPost").on("click", function(event) {
    onSearch();
  });

  //if you focus on the search icon and push space or enter
  d3.select("#submitPost").on("keydown", function() {
    if (d3.event.keyCode === 13 || d3.event.keyCode === 32) {
      onSearch();
    }
  });

  // set an area to default to. If you remove this, set selectMapArea to true
  // searchPostcodesIO("PO15 5RR");

  function searchPostcodesIO(postcode) {
    // show the remove cross
    d3.select(".search-control").append("abbr").attr("class", "postcode");

    var myURIstring = encodeURI("https://api.postcodes.io/postcodes/" + postcode);
    $.support.cors = true;
    $.ajax({
      type: "GET",
      crossDomain: true,
      dataType: "jsonp",
      url: myURIstring,
      error: function(xhr, ajaxOptions, thrownError) {
        d3.select("#pcErrorText").text("Sorry, that's not a valid postcode.");
        d3.select("#pcError").classed("incorrect", true);
      },
      success: function(data1) {

        if (data1.status == 200) {
          if (["Scotland", "Northern Ireland"].indexOf(data1.result.country) > -1) {
            d3.select("#pcErrorText").text("Sorry, data is only available for England and Wales.")
            d3.select("#pcError").classed("incorrect", true);
            return
          }
          d3.select("#pcErrorText").text("")
          d3.select("#pcError").classed("incorrect", false);

          postcode_lacd = data1.result.codes.admin_district;
          postcode_msoacd = data1.result.codes.msoa;
          if (postcode_msoacd != old_msoacd) {
            redraw(postcode_lacd, postcode_msoacd);
            old_msoacd = postcode_msoacd;
          }
          // if (postcode_lacd != old_lacd) {
          //   redraw(postcode_lacd, postcode_msoacd);
          //   old_lacd = postcode_lacd;
          // } else {
          //   selectOnMap(postcode_msoacd)
          // }
        } else {
          // TODO: give response to bad postcode
          d3.select("#keyvalue").text("Enter a valid postcode");
          d3.select("#screenreadertext").text("Enter a valid postcode");
        }
      }

    });
  }

  function redraw(postcode_lacd, postcode_msoacd) {
    var selectedLA = "test";
    // wipe map
    wipeMap();
    // load msoa boundaries, msoa centroids, spike data
    d3.queue()
      .defer(d3.csv, "data/csvs_by_la/" + postcode_lacd + ".csv")
      .defer(d3.csv, "data/msoanm_lookup.csv")
      .await(ready);
  }

  function ready(evt, data, msoanm_lookup) {//, geog) {
    // filter LA data for our specific msoa
    msoa_data = data.filter(function(d) { return d.msoacd == postcode_msoacd });
    // separate out the data into different objects
    covid_data = msoa_data.filter(function(d) { return d.group == 'covid'});
    noncovid_data = msoa_data.filter(function(d) { return d.group == 'noncovid'});
    average_data = msoa_data.filter(function(d) { return d.group == 'average'});
    if (!legendDrawn) {
      drawLegend();
      legendDrawn = true;
    }

    var timePeriodStrings = [];
    var timePeriodDates = [];
    initialiseData();
    updateDisplayName();
    setScales();
    drawChart();
    writeAnnotation();
    writeSource();
    pymChild.sendHeight();

    function drawLegend() {

      var prevX = 0;
      var prevY = 0;
      lineNo = 0;
      var lineNoOld = 0;

      dvc.essential.legend_labels.forEach(function(d, i) {

        // draw legend text based on content of var legend_labels ...
        var_group = svg.select("#legend");

        if (i==2) {
          var_group.append("line")
            .attr("class", "average rect" + i)
            .attr("stroke", dvc.optional.colour_palette[i])
            .attr("x1", 0)
            .attr("x2", 15)
            .attr("y1", 0)
            .attr("y2", 0)
        } else {
          var_group.append("rect")
            .attr("class", "rect" + i)
            .attr("fill", dvc.optional.colour_palette[i])
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
        }

        var_group.append("text")
          .text(dvc.essential.legend_labels[i])
          .attr("class", "legend" + i)
          .attr("text-anchor", "start")
          // .style("font-size", "12px")
          .style("fill", "#666")
          .attr('y', 15)
          .attr('x', 0);


        d3.selectAll(".legend" + (i))
          .each(calcPosition);

        function calcPosition() {


          var BBox = this.getBBox()


          //prevY =BBox.width
          d3.select(".legend" + (i))
            .attr("y", function(d) {
              if ((prevX + BBox.width + 50) > parseInt(graphic.style("width"))) {
                lineNoOld = lineNo;
                lineNo = lineNo + 1;
                prevX = 0;
              }
              return eval((lineNo * 20) + 20);
            })
            .attr("x", function(d) {
              return prevX + 25;
            })


          d3.select(".rect" + (i))
            .attr(i==2 ? "y1" : "y", function(d) {

              if ((prevX + BBox.width + 50) > parseInt(graphic.style("width"))) {
                lineNoOld = lineNo;
                lineNo = lineNo + 1;
                prevX = 0;
              }

              if (i==2) {
                return eval((lineNo * 20) + 15);
              } else {
                return eval((lineNo * 20) + 5);

              }
            })
            .attr(i==2 ? "x1" : "x", function(d) {
              return prevX;
            })
            .attr("y2", function() {
              return d3.select(this).attr("y1");
            })
            .attr("x2", function() {
              return i==2 ? +d3.select(this).attr("x1")+15 : null
            })

          prevX = prevX + BBox.width + 50



        }; // end function calcPosition()
      }); // end foreach
    } // end function createLegend()


    function initialiseData() {
      data.columns.forEach(function(column, i) {
        if (["msoacd","msoanm","msoanmhc","group"].indexOf(column) < 0) {
          timePeriodStrings.push(column);
          timePeriodDates.push(timeParse(column));
        };
      });

      areacdToProperties = d3.map(msoanm_lookup, function(d) { return d.msoacd } );

      // width = Math.min(500,parseInt(graphic.style("width")));
      width = parseInt(graphic.style("width"));
      if (width < dvc.optional.breakpoint_sm) {
        size = "sm";
      } else if (width < dvc.optional.breakpoint_md) {
        size = "md";
      } else {
        size = "lg";
      }

      chart_width = width - dvc.optional.margin[size].left - dvc.optional.margin[size].right;
      chart_height = chart_width*dvc.optional.height_width_ratio;
      height = chart_height + dvc.optional.margin[size].top + dvc.optional.margin[size].bottom;


      svg.style("width", width + "px")
        .style("height", height + "px");

      // spikeWidth = spikeWidthScaling*width;
      // spikeHeight = spikeHeightScaling*width;
      //
      // boundaryData = topojson.feature(geog, geog.objects.msoa_boundaries_test);
      // centroids = topojson.feature(geog, geog.objects.msoa_centroids_test).features;
      // centroids = centroids.sort(function(a,b) {return b.geometry.coordinates[1] - a.geometry.coordinates[1] });
      //
      // var mapPadding = 30;
      // projection = d3.geoAlbers()
      //     .center([centreLng, centreLat])
      //     .rotate([0, 0])
      //     .parallels([50, 60])
      //     .fitExtent([[mapPadding,mapPadding],[width-mapPadding, height-mapPadding]], boundaryData)
      //
      // path.projection(projection);

    }

    function updateDisplayName() {
      d3.select("p#msoanmhc")
        .html(
          "Your neighbourhood is" +
          "<br><strong>" + areacdToProperties.get(postcode_msoacd)['msoanmhc'] + "</strong>" +
          "<br>" + areacdToProperties.get(postcode_msoacd)['msoanm']
        )
    }

    function setScales() {
      // set scales
      x = d3.scaleBand()
        .domain(timePeriodDates)
        .range([0, chart_width])
        .paddingInner(0.05);
      y = d3.scaleLinear()
        .domain([0, 50])
        .range([chart_height, 0]);
    }

    function drawChart() {
      // set up area function
      var stack = d3.stack()
        .keys(["noncovid", "covid"])


      var current_data = timePeriodStrings.map(function(string) {
        var timePeriodObject = {
          date: string,
          covid: covid_data[0][string],
          noncovid: noncovid_data[0][string],
          average: average_data[0][string]
        };
        return timePeriodObject
      })

      var stacked_data = stack(current_data);

      // set max of y axis. To do this get last item in stacked_data and get the max of the values at index 1 (top of stacks)
      y.domain([0, d3.max(stacked_data[stacked_data.length-1].map(function(d) { return d[1] }))+3 ]);

      drawAxes();
      function drawAxes() {
        // define axes
        xAxis = d3.axisBottom(x)
          .tickValues(timePeriodDates.filter(function(d,i) { return [0,5,9,13].indexOf(i) > -1 }))//return !((i-1)%4) } ))
          .tickFormat(d3.timeFormat(dvc.optional.tick_format))
          .tickSizeOuter(0);
        yAxis = d3.axisLeft(y)
          .ticks(5); // TODO: are their special cases where this needs to change?
        yGridlines = d3.axisLeft(y)
          .tickSize(-chart_width)
          .ticks(5)
          .tickFormat("");
        // draw axes
        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + dvc.optional.margin[size].left + "," + (chart_height + dvc.optional.margin[size].top) + ")")
          .call(xAxis);
        chart.append("g")
          .attr("transform", "translate(" + dvc.optional.margin[size].left + ", " + dvc.optional.margin[size].top + ")")
          .attr("class", "y axis")
          .call(yAxis);
        // draw gridlines
        chart.append("g")
          .attr("class", "y axis gridlines")
          .attr("transform", "translate(" + dvc.optional.margin[size].left + ", " + dvc.optional.margin[size].top + ")")
          .call(yGridlines);
      }

      // append areas
      var chartArea = chart.append("g")
        .attr("id", "chart-area")
        .attr("transform", "translate(" + dvc.optional.margin[size].left + "," + dvc.optional.margin[size].top + ")")

      var gStack = chartArea.selectAll("g")
        .data(stacked_data)
        .enter()
        .append("g")
        .attr("id", function(d) { return "stack" + d.key })
        .attr("fill", function(d,i) { return dvc.optional.colour_palette[i] });

      gStack.selectAll("rect")
        .data(function(d) { return d })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(timeParse(d.data.date)) })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[1]) })
        .attr("height", function(d) { return y(d[0]) - y(d[1]) })
      // append average lines
      var gLine = chartArea.append("g")
        .attr("id", "lines")
      gLine.selectAll("line.average")
        .data(current_data)
        .enter()
        .append("line")
        .attr("class", "average")
        .attr("x1",function(d){return x(timeParse(d.date))})
        .attr("x2",function(d){return x(timeParse(d.date))+x.bandwidth()})
        .attr("y1",function(d){return y(d.average)})
        .attr("y2",function(d){return y(d.average)})
        // .attr("stroke",dvc.optional.colour_palette[2])
    } // end drawChart

    function writeAnnotation() {
      // calculate excess

      var monthPeriods = [
        ["March 2020", "April 2020", "May 2020", "June 2020", "July 2020"],
        ["September 2020", "October 2020", "November 2020", "December 2020", "January 2021", "February 2021", "March 2021"]
      ];

      // calculate excess deaths
      var excess = monthPeriods.map(function(months) {
        theseMonthsExcess = 0;
        theseMonthsAverage = 0;
        months.forEach(function(month, i) {
          theseMonthsAverage += +average_data[0][month]
          var thisMonthExcess = +covid_data[0][month] + +noncovid_data[0][month] - +average_data[0][month];
          theseMonthsExcess += thisMonthExcess;
        });
        theseMonthsPercExcess = theseMonthsExcess/theseMonthsAverage*100
        return {excess:theseMonthsExcess, percExcess:theseMonthsPercExcess}
      });

      var excessText = excess.map(function(d) {
        // if excess is positive, use "more", otherwise "less"
        var moreOrLess = d.excess > -1 ? "more" : "fewer";
        return '<tspan class="bold">' + Math.abs(d.excess) + '</tspan> ' + moreOrLess + ' deaths (' + (d.percExcess >= 0 ? "+" : "") + Math.round(d.percExcess) + '%) than normal'
      })
      // update text for screen readers
      d3.select("#screenreadertext")
        .text(function() {
          out = "Your neighbourhood is " + areacdToProperties.get(postcode_msoacd)['msoanmhc'] + ". "
          function isItMoreOrLess(i) { return excess[i].excess > -1 ? "more" : "fewer" }
          out += "From March 2020 to July 2020 there were " + excess[0].excess + " " + isItMoreOrLess(0) + " deaths than normal, which was " + (excess[0].percExcess >= 0 ? "+" : "") + Math.round(excess[0].percExcess) + "%. "
          out += "From September 2020 to March 2021 there were " + excess[1].excess + " " + isItMoreOrLess(1) + " deaths than normal, which was " + (excess[1].percExcess >= 0 ? "+" : "") + Math.round(excess[1].percExcess) + "%."
          return out
        })

      annotationData = [
        // end is not inclusive
        {
          "start": "March 2020",
          "end": "August 2020",
          "text": excessText[0]
        },
        {
          "start": "September 2020",
          "end": "April 2021",
          "text": excessText[1]
        }
      ]
      var gAnnotation = svg.select("g#annotations")
        .attr("transform", "translate(" + dvc.optional.margin[size].left + "," + dvc.optional.margin[size].top + ")")

      var update = gAnnotation.selectAll("g")
        .data(annotationData)

      var enter = update.enter()
        .append("g")
        .attr("class", "annotation-group")

      enter.append("rect")
        .each(positionRect);
      enter.append("text")
        .each(updateAnnotationText)

      update.selectAll("rect").data(function() { return d3.select(this).data()});
      update.selectAll("rect")
        .each(positionRect);
      update.selectAll("text").data(function() { return d3.select(this).data()});
      update.selectAll("text")
        .each(updateAnnotationText)

      function positionRect() {
        d3.select(this)
          .attr("x", function(d) { return x(timeParse(d.start)) })
          .attr("y", y.range()[1])
          .attr("width", function(d) { return x(timeParse(d.end)) - x(timeParse(d.start)) })
          .attr("height", chart_height);
      }
      function updateAnnotationText() {
        d3.select(this)
          .attr("transform", function(d) { return "translate(" + x(timeParse(d.start)) + "," + (y.range()[1] - dvc.optional.yAnnotation[size]) + ")" })
          .html(function(d) { return d.text })
          .each(wrap);
      }
    }

    function wrap(text) {
      var textWidth = dvc.optional.text_wrap[size];
      var words = text.text.split(/\s+/).reverse(),
        element = d3.select(this),
        word,
        line = [],
        lineNumber = 0,
        tspan = element.text(null).append("tspan")
      while (word = words.pop()) {
        line.push(word);
        tspan.html(line.join(" "));
        if (tspan.node().getComputedTextLength() > textWidth) {
          if (lineNumber == 0) {
            tspan.attr("dy", -0.2 + "em")
          };
          line.pop();
          tspan.html(line.join(" "));
          line = [word];
          ++lineNumber;
          tspan = element.append("tspan")
            .attr("x",0)
            .attr("dy", +1.1 + "em")
            .html(word);
        }
      }
    }

    function insertLinebreaks() {

       // var str = this;
       el1 = d3.select(this).text();
       var words = el1.split('  ');

       d3.select(this).text('');

       for (var j = 0; j < words.length; j++) {
         var tspan = d3.select(this).append('tspan').text(words[j]);
         if (j > 0)
           tspan
           .attr("x",0)//d3.select(this).attr("x"))
           .attr('dy', '1.1em');
       }
     };

     function writeSource() {
       d3.select('#source')
         .text('Source: ' + dvc.essential.sourceText);
     }
  } // end ready

  function wipeMap() {
    chart.selectAll('*').remove();
  }

  function selectOnMap(postcode_msoacd) {
    // for replicating hover over an MSOA that has been selected without hover
    onMouseover(postcode_msoacd);
    msoasNeedingDeselect.push(postcode_msoacd);
  }

  function onMouseover(msoacd) {
    // before selecting moused over areas, deselect any that need it
    for (i=0; msoasNeedingDeselect.length > 0; i++) {
      var msoaToDeselect = msoasNeedingDeselect.shift();
      onMouseout(msoaToDeselect);
    }
    showHovered(msoacd, true);
    updateTooltip(msoacd);

  }

  function onMouseout(msoacd) {
    showHovered(msoacd, false);
    d3.select("#tooltip").style("display", "none");
  }

  function showHovered(msoacd, isSelected) {
    d3.select("#area" + msoacd)
      .classed("selectedMSOA", isSelected)
      .raise(); // only required when isSelected == true
    d3.select("#spike" + msoacd)
      .classed("selectedSpike", isSelected);
  }

  function updateTooltip(msoacd) {
    var tooltip = d3.select("#tooltip");
    // update text
    var areanmhc = areacdToProperties.get(msoacd)['areanmhc'];
    var wave1 = areacdToProperties.get(msoacd)['Wave 1'];
    var wave2 = areacdToProperties.get(msoacd)['Wave 2'];
    var tooltipText = tooltip.select("text");
    tooltipText.select("#tooltipMsoanm")
      .text(areanmhc);
    tooltipText.select("#tooltipWave1")
      .text("Wave 1 deaths: " + wave1);
    tooltipText.select("#tooltipWave2")
      .text("Wave 2 deaths: " + wave2);

    d3.select("#infobox")
      .html("<strong>" + areanmhc + "</strong>" +
        "<br>Wave 1 deaths: " + wave1 +
        "<br>Wave 2 deaths: " + wave2);

    // update position
    var coords = centroids.filter(function(d) { return d.properties.msoa11cd == msoacd })[0].geometry.coordinates;
    // figure out what quadrant the spike is in
    if (coords[0] > centreLng) {
      var leftOrRight = 'right';
    } else {
      var leftOrRight = 'left';
    }
    if (coords[1] < centreLat) {
      var topOrBottom = 'bottom';
    } else {
      var topOrBottom = 'top';
    }

    var projectedCoords = projection(coords);

    // get dimensions of tooltip text
    var tooltipBBox = tooltipText.node().getBBox();
    var tooltipWidth = tooltipBBox.width;
    var tooltipHeight = tooltipBBox.height;

    if (leftOrRight == "left") {
      var translateX = projectedCoords[0] + 3;
    } else {
      var translateX = projectedCoords[0] - tooltipWidth - 23;
    };
    if (topOrBottom == "top") {
      var translateY = projectedCoords[1] + 20;
    } else {
      var translateY = projectedCoords[1] - tooltipHeight + 15;
    };

    // finally use calculations to position tooltip and background rectangle
    tooltip.select("rect")
      .attr("x", 5)
      .attr("y", -21)
      .attr("width", tooltipWidth + 10)
      .attr("height", tooltipHeight + 8)
    tooltip.style("display", null)
      .attr("transform", "translate(" + translateX + "," + translateY + ")");


  }

} // end drawgraphic

//check whether browser can cope with svg
if (Modernizr.svg) {

  //use pym to create iframed chart dependent on specified variables
  pymChild = new pym.Child({ renderCallback: drawGraphic});


} else {
  //use pym to create iframe containing fallback image (which is set as default)
  pymChild = new pym.Child();
  if (pymChild) {
    pymChild.sendHeight();
  }
}
