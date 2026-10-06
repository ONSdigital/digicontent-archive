//test if browser supports webGL

if (Modernizr.webgl) {
  //setup pymjs
  var pymChild = new pym.Child();

  //first load config file

  //Load data and config file
  d3.queue()
    // .defer(d3.csv, "data/data_newcodes0.csv")
    // .defer(d3.csv, "data/dates.csv")
    // .defer(d3.json, "data/nationalrates.json")

    .defer(d3.csv, "data/data.csv")
    .defer(d3.csv, "data/dates_variants.csv")
    .defer(d3.json, "data/nationalrates_new.json")

    .defer(d3.json, "data/config.json")
    .defer(d3.json, "data/geog_UK.json")
    .await(ready);

  function ready(error, data, dates, rates, config, geog) {
    dates.forEach(function (d) {
      d.date = d3.timeParse("%d/%m/%Y")(d.date);
    });

    //Set up global variables
    dvc = config.ons;
    oldAREACD = "";
    selected = false;
    firsthover = true;
    chartDrawn = false;
    thisdata = data;
    overallwidth = d3.select("body").node().getBoundingClientRect().width;
    navvalue = 0;
    // var scotland=["J06000223","J06000224","J06000225","J06000226","J06000227","J06000228"]
    // var wales=["J06000217","J06000218","J06000219","J06000220","J06000221","J06000222"]
    // var northernireland=["J06000229","J06000230","J06000231","J06000232","J06000233"]

    if (overallwidth < 600) {
      mobile = true;
    } else {
      mobile = false;
    }

    //Get column names and number
    variables = [];
    for (var column in data[0]) {
      if (column.slice(0, 4) != "time") continue;
      if (column == "AREACD") continue;
      if (column == "AREANM") continue;
      variables.push(column);
    }

    // console.log(variables);

    // get column names for minimums
    variablesmin = [];
    for (var column in data[0]) {
      if (column.slice(0, 3) != "min") continue;
      if (column == "AREACD") continue;
      if (column == "AREANM") continue;
      variablesmin.push(column);
    }

    // get column names for minimums
    variablesmax = [];
    for (var column in data[0]) {
      if (column.slice(0, 3) != "max") continue;
      if (column == "AREACD") continue;
      if (column == "AREANM") continue;
      variablesmax.push(column);
    }

    b = 0;

    if (dvc.timeload == "last") {
      a = variables.length - 1;
    } else {
      a = dvc.timeload;
    }

    //BuildNavigation
    if (dvc.varlabels.length > 1) {
      buildNav();
    } else {
      d3.select("#topNav").attr("display", "none");
    }
    //set title of page
    //Need to test that this shows up in GA
    document.title = dvc.maptitle;

    //Fire design functions
    selectlist(data);

    //Set up number formats
    displayformat = d3.format("." + dvc.displaydecimals + "f");
    legendformat = d3.format("." + dvc.legenddecimals + "f");

    //set up basemap
    map = new mapboxgl.Map({
      container: "map", // container id
      style: "data/style.json", //stylesheet location //includes key for API
      center: [-2.5, 54], // starting position
      minZoom: 3.5, //
      zoom: 4.5, // starting zoom
      maxZoom: 13, //
      attributionControl: false,
    });
    //add fullscreen option
    //map.addControl(new mapboxgl.FullscreenControl());

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Disable map rotation using right click + drag
    map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    // Add geolocation controls to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
      })
    );

    //add compact attribution
    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    );

    //get location on click
    d3.select(".mapboxgl-ctrl-geolocate").on("click", geolocate);

    //addFullscreen();

    setRates(thisdata);

    defineBreaks(thisdata);

    setupScales(thisdata);

    setTimeLabel(a);
    setTimeLabelsub(a);

    //now ranges are set we can call draw the key
    createKey(config);

    //convert topojson to geojson
    for (key in geog.objects) {
      var areas = topojson.feature(geog, geog.objects[key]);
    }

    //Work out extend of loaded geography file so we can set map to fit total extent
    bounds = turf.extent(areas);

    //set map to total extent
    setTimeout(function () {
      map.fitBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ]);
    }, 1000);

    //and add properties to the geojson based on the csv file we've read in
    areas.features.map(function (d, i) {
      //      d.properties.fill = color(rateById[d.properties.AREACD])
      //   if(!isNaN(rateById[d.properties.AREACD]))
      //   {d.properties.fill = color(rateById[d.properties.AREACD])}​​
      //  else {​​d.properties.fill = '#ccc'}​​;
      var fillNum = rateById[d.properties.AREACD];
      d.properties.fill = isNaN(fillNum) ? "#dadada" : color(fillNum);
    });

    map.on("load", defineLayers);

    setButtons();
    setSource();

    //setInterval(function(){animate()}, 3000);

    function buildNav() {
      fieldset = d3.select("#nav").append("fieldset");

      fieldset
        .append("legend")
        .attr("class", "visuallyhidden")
        .html("Choose a variable");

      fieldset
        .append("div")
        .attr("class", "visuallyhidden")
        .attr("aria-live", "polite")
        .append("span")
        .attr("id", "selected");

      grid = fieldset
        .append("div")
        .attr("class", "grid grid--full large-grid--fit");

      cell = grid
        .selectAll("div")
        .data(dvc.varlabels)
        .enter()
        .append("div")
        .attr("class", "grid-cell");

      cell
        .append("input")
        .attr("type", "radio")
        .attr("class", "visuallyhidden")
        .attr("id", function (d, i) {
          return "button" + i;
        })
        .attr("value", function (d, i) {
          return i;
        })
        .attr("name", "button");

      cell
        .append("label")
        .attr("for", function (d, i) {
          return "button" + i;
        })
        .html(function (d) {
          return d;
        });

      d3.selectAll('input[type="radio"]').on("change", function (d) {
        onchange(document.querySelector('input[name="button"]:checked').value);
        d3.select("#selected").text(
          dvc.varlabels[
            document.querySelector('input[name="button"]:checked').value
          ] + " is selected"
        );
      });

      d3.select("#button0").property("checked", true);
      d3.select("#selected").text(
        dvc.varlabels[
          document.querySelector('input[name="button"]:checked').value
        ] + " is selected"
      );

      //mobile nav
      selectgroup = d3.select("#selectnav");

      selectgroup
        .append("label")
        .attr("for", "mobileDropdown")
        .attr("class", "visuallyhidden")
        .html("Choose a variable");

      selectgroup
        .append("select")
        .attr("class", "dropdown")
        .attr("id", "mobileDropdown")
        .on("change", onselect)
        .selectAll("option")
        .data(dvc.varlabels)
        .enter()
        .append("option")
        .attr("value", function (d, i) {
          return i;
        })
        .property("selected", function (d, i) {
          return i === b;
        })
        .text(function (d, i) {
          return dvc.varlabels[i];
        });
    }

    function setRates(thisdata) {
      rateById = {};
      areaById = {};

      thisdata.forEach(function (d) {
        rateById[d.AREACD] = +eval("d." + variables[a]);
        areaById[d.AREACD] = d.AREANM;
      });
    }

    function setTimeLabel() {
      //d3.select("#timePeriod").select('p').text("Week " + dvc.timepoints[a]);
      //d3.select("#timePeriod").select('p').text("Period ending "+dvc.timelineLabelsDTsub[a]);
      d3.select("#timePeriod")
        .select("p")
        .text("Period ending " + d3.timeFormat("%-d %B %Y")(dates[a].date));
      // console.log(a)
    }

    function setTimeLabelsub() {
      //d3.select("#timePeriodsub").select('p').text(dvc.timelineLabelsDTsub[a]);
      //d3.select("#timePeriodsub").select('p').text(dates[a].variant+ " variant period");
      d3.select("#timePeriodsub")
        .select("p")
        .text(function (d) {
          return dates[a].variant + " variant period";
        })
        .style("color", function (d, i) {
          return dates[a].colour;
        });
    }

    function checkIfFirstorLast() {
      if ((a = 0)) {
      }
    }

    function defineBreaks(data) {
      //Flatten data values and work out breaks
      var values = thisdata
        .map(function (d) {
          return +eval("d." + variables[a]);
        })
        .filter(function (d) {
          return !isNaN(d);
        })
        .sort(d3.ascending);

      //If jenks or equal then flatten data so we can work out what the breaks need to be

      // Work out how many timepoints we have in our dataset; number of rows - area name & code // Look at linechart templates to see how?
      // parse data into columns
      if (config.ons.breaks == "jenks" || config.ons.breaks == "equal") {
        var values = [];
        allvalues = [];

        for (var column in data[0]) {
          if (column != "AREANM" && column != "AREACD") {
            values[column] = data
              .map(function (d) {
                return +eval("d." + column);
              })
              .filter(function (d) {
                return !isNaN(d);
              })
              .sort(d3.ascending);
            allvalues = allvalues.concat(values[column]);
          }
        }

        allvalues.sort(d3.ascending);
      }

      if (config.ons.breaks == "jenks") {
        breaks = [];

        ss.ckmeans(allvalues, dvc.numberBreaks).map(function (cluster, i) {
          if (i < dvc.numberBreaks - 1) {
            breaks.push(cluster[0]);
          } else {
            breaks.push(cluster[0]);
            //if the last cluster take the last max value
            breaks.push(cluster[cluster.length - 1]);
          }
        });
      } else if (config.ons.breaks == "equal") {
        breaks = ss.equalIntervalBreaks(allvalues, dvc.numberBreaks);
      } else {
        breaks = config.ons.breaks;
      }

      //round breaks to specified decimal places
      breaks = breaks.map(function (each_element) {
        return Number(each_element.toFixed(dvc.legenddecimals));
      });

      //work out halfway point (for no data position)
      midpoint = breaks[0] + (breaks[dvc.numberBreaks] - breaks[0]) / 2;
    }

    // console.log(breaks)

    function setupScales() {
      //set up d3 color scales
      //Load colours
      if (typeof dvc.varcolour === "string") {
        // colour = colorbrewer[dvc.varcolour][dvc.numberBreaks];
        color = chroma.scale(dvc.varcolour).colors(dvc.numberBreaks);
        colour = [];
        color.forEach(function (d) {
          colour.push(chroma(d).darken(0.4).saturate(0.6).hex());
        });
      } else {
        colour = dvc.varcolour;
      }

      //set up d3 color scales
      color = d3.scaleThreshold().domain(breaks.slice(1)).range(colour);
    }

    function defineLayers() {
      map.addSource("area", {
        type: "geojson",
        data: areas,
      });

      map.addLayer(
        {
          id: "area",
          type: "fill",
          source: "area",
          layout: {},
          paint: {
            "fill-color": {
              type: "identity",
              property: "fill",
            },
            "fill-opacity": 0.7,
            "fill-outline-color": "#fff",
          },
        },
        "place_city"
      );

      //Get current year for copyright
      today = new Date();
      copyYear = today.getFullYear();
      map.style.sourceCaches["area"]._source.attribution =
        "Contains OS data &copy; Crown copyright and database right " +
        copyYear;

      map.addLayer(
        {
          id: "state-fills-hover",
          type: "line",
          source: "area",
          layout: {},
          paint: {
            "line-color": "#000",
            "line-width": 2,
          },
          filter: ["==", "AREACD", ""],
        },
        "place_city"
      );

      map.addLayer({
        id: "area_labels",
        type: "symbol",
        source: "area",
        minzoom: 10,
        layout: {
          "text-field": "{AREANM}",
          "text-font": ["Open Sans", "Arial Unicode MS Regular"],
          "text-size": 14,
        },
        paint: {
          "text-color": "#666",
          "text-halo-color": "#fff",
          "text-halo-width": 1,
          "text-halo-blur": 1,
        },
      });

      //test whether ie or not
      function detectIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf("MSIE ");
        if (msie > 0) {
          // IE 10 or older => return version number
          return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
        }

        var trident = ua.indexOf("Trident/");
        if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf("rv:");
          return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
        }

        var edge = ua.indexOf("Edge/");
        if (edge > 0) {
          // Edge (IE 12+) => return version number
          return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
        }

        // other browser
        return false;
      }

      if (detectIE()) {
        onMove = onMove.debounce(200);
        onLeave = onLeave.debounce(200);
      }

      //Highlight stroke on mouseover (and show area information)
      map.on("mousemove", "area", onMove);

      // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
      map.on("mouseleave", "area", onLeave);

      //Add click event
      map.on("click", "area", onClick);
    }

    function updateLayers() {
      //update properties to the geojson based on the csv file we've read in
      areas.features.map(function (d, i) {
        // d.properties.fill = color(rateById[d.properties.AREACD])
        // console.log(d.properties.AREACD, d.properties.fill)
        //
        // if(!isNaN(rateById[d.properties.AREACD]))
        // 			    {​​d.properties.fill = color(rateById[d.properties.AREACD])}​​
        // 			   else {​​d.properties.fill = '#ccc'}​​;

        var fillNum = rateById[d.properties.AREACD];
        d.properties.fill = isNaN(fillNum) ? "#dadada" : color(fillNum);
      });

      //Reattach geojson data to area layer
      map.getSource("area").setData(areas);

      //set up style object
      styleObject = {
        type: "identity",
        property: "fill",
      };
      //repaint area layer map usign the styles above
      map.setPaintProperty("area", "fill-color", styleObject);
    }

    function onchange(i) {
      chartDrawn = false;
      navvalue = i;

      //load new csv file
      filepth = "data/data_newcodes" + i + ".csv";

      d3.csv(filepth, function (data) {
        thisdata = data;
        setRates(thisdata);
        defineBreaks(thisdata);
        setupScales(thisdata);
        createKey(config);

        if (selected) {
          setAxisVal($("#areaselect").val());
          if (mobile == false) {
            updateChart($("#areaselect").val());
          }
        }
        updateLayers();

        dataLayer.push({
          event: "navSelect",
          selected: i,
        });
      });
    }

    function setButtons() {
      d3.select("#play").on("click", onPlay);

      d3.select("#forward").on("click", animate);

      d3.select("#back").on("click", rev_animate);
    }

    function onPlay() {
      // if playing, pause
      if (d3.select("#play").classed("playing") === true) {
        d3.select("#play").classed("playing", false);
        d3.select("#play").attr("aria-checked", "false");

        d3.select("#playImage").attr("src", "images/play.svg");
        setButtons();
        clearInterval(animating);
        d3.selectAll(".btn--neutral").classed("btn--neutral-disabled", false);

        // if paused, play
      } else {
        d3.select("#play").attr("aria-checked", "true");
        d3.select("#play").classed("playing", true);

        animate();
        animating = setInterval(function () {
          animate();
        }, 1000); // was 1500
        d3.selectAll(".btn--neutral").classed("btn--neutral-disabled", true);
        d3.select("#playImage").attr("src", "images/pause.svg");
      }
    }

    function animate() {
      if (a < variables.length - 1) {
        a = a + 1;
      } else {
        a = 0;
      }
      updateFrame();
    }

    function rev_animate() {
      if (a > 0) {
        a = a - 1;
      } else {
        a = variables.length - 1;
      }
      updateFrame();
    }

    function updateFrame() {
      // console.log(a);
      // console.log(dvc.timepoints[a]);
      // console.log(dates[a].timelineLabelsDT); // change this over
      console.log(dvc.average[navvalue][a]);
      console.log(rates[navvalue][a]);

      //console.log(dvc.average[navvalue][a]);
      // console.log(navvalue);
      // console.log(a);

      setRates(thisdata);
      updateLayers();
      updateTimeLabel();
      updateTimeLabelsub();

      if (selected) {
        setAxisVal($("#areaselect").val());
        if (mobile == false) {
          updateChart($("#areaselect").val());
        }
      }
      if (mobile == false) {
        if (rates[navvalue] != null) {
          d3.select("#currPoint2")
            // .transition()
            // .duration(300)
            .attr("cx", x(dates[a].timelineLabelsDT))
            .attr("cy", y(rates[navvalue][a]));
        }
      }
    }

    function updateTimeLabel() {
      //d3.select("#timePeriod").select('p').text("Week " + dvc.timepoints[a])
      //d3.select("#timePeriod").select('p').text("Period ending "+dvc.timelineLabelsDTsub[a])
      d3.select("#timePeriod")
        .select("p")
        .text("Period ending " + d3.timeFormat("%-d %B %Y")(dates[a].date));
    }

    function updateTimeLabelsub() {
      //d3.select("#timePeriodsub").select('p').text(dvc.timelineLabelsDTsub[a])
      //d3.select("#timePeriodsub").select('p').text(dates[a].variant+" variant period")
      d3.select("#timePeriodsub")
        .select("p")
        .text(dates[a].variant + " variant period")
        .style("color", function (d, i) {
          return dates[a].colour;
        });
    }

    function onselect() {
      b = $(".dropdown").val();
      onchange(b);
    }

    function onMove(e) {
      map.getCanvasContainer().style.cursor = "pointer";

      newAREACD = e.features[0].properties.AREACD;

      if (firsthover) {
        dataLayer.push({
          event: "mapHoverSelect",
          selected: newAREACD,
        });

        firsthover = false;
      }

      if (newAREACD != oldAREACD) {
        oldAREACD = e.features[0].properties.AREACD;
        map.setFilter("state-fills-hover", [
          "==",
          "AREACD",
          e.features[0].properties.AREACD,
        ]);

        selectArea(e.features[0].properties.AREACD);
        setAxisVal(e.features[0].properties.AREACD);
        if (mobile == false) {
          updateChart(e.features[0].properties.AREACD);
        }
      }
    }

    function onLeave() {
      map.getCanvasContainer().style.cursor = null;
      map.setFilter("state-fills-hover", ["==", "AREACD", ""]);
      oldAREACD = "";
      $("#areaselect").val(null).trigger("chosen:updated");
      hideaxisVal();
    }

    function onClick(e) {
      disableMouseEvents();
      newAREACD = e.features[0].properties.AREACD;

      if (newAREACD != oldAREACD) {
        oldAREACD = e.features[0].properties.AREACD;
        map.setFilter("state-fills-hover", [
          "==",
          "AREACD",
          e.features[0].properties.AREACD,
        ]);

        selectArea(e.features[0].properties.AREACD);
        setAxisVal(e.features[0].properties.AREACD);
        if (mobile == false) {
          updateChart(e.features[0].properties.AREACD);
        }
      }

      dataLayer.push({
        event: "mapClickSelect",
        selected: newAREACD,
      });
    }

    function disableMouseEvents() {
      map.off("mousemove", "area", onMove);
      map.off("mouseleave", "area", onLeave);

      selected = true;
    }

    function enableMouseEvents() {
      map.on("mousemove", "area", onMove);
      map.on("click", "area", onClick);
      map.on("mouseleave", "area", onLeave);

      selected = false;
    }

    function selectArea(code) {
      $("#areaselect").val(code).trigger("chosen:updated");
      d3.select("abbr").on("keypress", function (evt) {
        if (d3.event.keyCode == 13 || d3.event.keyCode == 32) {
          d3.event.preventDefault();
          onLeave();
          resetZoom();
        }
      });
    }

    function zoomToArea(code) {
      specificpolygon = areas.features.filter(function (d) {
        return d.properties.AREACD == code;
      });

      specific = turf.extent(specificpolygon[0].geometry);

      map.fitBounds(
        [
          [specific[0], specific[1]],
          [specific[2], specific[3]],
        ],
        {
          padding: {
            top: 150,
            bottom: 150,
            left: 100,
            right: 100,
          },
        }
      );
    }

    function resetZoom() {
      map.fitBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ]);
    }

    function setAxisVal(code) {
      d3.select("#accessibilityInfo")
        .select("p.visuallyhidden")
        .text(function () {
          if (!isNaN(rateById[code])) {
            return (
              areaById[code] +
              ": " +
              displayformat(rateById[code]) +
              " " +
              dvc.varunit[b]
            );
          } else {
            return "Data unavailable";
          }
        });

      // d3.selectAll("#currVal2")
      //   .style("opacity", 0);

      if (mobile == false) {
        d3.select("#currLine")
          .style("opacity", function () {
            if (!isNaN(rateById[code])) {
              return 1;
            } else {
              return 0;
            }
          })
          // .transition()
          // .duration(300)
          .attr("y1", function () {
            if (!isNaN(rateById[code])) {
              return y(rateById[code]);
            } else {
              return y(midpoint);
            }
          })
          .attr("y2", function () {
            if (!isNaN(rateById[code])) {
              return y(rateById[code]);
            } else {
              return y(midpoint);
            }
          })
          .attr("x2", x(dates[a].timelineLabelsDT))
          .attr("x1", x(0));

        d3.select("#currVal")
          .text(function () {
            if (!isNaN(rateById[code])) {
              return displayformat(rateById[code]);
            } else {
              return "Data unavailable";
            }
          })
          .style("opacity", 1)
          // .transition()
          // .duration(300)
          .attr("x", x(dates[a].timelineLabelsDT))
          .attr("y", findCurrValy)
          .attr("text-anchor", "middle");

        // d3.select("#currVal2")
        //   .text(function() {
        //     if (!isNaN(rateById[code])) {
        //       return displayformat(rateById[code])
        //     } else {
        //       return "Data unavailable"
        //     }
        //   })
        //   // .transition()
        //   // .duration(300)
        //   .attr("x", x(dates[a].timelineLabelsDT))
        //   .attr("y", findCurrValy)
        //   .style("opacity", 1)
        //   .attr("text-anchor", "middle");

        function findCurrValy() {
          if (!isNaN(rateById[code])) {
            // if there exists a numerical value
            // if value is greater than threshold, put it below the line
            var yThreshold = ((y.domain()[0] + y.domain()[1]) * 2) / 3;
            if (rateById[code] > yThreshold) {
              yAdjustment = 22;
            } else {
              // otherwise it goes above
              yAdjustment = -12;
            }
            return y(rateById[code]) + yAdjustment;
          } else {
            // if there is no numerical value
            return y(midpoint);
          }
        }

        d3.select("#currPoint")
          .text(function () {
            if (!isNaN(rateById[code])) {
              return displayformat(rateById[code]);
            } else {
              return "Data unavailable";
            }
          })
          .style("opacity", function () {
            if (!isNaN(rateById[code])) {
              return 1;
            } else {
              return 0;
            }
          })
          .transition()
          .duration(300)
          .attr("cx", x(dates[a].timelineLabelsDT))
          .attr("cy", function () {
            if (!isNaN(rateById[code])) {
              return y(rateById[code]);
            } else {
              return 0;
            }
          });
      } else {
        d3.select("#currLine")
          .style("opacity", function () {
            if (!isNaN(rateById[code])) {
              return 1;
            } else {
              return 0;
            }
          })
          // .transition()
          // .duration(400)
          .attr("x1", function () {
            if (!isNaN(rateById[code])) {
              return xkey(rateById[code]);
            } else {
              return xkey(midpoint);
            }
          })
          .attr("x2", function () {
            if (!isNaN(rateById[code])) {
              return xkey(rateById[code]);
            } else {
              return xkey(midpoint);
            }
          });

        d3.select("#currVal")
          .text(function () {
            if (!isNaN(rateById[code])) {
              return displayformat(rateById[code]);
            } else {
              return "Data unavailable";
            }
          })
          .style("opacity", 1)
          // .transition()
          // .duration(400)
          .attr("x", function () {
            if (!isNaN(rateById[code])) {
              return xkey(rateById[code]);
            } else {
              return xkey(midpoint);
            }
          });
        d3.select(".areaci").style("opacity", 1);
      }
    }

    function updateChart(code, selectlist) {
      if (chartDrawn == false) {
        chartDrawn = true;

        selectedarea = thisdata.filter(function (d) {
          return d.AREACD == code;
        });

        selectedName = selectedarea.map(function (d) {
          return d.AREANM;
        });

        // console.log(code);
        //if (code=="J06000224"){
        if (dvc.walescodes.includes(code) == true) {
          varNum = 1;
        } else if (dvc.northernirelandcodes.includes(code) == true) {
          varNum = 2;
        } else if (dvc.scotlandcodes.includes(code) == true) {
          varNum = 3;
        } else {
          varNum = 0;
        }
        // console.log(varNum);
        // change the country line

        // check there are average values

        mydates = d3
          .map(dates, function (d, i) {
            return d.timelineLabelsDT;
          })
          .keys();

        if (rates[varNum] != null) {
          linedata2 = d3.zip(mydates, rates[varNum]);

          line2 = d3
            .line()
            .defined(function (d) {
              return !isNaN(d[0]);
            })
            .x(function (d) {
              return x(d[0]);
            })
            .y(function (d) {
              return y(d[1]);
            });

          var g2 = svgkeyGroup.append("g");

          g2.append("path")
            .attr("id", "line2")
            // g2.select("line2")
            .attr("d", line2(linedata2))
            .attr("stroke", dvc.countrylinecolour)
            .attr("stroke-width", "2px")
            .attr("fill", "none")
            .style("opacity", 1);

          // // add time dot for line2
          // g2.append("circle")
          //   .attr("id", "currPoint2")
          //   // d3.select("#currPoint2")
          //   .attr("r", "4px")
          //   .attr("cy", function () {
          //     if (rates[varNum] != null) {
          //       return y(rates[varNum][a]); // set start position
          //     } else {
          //       return y(0); // placeholder because no data for this variable
          //     }
          //   })
          //   .attr("cx", x(dates[a].timelineLabelsDT))
          //   .attr("fill", "#b0b0b0")
          //   .attr("stroke", "black");

          if (dvc.showcountrylabelsonline) {
            g2.append("text")
              .attr("id", "averagelabel")
              // d3.select("#averagelabel")
              .attr("x", function (d) {
                return x(linedata2[linedata2.length - 1][0]);
              })
              .attr("y", function (d) {
                return y(linedata2[linedata2.length - 1][1]) - 30; // use this number at end to adjust height of label
              })
              .attr("font-size", "14px")
              .style("opacity", 1)
              .style("fill", "#666")
              .attr("text-anchor", "end")
              .text(dvc.averageText[varNum]);
          }

          // also put this text into #keyunit2
          d3.select("#keyunit2").text(dvc.averageText[varNum]);
        } // end of draw country line

        selectedarea.forEach(function (d) {
          valuesx = variables.map(function (name) {
            return +d[name];
          });
        });

        // minimums
        selectedarea.forEach(function (d) {
          valuesminx = variablesmin.map(function (name) {
            return +d[name];
          });
        });

        // maximums
        selectedarea.forEach(function (d) {
          valuesmaxx = variablesmax.map(function (name) {
            return +d[name];
          });
        });

        values = valuesx.slice(0);
        valuesmin = valuesminx.slice(0);
        valuesmax = valuesmaxx.slice(0);

        // console.log(values)

        linedata = d3.zip(mydates, values);
        areamindata = d3.zip(mydates, valuesmin);
        areamaxdata = d3.zip(mydates, valuesmax);

        min_and_max = d3.zip(areamindata, areamaxdata);

        // console.log(min_and_max)

        data_for_area = min_and_max.map(function (d, i) {
          // console.log(d,i)
          return {
            index: i,
            week: d[0][0],
            min: d[0][1],
            max: d[1][1],
          };
        });

        line1 = d3
          .line()
          .defined(function (linedata) {
            return !isNaN(linedata[1]);
          })
          .x(function (d, i) {
            return x(linedata[i][0]);
          })
          .y(function (d, i) {
            return y(linedata[i][1]);
          });

        // add area for CIs
        areaci = d3
          .area()
          .curve(d3.curveLinear)
          .defined(function (d, i) {
            return !isNaN(areamaxdata[i][1]);
          })
          .x(function (d, i) {
            return x(linedata[i][0]);
          })
          .y1(function (d, i) {
            return y(areamindata[i][1]);
          })
          .y0(function (d, i) {
            return y(areamaxdata[i][1]);
          });

        gline1 = svgkeyGroup.select("#chartgroup");
        // var gline1 = svgkeyGroup.append("g")
        // .attr("transform", "translate(45,10)")
        // .attr("id", "chartgroup")

        gline1
          .append("path")
          .datum(data_for_area)
          .attr("class", "areaci")
          .attr("d", areaci)
          .attr("fill", dvc.rateslinecolour)
          .attr("opacity", 0.3);

        gline1
          .append("path")
          .attr("id", "line1")
          .style("opacity", 1)
          .attr("d", line1(linedata))
          .attr("stroke", dvc.rateslinecolour)
          .attr("stroke-width", "2px")
          .attr("fill", "none");

        gline1
          .append("circle")
          .attr("id", "currPoint")
          .attr("r", "4px")
          .attr("cy", y(linedata[a][1]))
          .attr("cx", x(dates[a].timelineLabelsDT))
          .attr("fill", "#666")
          .attr("stroke", "black")
          .style("opacity", 0);
      } else {
        // calculate varNum

        if (dvc.walescodes.includes(code) == true) {
          varNum = 1;
        } else if (dvc.northernirelandcodes.includes(code) == true) {
          varNum = 2;
        } else if (dvc.scotlandcodes.includes(code) == true) {
          varNum = 3;
        } else {
          varNum = 0;
        }
        // console.log(varNum);
        // change the country line

        // check there are average values
        if (rates[varNum] != null) {
          linedata2 = d3.zip(mydates, rates[varNum]);

          line2 = d3
            .line()
            .defined(function (d) {
              return !isNaN(d[0]);
            })
            .x(function (d) {
              return x(d[0]);
            })
            .y(function (d) {
              return y(d[1]);
            });

          var g2 = svgkeyGroup.append("g");

          // g2.append("path")
          //   .attr("id", "line2")
          d3.select("#line2")
            .attr("d", line2(linedata2))
            .attr("stroke", dvc.countrylinecolour)
            .attr("stroke-width", "2px")
            .attr("fill", "none")
            .style("opacity", 1);

          //    add time dot for line2
          // g2.append("circle")
          //   .attr("id", "currPoint2")
          d3.select("#currPoint2")
            .attr("r", "4px")
            .attr("cy", function () {
              if (rates[varNum] != null) {
                return y(rates[varNum][a]); // set start position
              } else {
                return y(0); // placeholder because no data for this variable
              }
            })
            .attr("cx", x(dates[a].timelineLabelsDT))
            .attr("fill", "#b0b0b0")
            .attr("stroke", "black");

          if (dvc.showcountrylabelsonline) {
            d3.select("#averagelabel")
              .attr("x", function (d) {
                return x(linedata2[linedata2.length - 1][0]);
              })
              .attr("y", function (d) {
                return y(linedata2[linedata2.length - 1][1]) - 30; // use this number at end to adjust height of label
              })
              .attr("font-size", "14px")
              .style("opacity", 1)
              .attr("fill", "#666")
              .attr("text-anchor", "end")
              .text(dvc.averageText[varNum]);
          }

          // also put this text into #keyunit2
          d3.select("#keyunit2").text(dvc.averageText[varNum]);
        } // end of draw country line

        selectedarea = thisdata.filter(function (d) {
          return d.AREACD == code;
        });

        selectedarea.forEach(function (d) {
          valuesx = variables.map(function (name) {
            return +d[name];
          });
        });

        selectedarea.forEach(function (d) {
          valuesminx = variablesmin.map(function (name) {
            return +d[name];
          });
        });

        selectedarea.forEach(function (d) {
          valuesmaxx = variablesmax.map(function (name) {
            return +d[name];
          });
        });

        values = valuesx.slice(0);
        valuesmin = valuesminx.slice(0);
        valuesmax = valuesmaxx.slice(0);

        linedata = d3.zip(mydates, values);
        areamindata = d3.zip(mydates, valuesmin);
        areamaxdata = d3.zip(mydates, valuesmax);

        min_and_max = d3.zip(areamindata, areamaxdata);

        data_for_area = min_and_max.map(function (d, i) {
          return {
            index: i,
            week: d[0][0],
            min: d[0][1],
            max: d[1][1],
          };
        });

        // console.log(data_for_area)
        d3.select(".areaci")
          .datum(data_for_area)
          .style("opacity", 0.3)
          // .transition()
          // .duration(300)
          .attr("d", areaci);

        d3.select("#line1")
          .style("opacity", 1)
          // .transition()
          // .duration(300)
          .attr("d", line1(linedata));
      }
    }

    function hideaxisVal() {
      d3.select("#line1").style("opacity", 0);

      d3.selectAll("#line2").style("opacity", 0);

      d3.select("#currPoint").style("opacity", 0);

      d3.selectAll("#currPoint2").style("opacity", 0);

      d3.select("#currLine").style("opacity", 0);

      d3.select("#currVal").text("").style("opacity", 0);

      // d3.selectAll("#currVal2")
      //   .style("opacity", 0);

      d3.select(".areaci").style("opacity", 0);

      if (dvc.showcountrylabelsonline) {
        d3.selectAll("#averagelabel").style("opacity", 0);
      }
    }

    function createKey(config, i) {
      d3.select("#keydiv").selectAll("*").remove();

      var color = d3.scaleThreshold().domain(breaks).range(colour);

      if (mobile == false) {
        d3.select("#keydiv")
          .append("p")
          .attr("id", "keyunit")
          .attr("aria-hidden", true)
          .style("margin-top", "15px")
          .style("margin-left", "10px")
          .style("font-size", "14px");

        d3.select("#keydiv")
          .append("svg")
          .attr("width", 15)
          .attr("height", "15")
          .style("margin-left", "10px")
          .append("rect")
          .style("fill", dvc.rateslinecolour)
          .attr("width", 15)
          .attr("height", "3")
          .attr("y", 8);

        d3.select("#keydiv")
          .append("p")
          .attr("id", "keyunit")
          .attr("aria-hidden", true)
          .style("margin-top", "-20px")
          .style("margin-left", "30px")
          .style("margin-bottom", "5px")
          .style("font-size", "14px")
          .text("Selected area");

        d3.select("#keydiv")
          .append("svg")
          .attr("width", 15)
          .attr("height", "15")
          .style("margin-left", "10px")
          .append("rect")
          .style("fill", dvc.countrylinecolour)
          .attr("width", 15)
          .attr("height", "3")
          .attr("y", 8);

        d3.select("#keydiv")
          .append("p")
          .attr("id", "keyunit2")
          .attr("aria-hidden", true)
          .style("margin-top", "-20px")
          .style("margin-left", "30px")
          .style("margin-bottom", "5px")
          .style("font-size", "14px")
          .text("Selected country");

        d3.select("#keydiv")
          .append("svg")
          .attr("width", 15)
          .attr("height", "15")
          .style("margin-left", "10px")
          .append("rect")
          .style("fill", dvc.rateslinecolour)
          .attr("opacity", 0.3)
          .attr("width", 15)
          .attr("height", "15");

        d3.select("#keydiv")
          .append("p")
          .attr("id", "keyunit3")
          .attr("aria-hidden", true)
          .style("margin-top", "-20px")
          .style("margin-left", "30px")
          .style("margin-bottom", "5px")
          .style("font-size", "14px")
          .text("95% credible interval");

        d3.select("#keydiv")
          .append("p")
          .attr("id", "keyunit4")
          .attr("aria-hidden", true)
          .attr("id", "keyunit")
          .style("margin-top", "10px")
          .style("margin-left", "10px")
          .style("margin-bottom", "0px")
          //.text("dvc.varunit[b]");
          .text("% testing positive (modelled)");

        keyheight = 300;

        keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;
        // console.log(keywidth)
        svgkey = d3
          .select("#keydiv")
          .append("svg")
          .attr("aria-hidden", true)
          .attr("id", "key")
          .attr("width", keywidth)
          .attr("height", keyheight + 30);

        svgkeyGroup = svgkey.append("g").attr("transform", "translate(45,10)");

        // Set up scales for legend
        y = d3
          .scaleLinear()
          .domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
          .range([keyheight, 0]); /*range for pixels*/

        // Set up scales for chart

        mydates = d3
          .map(dates, function (d, i) {
            return d.timelineLabelsDT;
          })
          .keys();

        x = d3
          .scalePoint()
          .domain(mydates) /*range for data*/
          .range([0, keywidth - 65])
          .align(0.5); /*range for pixels*/

        var yAxis = d3
          .axisLeft(y)
          .tickSize(15) // was 15
          .tickValues(color.domain())
          .tickFormat(legendformat);

        //Add
        var xAxisTime = d3.axisBottom(x).tickSize(5).tickValues(mydates);

        // create g2 before g so that its contents sit behind
        var g2 = svgkeyGroup
          .append("g")
          // .attr("transform", "translate(45,10)")
          .attr("id", "chartgroup");

        var g = svgkeyGroup
          .append("g")
          .attr("id", "vert")
          // .attr("transform", "translate(45,10)")
          .attr("font-weight", "600")
          .style("font-size", "14px");

        d3.selectAll("path").attr("display", "none");

        g.selectAll("rect")
          .data(
            color.range().map(function (d, i) {
              return {
                y0: i ? y(color.domain()[i]) : y.range()[0],
                y1:
                  i < color.domain().length
                    ? y(color.domain()[i + 1])
                    : y.range()[1],
                z: d,
              };
            })
          )
          .enter()
          .append("rect")
          .attr("width", 8)
          .attr("x", -8)
          .attr("y", function (d) {
            return d.y1;
          })
          .attr("height", function (d) {
            return d.y0 - d.y1;
          })
          .style("fill", function (d) {
            return d.z;
          });

        g.call(yAxis).append("text");

        svgkeyGroup
          .append("g")
          .attr("id", "timeaxis")
          .attr("transform", "translate(0," + keyheight + ")")
          .attr("font-weight", "600")
          .style("font-size", "14px")
          .call(xAxisTime);

        //
        // g.append("line")
        //   .attr("id", "currLine")
        //   .attr("y1", y(10))
        //   .attr("y2", y(10))
        //   .attr("x1", -10)
        //   .attr("x2", 0)
        //   .attr("stroke-width", "2px")
        //   .attr("stroke", "#000")
        //   .attr("opacity", 0);

        g.append("text")
          .attr("id", "currVal")
          .attr("y", y(11))
          .attr("fill", "#414042")
          .attr("paint-order", "stroke")
          .attr("stroke", "#fff")
          .attr("stroke-width", "5px")
          .attr("stroke-linecap", "butt")
          .attr("stroke-linejoin", "miter")
          .text("");

        // g.append("text")
        //   .attr("id", "currVal2")
        //   .attr("y", y(11))
        //   .attr("fill", "#414042")
        //   .attr("font-size","14px")
        //   .text("");

        varNum = navvalue;

        // check there are average values
        if (rates[varNum] != null) {
          linedata2 = d3.zip(mydates, rates[varNum]);

          line2 = d3
            .line()
            .defined(function (d) {
              return !isNaN(d[0]);
            })
            .x(function (d) {
              return x(d[0]);
            })
            .y(function (d) {
              return y(d[1]);
            });

          g2.append("path")
            .attr("id", "line2")
            .attr("d", line2(linedata2))
            .attr("stroke", "#666")
            .attr("stroke-width", "2px")
            .attr("fill", "none");

          // add time dot for line2
          g2.append("circle")
            .attr("id", "currPoint2")
            .attr("r", "4px")
            .attr("cy", function () {
              if (rates[navvalue] != null) {
                return y(rates[navvalue][a]); // set start position
              } else {
                return y(0); // placeholder because no data for this variable
              }
            })
            .attr("cx", x(dates[a].timelineLabelsDT))
            .attr("fill", "#b0b0b0")
            .attr("stroke", "black");

          if (dvc.showcountrylabelsonline) {
            g2.append("text")
              .attr("id", "averagelabel")
              .attr("x", function (d) {
                return x(linedata2[linedata2.length - 1][0]);
              })
              .attr("y", function (d) {
                return y(linedata2[linedata2.length - 1][1]) - 30; // use this number at end to adjust height of label
              })
              .attr("font-size", "14px")
              .attr("fill", "#666")
              .attr("text-anchor", "end")
              .text(dvc.averageText[varNum]);
          }
        } //end of add the average line
      } else {
        // Horizontal legend
        keyheight = 65;

        keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

        svgkey = d3
          .select("#keydiv")
          .append("svg")
          .attr("aria-hidden", true)
          .attr("id", "key")
          .attr("width", keywidth)
          .attr("height", keyheight);

        xkey = d3
          .scaleLinear()
          .domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
          .range([0, keywidth - 30]); /*range for pixels*/

        y = d3
          .scaleLinear()
          .domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
          .range([0, keywidth - 30]); /*range for pixels*/

        var xAxis = d3
          .axisBottom(xkey)
          .tickSize(15)
          .tickValues(color.domain())
          .tickFormat(legendformat);

        var g2 = svgkey
          .append("g")
          .attr("id", "horiz")
          .attr("transform", "translate(15,30)");

        keyhor = d3.select("#horiz");

        g2.selectAll("rect")
          .data(
            color.range().map(function (d, i) {
              return {
                x0: i ? xkey(color.domain()[i + 1]) : xkey.range()[0],
                x1:
                  i < color.domain().length
                    ? xkey(color.domain()[i + 1])
                    : xkey.range()[1],
                z: d,
              };
            })
          )
          .enter()
          .append("rect")
          .attr("class", "blocks")
          .attr("height", 8)
          .attr("x", function (d) {
            return d.x0;
          })
          .attr("width", function (d) {
            return d.x1 - d.x0;
          })
          .style("opacity", 0.8)
          .style("fill", function (d) {
            return d.z;
          });

        g2.append("line")
          .attr("id", "currLine")
          .attr("x1", xkey(10))
          .attr("x2", xkey(10))
          .attr("y1", -10)
          .attr("y2", 8)
          .attr("stroke-width", "2px")
          .attr("stroke", "#000")
          .style("opacity", 0);

        g2.append("text")
          .attr("id", "currVal")
          .attr("x", xkey(10))
          .attr("y", -15)
          .attr("fill", "#414042")
          .text("");

        keyhor
          .selectAll("rect")
          .data(
            color.range().map(function (d, i) {
              return {
                x0: i ? xkey(color.domain()[i]) : xkey.range()[0],
                x1:
                  i < color.domain().length
                    ? xkey(color.domain()[i + 1])
                    : xkey.range()[1],
                z: d,
              };
            })
          )
          .attr("x", function (d) {
            return d.x0;
          })
          .attr("width", function (d) {
            return d.x1 - d.x0;
          })
          .style("fill", function (d) {
            return d.z;
          });

        keyhor
          .call(xAxis)
          .append("text")
          .attr("id", "caption")
          .attr("x", -63)
          .attr("y", -20)
          .text("");

        keyhor
          .append("rect")
          .attr("id", "keybar")
          .attr("width", 8)
          .attr("height", 0)
          .attr("transform", "translate(15,0)")
          .style("fill", "#ccc")
          .attr("x", xkey(0));

        // selected area text and shape
        // d3.select("#keydiv")
        //   .append("svg")
        //   .attr("width", 15)
        //   .attr("height", "5")
        //   .attr("y", 20)
        //   .style("margin-left", "10px")
        //   .append("rect")
        //   .style("fill", dvc.rateslinecolour)
        //   .attr("width", 15)
        //   .attr("height", "3");

        // d3.select("#keydiv")
        //   .append("p")
        //   .attr("aria-hidden", true)
        //   .attr("id", "keyunit")
        //   .style("margin-top", "-20px")
        //   .style("margin-left", "30px")
        //   .style("margin-bottom", "5px")
        //   //.text("dvc.varunit[b]");
        //   .text("Selected area");

        // // selected country text and shape
        // d3.select("#keydiv")
        //   .append("svg")
        //   .attr("width", 15)
        //   .attr("height", "5")
        //   .attr("y", 20)
        //   .style("margin-left", "10px")
        //   .append("rect")
        //   .style("fill", dvc.countrylinecolour)
        //   .attr("width", 15)
        //   .attr("height", "3");

        // d3.select("#keydiv")
        //   .append("p")
        //   .attr("aria-hidden", true)
        //   .attr("id", "keyunit2")
        //   .style("margin-top", "-20px")
        //   .style("margin-left", "30px")
        //   .style("margin-bottom", "5px")
        //   .text("Selected country");

        // confidence interval label
        // d3.select("#keydiv")
        //   .append("svg")
        //   .attr("width", 15)
        //   .attr("height", 15)
        //   .attr("y", 20)
        //   .style("margin-left", "10px")
        //   .append("rect")
        //   .style("fill", "#206096")
        //   .attr("opacity", 0.3)
        //   .attr("width", 15)
        //   .attr("height", 15);

        // d3.select("#keydiv")
        //   .append("p")
        //   .attr("aria-hidden", true)
        //   .attr("id", "keyunit3")
        //   .style("margin-top", "-20px")
        //   .style("margin-left", "30px")
        //   .style("margin-bottom", "5px")
        //   .text("95% credible interval");

        if (dvc.dropticks) {
          d3.select("#timeaxis")
            .selectAll("text")
            .attr("transform", function (d, i) {
              // if there are more that 4 breaks, so > 5 ticks, then drop every other.
              if (i % 2) {
                return "translate(0,10)";
              }
            });
        }
      }
    } // Ends create key

    // tidy up the x axis to make it readable
    noofticks = dates.length;

    d3.select("#timeaxis")
      .selectAll("text")
      .style("display", function (d, i) {
        if (i == 0 || i == noofticks - 1) {
          return "block";
        } else {
          return "none";
        }
      })
      .text(function (d, i) {
        if (i == 0 || i == noofticks - 1) {
          return d3.timeFormat("%-d %b %y")(dates[i].date);
        } else {
          return "";
        }
      })
      .attr("text-anchor", function (d, i) {
        if (i == noofticks - 1) {
          return "end";
        } else {
          return "start";
        }
      });

    // format the ticks too
    d3.select("#timeaxis")
      .selectAll(".tick")
      .style("display", function (d, i) {
        if (i == 0 || i == noofticks - 1) {
          return "block";
        } else {
          return "none";
        }
      });

    // colour the lines grey
    d3.select("#timeaxis")
      .selectAll(".tick")
      .selectAll("line")
      .attr("fill", "#707071");

    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          x = text.attr("x");
        (dy = 0),
          (tspan = text
            .text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy + "em"));
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    } // end wrap function

    function addFullscreen() {
      currentBody = d3.select("#map").style("height");
      d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight);
    }

    function setbodyheight() {
      d3.select("#map").style("height", "100%");

      document.addEventListener("webkitfullscreenchange", exitHandler, false);
      document.addEventListener("mozfullscreenchange", exitHandler, false);
      document.addEventListener("fullscreenchange", exitHandler, false);
      document.addEventListener("MSFullscreenChange", exitHandler, false);
    }

    function exitHandler() {
      if (document.webkitIsFullScreen === false) {
        shrinkbody();
      } else if (document.mozFullScreen === false) {
        shrinkbody();
      } else if (document.msFullscreenElement === false) {
        shrinkbody();
      }
    }

    function shrinkbody() {
      d3.select("#map").style("height", currentBody);
      pymChild.sendHeight();
    }

    function geolocate() {
      dataLayer.push({
        event: "geoLocate",
        selected: "geolocate",
      });

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    }

    function success(pos) {
      crd = pos.coords;

      //go on to filter
      //Translate lng lat coords to point on screen
      point = map.project([crd.longitude, crd.latitude]);

      //then check what features are underneath
      var features = map.queryRenderedFeatures(point);

      //then select area
      disableMouseEvents();

      map.setFilter("state-fills-hover", [
        "==",
        "AREACD",
        features[0].properties.AREACD,
      ]);

      selectArea(features[0].properties.AREACD);
      setAxisVal(features[0].properties.AREACD);
      if (mobile == false) {
        updateChart(e.features[0].properties.AREACD);
      }
    }

    function setSource() {
      d3.select("#source")
        .append("h5")
        .text("Source: " + dvc.sourcetext);
    }

    function selectlist(datacsv) {
      var areacodes = datacsv.map(function (d) {
        return d.AREACD;
      });
      var areanames = datacsv.map(function (d) {
        return d.AREANM;
      });
      var menuarea = d3.zip(areanames, areacodes).sort(function (a, b) {
        return d3.ascending(a[0], b[0]);
      });

      //hide area dropdown to screen reader if on mobile
      if (mobile == true) {
        d3.select("selectNav").attr("aria-hidden", true);
      }

      // Build option menu for occupations
      var optns = d3
        .select("#selectNav")
        .append("div")
        .attr("id", "sel")
        .append("select")
        .attr("id", "areaselect")
        .attr("style", "width:98%")
        .attr("class", "chosen-select");

      optns.append("option");

      optns
        .selectAll("p")
        .data(menuarea)
        .enter()
        .append("option")
        .attr("value", function (d) {
          return d[1];
        })
        .text(function (d) {
          return d[0];
        });

      myId = null;

      $("#areaselect").chosen({
        placeholder_text_single: "Select an area",
        allow_single_deselect: true,
      });

      d3.select("input.chosen-search-input").attr("id", "chosensearchinput");
      d3.select("div.chosen-search")
        .insert("label", "input.chosen-search-input")
        .attr("class", "visuallyhidden")
        .attr("for", "chosensearchinput")
        .html("Type to select an area");

      $("#areaselect").on("change", function () {
        if ($("#areaselect").val() != "") {
          areacode = $("#areaselect").val();

          disableMouseEvents();

          map.setFilter("state-fills-hover", ["==", "AREACD", areacode]);

          selectArea(areacode);
          setAxisVal(areacode);
          if (mobile == false) {
            updateChart(areacode);
          }
          zoomToArea(areacode);

          dataLayer.push({
            event: "mapDropSelect",
            selected: areacode,
          });
        } else {
          dataLayer.push({
            event: "deselectCross",
            selected: "deselect",
          });

          enableMouseEvents();
          hideaxisVal();
          onLeave();
          resetZoom();
        }
      });
    }
    pymChild.sendHeight();
  }
} else {
  //provide fallback for browsers that don't support webGL
  d3.select("#map").remove();
  d3.select("body")
    .append("p")
    .html(
      "Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>"
    );
}
