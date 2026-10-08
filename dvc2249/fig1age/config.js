config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#27A0CC",
    "sourceText": "Census 2011 and 2021 from the Office for National Statistics",
    "accessibleSummary":"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title. The underlying data is available in the accompanying data download.",
    "dataLabels":{
      "show":false,
      "numberFormat":".0%"
    },
    "xDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Percentage of usual residents at each age"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 55
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 90
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 90
      }
    },
    "seriesHeight":{
      "sm":1,
      "md":1,
      "lg":1
    },
    "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
