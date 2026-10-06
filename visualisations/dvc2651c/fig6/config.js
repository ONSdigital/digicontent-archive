config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#871A5B","lightgrey","#206095"],
    "colour_palette_stroke": ["#871A5B","grey","#206095"],
    "fillOpacity":1,
    "strokeOpacity":1,
    "dateFormat": "%d/%m/%Y",
        "radius": "6",
    "sourceText": "Office for National Statistics analysis using Longitudinal Education Outcomes (LEO) from the Department for Education and Index of Multiple Deprivation 2019 from the Department for Levelling Up, Housing and Communities (DLUHC)",
    "accessibleSummary":"Here is the screenreader text describing the chart.",
    "xDomain":[-25,1],
    "yDomain":"auto",
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"",
    "yAxisLabel":"0 = the attainment rate for those in low income deprivation towns",
    "xAxisFormat":"%d %b",
    "yAxisFormat":".1d"
  },
  "optional": {
    "chartEvery":{
      "sm":1,
      "md":1,
      "lg":1
    },
    "margin": {
      "sm": {
        "top": 30,
        "right": 20,
        "bottom": 50,
        "left": 50
      },
      "md": {
        "top": 30,
        "right": 20,
        "bottom": 50,
        "left": 50
      },
      "lg": {
        "top": 30,
        "right":50,
        "bottom": 50,
        "left": 50
      }
    },
    "xAxisTicks":{
      "sm":3,
      "md":3,
      "lg":4
    },
    "yAxisTicks":{
      "sm":4,
      "md":4,
      "lg":5
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":0, "titles":0},
  "chart_build":{}
};
