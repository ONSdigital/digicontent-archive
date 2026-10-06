var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "graphic_data_gaps_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 5, "y": 0},{"x": 5, "y": 0},{"x": 5, "y": 0},{"x": 5, "y": -10},{"x": 5, "y": -10},{"x": 5, "y": -10},{"x": 5, "y": -10},{"x": 5, "y": -10},{"x": 5, "y": -10},{"x": 5, "y": -10}],
            "colour_palette": ["#A8BD3A","#206095","#616161","#494949","#494949","#494949","#494949","#494949","#494949","#494949","#494949"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#8A9B2E","#206095","#616161","#494949","#494949","#494949","#494949","#494949","#494949","#494949","#494949"],
            "drawlabel": [true, true, true, false, false, false, false, false, false, false ],
            "sourceText":["VisitEngland"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            // {
              //   "xVal": "2003-06-23T00:00:00.000Z",
              //   "yVal": 160,
              //   "path": "",
              //   "text": "Lorem ipsum dolor sit amet, consectetur",
              //   "textOffset": [0,0]
              // },
              //
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

            "yAxisLabel":"percentage point difference",
            "yAxisScale":"auto_min_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 30, 25, 35], //[top,right,bottom,left]
            "margin_md": [30, 150, 25, 35],
            "margin_lg": [10, 150, 25, 35],

            "x_ticks_every": {
              "0": 4,
              "1": 3,
              "2": 3
            },

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b-%y", "%b-%y", "%b-%Y"],

            "x_num_ticks_sm_md_lg" : [4,6,3],
            "y_num_ticks_sm_md_lg" : [5,5,10],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["23/03/2020", 3],["15/06/2020", -70]], [["05/11/2020", 3],["02/12/2020", -70]], [["04/01/2021", 3],["01/02/2021", -70]] ] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#ABCDEF", 0.2], ["#ABCDEF", 0.2]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
