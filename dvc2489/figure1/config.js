config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"min":"19 – 30 January 2022", "max":" 25 January – 5 February 2023"},
    //the keys match the column names
    "colour_palette": ["#8D8C8E", "#206095"],
    "sourceText": "Office for National Statistics – Opinions and Lifestyle Survey",
    "accessibleSummary":"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
    "numberFormat":".0%",
    "xAxisLabel":"Proportion of adults",
    "xDomain":[0,0.5]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 5,
        "right": 20,
        "bottom": 20,
        "left": 170
      },
      "md": {
        "top": 5,
        "right": 20,
        "bottom": 20,
        "left": 170
      },
      "lg": {
        "top": 5,
        "right": 20,
        "bottom": 40,
        "left": 170
      }
    },
    "seriesHeight":{
      "sm":60,
      "md":60,
      "lg":60
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
