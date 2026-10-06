var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%b-%y",
            "displayTicksFormat":"%b %y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#A8BD3A","#206095","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#057FAC","#003C57","#118C7B","#8A9B2E","#871A5B","#F66068","#746CB1","#1AA590"],
            "sourceText":["Office for National Statistics"],
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

            "yAxisLabel":"£ billion, seasonally adjusted",
            "xAxisLabel":"Three months ending",
            "yAxisScale":[0, 200], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [25, 25, 55, 45], //[top,right,bottom,left]
            "margin_md": [25, 25, 55, 45],
            "margin_lg": [25, 25, 55, 45],

            "aspectRatio_sm" : [16,14],
            "aspectRatio_md" : [16,5],
            "aspectRatio_lg" : [16,5],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%y", "%b %y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [9,9,9],
            "y_num_ticks_sm_md_lg" : [4,3,5],
            "x_ticks_every": {
              "sm": 12,
              "md": 8,
              "lg": 8
            },

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
