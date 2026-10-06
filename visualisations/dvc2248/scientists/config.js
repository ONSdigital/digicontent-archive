config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"min":"Women", "max":"Men"},
    //the keys match the column names
    "colour_palette": ["#6749A6","#2EA1A4"],
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
    "numberFormat":".0f",
    "xAxisLabel":"%",
    "xDomain":[0,80]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 5,
        "right": 20,
        "bottom": 20,
        "left": 150
      },
      "md": {
        "top": 5,
        "right": 20,
        "bottom": 20,
        "left": 150
      },
      "lg": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 150
      }
    },
    "seriesHeight":{
      "sm":40,
      "md":40,
      "lg":40
    },
    "xAxisTicks":{
      "sm":5,
      "md":5,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
