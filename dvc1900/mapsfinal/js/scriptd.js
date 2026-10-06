//test if browser supports webGL

if (Modernizr.webgl) {

  //setup pymjs
  var pymChild = new pym.Child();
ddAll = [];

  //Load data and config file
  d3.queue()
    .defer(d3.csv, "data/doms/hi_data.csv")
    .defer(d3.csv, "data/indicator.csv")
    .defer(d3.json, "data/config.json")
    //.defer(d3.json, "data/geogUA20.json")
    .defer(d3.json, "data/geogLA2021UK.json")
    .await(ready);


  function ready(error, data, indNames, config, geog) {

    //Set up global variables
    dvc = config.ons;
    oldAREACD = "";
    selected = false;
    firsthover = true;
    chartDrawn = false;
    thisdata = data;
    overallwidth = d3.select("body").node().getBoundingClientRect().width;
    navvalue = 0;
    avergLine = [];


    if (overallwidth < 600) {
      mobile = true;
    } else {
      mobile = false;
    };

    geog.objects.geog.geometries.forEach(function(d,i){
          if (d.properties.AREACD == 'E10000002') {
            d.properties.AREACD = 'E06000060';
          }

          // if (d.properties.AREACD == 'E92000001') {
          //   d.properties.AREACD = 'E06000060';
          // }

    });


    //Get column names and number
    variables = [];
    for (var column in data[0]) {
      if (column == 'AREACD') continue;
      if (column == 'AREANM') continue;
      variables.push(column);
    }

    b = 0;

    if (dvc.timeload == "last") {
      a = variables.length - 1;
    } else {
      a = dvc.timeload;
    }

    // Sort indicator names

ind1=[];ind2=[];ind3=[];indAll=[];

  indNames['columns'].forEach(function(d){

            if (d[0].substring(0,1) ==1){ ind1.push(d);
            }
            if (d[0].substring(0,1) ==2){ ind2.push(d);
            }
            if (d[0].substring(0,1) ==3){ ind3.push(d);
            }
    //  }
    });
    indAll.push(ind1);indAll.push(ind2);indAll.push(ind3);


    //BuildNavigation
    if (dvc.varlabels.length > 1) {
      buildNav();
    } else {
      d3.select("#topNav").attr("display", "none")
    }
    //set title of page
    //Need to test that this shows up in GA
    document.title = dvc.maptitle;

    // select area dropdown
    selectlist(data);

    //Set up number formats
    displayformat = d3.format("." + dvc.displaydecimals + "f");
    legendformat = d3.format("." + dvc.legenddecimals + "f");


    //set up basemap
    map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'data/style.json', //stylesheet location //includes key for API
      center: [-2.5, 54], // starting position
      minZoom: 3.5, //
      zoom: 4.5, // starting zoom
      maxZoom: 13, //
      attributionControl: false
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
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      }
    }));

    //add compact attribution
    map.addControl(new mapboxgl.AttributionControl({
      compact: true
    }));

    //get location on click
    d3.select(".mapboxgl-ctrl-geolocate").on("click", geolocate);

    keyheight = 200;
    keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

    //addFullscreen();

    setRates(thisdata);

    defineBreaks(thisdata);

    setupScales(thisdata);

    //setTimeLabel(a);

    makeSlider();

    //now ranges are set we can call draw the key
    createKey(thisdata); // was config

    //convert topojson to geojson
    for (key in geog.objects) {

      var areas = topojson.feature(geog, geog.objects[key])
    }

    //Work out extend of loaded geography file so we can set map to fit total extent
    bounds = turf.extent(areas);

    //set map to total extent
    setTimeout(function() {
      map.fitBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]]
      ])
    }, 1000);


    //and add properties to the geojson based on the csv file we've read in
    areas.features.map(function(d, i) {

      d.properties.fill = color(rateById[d.properties.AREACD])
    });

    map.on('load', defineLayers);

    setButtons();
    setSource();

    //setInterval(function(){animate()}, 3000);


function buildNav() {

 // desktop buttons
  var hi = d3.select('#nav').append('div')
          .append('form')
          .attr('class', 'form-group-fullwidth')
          .attr('role', 'radiogroup')
          .selectAll('div')
          .data(["Health Index"])
          .enter()
          .append('div')
          .attr("class", 'form-group-fullwidth')
          .attr("role", "radio")
          .attr("tabindex", "1");

          hi.append('input')
              .attr("id", function(d, i) {
                return "hibutton" + i
              })
              .attr('class', 'radio-primary-fullwidth')
              .attr("type", "radio")
              .attr("name", "hibutton")
              .attr("value", function(d, i) {
                return i;
              })
              .attr("aria-checked", function(d, i) {
                if (i == b) {
                  return true;
                }
              })
             .property("checked", function(d, i) {
               return i === b;
             });

            hi.append('label')
              .attr('class', 'label-primary-fullwidth')
              .attr("for", function(d, i) {
                return "hibutton" + (i)
              })
              .text(function(d, i) {
                return d;
              })
              .on('click', function(d, i) {
    d3.select('#button0').property("checked", false);
    d3.select('#button0').attr("aria-checked", false);
    d3.select('#button1').property("checked", false);
    d3.select('#button1').attr("aria-checked", false);
    d3.select('#button2').property("checked", false);
    d3.select('#button2').attr("aria-checked", false);

  //  d3.select('#selectsub').style("display", "none");
  //  d3.select('#selectind').style("display", "none");

  // take the dom button colour off. CSS
  d3.select('#selectsub').selectAll("*").remove();
  d3.select("#selectind").selectAll("*").remove();
    onchange2Dom(i);
              });

// Now for the doms
    var domgroup = d3.select('#nav').append('div')
                .append('form')
                .attr('class', 'form-group-fullwidth')
                .attr('role', 'radiogroup')
                .selectAll('div')
                .data(dvc.varlabels)
                .enter()
                .append('div')
                .attr("class", 'form-group-fullwidth')
                .attr("role", "radio")
                .attr("tabindex", "1");

      domgroup.append('input')
                .attr("id", function(d, i) {
                  return "button" + (i+1);
                })
                .attr('class', 'radio-primary-fullwidth')
                .attr("type", "radio")
                .attr("name", "button")
                .attr("value", function(d, i) {
                  return i;
                })
                .attr("aria-checked", function(d, i) {
                  if ((i+1) == b) {
                    return true;
                  }
                })
               .property("checked", function(d, i) {
                 if ((i+1) == b) {
                   console.log('checked here');
                   d3.select('input #hibutton0').property("checked", false);
                   d3.select('input #hibutton0').attr("aria-checked", false);
                    }
                 return (i+1) === b; // ie true/false
               })

      domgroup.append('label')
        .attr('class', 'label-primary-fullwidth')
        .attr("for", function(d, i) {
          return "button" + (i+1)
        })
        .text(function(d, i) {
          return dvc.varlabels[i]
        })
        .on('click', function(d, i) {
        //  console.log("get map"+(i+1), d, b);
        // i = button pushed
        d3.select('#hibutton0').property("checked", false);
        d3.select('#hibutton0').attr("aria-checked", false);
          //  domHit = i;
          //Build sub-groups
    // don't redraw if done already
//if(d3.select('#selectsub').empty() == true)
        subDomsDD(i+1);
        onchange2Dom(i+1);
      }); // ends domgroup onClick

 // ++++++ Mobile version ++++++++++++++++++
// Mobile version
      dvc.varlabels.unshift("Health Index");

selectgroup = d3.select("#mobilenav")
          .append("div")
         .attr("id", "mobdomsel")
         .append("select")
         .attr("id", "mobdomselect")
         .attr("style", "width:100%")
         .attr("class", "chosen-select");

         selectgroup.append("option");

         selectgroup.selectAll("p")
               .data(dvc.varlabels).enter()
               .append("option")
               .attr("value", function(d,i) {
                 return i;
               })
               .text(function(d) {
                 return d;
               });

         $('#mobdomselect').chosen({
                 placeholder_text_single: "Select a domain",
                 allow_single_deselect: true
               });

    $('#mobdomselect').on('change',function(evt,i)
            {
              if ($('#mobdomselect').val() != "")
              {
            var domHit = parseInt($('#mobdomselect').val());

                   //disableMouseEvents();

             if (domHit>0) { // Not index val
                           subDomsDD(domHit+1);
                            onchange2Dom(domHit+1);
                       //  And clear sub ind DDs
               }
               else {
                   console.log("index hit:", b, i);
                   //d3.select('#selectsub').style("display", "none");
                   //d3.select('#selectind').style("display", "none");
                   d3.select('#selectsub').selectAll("*").remove();
                   d3.select("#selectind").selectAll("*").remove();
                   onchange2Dom(domHit+1);
                 } // ends if
                   }

           }); // ends on change

    } // ends buildNav


function subDomsDD(bigD){

  $("#selectsub").on('change', function () {

  if ($("#subselect").val() == "") {
      //code to run when "X" button pressed
      console.log("deselected")
        d3.select("#selectind").selectAll("*").remove();
  }
        // else {
        //     //code to run on selection, or remove if not needed
        //     console.log("selected")
        // }
});

  d3.select('#selectsub').selectAll("*").remove();
  d3.select("#selectind").selectAll("*").remove();
        var subLabels = dvc.sublabels[bigD-1];
        // build new dd
        subDDlist = d3.select("#selectsub")
                // .attr("float", "clear")
                  .append("div")
                  .attr("width", overallwidth)
                 .attr("id", "subsel")
                 .append("select")
                 .attr("id", "subselect")
                 .attr("style", "width:100%")
                //  .style("margin", "auto")
                 .attr("class", "chosen-select");

              subDDlist.append("option");

              subDDlist.selectAll("p")
                    .data(subLabels).enter()
                    .append("option")
                    .attr("value", function(d) {
                      return d[0];
                    })
                    .text(function(d) {
                      return d[1];
                    });

              $('#subselect').chosen({
                      placeholder_text_single: "Select a subdomain",
                      allow_single_deselect: true
                    });

          $('#subselect').on('change', function(evt,e) {
              if ($('#subselect').val() != "")
              {
                subHit = $('#subselect').val();
                        //disableMouseEvents();
                        subonchange(subHit,e)
                        indicatorDD(bigD-1, parseInt(subHit.substring(2,3)));
                      } // ends if (valid)
          //   $('abbr').on('change',function(evt){
          //   console.log("triggered");
          //   console.log(evt);
          // }); // ends on change

        }); // ends onChange


} //ends function subdom


function indicatorDD(dm,sb){

  d3.select("#selectind").selectAll("*").remove();
  // Unless we port this up and use hide

 // Add dd menu
 // subDDlist = d3.select("#selectsub")
 //         // .attr("float", "clear")
 //           .append("div")
 //           .attr("width", overallwidth)
 //          .attr("id", "subsel")
 //          .append("select")
 //          .attr("id", "subselect")
 //          .attr("style", "width:100%")
 //         //  .style("margin", "auto")
 //          .attr("class", "chosen-select");

 indLabels = d3.select("#selectind")
           .append("div")
           .attr("width", overallwidth)
           .attr("id", "indsel")
          .append("select")
          .attr("id", "indselect")
          .attr("style", "width:100%")
          // A NEW ONE
          .attr("class", "chosen-select");

   d3.select('#indselect').style('visibility', 'hidden');

       // need to split array into two.
       var labelsind = indAll[dm].map(function(d,i) {
               return d.substring(0,3);
             }); // "_" +
             var codesind = indAll[dm].map(function(d) {
               return d.substring(3,d.length+3);
             });
             var indMenu = d3.zip(labelsind, codesind);

     var indshow = indMenu.filter(function(d){
         return parseInt(d[0].substring(3,2)) === sb;
     });
     //console.log(indshow)

       indLabels.selectAll("p")
                 .data(indshow).enter()
                 .append("option")
                 .attr("value", function(d,i) {

                 return d[0] +"_"+ (i+1);
               }) // + "_"
                 .text(function(d) {
                 return d[1];
                 });

         // myId = null;

         $("#indselect").val(indMenu);
        $("#indselect").trigger("chosen:updated");
     //   $("#indselect").setSelectionOrder(myOptions);
        $('#indselect').chosen({
            placeholder_text_single: "Select an indicator",
            allow_single_deselect: true
          });

        $('#indselect').on('change', function(d,i) {

         if ($('#indselect').val() != "") {
//console.log("indy change")
           indcode = $('#indselect').val().substring(0);

           indonchange(indcode,i);
           //disableMouseEvents();

           d3.select('#indselect').property("checked", true);
           d3.select('#indselect').attr("aria-checked", true);
         //  chosen-single d3.classed chosen-single-with-deselect
          d3.select('#indselect').classed("chosen-single-with-deselect");
           //map.setFilter("state-fills-hover", ["==", "AREACD", areacode]);

         } else {
           dataLayer.push({
             'event': 'deselectCross',
             'selected': 'deselect'
           })

           enableMouseEvents();
             //console.log("gone from indicatorDD");
           hideaxisVal();
           onLeave();
           resetZoom();
         }
       });

} // ends F indicatorDD


function indonchange(file_ext,i) {
      //console.log('indonchange to map'+file_ext,i);
            chartDrawn = false;
            subnavvalue = i;
            //load new ind csv file

            var filepth3 = "data/indicators/"+file_ext+".csv"; // data
    reDrawMap(filepth3,i);
}


  function subonchange(dom,co) {
        //console.log(dom, 'subonchange to map',co);
              chartDrawn = false;
              subnavvalue = co;
              //load new ind csv file

              var filepth2 = "data/subdoms/data"+dom+".csv";
      reDrawMap(filepth2,co);
  }


  function onchange2Dom(t) {
    //console.log('onchange2Dom to dom map'+t);
          chartDrawn = false;
          navvalue = t;
          //load new csv file
          var filepth = "data/doms/data" + t + ".csv";
          reDrawMap(filepth,t);
    }

  function reDrawMap(fileGet, selecti){

          d3.csv(fileGet, function(data) {
            if(fileGet.substring(5,15) == 'indicators'){
            thisdata = data.map(function(d){
            return {  'AREACD': d.AREACD,
              'AREANM': d.AREANM,
              'Time1': d.Time1,
              'Time2': d.Time2,
              'Time3': d.Time3,
              'Time4': d.Time4,
              'Time5': d.Time5,
              'Time6': d.Time6 };
            });
          } else { thisdata = data};

            setRates(thisdata);
            defineBreaks(thisdata);
            setupScales(thisdata);
            createKey(thisdata); // was config

            if (selected) {
              setAxisVal($("#areaselect").val());
              if (mobile == false) {
                if($("#areaselect").val() != "") {
                  updateChart($("#areaselect").val());
                }
              }
            }
            updateLayers();

            dataLayer.push({
              'event': 'navSelect',
              'selected': selecti
            })
          });

  }// ends reDrawMap


  function setRates(thisdata) {
      rateById = {};
      areaById = {};

      thisdata.forEach(function(d) {
        rateById[d.AREACD] = +eval("d." + variables[a]);
        areaById[d.AREACD] = d.AREANM
      });
//console.log(rateById);
    }

  // function setTimeLabel() {
  //     d3.select("#timePeriod").text(dvc.timepoints[a]);
  //   }

    function defineBreaks(data) {
      //Flatten data values and work out breaks
      var values = thisdata.map(function(d) {
        return +eval("d." + variables[a]);
      }).filter(function(d) {
        return !isNaN(d)
      }).sort(d3.ascending);


      //If jenks or equal then flatten data so we can work out what the breaks need to be

      // Work out how many timepoints we have in our dataset; number of rows - area name & code // Look at linechart templates to see how?
      // parse data into columns
      if (config.ons.breaks == "jenks" || config.ons.breaks == "equal") {
        var values = [];
        allvalues = [];

        for (var column in data[0]) {
          if (column != 'AREANM' && column != 'AREACD') {
            values[column] = data.map(function(d) {
              return +eval("d." + column);
            }).filter(function(d) {
              return !isNaN(d)
            }).sort(d3.ascending);
            allvalues = allvalues.concat(values[column]);
          }

        }
        allvalues.sort(d3.ascending);

         var upperh = [];
         upperh = allvalues.filter(function(d){
           return d>=100;})

         var lowerh = [];
         lowerh = allvalues.filter(function(d){
           return d<100;});
      } // ends equal

      if (config.ons.breaks == "jenks") {
        breaks = [];

        ss.ckmeans(allvalues, (dvc.numberBreaks)).map(function(cluster, i) {
          if (i < dvc.numberBreaks - 1) {
            breaks.push(cluster[0]);
          } else {
            breaks.push(cluster[0])
            //if the last cluster take the last max value
            breaks.push(cluster[cluster.length - 1]);
          }
        });
      } else if (config.ons.breaks == "equal") {
        var breaks1 = [], breaks2 = [];
        breaks1 = ss.equalIntervalBreaks(lowerh, 3);
        breaks2 = ss.equalIntervalBreaks(upperh, 3);
        breaks1.pop();
        breaks = [...breaks1, ...breaks2];
      } else {
        breaks = config.ons.breaks;
      };

      //round breaks to specified decimal places
      breaks = breaks.map(function(each_element) {
        return Number(each_element.toFixed(dvc.legenddecimals));
      });

      //work out halfway point (for no data position)
      midpoint = breaks[0] + ((breaks[dvc.numberBreaks] - breaks[0]) / 2)

    }/// ends function defineBreaks

    function setupScales() {
      //set up d3 color scales
      //Load colours
      if (typeof dvc.varcolour === 'string') {
        // colour = colorbrewer[dvc.varcolour][dvc.numberBreaks];
        color = chroma.scale(dvc.varcolour).colors(dvc.numberBreaks)
        colour = []
        color.forEach(function(d) {
          colour.push(chroma(d).darken(0.4).saturate(0.6).hex())
        })


      } else {
        colour = dvc.varcolour;
      }

      //set up d3 color scales
      color = d3.scaleThreshold()
        .domain(breaks.slice(1))
        .range(colour);

    }

    function defineLayers() {

      map.addSource('area', {
        'type': 'geojson',
        'data': areas
      });

      map.addLayer({
        'id': 'area',
        'type': 'fill',
        'source': 'area',
        'layout': {},
        'paint': {
          'fill-color': {
            type: 'identity',
            property: 'fill'
          },
          'fill-opacity': 0.7,
          'fill-outline-color': '#fff'
        }
      }, 'place_city');


      //Get current year for copyright
      today = new Date();
      copyYear = today.getFullYear();
      map.style.sourceCaches['area']._source.attribution = "Contains OS data &copy; Crown copyright and database right " + copyYear;

      map.addLayer({
        "id": "state-fills-hover",
        "type": "line",
        "source": "area",
        "layout": {},
        "paint": {
          "line-color": "#000",
          "line-width": 2
        },
        "filter": ["==", "AREACD", ""]
      }, 'place_city');


      map.addLayer({
        'id': 'area_labels',
        'type': 'symbol',
        'source': 'area',
        'minzoom': 10,
        'layout': {
          "text-field": '{AREANM}',
          "text-font": ["Open Sans", "Arial Unicode MS Regular"],
          "text-size": 14
        },
        'paint': {
          "text-color": "#666",
          "text-halo-color": "#fff",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      });


      //test whether ie or not
      function detectIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
          // IE 10 or older => return version number
          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
          // Edge (IE 12+) => return version number
          return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
      }


      if (detectIE()) {
        onMove = onMove.debounce(200);
        onLeave = onLeave.debounce(200);
      };

      //Highlight stroke on mouseover (and show area information)
      map.on("mousemove", "area", onMove);

      // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
      map.on("mouseleave", "area", onLeave);

      //Add click event
      map.on("click", "area", onClick);

    }


    function updateLayers() {

      //update properties to the geojson based on the csv file we've read in
      areas.features.map(function(d, i) {

        d.properties.fill = color(rateById[d.properties.AREACD])
      });

      //Reattach geojson data to area layer
      map.getSource('area').setData(areas);

      //set up style object
      styleObject = {
        type: 'identity',
        property: 'fill'
      }
      //repaint area layer map usign the styles above
      map.setPaintProperty('area', 'fill-color', styleObject);

    }


  function setButtons() {

    d3.select("#play").on("click", onPlay)

    d3.select("#forward").on("click", fwd_animate);

    d3.select("#back").on("click", rev_animate);

    }

    function onPlay() {
        fwd_animate(); // don't need a delay bfeore first animation
        animating = setInterval(function() {
          fwd_animate()
        }, 1500);

        // replace play control with pause
        d3.select("#play").select("span")
          .classed("glyphicon-play", false)
          .classed("glyphicon-pause", true);

        // switch id/class of play to pause
        d3.select("#play").attr("id", "pause");
        // change button event from play to pause
        d3.select("#pause").on("click", onPause);
      }

      function onPause() {
        // replace pause symbol with play symbol
        d3.select("#pause").select("span")
          .classed("glyphicon-pause", false)
          .classed("glyphicon-play", true);
        d3.select("#pause").attr("id", "play")
        // make symbols clickable - TODO is this required?
        setButtons();
        clearInterval(animating);
      }

      function fwd_animate() {
        // go forwards in time
        if (a < variables.length - 1) {
          a = a + 1;
        } else {
          a = 0;
        }

        moveSliderToVal();
        updateVisuals();
      }

      function rev_animate() {
        // go back in time
        if (a > 0) {
          a = a - 1;
        } else {
          a = variables.length - 1;
        }

        moveSliderToVal();
        updateVisuals();
      }

      function moveSliderToVal() {
        sliderSimple.silentValue(a);
      }

function updateVisuals() {

    setRates(thisdata);
    updateLayers();
    updateTimeLabel();

        if (selected) {
          setAxisVal($("#areaselect").val());
          if (mobile == false) {
            updateChart($("#areaselect").val());
          }
        }
        // if (mobile == false) {
        //   //console.log("here > desktop > circle ?");
        // //  if (average[avergLine[a]] != null) {
        //     d3.select("#currPoint2")
        //       .transition()
        //       .ease(d3.easeQuadOut)
        //       .duration(200)
        //       .attr("cx", x(dvc.timepoints[a]))
        //       .attr("cy", y(avergLine[a]));
        // }

  } // ends updateVisuals


  function updateTimeLabel() {
      d3.select("#timePeriod").select('p').text(dvc.timepoints[a])

    }

  function makeSlider() {

    var formatDate = d3.timeFormat("%D");
    sliderDomain = [0, variables.length-1];
    var mobileWidth = parseInt(d3.select('body').style("width")) - 145;
    if (mobile) {
      var sliderRange = [0, mobileWidth-70];
    } else {
      var sliderRange = [0, keywidth - dvc.keyMargin.right - dvc.keyMargin.left];
    };

  sliderScale = d3.scaleLinear()
      .domain(sliderDomain)
      .range(sliderRange);

    sliderSimple = d3.sliderBottom(sliderScale)
      .displayFormat(function(i) {
        return dvc.timepoints[i]; })
      .step(1)
      .default(a)
      .displayValue(!mobile)
      .handle(
        d3.symbol()
          .type(d3.symbolCircle)
          .size(500)
      )
      .fill("#206095")
      .ticks([]);

    sliderSimple.on('onchange', function(val) {
      // a is the master variable for the current timepoint
      if (a !== val) { // if a has changed
        a = val;
        // onPause();
        updateVisuals();
      }
    });

    if (mobile) {
      var sliderSvg = d3.select("#chartcol").append("svg")
        .attr("id","slider-svg");
    } else {
      var sliderSvg = d3.select("div#slider-simple").append("svg");
    }

    var gSimple = sliderSvg
      // .attr('width', parseInt(d3.select('#').style("width"))-140)
      .attr('height', 80 - 30*mobile)
      .attr('width', mobile ? mobileWidth : keywidth + dvc.keyMargin.left + dvc.keyMargin.right - 20 - 300*mobile)
      .append('g')
      .attr('transform', mobile ? 'translate(20,20)' : 'translate(' + (dvc.keyMargin.left + 30) + ',20)'); // extra 30 is to widen svg to go over top of map

    gSimple.call(sliderSimple);
  }

  d3.select('body').on('keydown',function(){
  if(document.getElementById("handle")===document.activeElement){//if handle is focussed
    var min = sliderDomain[0];
    var max = sliderDomain[1];
    var pageUpDownSteps = 5;

    if (d3.event.key=='ArrowLeft' || d3.event.key=='ArrowDown') {
      d3.event.preventDefault();
      if(a !== min){
        sliderSimple.value(a-1)
      }
    }
    if (d3.event.key=='ArrowRight' || d3.event.key=='ArrowUp') {
      d3.event.preventDefault();
      if(a !== max){
        sliderSimple.value(a+1)
      }
    }
    if (d3.event.key=='PageUp') {
      d3.event.preventDefault();
      if (a < max) {
        if (a+pageUpDownSteps > max) { // if a is close to max
          sliderSimple.value(max)
        } else { // if a is not close to max
          sliderSimple.value(a - pageUpDownSteps)
        }
      }
    }
    if (d3.event.key=='PageDown') {
      d3.event.preventDefault();
      if (a > min) {
        if (a-pageUpDownSteps < min) { // if a is close to min
          sliderSimple.value(min);
        } else { // if a is not close to min
          sliderSimple.value(a + pageUpDownSteps)
        }
      }
    }
    if (d3.event.key=='Home') {
      d3.event.preventDefault();
      sliderSimple.value(min)
    }
    if (d3.event.key=='End') {
      d3.event.preventDefault();
      sliderSimple.value(max)
    }
  }
});


    function onMove(e) {
      map.getCanvasContainer().style.cursor = 'pointer';

      newAREACD = e.features[0].properties.AREACD;

      // if (firsthover) {
      //   dataLayer.push({
      //     'event': 'mapHoverSelect',
      //     'selected': newAREACD
      //   })
      //
      //   firsthover = false;
      // }

      if (newAREACD != oldAREACD) {
        selected = true;
        oldAREACD = e.features[0].properties.AREACD;
        map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);

        selectArea(e.features[0].properties.AREACD);
        setAxisVal(e.features[0].properties.AREACD);
        if (mobile == false) {
          if(e.features[0].properties.AREACD !="") {
            updateChart(e.features[0].properties.AREACD);
          }
        }
      }
    };


  function onLeave() {
      selected = false;
      map.getCanvasContainer().style.cursor = null;
      map.setFilter("state-fills-hover", ["==", "AREACD", ""]);
      oldAREACD = "";
      $("#areaselect").val(null).trigger('chosen:updated');
      // console.log("gone from indicatorDD");
      hideaxisVal();
    };

  function onClick(e) {
      //console.log("onClick . updateChart");
      disableMouseEvents();
      newAREACD = e.features[0].properties.AREACD;

      if (newAREACD != oldAREACD) {
        oldAREACD = e.features[0].properties.AREACD;
        map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);

        selectArea(e.features[0].properties.AREACD);
        setAxisVal(e.features[0].properties.AREACD);
        if (mobile == false) {
          if(e.features[0].properties.AREACD !="") {
            updateChart(e.features[0].properties.AREACD);  //  !=""
            }
        }
      }

      // dataLayer.push({
      //   'event': 'mapClickSelect',
      //   'selected': newAREACD
      // })

    };

    function disableMouseEvents() {
      console.log("disableMouseEvents")
      map.off("mousemove", "area", onMove);
      map.off("mouseleave", "area", onLeave);

      selected = true;
    }

    function enableMouseEvents() {
      console.log("enableMouseEvents")
      map.on("mousemove", "area", onMove);
      map.on("click", "area", onClick);
      map.on("mouseleave", "area", onLeave);

      selected = false;
    }

    function selectArea(code) {
      $("#areaselect").val(code).trigger('chosen:updated');
      d3.select('abbr').on('keypress',function(evt){
        console.log(evt);
        console.log(d3.event.keyCode);
      if(d3.event.keyCode==13 || d3.event.keyCode==32){
        d3.event.preventDefault();
        onLeave();
        resetZoom();
      }
    })
    }



    function zoomToArea(code) {

      specificpolygon = areas.features.filter(function(d) {
        return d.properties.AREACD == code
      })

      specific = turf.extent(specificpolygon[0].geometry);

      map.fitBounds([
        [specific[0], specific[1]],
        [specific[2], specific[3]]
      ], {
        padding: {
          top: 150,
          bottom: 150,
          left: 100,
          right: 100
        }
      });

    }

    function resetZoom() {

      map.fitBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]]
      ]);

    }


  function setAxisVal(code) {
  //  console.log("setAxisVal",code);

    d3.select('#accessibilityInfo').select('p.visuallyhidden')
    .text(function(){
      if (!isNaN(rateById[code])) {
        return areaById[code]+": "+ displayformat(rateById[code]) +" "+ dvc.varunit;
      } else {
        return "Data unavailable";
      }
    });


  if (mobile == false) {

        d3.select("#currVal2")
          .text(function() {
            if (!isNaN(rateById[code])) {
              return displayformat(rateById[code]);
            } else {
              return "Data unavailable"
            }
          })
          .style("opacity", 1)
          .transition()
          .ease(d3.easeQuadOut)
          .duration(300)
          .attr("x", x(dvc.timepoints[a]))
          .attr("y", function() {
            if (!isNaN(rateById[code])) {
              return y(rateById[code]);
            } else {
              return y(midpoint)
            }
          })
           .attr("y", findCurrValy(code)+5)
           .attr("text-anchor", "middle");

          // findCurrValy

        d3.select("#currPoint")
          .text(function() {
            if (!isNaN(rateById[code])) {
              return displayformat(rateById[code])
            } else {
              return "Data unavailable"
            }
          })
          .style("opacity", function() {
                  if (!isNaN(rateById[code])) {
                    return 1
                  } else {
                    return 0
                  }
          })
          .transition()
          .ease(d3.easeQuadOut)
          .duration(300)
          .attr("cx", x(dvc.timepoints[a]))
          .attr("cy", function() {
            if (!isNaN(rateById[code])) {
              return y(rateById[code])
            } else {
              return 0
            }
          });

      } else {

        d3.select("#currLine")
          .style("opacity", function() {
            if (!isNaN(rateById[code])) {
              return 1
            } else {
              return 0
            }
          })
          .transition()
          .duration(400)
          .attr("x1", function() {
            if (!isNaN(rateById[code])) {
              return xkey(rateById[code])
            } else {
              return xkey(midpoint)
            }
          })
          .attr("x2", function() {
            if (!isNaN(rateById[code])) {
              return xkey(rateById[code])
            } else {
              return xkey(midpoint)
            }
          });


        d3.select("#currVal")
          .text(function() {
            if (!isNaN(rateById[code])) {
              return displayformat(rateById[code])
            } else {
              return "Data unavailable"
            }
          })
          .style("opacity", 1)
          .transition()
          .duration(400)
          .attr("x", function() {
            if (!isNaN(rateById[code])) {
              return xkey(rateById[code])
            } else {
              return xkey(midpoint)
            }
          });


      } // ends else

    }

    function findCurrValy(icode) {
            if (!isNaN(rateById[icode])) { // if there exists a numerical value
              // if value is greater than threshold, put it below the line
              var yThreshold = ( y.domain()[0] + y.domain()[1] ) * 2 / 3
              if (rateById[icode] > yThreshold ) {
                yAdjustment = 22
              } else { // otherwise it goes above
                yAdjustment = -12
              }
              return y(rateById[icode]) + yAdjustment
            } else { // if there is no numerical value
              return y(midpoint)
            }
          }


  function updateChart(code) {
  //  console.log("updateChart", code);
      if (chartDrawn == false) {
        chartDrawn = true;

        selectedarea = thisdata.filter(function(d) {
          return d.AREACD == code;
        });

        selectedarea.forEach(function(d) {
          //console.log(d)
          valuesx = variables.map(function(name) {
              return +d[name];
          //  return +d[name];
          });
        });

        values = valuesx.slice(0);
        //console.log(values)

        linedata = d3.zip(dvc.timepoints, values);

        line1 = d3.line()
          .defined(function(linedata) {
            return !isNaN(linedata[1]);
          })
          .x(function(d, i) {
            return x(linedata[i][0]);
          })
          .y(function(d, i) {
            return y(linedata[i][1]);
          });


  var gline1 = svgkeyGroup.select("#chartgroup");

        gline1.append("path")
              .attr("id", "line1")
              .style("opacity", 1)
              .attr("d", line1(linedata))
              .attr("stroke", "black")
              .attr("stroke-width", "2px")
              .attr("fill", "none")
              .style("opacity", 0.5);

            gline1.append("circle")
              .attr("id", "currPoint")
              .attr("r", "4px")
              .attr("cy", y(linedata[a][1]))
              .attr("cx", x(dvc.timepoints[a]))
              .attr("fill", "#666")
              .attr("stroke", "black")
              .style("opacity", 0)


      } else {

        selectedarea = thisdata.filter(function(d) {
          return d.AREACD == code
        });

        selectedarea.forEach(function(d) {
          valuesx = variables.map(function(name) {
            return +d[name]
          });
        });

        values = valuesx.slice(0);
          //console.log(values);
        linedata = d3.zip(dvc.timepoints, values);

        d3.select("#line1")
          .style("opacity", 0.5)
          .transition()
          .duration(300)
          .attr("d", line1(linedata))

      }

  } // ends updateChart


  function hideaxisVal() {
      d3.select("#line1")
        .style("opacity", 0);

      d3.select("#currPoint")
        .style("opacity", 0);

      d3.select("#currLine")
        .style("opacity", 0);

       d3.select("#currVal").text("")
         .style("opacity", 0);

      d3.select("#currVal2")
        .style("opacity", 0);
    }

function createKey(avdata) {
//console.log(avdata)
      d3.select("#keydiv").selectAll("*").remove();

      var color = d3.scaleThreshold()
        .domain(breaks)
        .range(colour);

      if (mobile == false) {

        d3.select("#keydiv").append("p")
                  .attr("class", "keyunit")
                  .attr('aria-hidden',true)
                  .style("margin-top", "10px")
                  .style("margin-left", "10px")
                  .style("color", "#666666")
                  .text(dvc.varunit);
                //  .text(dvc.varunit[b]);

          d3.select("#keydiv").append("p")
                    .attr("class", "keyunit")
                    .attr('aria-hidden',true)
                    .style("margin-top", "5px")
                    .style("margin-left", "10px")
                    .style("color", "#0f8243")
                    .text("England average");



        svgkey = d3.select("#keydiv")
          .append("svg")
          .attr("id", "key")
          .attr('aria-hidden',true)
          .attr("width", keywidth)
          .attr("height", keyheight + 50);

          svgkeyGroup = svgkey.append("g")
        .attr("transform", "translate(" + dvc.keyMargin.left + ",10)");


        // Set up scales for legend
        y = d3.scaleLinear()
          .domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
          .range([keyheight, 0]); /*range for pixels*/

        // Set up scales for chart
        x = d3.scalePoint()
          .domain(dvc.timepoints) /*range for data*/
          .range([0, keywidth - 70])
          // - dvc.keyMargin.left - dvc.keyMargin.right])
          .align(0.5); /*range for pixels*/

        var yAxis = d3.axisLeft(y)
          .tickSize(15)
          .tickValues(color.domain())
          //.tickFormat(legendformat);

        //Add
        var xAxisTime = d3.axisBottom(x)
          .tickSize(5)
          .tickValues(dvc.timelineLabelsDT)
          .tickFormat(function(d,i){
            return "'"+d.slice(2,4);
           });

          // create g2 before g so that its contents sit behind


        var g = svgkeyGroup.append("g").attr("id", "vert")
          .attr("transform", "translate(-15,10)")
          .attr("font-weight", "400")
          .style("font-family", "'open sans'")
          .style("font-size", "14px");

          var g2 = svgkeyGroup.append("g")
          .attr("transform", "translate(-10,10)")
            .attr("id", "chartgroup");

      //  d3.selectAll("path").attr("display", "none")

        g.selectAll("rect")
          .data(color.range().map(function(d, i) {
            return {
              y0: i ? y(color.domain()[i]) : y.range()[0],
              y1: i < color.domain().length ? y(color.domain()[i + 1]) : y.range()[1],
              z: d
            };
          }))
          .enter().append("rect")
          .attr("width", 8)
          .attr("x", -8)
          .attr("y", function(d) {
            return d.y1;
          })
          .attr("height", function(d) {
            return d.y0 - d.y1;
          })
          .style("fill", function(d) {
            return d.z;
          });

        g.call(yAxis).append("text"); //.attr("id", "ticky");
      //  console.log(yAxis.tickValues()[3]);


        //  d3.selectAll("#vert g.tick").select("text").attr("id", "ticky");

          // d3.selectAll("#vert g.tick").select("text:nth-child(3)").attr("id", "tick100");

      var textElements = d3.selectAll("#vert g.tick").select("text").nodes(); // <== Get all elements
d3.select(textElements[3]).attr("font-weight","bold").attr("font-size", "16px");

        // forEach(function(d,i){
        //     console.log(d,i);
        // })

        svgkey.append("g").attr("id", "timeaxis")
          .attr("transform", "translate(45," + (30 + keyheight) + ")")
          .attr("font-weight", "400")
          .style("font-family", "'open sans'")
          .style("font-size", "12px")
          .call(xAxisTime);


//////???? This brings the averge value and circle back
        // g2.append("text")
        //   .attr("id", "currVal")
        //   .attr("y", y(11))
        //   .attr("fill", "#000")
        //   .attr("paint-order", "stroke")
        //   .attr("stroke", "#fff")
        //   .attr("stroke-width", "5px")
        //   .attr("stroke-linecap", "butt")
        //   .attr("stroke-linejoin", "miter")
        //   .text("");

        // g.append("circle")
        //   .attr("id", "currPoint")
        //   .attr("r", "4px")
        //   .attr("cy", y(linedata2[a][1]) )
        //   .attr("cx", x(dvc.timepoints[a]))
        //   .attr("fill", "#666")
        //   .attr("stroke", "black")
        //   .attr("opacity", 0);


// avdata  avdata  avdata   avdata
      engAvg = thisdata.filter(function(d) {
        return d.AREACD == "E92000001"
      });

      engAvg.forEach(function(d) {

        valuesx = variables.map(function(name) {
          // Upper and lower can be here
          return +d[name];
        });
      });

      values = valuesx.slice(0);

linedata2 = d3.zip(dvc.timepoints, values);


        // NOT SURE here
        varNum = navvalue;


        line2 = d3.line()
          .defined(function(d) {
            return !isNaN(d[0]);
          })
          .x(function(d) {
            return x(d[0]);
          })
          .y(function(d) {
            return y(d[1]);
          });


          g2.append("path")
            .attr("id", "line2")
            .attr("d", line2(linedata2))
            .attr("stroke", "#0F8243")
            .attr("stroke-width", "2px")
            .attr("fill", "none");

          // add time dot for line2
          g2.append("circle")
            .attr("id", "currPoint2")
            .attr('r',"4px")
            .attr("cy", function() {

              if (avergLine[a] != null) {
                return y(avergLine[a]) // set start position
              } else {
                return y(0) // placeholder because no data for this variable
              }
            })
            .attr("cx", x(dvc.timepoints[a]))
            .attr("fill", "#b0b0b0")
            .attr("stroke", "#0F8243")

          // g2.append("text")
          //     .attr("id", "averagelabel")
          //     .attr("x", function(d) {
          //       return x(linedata2[linedata2.length - 1][0])
          //     })
          //     .attr("y", function(d) {
          //       return y(linedata2[linedata2.length - 1][1]) - 10 // use this number at end to adjust height of label
          //     })
          //     .attr("font-size", "12px")
          //     .attr("fill", "#757575")
          //     .attr("text-anchor", "end")
          //     .text(dvc.averageText);

              g2.append("text")
                    .attr("class", "keyunit")
                    .attr('aria-hidden',true)
                  //  .attr y  y(yaxis(domain(1)))
                  .attr("x", 10)
                  .attr("y", 10)
                  .style("fill", "#999")
                    .text("Better");

              g2.append("text")
                    .attr("class", "keyunit")
                    .attr('aria-hidden',true)
                  //  .attr y  y(yaxis(domain(1)))
                  .attr("x", 10)
                  .attr("y", keyheight)
                  .style("fill", "#999")
                    .text("Worse");

                    // causes ghost text???
                    g2.append("text")
                      .attr("id", "currVal2")
                      .attr("y", y(11))
                      .attr("fill", "#000")
                      .attr("paint-order", "stroke")
                      .attr("stroke", "#fff")
                      .attr("stroke-width", "5px")
                      .attr("stroke-linecap", "butt")
                      .attr("stroke-linejoin", "miter")
                      .style("stroke-opacity", 0.6)
                      .text("");


        // svgkey.append("g")
        //   .attr("transform", "translate(45,20)")
        //   .attr("id", "chartgroup")
        //   .append("path")
        //   .attr("id", "line2")
        //   .style("opacity", 0.3)
        //   .attr("d", line2(linedata2))
        //   .attr("stroke", "#666")
        //   .attr("stroke-width", "2px")
        //   .attr("fill", "none");
        //
        // svgkey.append("text")
        //   .attr("id", "averagelabel")
        //   .attr("x", function(d) {
        //     return x(linedata2[linedata2.length - 1][0])
        //   })
        //   .attr("y", function(d) {
        //     return y(linedata2[linedata2.length - 1][1])
        //   })
        //   .attr("font-size", "12px")
        //   .style("opacity", 0.3)
        //   .attr("fill", "#666")
        //   .attr("text-anchor", "middle")
        //   .text(dvc.averageText);


      } else { // (mobile !== false)
        // Horizontal legend
        keyheight = 65;

        keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

        svgkey = d3.select("#keydiv")
          .append("svg")
          .attr("id", "key")
          .attr("width", keywidth)
          .attr("height", keyheight);


        xkey = d3.scaleLinear()
          .domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
          .range([0, keywidth - 30]); /*range for pixels*/

        y = d3.scaleLinear()
          .domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
          .range([0, keywidth - 30]); /*range for pixels*/

        var xAxis = d3.axisBottom(xkey)
          .tickSize(15)
          .tickValues(color.domain())
        //  .tickFormat(legendformat);

        var g2 = svgkey.append("g").attr("id", "horiz")
          .attr("transform", "translate(15,36)");


        keyhor = d3.select("#horiz");

        g2.selectAll("rect")
          .data(color.range().map(function(d, i) {

            return {
              x0: i ? xkey(color.domain()[i + 1]) : xkey.range()[0],
              x1: i < color.domain().length ? xkey(color.domain()[i + 1]) : xkey.range()[1],
              z: d
            };
          }))
          .enter().append("rect")
          .attr("class", "blocks")
          .attr("height", 8)
          .attr("x", function(d) {
            return d.x0;
          })
          .attr("width", function(d) {
            return d.x1 - d.x0;
          })
          .style("opacity", 0.8)
          .style("fill", function(d) {
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
          .attr("opacity", 0);

        g2.append("text")
          .attr("id", "currVal")
          .attr("x", xkey(10))
          .attr("y", -15)
          .attr("fill", "#000")
          .text("");


        keyhor.selectAll("rect")
          .data(color.range().map(function(d, i) {
            return {
              x0: i ? xkey(color.domain()[i]) : xkey.range()[0],
              x1: i < color.domain().length ? xkey(color.domain()[i + 1]) : xkey.range()[1],
              z: d
            };
          }))
          .attr("x", function(d) {
            return d.x0;
          })
          .attr("width", function(d) {
            return d.x1 - d.x0;
          })
          .style("fill", function(d) {
            return d.z;
          });

        keyhor.call(xAxis).append("text")
          .attr("id", "caption")
          .attr("x", -63)
          .attr("y", -20)
          .text("");

        keyhor.append("rect")
          .attr("id", "keybar")
          .attr("width", 8)
          .attr("height", 0)
          .attr("transform", "translate(15,0)")
          .style("fill", "#ccc")
          .attr("x", xkey(0));


        if (dvc.dropticks) {
          d3.select("#timeaxis").selectAll("text").attr("transform", function(d, i) {
            // if there are more that 4 breaks, so > 5 ticks, then drop every other.
            if (i % 2) {
              return "translate(0,10)"
              }
            });
          } // ends if

      } // ends else for mobile, #horiz

  } // Ends create key

    function addFullscreen() {

      currentBody = d3.select("#map").style("height");
      d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight)

    }

    function setbodyheight() {
      d3.select("#map").style("height", "100%");

      document.addEventListener('webkitfullscreenchange', exitHandler, false);
      document.addEventListener('mozfullscreenchange', exitHandler, false);
      document.addEventListener('fullscreenchange', exitHandler, false);
      document.addEventListener('MSFullscreenChange', exitHandler, false);

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
        'event': 'geoLocate',
        'selected': 'geolocate'
      })

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
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

      map.setFilter("state-fills-hover", ["==", "AREACD", features[0].properties.AREACD]);

      selectArea(features[0].properties.AREACD);
      setAxisVal(features[0].properties.AREACD);
      if (mobile == false) {
        if(e.features[0].properties.AREACD != "") {
          updateChart(e.features[0].properties.AREACD);
        }
      }


    };

  function setSource() {
      d3.select("#source")
        .append("h5")
        .attr("class", "source")
        .style("font-size", "14px")
        .style("fill", "#323132")
        .style("font-weight", 600)
        .text("Source: "+dvc.sourcetext)
    }

  function selectlist(datacsv) {
  //  console.log(datacsv);
      var areasDD = datacsv.map(function(d) {
        return d.AREACD;
      });
    //  console.log(areasDD)
      var labelsDD = areasDD.filter(function(d){
        return d != 'E92000001';});
          //console.log(labelsDD)

      var namesDD = datacsv.map(function(d) {
        return d.AREANM;
      });
      var codesDD = namesDD.filter(function(d){
        return d != 'England';});

      var menuarea = d3.zip(codesDD, labelsDD).sort(function(a, b) {
       return d3.ascending(a[0], b[0]);
      });

      //hide area dropdown to screen reader if on mobile
    if(mobile==true){
      d3.select("selectNav").attr('aria-hidden',true)
    }

      var optns = d3.select("#selectNav").append("div").attr("id", "sel").append("select")
        .attr("id", "areaselect")
        .attr("style", "width:99%")
        .attr("class", "chosen-select");

      optns.append("option");

      optns.selectAll("p")
            .data(menuarea).enter()
            .append("option")
            .attr("value", function(d) {
              return d[1]
            })
            .text(function(d) {
              return d[0]
            });

      //myId = null; // whats this??

      $('#areaselect').chosen({
        placeholder_text_single: "Select an area",
        allow_single_deselect: true
      });

      d3.select('input.chosen-search-input')
        .attr('id','chosensearchinput');

    d3.select('div.chosen-search')
      .insert('label','input.chosen-search-input')
      .attr('class','visuallyhidden')
      .attr('for','chosensearchinput').html("Type to select an area");

      $('#areaselect').on('change', function() {

        if ($('#areaselect').val() != "") {

          // if there's a place in areaselect, somewhere is selected
          selected = true;

          areacode = $('#areaselect').val();

          disableMouseEvents();

          map.setFilter("state-fills-hover", ["==", "AREACD", areacode]);

          selectArea(areacode);

          if (mobile == false) {
            if(areacode != "") {
              updateChart(areacode);
            }
          }
          setAxisVal(areacode);
          zoomToArea(areacode);

          dataLayer.push({
            'event': 'mapDropSelect',
            'selected': areacode
          })
        } else {

          dataLayer.push({
            'event': 'deselectCross',
            'selected': 'deselect'
          })

          enableMouseEvents();
          console.log("gone from selectlist");
          hideaxisVal();
          onLeave();
          resetZoom();
        }

      });

    }; // ends F selectlist for areas

    pymChild.sendHeight()
  }

} else {
  //provide fallback for browsers that don't support webGL
  d3.select('#map').remove();
  d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>");

}
