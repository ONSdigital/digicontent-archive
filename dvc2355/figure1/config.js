config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#206095",
    "sourceText": "Office for National Statistics – Business Insights and Conditions Survey",
    "accessibleSummary":"The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":[0,1],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Percentage of businesses"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 240
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 280
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 280
      }
    },
    "seriesHeight":{
      "sm":30,
      "md":25,
      "lg":25
    },
    "xAxisTicks":{
      "sm":2,
      "md":5,
      "lg":5
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
