config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#206095",
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary":"Kensington and Chelsea had the highest proportion of residents who used second addresses as holiday homes ",
    "dataLabels":{
      "show":true,
      "numberFormat":".1%"
    },
    "xDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Percentage of usual residents who used a second address as a holiday home"
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
  //future functionality for chart builder - changing values will have no impact on charts when coding manually.
"elements":{"select":0, "nav":0, "legend":0, "titles":0},
};
