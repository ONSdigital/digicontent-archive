config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": "#206095",
    "sourceText": "Census 2021 from the Office for National Statistics",
    "accessibleSummary":"This chart shows occupations of those in work, by ethnic group, of those aged 16 to 64 years in England and Wales. The underlying data is available in the accompanying data download.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":[0,0.35],
    "zDomain":[0,0.35],
    // either "auto" or an array for the x domain e.g. [0,100]
    "xAxisLabel":"Percentage of usual residents"
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 210
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 260
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 50,
        "left": 260
      }
    },
    "seriesHeight":{
      "sm":30,
      "md":30,
      "lg":30
    },
    "xAxisTicks":{
      "sm":3,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600,
    
    "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [ [["0.2", "Asian, Asian British or Asian Welsh"],["0.2", "Caribbean"]]],
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

  }
};
