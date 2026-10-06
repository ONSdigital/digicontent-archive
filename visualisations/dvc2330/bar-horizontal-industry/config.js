var dvc = {
  "essential" : {
          //data to use for chart
          "graphic_data_url": "data.csv",
          //chart colour
          "colour_palette": [ "#206095" ],
          "negative_colour":["#118C7B"],
          //Set alternative screenreader text if more detail than default is needed
          "screenreadertext":"For every 1,000 wholesale and retail trade workers, there were 10 former employees out of work long-term sick ",
          //Source
          "sourceText":["Office for National Statistics, APS April 2021 to March 2022"],
          //desktop annotations (double space for new line)
          "annotationChart": [
              "UK average: 6.5"
           ],
          // mobile annotations
          "annotationBullet": [
             "UK average: 6.5"
           ],
          //position of annotaions specified using x, y values
          "annotationXY":[
              ["6.7","Information and communication"]
              // ["2008","3"]
          ],
          //annotation alignment (start, middle or end)
          "annotationAlign":[
              "start",
              // "middle"
          ],
          //y axis label
          "xAxisLabel":"per 1,000 workers",
          //y axis scale ("auto_zero_max", "auto_min_max" or custom e.g. [-3,5])
          "xAxisScale":["auto_zero_max"]
  },
  "optional" : {
          //specifies margins at different window sizes
          "margin": {
            "sm": {
              "top": 35,
              "right": 20,
              "bottom": 10,
              "left": 140
            },
            "md": {
              "top": 15,
              "right": 20,
              "bottom": 10,
              "left": 225
            },
            "lg": {
              "top": 15,
              "right": 20,
              "bottom": 10,
              "left": 225
            }
          },
          //specifies aspect ratio of chart at different window sizes
          "aspectRatio": {
            "sm": [4, 8],
            "md": [3, 3],
            "lg": [14, 10]
          },
          //specifies smallest breakpoint (for mobile users)
          "mobileBreakpoint" : 414,
          //specifies middle breakpoint(for tablet users)
          "middleBreakpoint": 600,
          //specified the number of ticks required on the x axis at different window sizes
          "x_num_ticks": {
            "sm": 6,
            "md": 8,
            "lg": 10
          },
          //draws vertical_lines if required for annotations (set to true or false)
          "vertical_line" : true,
          //define start and end points of any annotation lines
          "annotateLineX1_Y1_X2_Y2":[
            [
              [6.5, "Retail"],
              [6.5, "Information and communication"]
            ]
          ],
          //draws rectangles if required for annotations (set to true or false)
          "annotateRect" : false,
          //define start and end points of rectangles
          "annotateRectX_Y" : [
            [
              [40, "South West"],
              [75, "West Midlands"]
            ]
          ],
          //draws a line with a heavier stroke, used if the x axis is dropped or the data has negative and positive values
          "centre_line" : false,
          "centre_line_value" : 4.9
  }
}
