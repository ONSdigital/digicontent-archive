var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["Office for National Statistics - Opinions and Lifestyle Survey"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2020-11-24T00:00:00.000Z",
                "yVal": 85,
                "path": "",
                "text": "Lockdown 2",
                "textOffset": [0,0]
              },

              {
                "xVal": "2020-10-30T00:00:00.000Z",
                "yVal": 89,
                "path": "",
                "text": "Wales fire-break",
                "textOffset": [0,0]
              },

              {
                "xVal": "2021-01-14T00:00:00.000Z",
                "yVal": 85,
                "path": "",
                "text": "Lockdown 3",
                "textOffset": [0,0]
              }
            ],

            "wordwrap":[05,05,05],
            "annoAlign": ["middle","middle","middle"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"%",
            "yAxisScale":["auto_zero_max"], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [50, 10, 150, 35], //[top,right,bottom,left]
            "margin_md": [50, 82, 25, 35],
            "margin_lg": [50, 82, 25, 35],

            "aspectRatio_sm" : [16,11],
            "aspectRatio_md" : [16,11],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 640,

            "xAxisTextFormat_sm_md_lg" : ["%b", "%b %Y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["05/11/2020", 78],["02/12/2020", 0]], [["04/01/2021", 78],["24/01/2021", 0]], [["23/10/2020", 78],["09/11/2020", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#ABCDEF", 0.2],["#ABCDEF", 0.2],["#ABCDEF", 0.2]],
            // order of annotations: lockdown 2, lockdown 3, wales fire-break

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
