var dvc = {
        "essential": {
                "graphic_data_url": "../data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%y",
                "legendStyle": "line",
                "directLabeling": false,
                "directLabelingAdjust": [{ "x": 0, "y": 0 }, { "x": 0, "y": 7 }, { "x": 0, "y": -43 }],
                "colour_palette": ["#adadad", "#871A5B", "#adadad", "#871A5B", "#adadad", "#871A5B"],
                // for darker text required by accessibility rules on colour contrast
                "colour_palette_labels": ["#adadad", "#057FAC", "#adadad", "#871A5B", "#adadad", "#871A5B"],
                "sourceText": ["Office for National Statistics"],
                "sourceURL": ["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart": [
                ],

                "wordwrap": [30, 20, 10],
                "annoAlign": ["middle", "middle", "end"],
                "annotationBullet": [/*"An annotation","Another annotation"*/],

                "circles": false,
                // "annotationCXCY":[
                //     ["Jan-93","68.4"],
                //     ["Jan-08","73"]
                // ],
                //"annotationColour": ["green"],

                "yAxisLabel": "Number of deaths registered by week",
                "yAxisScale": [0,8000], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65, 65, 65]
        },

        "optional": {
                "margin_sm": [30, 65, 25, 50], //[top,right,bottom,left]
                "margin_md": [30, 82, 25, 50],
                "margin_lg": [30, 82, 25, 50],

                "aspectRatio_sm": [16, 8],
                "aspectRatio_md": [16, 6],
                "aspectRatio_lg": [16, 6],

                "mobileBreakpoint": 414,

                "xAxisTextFormat_sm_md_lg": ["%-y", "%-y", "%-y"],

                "x_num_ticks_sm_md_lg": [6, 9, 9],
                "y_num_ticks_sm_md_lg": [4, 4, 5],

                "lineMarkers": false,

                "vertical_line": true,
                "annotateLineX1_Y1_X2_Y2": [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

                "annotateRect": true,
                "annotateRectX_Y": [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/],
                "lineColor_opcty": [["#ABCDEF", 0.2], ["#888", 0.4]],

                "centre_line": false,
                "centre_line_value": 25
        }
}
