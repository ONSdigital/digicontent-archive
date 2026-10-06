config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"val":"All", "val2":"Women", "val3": "Men"},
    //the keys match the column names
    "colour_palette": ["#27A0CC", "#9A86E9",  "#3FB0B3"],
    "sourceText": "Crime Survey for England and Wales (CSEW) from the Office for National Statistics",
    "accessibleSummary":"This chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
    "numberFormat":".0f",
    "xAxisLabel":"Number of victims (thousands)",
    "xDomain":[0,800],
    // either auto or a custom domain as an array e.g [0,100]
    "compareLabels":[],
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 20,
        "right": 15,
        "bottom": 45,
        "left": 100
      },
      "md": {
        "top": 20,
        "right": 15,
        "bottom": 45,
        "left": 100
      },
      "lg": {
        "top": 20,
        "right": 15,
        "bottom": 45,
        "left": 100
      }
    },
    "seriesHeight":{
      "sm": 30,
      "md": 30,
      "lg": 30
    },
    "xAxisTicks":{
      "sm":8,
      "md":8,
      "lg": 8
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
