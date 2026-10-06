 config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"val":"Female", "val2":"Male"},
    //the keys match the column names
    "colour_palette": ["#6749A6", "#2EA1A4"],
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary":"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title. The underlying data is available in the accompanying data download.",
    "numberFormat":".0%",
    "xAxisLabel":"Percentage of adult children",
    "xDomain":[0,0.22]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": { 
    "margin": {
      "sm": {
        "top": 5,
        "right": 10,
        "bottom": 40,
        "left": 80
      },
      "md": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 125
      },
      "lg": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 125
      }
    },
    "seriesHeight":{
      "sm":50,
      "md":50,
      "lg":50
    
    },
    "xAxisTicks":{
      "sm":5,
      "md":6,
      "lg":7
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
