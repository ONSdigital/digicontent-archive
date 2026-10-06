var dvc = {
        "essential": {
                "graphic_data_url": "data.csv",
                "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
                "dateFormat": "%d/%m/%Y",
                "legendStyle": "line",
                "directLabeling": false,
                "directLabelingAdjust": [{ "x": 0, "y": 0 }, { "x": 0, "y": 7 }, { "x": 0, "y": -43 }],
                "colour_palette": ["#27A0CC", "#871A5B"],
                "colour_palette_labels": ["#27A0CC", "#871A5B"],
                "sourceText": [],
                "sourceURL": ["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart": [
                        {
                                "xVal": "2020-04-15T00:00:00.000Z",
                                "yVal": 10000,
                                "path": "",
                                "text": "Testing capacity was small and case numbers likely under-reported",
                                "textOffset": [0, 0]
                        },
                        {
                                "xVal": "2020-05-28T00:00:00.000Z",
                                "yVal": 10000,
                                "path": "",
                                "text": "T&T introduced",
                                "textOffset": [0, 0]
                        },
                        {
                                "xVal": "2020-07-09T00:00:00.000Z",
                                "yVal": 0,
                                "path": "",
                                "text": "CIS introduced",
                                "textOffset": [0, 0]
                        },
                        {
                                "xVal": "2022-01-11T00:00:00.000Z",
                                "yVal": 220000,
                                "path": "",
                                "text": "End of confirmatory PCR tests",
                                "textOffset": [0, 0]
                        },
                        {
                                "xVal": "2022-04-01T00:00:00.000Z",
                                "yVal": 120000,
                                "path": "",
                                "text": "End of universal testing",
                                "textOffset": [0, 0]
                        }
                ],

                "wordwrap": [20, 20, 10],
                "annoAlign": ["end", "middle", "end"],
                "annotationBullet": [/*"An annotation","Another annotation"*/],

                "circles": false,
                // "annotationCXCY":[
                //     ["Jan-93","68.4"],
                //     ["Jan-08","73"]
                // ],
                //"annotationColour": ["green"],

                "yAxisLabel": "CIS estimate of the proportion of the population testing positive for COVID-19 (%)",
                "yAxisScale": ["auto_zero_max"], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65, 65, 65]
        },

        "optional": {
                "margin_sm": [50, 30, 60, 60], //[top,right,bottom,left]
                "margin_md": [50, 30, 60, 60],
                "margin_lg": [50, 30, 60, 60],

                "aspectRatio_sm": [16, 10],
                "aspectRatio_md": [16, 10],
                "aspectRatio_lg": [16, 10],

                "mobileBreakpoint": 414,

                "xAxisTextFormat_sm_md_lg": ["%b %y", "%b %y", "%b %y"],

                "x_num_ticks_sm_md_lg": [6, 7, 20],
                "y_num_ticks_sm_md_lg": [5, 5, 5],

                "lineMarkers": false,

                "vertical_line": true,
                "annotateLineX1_Y1_X2_Y2": [
                        [["31/12/2021", "8"], ["31/12/2021", "0"]],
                        [["01/04/2022", "8"], ["01/04/2022", "0"]]
                ],

                "annotateRect": false,
                "annotateRectX_Y": [
                        [["Mar-20", 30], ["Feb-22", 0]]
                ],
                "lineColor_opcty": [["#888", 0.2]],

                "centre_line": false,
                "centre_line_value": 25
        }
}
