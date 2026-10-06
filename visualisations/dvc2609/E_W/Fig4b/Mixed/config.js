config = {
  essential: {
    accessibleSummary: "This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
    sourceText: "Office for National Statistics – Census 2021",
    graphic_data_url: "comparison.csv",
    comparison_data: "data.csv",
    dataType: "other",
    // dataType can be a 'percentage' or 'numbers' where it works out the percentage in the script
    colour_palette: ["#9A86E9", "#3fb0b3"],
    // this is the lighter palette for reference lines ["#9A86E9", "#3fb0b3"]
    comparison_colour_palette: ["#5c5185", '#306970'],
    legend: ["Census", 'ABES'],
    xAxislabel: ["Percentage of group"],
    maxValue: 0.12,
    tickValues: ["<16","16-34","35-49","50-64","65+"]

  },
  "optional": {
    "margin": {
      "sm": {
        "top": 0,
        "right": 10,
        "bottom": 50,
        "left": 20
      },
      "md": {
        "top": 0,
        "right": 10,
        "bottom": 50,
        "left": 20
      },
      "lg": {
        "top": 0,
        "right": 10,
        "bottom": 50,
        "left": 20
      },
      "centre": 40
    },
    "seriesHeight": {
      "sm": 20,
      "md": 20,
      "lg": 20
    },
    "xAxisTicks": {
      "sm": 2,
      "md": 3,
      "lg": 4
    },
    "mobileBreakpoint": 510,
    "mediumBreakpoint": 600
  }
};
