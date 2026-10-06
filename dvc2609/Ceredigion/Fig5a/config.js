config = {
  "essential": {
    "accessibleSummary": "This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
    "sourceText": "Office for National Statistics",
    "graphic_data_url": "comparison.csv",
    "comparison_data": "data.csv",
    "dataType": "other",
    // dataType can be a 'percentage' or 'numbers' where it works out the percentage in the script
    "colour_palette": ["#9A86E9", "#3fb0b3"],
    // this is the lighter palette for reference lines ["#9A86E9", "#3fb0b3"]
    "comparison_colour_palette": ["#5c5185", "#306970"],
    "legend": ["Census", "ABES"],
    "xAxislabel": ["Percentage of group"]

  },
  "optional": {
    "margin": {
      "sm": {
        "top": 30,
        "right": 10,
        "bottom": 50,
        "left": 22
      },
      "md": {
        "top": 30,
        "right": 10,
        "bottom": 50,
        "left": 22
      },
      "lg": {
        "top": 30,
        "right": 10,
        "bottom": 50,
        "left": 22
      },
      "centre": 60
    },
    "seriesHeight": {
      "sm": 25,
      "md": 25,
      "lg": 25
    },
    "xAxisTicks": {
      "sm": 4,
      "md": 4,
      "lg": 4
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  },
  //future functionality for chart builder - changing values will have no impact on charts when coding manually.
"elements":{"select":0, "nav":0, "legend":1, "titles":1}
};
