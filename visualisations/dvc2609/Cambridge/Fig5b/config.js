config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#27A0CC",
    "sourceText": "Office for National Statistics – Census 2021",
    // "sourceText": "Office for National Statistics – Dataset name",
    "accessibleSummary":"The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below",
    "dataLabels":{
      "show":false,
      "numberFormat":".1f",
          //takes d3 number formats e.g
      // .0f for a number with 0 decimal places
      // .1% for a percentage with 1 decimal place
      "widthThreshold":30
     //hides data labels if bar is smaller than this
    },
    "yDomain":[0,20],
    "aspectratio":{
      "sm":4,
      "md":4,
      "lg":4
    },
    // either "auto" or an array for the x domain e.g. [0,100]
    "yAxisTickFormat": ".0f",
    //uses same format as the numberFormat above
    "xAxisLabel":"Age disparity (years)",
    "yAxisLabel":"%",
    "lastchart":"16 to 24 years",
    "lastchart":"75 years and over"
    // sets the width of the caps to the CI line - use the defaults unless necessary
  },
  "optional": {
    "margin": {
      "sm": {
        "top":28,
        "right": 25,
        "bottom": 38,
        "left": 52
      },
      "md": {
        "top": 28,
        "right": 25,
        "bottom": 38,
        "left": 52
      },
      "lg": {
        "top": 28,
        "right": 25,
        "bottom": 38,
        "left": 52
      }
    },
//y axis ticks  - number of ticks
    "yAxisTicks":{
      "sm":2,
      "md":6,
      "lg":6
    },
 //x axis ticks - ticks every x points
    "xAxisTicks":{
      "sm":5,
      "md":5,
      "lg":5
    },

    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
