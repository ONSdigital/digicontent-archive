config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["September 2022", "October 2022", "November 2022"],
    "colour_palette": ["#22D0B6", "#27A0CC", "#206095"],
    "sourceText": "Source: Food Standards Agency – Consumer Insights Tracker",
    "accessibleSummary":"Horizontal bar chart showing around three in ten consumers reported not being able to afford a healthy balanced diet. Data visualised in the chart is available to download below.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":[0,1],
    "xDomainMob":[0,0.5],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Proportion of participants"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 200
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 200
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 200
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
