config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["ABES", "Census"],
    "colour_palette": ["#206095", "#27a0cc", "#871A5B"],
    "sourceText": "Office for National Statistics",
    "accessibleSummary":"Here is the screenreader text describing the chart.",
    "dataLabels":{
      "show":true,
      "numberFormat":".1%"
    },
    "xDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"proportion of people"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 120
      }
    },
    "seriesHeight":{
      "sm":27,
      "md":27,
      "lg":27
    },
    "xAxisTicks":{
      "sm":4,
      "md":4,
      "lg":5
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  //future functionality for chart builder - changing values will have no impact on charts when coding manually.
"elements":{"select":0, "nav":0, "legend":1, "titles":0}
};
