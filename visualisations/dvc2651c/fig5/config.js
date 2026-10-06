config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["Seaside towns", "Other coastal towns", "Non-coastal towns"],
    "colour_palette": ["#22D0B6","#206095","lightgrey","#A8BD3A","#F66068"],
    "colour_palette_stroke": ["#3f996c","#206095","grey","#A8BD3A","#F66068"],
    "sourceText": "Office for National Statistics analysis using Longitudinal Education Outcomes (LEO) from the Department for Education (DfE)",
    "accessibleSummary":"This is a dot plot chart. The chart is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below..",
    "xDomain":"auto"
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 10,
        "right": 20,
        "bottom": 20,
        "left": 80
      },
      "md": {
        "top": 10,
        "right": 20,
        "bottom": 20,
        "left": 150
      },
      "lg": {
        "top": 10,
        "right": 20,
        "bottom": 20,
        "left": 150
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
