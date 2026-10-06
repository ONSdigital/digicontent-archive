config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#27A0CC",
    "sourceText": "Office for National Statistics – Monthly Wages and Salaries Survey, Vacancy Survey and Workforce Jobs",
    "accessibleSummary":"A scatter plot showing most industries with increased vacancy rates saw higher wage growth in June 2022, dvc2326",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "legendLabels": ["50 thousand people", "5 million people"],
    "xDomain":[-5.7,10],
    "yDomain":[-0.05,2.4],
    "rDomain":[0,4477],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Wage growth % year on year",
    "yAxisLabel":"Vacancy rate: year on year change (percentage points)"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 230,
        "right": 20,
        "bottom": 50,
        "left": 35
      },
      "md": {
        "top": 230,
        "right": 20,
        "bottom": 50,
        "left": 35
      },
      "lg": {
        "top": 115,
        "right": 60,
        "bottom": 50,
        "left": 35
      }
    },
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":30
    },
    "aspectRatio": {
      "sm": [16, 14],
      "md": [16, 12],
      "lg": [16, 12]
    },
    "xAxisTicks":{
      "sm":2,
      "md":4,
      "lg":4
    },
    "mobileBreakpoint": 450,
    "mediumBreakpoint": 600,
    "selectLabels": ["Manufacturing", "Construction"],
    "annotationText": ["Low vacancy growth and low wage growth", "High vacancy growth and high wage growth"]
  }
};
