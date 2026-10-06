var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d-%b/%y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [
              {"x": 0, "y": -10},
              {"x": 0, "y": 0},
              {"x": 0, "y": -43}
            ],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["Office for National Statistics – Research into how the Coronavirus pandemic is affecting students in Higher Education"],
            "draggable": false,
            "annotationsChart" : [
            // {
            //     "xVal": "2020-09-30T00:00:00.000Z",
            //     "yVal": 50,
            //     "path": "",
            //     "text": "Cases rise in private residential first",
            //     "textOffset": [0,0]
            //   }
              // ,
              // {
              //   "xVal": "1995-06-23T00:00:00.000Z",
              //   "yVal": 120,
              //   "path": "",
              //   "text": "adipiscing elit, sed do eiusmod",
              //   "textOffset": [0,0]
              // },
              //
              // {
              //   "xVal": "2011-06-01T00:00:00.000Z",
              //   "yVal": 60,
              //   "path": "",
              //   "text": "incididunt ut labore et dolor",
              //   "textOffset": [0,0]
              // }
            ],

            "wordwrap":[30,20,10],
            "annoAlign": ["middle","middle","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Daily cases",
            "yAxisScale":[0,140], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
      "margin": {
            "sm": {
              "top": 30,
              "right": 23,
              "bottom": 45,
              "left": 35
            },
            "md": {
              "top": 30,
              "right": 23,
              "bottom": 45,
              "left": 35
            },
            "lg": {
              "top": 30,
              "right": 23,
              "bottom": 45,
              "left": 35
            }
          },
          "aspectRatio": {
            "sm": [16, 12],
            "md": [16, 8],
            "lg": [16, 8]
          },

            "mobileBreakpoint" : 414,

            "x_ticks_every": {
              "sm": 14,
              "md": 14,
              "lg": 7
            },
            "y_num_ticks_sm_md_lg" : [3,5,5],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
