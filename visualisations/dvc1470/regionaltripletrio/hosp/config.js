var dvc = {
        "essential": {
                "graphic_data_url": "data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%d/%m/%Y",
                "legendStyle": "line",
                "directLabeling": false,
                "directLabelingAdjust": [{ "x": 0, "y": 0 }, { "x": 0, "y": 7 }, { "x": 0, "y": -43 }],
                "colour_palette": [
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad"
                ],
                // for darker text required by accessibility rules on colour contrast
                "colour_palette_labels": [
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad",
                        "#adadad"
                ],
                "sourceText": ["Office for National Statistics"],
                "sourceURL": ["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart": [],

                "wordwrap": [30, 20, 10],
                "annoAlign": ["middle", "middle", "end"],
                "annotationBullet": [/*"An annotation","Another annotation"*/],

                "circles": false,
                // "annotationCXCY":[
                //     ["Jan-93","68.4"],
                //     ["Jan-08","73"]
                // ],
                //"annotationColour": ["green"],

                "xAxisLabel": "Week ending",
                "yAxisLabel": "",
                "yAxisScale": [0, 20], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65, 65, 65]
        },

        "optional": {
                "margin_sm": [30, 47, 45, 35], //[top,right,bottom,left]
                "margin_md": [10, 82, 50, 35],
                "margin_lg": [10, 82, 50, 35],

                "aspectRatio_sm": [16, 11],
                "aspectRatio_md": [16, 7],
                "aspectRatio_lg": [16, 7],

                "mobileBreakpoint": 414,

                "xAxisTextFormat_sm_md_lg": ["%d %b %y", "%d %b %y", "%d %b %y"],

                "x_num_ticks_sm_md_lg": [2, 5, 5],
                "y_num_ticks_sm_md_lg": [3, 3, 3],

                "lineMarkers": false,

                "vertical_line": false,
                "annotateLineX1_Y1_X2_Y2": [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

                "annotateRect": false,
                "annotateRectX_Y": [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/],
                "lineColor_opcty": [["#ABCDEF", 0.2], ["#888", 0.4]],

                "centre_line": false,
                "centre_line_value": 25
        }
}
