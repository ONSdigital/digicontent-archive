config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#27A0CC","#27A0CC","#27A0CC","#27A0CC","#27A0CC"],
    "colour_palette_average": ["#222","#222","#222","#222","#222"],
    "fillOpacity":1,
    "strokeOpacity":1,
        "radius": 2.3,
      "stripHeight":{
      "sm":150,
      "md":150,
      "lg":150
    },
    "sourceText": "Office for National Statistics analysis using Longitudinal Education Outcomes (LEO) from the Department for Education (DfE)",
    "accessibleSummary":"This chart is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "xDomain":[-12.1,12.1],
    // "yDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Educational attainment index score",
    "yAxisLabel":"",
    "xAxisFormat":".0f",
    "yAxisFormat":"",
    "showGuidelines":"True",
    //iterations is the number of times the simulation needs to run before it is stable. 
    //the default is 50 but more points will need longer - but longer will take longer to load
    "iterations":"300"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 63,
        "right": 0,
        "bottom": 50,
        "left": 0
      },
      "md": {
        "top": 63,
        "right": 0,
        "bottom": 50,
        "left": 0
      },
      "lg": {
        "top": 63,
        "right":0,
        "bottom": 50,
        "left":0
      }
    },
    "xAxisTicks":{
      "sm":4,
      "md":5,
      "lg":5
    },
    "yAxisTicks":{
      "sm":10,
      "md":10,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":0, "titles":0},
  "chart_build":{}
};
