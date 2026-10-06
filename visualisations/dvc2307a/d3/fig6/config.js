config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["In care", "Not in care"],
    "colour_palette": ["#206095", "#A8BD3A"],
    "sourceText": "ONS analysis of Growing Up in England data",
    "accessibleSummary":"The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":"auto"
    // either "auto" or an array for the x domain e.g. [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
     "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 120
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom":20,
        "left": 170
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 170
      }
    },
    "seriesHeight":{
      "sm":40,
      "md":28,
      "lg":28
    },
    "aspectRatio": {
      "sm": [5, 6],
      "md": [15, 6],
      "lg": [15, 9]
    },
    "xAxisTicks":{
      "sm":2,
      "md":10,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
