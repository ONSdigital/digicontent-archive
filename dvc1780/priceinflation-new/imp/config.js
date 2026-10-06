var dvc = {
        "essential": {
                "graphic_data_url": "data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%b-%y",
                "legendStyle": "line",
                "directLabeling": false,
                "directLabelingAdjust": [{ "x": 0, "y": 0 }, { "x": 0, "y": 7 }, { "x": 0, "y": -43 }],
                "colour_palette": ["#118C7B", "#27A0CC"],
                "colour_palette_labels": ["#118C7B", "#27A0CC"],
                "sourceText": [],
                "sourceURL": ["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart": [
                        // {
                        //   "xVal": "2003-06-23T00:00:00.000Z",
                        //   "yVal": 160,
                        //   "path": "",
                        //   "text": "Lorem ipsum dolor sit amet, consectetur",
                        //   "textOffset": [0,0]
                        // },
                        //
                        // {
                        //   "xVal": "2019-01-23T00:00:00.000Z",
                        //   "yVal": 140,
                        //   "path": "",
                        //   "text": "January 2019: Energy price cap introduced",
                        //   "textOffset": [0,0]
                        // }
                        //
                        // {
                        //   "xVal": "2011-06-01T00:00:00.000Z",
                        //   "yVal": 60,
                        //   "path": "",
                        //   "text": "incididunt ut labore et dolor",
                        //   "textOffset": [0,0]
                        // }
                ],

                "wordwrap": [30, 20, 10],
                "annoAlign": ["start", "start", "start"],
                "annotationBullet": [/*"An annotation","Another annotation"*/],

                "circles": false,
                // "annotationCXCY":[
                //     ["Jan-93","68.4"],
                //     ["Jan-08","73"]
                // ],
                //"annotationColour": ["green"],

                "yAxisLabel": "Index prices, January 2015 = 100",
                "yAxisScale": [70, 160], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65, 65, 65]
        },

        "optional": {
                "margin_sm": [50, 30, 80, 45], //[top,right,bottom,left]
                "margin_md": [50, 30, 80, 45],
                "margin_lg": [50, 30, 80, 45],

                "aspectRatio_sm": [16, 10],
                "aspectRatio_md": [16, 10],
                "aspectRatio_lg": [16, 10],

                "mobileBreakpoint": 414,
                "xAxisTextFormat_sm_md_lg": ["%Y", "%Y", "%b %y"],

                "x_num_ticks_sm_md_lg": [6, 7, 20],
                "y_num_ticks_sm_md_lg": [5, 5, 5],

                "lineMarkers": false,

                "vertical_line": true,
                "annotateLineX1_Y1_X2_Y2": [
                         [["Jan-19", "160"], ["Jan-19", "55"]],
                        // [["Oct-19", "32"], ["Oct-19", "0"]],
                        // [["Dec-20", "32"], ["Dec-20", "0"]]
                ],

                "annotateRect": true,
                "annotateRectX_Y": [
                        // [["Mar-20", 30], ["Oct-21", 0]]
                ],
                "lineColor_opcty": [["#888", 0.2]],

                "centre_line": true,
                "centre_line_value": 100
        }
}
