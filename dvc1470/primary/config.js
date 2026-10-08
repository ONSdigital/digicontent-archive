dvc = {
  "essential": {
    "graphic_data_url": "data.csv",
    "dateFormat": "%d/%m/%Y",
    "legendLabels": ["All regions", "England", "Your selected region"],
    "colour_palette": ["#e7e7e7","#055477",'#27a0cc'],
    "sourceText": "COVID-19 admissions primary diagnosis supplement from NHS England",
    "yAxisLabel": "%",
    "yAxisScale": [0, 100]//can be auto_min_max, auto_zero_max or an array for the domain of the y-scale
  },

  "optional": {
    "mobileBreakpoint": 400, //breakpoint for mobile
    "mediumBreakpoint": 600, //breakpoint for medium
    "referenceline":{"display":true,"series":"reference", "colour":"#055477"},//display is true/false, if set to true the series is the column to use as the reference

    "margin": {
      "sm": {
        "top": 30,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
      "md": {
        "top": 30,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
      "lg": {
        "top": 30,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
    },
    "aspectRatio": {
      "sm": [1, 1],
      "md": [2, 1],
      "lg": [2, 1]
    },

    "x_ticks_every": {
      "sm": 194,
      "md": 97,
      "lg": 97
    },
    "y_num_ticks": {
      "sm": 3,
      "md": 3,
      "lg": 3
    },
  }
};
