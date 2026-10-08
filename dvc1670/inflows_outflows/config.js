dvc = {
  "essential": {
    "graphic_data_url": ["data.csv","data2.csv"],
    "dateFormat": "%d/%m/%Y",
    "legendLabels": ["Occupations", "All", "Selected occupation"],
    "colour_palette": ["#e7e7e7","#055477",'#D2376D'],
    "sourceText": "Office for National Statistics – Labour Force Survey",
    "yAxisLabel": "Flows: Index April - June 2016 = 100",
    "yAxisScale": [0.5, 1.6]//can be auto_min_max, auto_zero_max or an array for the domain of the y-scale
  },

  "optional": {
    "mobileBreakpoint": 400, //breakpoint for mobile
    "mediumBreakpoint": 600, //breakpoint for medium
    "referenceline":{"display":true,"series":"reference", "colour":"#055477"},//display is true/false, if set to true the series is the column to use as the reference

    "margin": {
      "sm": {
        "top": 80,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
      "md": {
        "top": 80,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
      "lg": {
        "top": 80,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
    },
    "aspectRatio": {
      "sm": [1, 1],
      "md": [1, 0.5],
      "lg": [1, 0.3]
    },

    "xAxisTextFormat": {
      "sm": "%b-%y",
      "md": "%b-%y",
      "lg": "%b-%y"
    },
    "x_ticks_every": {
      "sm": 30,
      "md": 30,
      "lg": 20
    },
    "y_num_ticks": {
      "sm": 6,
      "md": 6,
      "lg": 6
    },
  }
};
