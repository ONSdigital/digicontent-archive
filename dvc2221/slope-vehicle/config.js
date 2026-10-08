config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095","#F66068","#e3e3e3"],
    "sourceText": "Office for National Statistics – 2011 Census and Census 2021",
    "accessibleSummary":"The chart shows the proportion of people in-work employed in vehicle manufacturing in each local authority in 2011 and 2021. It shows that local authorities in the West Midlands saw the biggest increases while local authorities in South Wales saw the biggest decreases.",
    "xTickLabels": ["2011","2021"],
    "yDomain":[0.5,6.3],
    "show": ["Warwick","Solihull","Stratford-on-Avon","Rugby","Tamworth","Rhondda Cynon Taf","Bridgend","Neath Port Talbot","Blaenau Gwent", "Torfaen"],
    "positive": ["Warwick","Solihull","Stratford-on-Avon", "Rugby","Tamworth"],
    "negative": ["Rhondda Cynon Taf","Bridgend","Neath Port Talbot","Blaenau Gwent", "Torfaen"]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "aspectRatio":{
      //height to width ratio of the chart area, not including margin
      "sm":[6,2],
      "md":[3.5,2],
      "lg":[3.5,2]
    },
    "margin": {
      "sm": {
        "top": 50,
        "right": 130,
        "bottom": 50,
        "left": 70
      },
      "md": {
        "top": 50,
        "right": 180,
        "bottom": 30,
        "left": 80
      },
      "lg": {
        "top": 50,
        "right": 200,
        "bottom": 30,
        "left": 200
      }
    },
    "yAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 414,
    "mediumBreakpoint": 600
  }
};
