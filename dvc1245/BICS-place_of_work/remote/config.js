var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#206095","#27A0CC","#003C57","#118C7B","#A8BD3A"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#206095","#27A0CC","#003C57","#118C7B","#A8BD3A"],
            "line_widths": [4.5,2.5,2.5,2.5,2.5,4.5,2.5,2.5,2.5,2.5],
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            // {
            //     "xVal": "2020-04-04T00:00:00.000Z",
            //     "yVal": 75,
            //     "path": "",
            //     "text": "Spring 2020 Lockdown",
            //     "textOffset": [0,0]
            //   },
            //
            //   {
            //     "xVal": "2020-11-24T00:00:00.000Z",
            //     "yVal": 72.5,
            //     "path": "",
            //     "text": "Winter 2020 restrictions",
            //     "textOffset": [0,0]
            //   },
            //
            //   {
            //     "xVal": "2021-02-20T00:00:00.000Z",
            //     "yVal": 75,
            //     "path": "",
            //     "text": "Early 2021 Lockdown",
            //     "textOffset": [0,0]
            //   }
            ],

            "wordwrap":[5,10,5],
            "annoAlign": ["start","middle","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"%",
            "yAxisScale":[0,85], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 35], //[top,right,bottom,left]
            "margin_md": [30, 20, 25, 35],
            "margin_lg": [10, 20, 25, 35],

            "aspectRatio_sm" : [16,8],
            "aspectRatio_md" : [16,6],
            "aspectRatio_lg" : [16,6],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b", "%b %y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,5,5],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [ [["04/01/2021", "85"],["04/01/2021", "0"]] ],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["03/04/2020", 84],["13/05/2020", 0]], [["14/10/2020", 84],["04/01/2021", 0]], [["05/01/2021", 84],["21/02/2021", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#ABCDEF", 0.2],["#ABCDEF", 0.2],["#ABCDEF", 0.2]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
