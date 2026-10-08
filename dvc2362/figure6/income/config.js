config={
  "essential": {
    "graphic_data_url": "data.csv",
    "legendLabels": ["Percentage on mortgages", "Percentage on rent"],
    "colour_palette": ["#206095", "#118C7B"],
    "sourceText": "Office for National Statistics – Living Costs and Food Survey ",
    "accessibleSummary":"The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
    "dataLabels":{
      "show":true,
      "numberFormat":".0%"
    },
    "xDomain":[0,0.5]
    // either "auto" or an array for the x domain e.g. [0,100]
  },
  "optional": {
    "margin": {
      "sm": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 150
      },
      "md": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 150
      },
      "lg": {
        "top": 15,
        "right": 20,
        "bottom": 20,
        "left": 150
      }
    },
    "seriesHeight":{
      "sm":19,
      "md":25,
      "lg":25
    },
    "aspectRatio": {
      "sm": [5, 6],
      "md": [15, 6],
      "lg": [15, 9]
    },
    "xAxisTicks":{
      "sm":4,
      "md":8,
      "lg":10
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
