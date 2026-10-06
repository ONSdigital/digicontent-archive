config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#206095",
    "sourceText": "Shopping Prices Comparison Tool from the Office for National Statistics",
    "accessibleSummary":"Three quarters of the fast food and takeaway items collected saw an average price increase of 10% or more in the 12 months in March 2023",
    "dataLabels":{
      "show":false,
      "numberFormat":".0f"
    },
    "xDomain":[0,20],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"annual growth rate (%)"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 50,
        "right": 20,
        "bottom": 50,
        "left": 150
      },
      "md": {
        "top": 50,
        "right": 20,
        "bottom": 50,
        "left": 150
      },
      "lg": {
        "top": 50,
        "right": 20,
        "bottom": 50,
        "left": 150
      }
    },
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":30
    },
    "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":0, "titles":0},
  "chart_build":{}
};
