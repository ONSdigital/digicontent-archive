config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095","#3fb0b3"],
    "fillOpacity":0.3,
    "strokeOpacity":0.9,
    "radius":{
      "sm":3,
      "md":3.5,
      "lg":4
    },
    "sourceText": "Office for National Statistics analysis using Longitudinal Education Outcomes (LEO) from the Department for Education (DfE)",
    "accessibleSummary":"This is a scatter plot. This chart is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "xDomain":"auto",
    "yDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Educational attainment score",
    "yAxisLabel":"Residents aged 35-64 with Level 4 or above qualifications",
    "xAxisFormat":".0f",
    "yAxisFormat":".0%"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 45,
        "right": 20,
        "bottom": 50,
        "left": 50
      },
      "md": {
        "top": 45,
        "right": 20,
        "bottom": 50,
        "left": 50
      },
      "lg": {
        "top": 45,
        "right":50,
        "bottom": 50,
        "left": 50
      }
    },
    "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "yAxisTicks":{
      "sm":4,
      "md":4,
      "lg":6
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":0, "titles":0},
  "chart_build":{}
};
