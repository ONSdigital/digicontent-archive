var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["HM Prison and Probation Service and Ministry of Justice"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [

            ],

            "wordwrap":[12,12,05],
            "annoAlign": ["middle","middle","middle"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Number of positive tests",
            "yAxisScale":[0, 2400], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [50, 10, 120, 50], //[top,right,bottom,left]
            "margin_md": [50, 82, 25, 50],
            "margin_lg": [50, 82, 25, 50],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 640,

            "xAxisTextFormat_sm_md_lg" : ["%b", "%b", "%b"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : true,

            "vertical_line" : false,
            "annotateLineX1_Y1_X2_Y2" : [ [["15/04/2020", "400"],["15/04/2020", "0"]], [["20/07/2020", "200"],["20/07/2020", "0"]] ],

            "annotateRect" : false,
            "annotateRectX_Y" : [ [["05/11/2020", 78],["02/12/2020", 0]], [["04/01/2021", 78],["20/01/2021", 0]], [["23/10/2020", 78],["09/11/2020", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#ABCDEF", 0.2],["#ABCDEF", 0.2],["#ABCDEF", 0.2]],
            // order of annotations: lockdown 2, lockdown 3, wales fire-break

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
