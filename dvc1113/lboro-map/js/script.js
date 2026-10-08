//test if browser supports webGL

if (Modernizr.webgl) {

  //setup pymjs
  var pymChild = new pym.Child();

  //Load data and config file
  d3.queue()
    .defer(d3.json, "data/config.json")
    .defer(d3.json, "data/cases.json")
    .await(ready);

  var displayedData;

  function ready(error, config, area) {

    formatDate = d3.timeFormat("%d/%m");

    //convert topojson to geojson
    for(key in area.objects){
      var areas = topojson.feature(area,area.objects[key])
    }

    //Set up global variables
    dvc = config.ons;
    minDate = new Date("Thu Oct 01 2020 00:00:00 GMT+0100 (British Summer Time)");
    maxDate = new Date("Wed Dec 02 2020 00:00:00 GMT+0000 (Greenwich Mean Time)");
    var circleMultiplier = 5;

    d3.select("#source").html("Source: "+dvc.source)

    //set title of page
    document.title = dvc.maptitle;

    //set up basemap
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'data/style.json', //stylesheet location
      center: [-1.213004616473654, 52.76863968334138], // starting position
      zoom: 12.130118099867014, // starting zoom
      maxBounds: [[-1.3831021802726013, 52.70654560176658], [-1.0811460087489024, 52.82564897372987]],//limit it to just Loughborough
      // minZoom: 4,
      // maxZoom: 17, //
      attributionControl: false
    });
    //add fullscreen option
    // map.addControl(new mapboxgl.FullscreenControl());

    // Add zoom and rotation controls to the map.
    // map.addControl(new mapboxgl.NavigationControl());

    // Disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map zoom when using scroll
    map.scrollZoom.disable();

    // Disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    // Disable double click zoom
    map.doubleClickZoom.disable();

    //disable keyboard zoom
    map.keyboard.disable();

    //disable box zoom handler
    map.boxZoom.disable();

      //add compact attribution
    map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      // add zoomstack attribution
      customAttribution: "Contains OS data © Crown copyright and database right (" + new Date().getFullYear() + ")"
    }));

    //define mouse pointer
    map.getCanvasContainer().style.cursor = 'pointer';

    addFullscreen();

    map.fitBounds([
      [-1.2731591701794684, 52.74490726640602],
      [-1.152850062764486, 52.79235917125371]
    ]);

      map.on('load', function() {

      //Add the geojsons
      map.addSource('cases', { 'type': 'geojson', 'data': areas });

      map.addLayer({
        'id': 'cases',
        'type': 'circle',
        'source': 'cases',
        'touchAction':'none',
        'layout': {
          'circle-sort-key':['get','date_unix']
        },
        'paint': {
          'circle-color': "rgba(0,0,0,0)",
          "circle-radius": 0,
          'circle-stroke-color':["case",
            ["==",['get','location'],"Private"],
            '#206095',
            ["==",['get','location'],"Halls"],
            '#A8BD3A',
            'white'
          ],
          'circle-stroke-width':['*', ['get', 'cases'], circleMultiplier],


      //     ['interpolate',
      //     ['linear'], ['zoom'],
      //   10, ['*', ['get', 'cases'], circleMultiplier], 30],
      //   13, ['*', ['get', 'cases'], circleMultiplier], 10]
      // ]
        }
      }, 'place_city');
      //
      updateFeatureState(minDate.getTime())

    });


    //advance through the displayed data

    $("#forward").click(function(event) {
      changeDate("forward");
    });

    $("#back").click(function(event) {
      changeDate("back")
    });

    var playing = false
    var timer

    $("#advance").click(function(event) {
      if (playing===false){
        changeDate("forward")
        timer = setInterval(function(){changeDate("forward")},500)
        d3.select("#advanceIcon").attr("class", "glyphicon glyphicon-pause")
        playing = true
      } else {
        d3.selectAll("#advanceIcon").attr("class", "glyphicon glyphicon-play")
        playing = false
        clearInterval(timer);
      }
    });

    function addFullscreen() {
      currentBody = d3.select("#map").style("height");
      d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight);
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

    function updateFeatureState(timeval) {


    map.setPaintProperty(
      'cases',
      'circle-stroke-opacity',
      ['interpolate',
      ['linear'],
        [
          "/",
          ['-', timeval, ['get', 'date_unix']],//time between now and start date
          ['-', ['get', 'date_plus_7_unix'], ['get', 'date_unix']] //time between start date and end date
        ],
          -9999,0,
          -0.001,0,
          0,0.7,// when the calculated value is 0 is when clusters starts, set opacity to 0.7
          1,0.3,// Opacity is 0.3 is when cluster finishes
          1.001,0,
          9999,0
      ]
    );

  map.setPaintProperty(
    'cases',
    'circle-blur',
    ['interpolate',
    ['linear'],
      [
        "/",
        ['-', timeval, ['get', 'date_unix']],//time between now and start date
        ['-', ['get', 'date_plus_7_unix'], ['get', 'date_unix']] //time between start date and end date
      ],
        -9999,0,
        -0.001,0,
        0,0.0,// 0 is when clusters starts
        1,1,// Opacity is 0.3 is when cluster finishes
        1.001,1,
        9999,1
    ]
  );


  map.setPaintProperty(
    'cases',
    'circle-radius',
    ['interpolate',
    ['linear'],
      [
        "/",
        ['-', timeval, ['get', 'date_unix']],//time between now and start date
        ['-', ['get', 'date_plus_7_unix'], ['get', 'date_unix']] //time between start date and end date
      ],
        -9999,0,
        -0.001,0,
        0,0,// 0 is when clusters starts
        1,['*', ["sqrt",['get', 'cases']], circleMultiplier],// 0 is when clusters starts
        1.001,0,
        9999,0
    ]
  );

  map.setPaintProperty(
    'cases',
    'circle-stroke-width',
    ['interpolate',
    ['linear'],
      [
        "/",
        ['-', timeval, ['get', 'date_unix']],//time between now and start date
        ['-', ['get', 'date_plus_7_unix'], ['get', 'date_unix']] //time between start date and end date
      ],
        -9999,0,
        -0.001,0,
        0,['*', ["sqrt",['get', 'cases']], circleMultiplier],// 0 is when clusters starts
        1,0,// Opacity is 0.3 is when cluster finishes
        1.001,0,
        9999,0
    ]
  );
}//end updateFeatureState

    displayedData = minDate

    function changeDate(direction)  {
      if (direction === "forward") {
        if (displayedData.getTime() < maxDate.getTime()){
          displayedData = displayedData.addDays(1)
        } else {
          displayedData = minDate
        }
      }

      if (direction === "back") {
        if (displayedData.getTime() > minDate.getTime()){
          displayedData = displayedData.addDays(-1)
        } else {
          displayedData = maxDate
        }
      }

      if (direction === "end") {
        displayedData = maxDate
      }

      if (direction === "start") {
        displayedData = minDate
      }

      updateFeatureState(displayedData.getTime())
      sliderSimple.silentValue(displayedData)
    }

    // time slider bits

    sliderSimple = d3
      .sliderBottom()
      .min(minDate)
      .max(maxDate)
      .width(parseInt(d3.select('body').style("width"))-210)
      .default(minDate)
      // .step(1000*60*60*24)
      .marks(d3.timeDay.range(minDate,maxDate,1).concat(maxDate))
      .handle(
        d3.symbol()
          .type(d3.symbolCircle)
          .size(500)
      )
      .fill("#206595");

      if (parseInt(d3.select('body').style('width')) > 700) {
        sliderSimple
          .tickFormat(formatDate)
          .displayFormat(d3.timeFormat("%d/%m"))
          .ticks(10)

      }else{
        sliderSimple
          .displayFormat(formatDate)
          .tickFormat(d3.timeFormat("%d %b"))
          .ticks(4);
      }

      sliderSimple.on('onchange', function(val){
        updateFeatureState(val.getTime())
        displayedData = val
      });

      var gSimple = d3
      .select('div#slider-simple')
      .append('svg')
      .attr('width', parseInt(d3.select('body').style("width"))-140)
      .attr('height', 75)
      .append('g')
      .attr('transform', 'translate(30,20)');

      gSimple.call(sliderSimple);

      //Time slider accessibility
      d3.select('.playbackcontrols').on('keydown',function(){
          if (d3.event.key=='ArrowRight' || d3.event.key=='ArrowUp') {
            changeDate("forward")
          }
          if (d3.event.key=='ArrowLeft' || d3.event.key=='ArrowDown') {
            changeDate("back")
          }
          if (d3.event.key=='PageDown' || d3.event.key=='End') {
            changeDate("end")
          }
          if (d3.event.key=='PageUp' || d3.event.key=='Home') {
            changeDate("start")
          }

      })

      pymChild.sendHeight();

  } //end function ready

} else {

  //provide fallback for browsers that don't support webGL
  d3.select('#map').remove();
  d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>");

}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
