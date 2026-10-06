config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#206095",
    "sourceText": "Shopping Prices Comparison Tool from the Office for National Statistics",
    "accessibleSummary":"Personal health products show some of largest increases across all health items in the shopping prices comparison tool in the last year ",
    "dataLabels":{
      "show":false,
      "numberFormat":".0f"
    },
    "xDomain":[0,25],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Annual growth rate (%)"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 20,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "md": {
        "top": 20,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "lg": {
        "top": 20,
        "right": 20,
        "bottom": 50,
        "left": 120
      }
    },
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":30
    },
    "xAxisTicks":{
      "sm":5,
      "md":5,
      "lg":5
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":0, "titles":0},
  "chart_build":{}
};
