config={
  "essential": {
    "graphic_data_url": "data.csv",
    "colour_palette": ["#206095","#F66068","#e3e3e3"],
    "sourceText": "Office for National Statistics – Opinions and Lifestyle Survey",
    "accessibleSummary":"The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "xTickLabels": ["14 to 25 September","7 to 18 December"],
    "xTickLabelsMob": ["14 to 25 Sept","7 to 18 Dec"],
    "yDomain":[0,0.55],
    "show": ["Very easy or Somewhat easy","Somewhat difficult or Very difficult","Don't know or Prefer not to say"],
    "positive": ["Very easy or Somewhat easy","Somewhat difficult or Very difficult","Don't know or Prefer not to say"],
    "negative": ["Don't know or Prefer not to say","Somewhat difficult or Very difficult","Very easy or Somewhat easy"]
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
        "left": 60
      },
      "md": {
        "top": 50,
        "right": 180,
        "bottom": 30,
        "left": 75
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
