var dvc = {
  "essential" : {
          //data to use for chart
          "graphic_data_url": "data.csv",
          //chart colour
          "colour_palette": [ "#206095" ],
          "negative_colour":["#F66068"],
          //Set alternative screenreader text if more detail than default is needed
          "screenreadertext":"Horizonal bar chart showing some of the lowest-cost everyday grocery items have increased by more than 20% in the year to September 2022. Data visualised in the chart is available to download below.",
          //Source
          "sourceText":["Office for National Statistics – Tracking the lowest cost grocery items"],
          //desktop annotations (double space for new line)
          "annotationChart": [
          //    "Lorem ipsum  dolor sit amet",
          //     "adipiscing elit  sed do eiusmod"
           ],
          // mobile annotations
          "annotationBullet": [
          //    "Lorem ipsum  dolor sit amet",
          //     "adipiscing elit  sed do eiusmod"
           ],
          //position of annotaions specified using x, y values
          "annotationXY":[
              // ["1984","-1"],
              // ["2008","3"]
          ],
          //annotation alignment (start, middle or end)
          "annotationAlign":[
              // "middle",
              // "middle"
          ],
          //y axis label
          "xAxisLabel":"%",
          //y axis scale ("auto_zero_max", "auto_min_max" or custom e.g. [-3,5])
          "xAxisScale":[-10,70]
  },
  "optional" : {
          //specifies margins at different window sizes
          "margin": {
            "sm": {
              "top": 65,
              "right": 20,
              "bottom": 5,
              "left": 175
            },
            "md": {
              "top": 65,
              "right": 20,
              "bottom": 5,
              "left": 185
            },
            "lg": {
              "top": 65,
              "right": 20,
              "bottom": 5,
              "left": 185
            }
          },
          //specifies aspect ratio of chart at different window sizes
          "aspectRatio": {
            "sm": [4, 16],
            "md": [3, 6],
            "lg": [16, 24]
          },
          //specifies smallest breakpoint (for mobile users)
          "mobileBreakpoint" : 420,
          //specifies middle breakpoint(for tablet users)
          "middleBreakpoint": 600,
          //specified the number of ticks required on the x axis at different window sizes
          "x_num_ticks": {
            "sm": 4,
            "md": 6,
            "lg": 10
          },
          //draws vertical_lines if required for annotations (set to true or false)
          "vertical_line" : false,
          //define start and end points of any annotation lines
          "annotateLineX1_Y1_X2_Y2":[
          ],
          //draws rectangles if required for annotations (set to true or false)
          "annotateRect" : false,
          //define start and end points of rectangles
          "annotateRectX_Y" : [
            ],
          //draws a line with a heavier stroke, used if the x axis is dropped or the data has negative and positive values
          "centre_line" : true,
          "centre_line_value" : 17.3
  }
}
