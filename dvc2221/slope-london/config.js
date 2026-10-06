config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095","#F66068","#C6C6C6"],
    "sourceText": "Office for National Statistics – 2011 Census and Census 2021",
    "accessibleSummary":"The chart shows the number of people employed in each indsutry in London in 2011 and 2021. It shows that the number of people employed in computer programming and consultancy overtook those employed in finance in 2021",
    "yDomain":[50000,450000],
    "xTickLabels": ["2011","2021"],
    "show": ["Financial service activities, except insurance and pension funding","Computer programming, consultancy and related activities"],
    "positive": ["Computer programming, consultancy and related activities"],
    "negative": ["Financial service activities, except insurance and pension funding"]
    // either auto or a custom domain as an array e.g [0,100]
  },
  "optional": {
    "aspectRatio":{
      //height to width ratio of the chart area, not including margin
      "sm":[5,2],
      "md":[3.5,2],
      "lg":[4,2]
    },
    "margin": {
      "sm": {
        "top": 50,
        "right": 160,
        "bottom": 30,
        "left": 70
      },
      "md": {
        "top": 50,
        "right": 200,
        "bottom": 30,
        "left": 80
      },
      "lg": {
        "top": 50,
        "right": 300,
        "bottom": 30,
        "left": 100
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
