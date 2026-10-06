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
    "dataLabels1":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":[0,0.55]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 50,
        "bottom": 20,
        "left": 150
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 250
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 250
      }
    },
    "seriesHeight":{
      "sm":60,
      "md":40,
      "lg":40
    },
    "xAxisTicks":{
      "sm":3,
      "md":10,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
