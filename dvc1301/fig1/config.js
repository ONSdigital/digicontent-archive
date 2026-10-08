var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": -20},{"x": 0, "y": -7},{"x": 0, "y": 7},{"x": 0, "y": 0}],
            "colour_palette": ["#206095","#118C7B","#003C57","#A8BD3A","#27A0CC","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#118C7B","#003C57","#8A9B2E","#057FAC","#871A5B","#F66068","#746CB1","#1AA590"],
            "sourceText":["Office for National Statistics – Opinions and Lifestyle Survey"],
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

            "yAxisLabel":"%",
            "yAxisScale":"auto_zero_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [50, 10, 150, 35], //[top,right,bottom,left]
            "margin_md": [35, 140, 50, 35],
            "margin_lg": [35, 140, 50, 35],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,
            "desktopBreakpoint": 600,

            "xAxisTextFormat_sm_md_lg" : ["%b %y", "%b %y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [4,4,5],
            "y_num_ticks_sm_md_lg" : [5,6,6],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [
              // [["15/06/2020", "0"],["15/06/2020", "75"]],
              // [["02/12/2020", "0"],["02/12/2020", "57"]],
              // [["05/01/2021", "0"],["05/01/2021", "46"]],
              // [["22/02/2021", "0"],["22/02/2021", "54"]]
            ],

            "annotateRect" : true,
            "annotateRectX_Y" : [
              [["14/05/2020", 70],["04/07/2020", 0]],
              [["05/11/2020", 70],["02/12/2020", 0]],
              [["05/01/2021", 70],["12/04/2021", 0]]
            ] ,
            "lineColor_opcty" : [
              ["#ABCDEF", 0.2],
              ["#ABCDEF", 0.2],
              ["#ABCDEF", 0.2]
            ],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
