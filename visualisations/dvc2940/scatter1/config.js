config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#27a0cc",
    "colour_highlight": "#f56927",
    "fillOpacity":0,
    "strokeOpacity":1,
      "chart_height": 1.0,
    // Chart height as a proportion of the chart width
    // For example,
    ///  1 would make the height equal to the width (a square),
    ///  0.5 would make the height half the width
        "radius": "4",
    "sourceText": "Early years and childcare statistics from Ofsted and Census 2021 data from the Office for National Statistics",
		"accessibleSummary": "The proportion of women in households with dependents aged 0-4 years with higher education qualifications was higher in areas with higher levels of childcare access.",
    "dataLabels":{
      "show":true,
      "numberFormat":",.0f"
    },
    // "xDomain":[5000,95000],
    // "yDomain":[10000,190000],
    "xDomain":[10,45],
    "yDomain":[20,75],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Equivalent places per 100 children",
    "yAxisLabel":"Proportion women in households with dependents aged 0-4 years with higher education qualifications"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 65,
        "right": 60,
        "bottom": 50,
        "left": 70
      },
      "md": {
        "top": 65,
        "right": 40,
        "bottom": 50,
        "left": 70
      },
      "lg": {
        "top": 59,
        "right": 40,
        "bottom": 43,
        "left": 70
      }
    },
      "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":8
    },
    "yAxisTicks":{
      "sm":8,
      "md":15,
      "lg":15
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":0, "titles":0},
  "chart_build":{}
};
