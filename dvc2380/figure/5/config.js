config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["2011", "2021"],
    "colour_palette": ["#206095", "#206095"],
    "sourceText": "Source: Office for National Statistics – Opinions and Lifestyle Survey",
    "accessibleSummary":"Horizontal bar chart showing over half of all adults in the most deprived areas of England reported spending less on their food shopping and essentials. Data visualised in the chart is available to download below.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":[0,1],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Proportion of adults"
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
      "sm":28,
      "md":28,
      "lg":28
    },
    "xAxisTicks":{
      "sm":2,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
