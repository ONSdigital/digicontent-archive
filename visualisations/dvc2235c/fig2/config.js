config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#003C57", "#27a0cc"],
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary": "This chart shows disability statuses as defined under the Equality Act (2010), by ethnic group, in England and Wales. People identifying as “‘White: Gypsy or Irish Traveller”’ had the highest proportion of disabled people. The underlying data is available in the accompanying data download.",
    "xDomain":[0,0.3],
    "zDomain":[0,0.3],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisTickFormat":".0f",
    "xAxisLabel":"",
    "stackOffset":d3.stackOffsetNone,
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
    "repositioningScale": [0, 0.67],
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
