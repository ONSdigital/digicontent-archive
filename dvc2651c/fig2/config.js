config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#871A5B","lightgrey","#206095","#A8BD3A","#F66068"],
    "sourceText": "Office for National Statistics analysis using Longitudinal Educational Outcomes (LEO) from the Department for Education (DfE)",
    "accessibleSummary":"This is a stacked bar chart. The chart is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "xDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisTickFormat":".0f",
    "xAxisLabel":"Percentage of towns or cities in group",
    "stackOffset":d3.stackOffsetNone,
    // options include
    // stackOffsetNone means the baseline is set at zero
    // stackOffsetExpand to do 100% charts
    // stackOffsetDivergine for data with positive and negative values
    "stackOrder":d3.stackOrderNone
    // other options include
    // d3.stackOrderNone means the order is taken from the datafile
    // d3.stackOrderAppearance the earliest series (according to the maximum value) is at the bottom
    // d3.stackOrderAscending the smallest series (according to the sum of values) is at the bottom
    // d3.stackOrderDescending the largest series (according to the sum of values) is at the bottom
    // d3.stackOrderReverse reverse the order as set from the data file
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 20,
        "right": 20,
        "bottom": 20,
        "left":70
      },
      "md": {
        "top": 20,
        "right": 20,
        "bottom": 20,
        "left": 110
      },
      "lg": {
        "top": 20,
        "right": 20,
        "bottom": 20,
        "left": 110
      }
    },
    "seriesHeight":{
      "sm":35,
      "md":35,
      "lg":35
    },
    "xAxisTicks":{
      "sm":2,
      "md":5,
      "lg":5
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
