var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%b-%y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 0},{"x": 0, "y": 0}],
            "colour_palette": ["#206095","#27A0CC","#871A5B","#A8Bd3A","#F66068","#003C57","#22D0B6","#746CB1","#118C7B"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#27A0CC","#871A5B","#A8Bd3A","#F66068","#003C57","#22D0B6","#746CB1","#118C7B"],
            "sourceText":["Office for National Statistics – Baby names in England and Wales"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
              "xVal": "2019-01-23T00:00:00.000Z",
              "yVal": 911,
              "path": "",
              "text": "Sequel Trilogy released",
              "textOffset": [0,0]
              },

            ],

            "wordwrap":[30,30,30],
            "annoAlign": ["end","middle","middle"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Number of babies",
            "yAxisScale":[0, 900], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 35], //[top,right,bottom,left]
            "margin_md": [30, 82, 25, 35],
            "margin_lg": [10, 82, 25, 35],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%y", "%Y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [10,10,10],

            "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2": [[["Jan-15", 0], ["Jan-15", 900]], [["Jan-17", 0], ["Jan-17", 900]], [["Jan-19", 0], ["Jan-19", 900]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["Jan-15", 900],["Jan-21", 0]]],
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
