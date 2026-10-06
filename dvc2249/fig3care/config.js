config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"min":"Female", "max":"Male"},
    //the keys match the column names
    "colour_palette": ["#6749A6", "#2EA1A4"],
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary":"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title. The underlying data is available in the accompanying data download.",
    "numberFormat":".0f",
    "axisFormat":".0%",
    "xAxisLabel":"Percentage providing unpaid care",
    "xDomain":[0,0.4]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 70
      },
      "md": {
        "top": 5,
        "right": 20,
        "bottom": 20,
        "left": 110
      },
      "lg": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 110
      }
    },
    "seriesHeight":{
      "sm":40,
      "md":40,
      "lg":40
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
