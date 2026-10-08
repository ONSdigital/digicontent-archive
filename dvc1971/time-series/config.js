var dvc = {
        "essential": {
                "graphic_data_url": "data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%d/%m/%Y",
                "legendStyle": "line",
                "directLabeling": true,
                "directLabelingAdjust": [{ "x": 0, "y": 1 }, { "x": 0, "y": -5 }, { "x": 0, "y": -3 }],
                "colour_palette": ["#118C7B", "#206095", "#871A5B"],
                // for darker text required by accessibility rules on colour contrast
                "colour_palette_labels": ["#118C7B", "#206095", "#871A5B"],
                "sourceText": ["Office for National Statistics – Opinions and Lifestyle Survey"],
                "sourceURL": ["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart": [
                        {
                                "xVal": "2022-03-27T00:00:00.000Z",
                                "yVal": 51,
                                "path": "",
                                "text": "Change in survey question wording",
                                "textOffset": [2, -60]
                        }
                ],

                "wordwrap": [20,],
                "annoAlign": ["end"],
                "annotationBullet": ["1 Change in survey question wording"],

                "circles": false,
                // "annotationCXCY":[
                //     ["Jan-93","68.4"],
                //     ["Jan-08","73"]
                // ],
                // "annotationColour": ["green"],

                "yAxisLabel": "%",
                "yAxisScale": [0, 60], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65, 65, 65]
        },

        "optional": {
                "margin_sm": [55, 30, 25, 30], //[top,right,bottom,left]
                "margin_md": [55, 140, 25, 30],
                "margin_lg": [55, 140, 25, 30],

                "aspectRatio_sm": [16, 20],
                "aspectRatio_md": [16, 10],
                "aspectRatio_lg": [16, 10],

                "mobileBreakpoint": 414,

                "xAxisTextFormat_sm_md_lg": ["%b-%y", "%b-%y", "%b-%y"],

                "x_num_ticks_sm_md_lg": [5, 6, 6],
                "y_num_ticks_sm_md_lg": [5, 5, 5],

                "lineMarkers": false,

                "vertical_line": true,
                "annotateLineX1_Y1_X2_Y2": [[["27/03/2022", 0], ["27/03/2022", 60]]],

                "annotateRect": false,
                "annotateRectX_Y": [[["04/01/2021", 60], ["28/03/2021", 0]]],
                "lineColor_opcty": [["#ABCDEF", 0.3]],

                "centre_line": false,
                "centre_line_value": 25
        }
}
