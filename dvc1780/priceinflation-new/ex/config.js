var dvc = {
        "essential": {
                "graphic_data_url": "data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%b-%y",
                "legendStyle": "line",
                "directLabeling": false,
                "directLabelingAdjust": [{ "x": 0, "y": 0 }, { "x": 0, "y": 7 }, { "x": 0, "y": -43 }],
                "colour_palette": ["#206095", "#206095"],
                "colour_palette_labels": ["#206095", "#206095"],
                "sourceText": [],
                "sourceURL": ["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart": [
                        // {
                        //   "xVal": "Jan-19",
                        //   "yVal": 1000,
                        //   "path": "",
                        //   "text": "Lorem ipsum dolor sit amet, consectetur",
                        //   "textOffset": [0,0]
                        // },
                        //
                        {
                          "xVal": "2018-10-23T00:00:00.000Z",
                          "yVal": 1250,
                          "path": "",
                          "text": "January 2019: Energy price cap introduced",
                          "textOffset": [0,0]
                        }
                        // {
                        //   "xVal": "2017-06-23T00:00:00.000Z",
                        //   "yVal": 1000,
                        //   "path": "",
                        //   "text": "adipiscing elit, sed do eiusmod",
                        //   "textOffset": [0,0]
                        // }


                        //   "xVal": "2011-06-01T00:00:00.000Z",
                        //   "yVal": 60,
                        //   "path": "",
                        //   "text": "incididunt ut labore et dolor",
                        //   "textOffset": [0,0]
                        // }
                ],

                "wordwrap": [30, 20, 10],
                "annoAlign": ["end", "end", "end"],
                "annotationBullet": [/*"An annotation","Another annotation"*/],

                "circles": false,
                // "annotationCXCY":[
                //     ["Jan-93","68.4"],
                //     ["Jan-08","73"]
                // ],
                //"annotationColour": ["green"],

                "yAxisLabel": "Default tariff cap level for direct debit, dual fuel, £",
                "yAxisScale": [900, 1300], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
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

                "x_num_ticks_sm_md_lg": [6, 7, 12],
                "y_num_ticks_sm_md_lg": [5, 5, 5],

                "lineMarkers": false,

                "vertical_line": false,
                "annotateLineX1_Y1_X2_Y2": [
                        // [["Mar-19", "32"], ["Mar-19", "0"]],
                        // [["Oct-19", "32"], ["Oct-19", "0"]],
                        // [["Dec-20", "32"], ["Dec-20", "0"]]
                ],

                "annotateRect": true,
                "annotateRectX_Y": [
                        [["Jan-15", 1300], ["Jan-19", 840]]
                ],
                "lineColor_opcty": [["#888", 0.2]],

                "centre_line": false,
                "centre_line_value": 25
        }
}
