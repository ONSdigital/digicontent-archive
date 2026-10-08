config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": {"val":"Working away from home", "val2":"Working from home"},
    //the keys match the column names
    "colour_palette": [ "#118c7b", "#871a5b"],
    "sourceText": "Time Use Survey from the Office for National Statistics",
    "accessibleSummary":"Figure two shows that those working from home spent more time on sleep and rest, and exercise, sports and wellbeing, on average. The chart shows the average daily minutes, and their confidence intervals, spent on different activities by work location, UK, March 2024.",
    "numberFormat":".0f",
    "xAxisLabel":"Minutes",
    "xDomain":[0,600],
    // either auto or a custom domain as an array e.g [0,100]
    "compareLabels":[],
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 20,
        "right": 15,
        "bottom": 45,
        "left": 120
      },
      "md": {
        "top": 20,
        "right": 15,
        "bottom": 45,
        "left": 220
      },
      "lg": {
        "top": 20,
        "right": 15,
        "bottom": 45,
        "left": 220
      }
    },
    "seriesHeight":{
      "sm":33,
      "md":33,
      "lg":33
    },
    "xAxisTicks":{
      "sm":4,
      "md":6,
      "lg":7
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
