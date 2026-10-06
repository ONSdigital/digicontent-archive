config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#80C6A3","#1F9EB7","#186290","#080C54"],
    "fillOpacity":0,
    "strokeOpacity":1,
      "chart_height": 0.75,
    // Chart height as a proportion of the chart width
    // For example, 
    ///  1 would make the height equal to the width (a square), 
    ///  0.5 would make the height half the width
        "radius": "4.5",
    "sourceText": "Annual Survey of Hours and Earnings (ASHE) from the Office for National Statistics",
		"accessibleSummary": "This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0f"
    },
    "xDomain":[0,80],
    "yDomain":[0,30],
    // either "auto" or an array for the x domain e.g. [0,100]
    "yAxisLabel":"Median hourly earnings",
    "xAxisLabel":"% of full time employees who are women"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 30,
        "right": 20,
        "bottom": 50,
        "left": 25
      },
      "md": {
        "top": 30,
        "right": 20,
        "bottom": 50,
        "left": 120
      },
      "lg": {
        "top": 30,
        "right": 20,
        "bottom": 43,
        "left": 40
      }
    },
      "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "yAxisTicks":{
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
