var dvc = {
        "essential": {
                "graphic_data_url": "data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%d/%m/%Y",
                "legendStyle": "line",
                "directLabeling": true,
                "directLabelingAdjust": [{ "x": 0, "y": 0 }, { "x": 0, "y": 7 }, { "x": 0, "y": -43 }],
                "colour_palette": ["#206095", "#27A0CC", "#003C57", "#118C7B", "#A8BD3A", "#871A5B", "#F66068", "#746CB1", "#22D0B6"],
                // for darker text required by accessibility rules on colour contrast
                "colour_palette_labels": ["#206095", "#057FAC", "#003C57", "#118C7B", "#8A9B2E", "#871A5B", "#F66068", "#746CB1", "#1AA590"],
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

                "yAxisLabel": "%",
                "yAxisScale": [0, 100], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65, 65, 65]
        },

        "optional": {
                "margin_sm": [50, 50, 190, 50], //[top,right,bottom,left]
                "margin_md": [70, 90, 50, 50],
                "margin_lg": [70, 90, 50, 50],

                "aspectRatio_sm": [16, 10],
                "aspectRatio_md": [16, 10],
                "aspectRatio_lg": [16, 10],

                "mobileBreakpoint": 599,

                "xAxisTextFormat_sm_md_lg": ["%b", "%b %y", "%b %y"],

                "x_num_ticks_sm_md_lg": [4, 9, 9],
                "y_num_ticks_sm_md_lg": [5, 11, 11],

                "lineMarkers": true,

                "vertical_line": true,
                "annotateLineX1_Y1_X2_Y2": [
                        [["01/11/2020", "0"], ["01/11/2020", "105"]],
                        [["02/12/2020", "0"], ["02/12/2020", "100"]],
                        [["04/01/2021", "0"], ["04/01/2021", "100"]],
                        // [["22/02/2021", "0"], ["22/02/2021", "100"]],
                        [["12/04/2021", "0"], ["12/04/2021", "100"]]
                ],

                "annotateRect": false,
                "annotateRectX_Y": [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/],
                "lineColor_opcty": [["#ABCDEF", 0.2], ["#888", 0.4]],

                "centre_line": false,
                "centre_line_value": 25
        }
}
