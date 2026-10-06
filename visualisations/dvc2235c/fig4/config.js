config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095", "#27A0CC", "#A8BD3A", "#A09FA0", "#F66068"],
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary": "This chart shows economic activity status by ethnic group, of those aged 16 to 64 years, in England and Wales. People who identified with an “‘Other White”’ ethnicity were most likely to be an employee. The underlying data is available in the accompanying data download.",
    "xDomain":[0,1],
    "zDomain":[0,1],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisTickFormat":".0f",
    "xAxisLabel":"",
    "stackOffset":d3.stackOffsetExpand,
    // options include
    // stackOffsetNone means the baseline is set at zero
    // stackOffsetExpand to do 100% charts
    // stackOffsetDivergine for data with positive and negative values
    "stackOrder":d3.stackOrderNone,
    // other options include
    // d3.stackOrderNone means the order is taken from the datafile
    // d3.stackOrderAppearance the earliest series (according to the maximum value) is at the bottom
    // d3.stackOrderAscending the smallest series (according to the sum of values) is at the bottom
    // d3.stackOrderDescending the largest series (according to the sum of values) is at the bottom
    // d3.stackOrderReverse reverse the order as set from the data file
    "repositionUsingCSVValues": true,
    "repositioningScale": [0, 0.68],
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 35,
        "right": 20,
        "bottom": 20,
        "left": 150
      },
      "md": {
        "top": 35,
        "right": 20,
        "bottom": 20,
        "left": 250
      },
      "lg": {
        "top": 35,
        "right": 40,
        "bottom": 20,
        "left": 250
      }
    },
    "seriesHeight":{
      "sm":45,
      "md":40,
      "lg":35
    },
    "xAxisTicks":{
      "sm":2,
      "md":6,
      "lg":6
    },
    "mobileBreakpoint": 420,
    "mediumBreakpoint": 600
  }
};
