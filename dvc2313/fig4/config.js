config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"min":"2021 Week 24", "max":"2022 Week 26"},
    //the keys match the column names
    "colour_palette": ["#8D8C8E", "#206095"],
    "sourceText": "Office for National Statistics, National Records of Scotland, Northern Ireland Statistics and Research Agency, Eurostat",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
    "numberFormat":".1f",
    "xAxisLabel":"Relative cumulative age-standardised mortality rates",
    "xDomain":[-15,20]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 0,
        "right": 30,
        "bottom": 40,
        "left": 100
      },
      "md": {
        "top": 0,
        "right": 20,
        "bottom": 40,
        "left": 200
      },
      "lg": {
        "top": 0,
        "right": 20,
        "bottom": 40,
        "left": 200
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
