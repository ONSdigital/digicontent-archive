config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#206095",
    "sourceText": "Office for National Statistics – Business Insights and Conditions Survey",
    "accessibleSummary":"Here is the screenreader text describing the chart.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":""
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 3,
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
      "sm":30,
      "md":30,
      "lg":30
    },
    "xAxisTicks":{
      "sm":2,
      "md":4,
      "lg":4
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
