config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["High deprivation", "Medium deprivation", "Low deprivation"],
    "colour_palette": ["#871A5B","lightgrey","#206095","#A8BD3A","#F66068"],
    "colour_palette_stroke": ["#871A5B","grey","#206095","#A8BD3A","#F66068"],
    "sourceText": "Office for National Statistics analysis using Longitudinal Education Outcomes (LEO) from the Department for Education (DfE) and Index of Multiple Deprivation 2019 from the Department for Levelling Up, Housing and Communities (DLUHC)",
    "accessibleSummary":"Chart showing death rates due to alchohol by regions, for males, females and all.",
    "xDomain":"auto"
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 60,
        "right": 20,
        "bottom": 20,
        "left": 115
      },
      "md": {
        "top": 60,
        "right": 20,
        "bottom": 20,
        "left": 115
      },
      "lg": {
        "top": 60,
        "right": 20,
        "bottom": 20,
        "left": 115
      }
    },
    "seriesHeight":{
      "sm":40,
      "md":40,
      "lg":40
    },
    "xAxisTicks":{
      "sm":4,
      "md":6,
      "lg":6
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  "elements":{"select":0, "nav":0, "legend":1, "titles":0}
};
