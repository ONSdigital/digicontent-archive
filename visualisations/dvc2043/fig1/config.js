var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": 0},{"x": 0, "y": 0}],
            "colour_palette": ["#003C57","#A8BD3A","#871A5B","#27A0CC"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#003C57","#A8BD3A","#871A5B","#27A0CC"],
            "sourceText":["Office for National Statistics – Monthly Business Survey – Retail Sales Inquiry"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2020-01-01T00:00:00.000Z",
                "yVal": 33.5,
                "path": "",
                "text": "Proportion of online sales peaked during lockdown restrictions",
                "textOffset": [0,0]
              }
              ,

              {
                "xVal": "2006-02-01T00:00:00.000Z",
                "yVal": 206,
                "path": "",
                "text": "Above 100 means above 2016 baseline",
                "textOffset": [0,0]
              }
              // ,
              //
              // {
              //   "xVal": "2011-06-01T00:00:00.000Z",
              //   "yVal": 60,
              //   "path": "",
              //   "text": "incididunt ut labore et dolor",
              //   "textOffset": [0,0]
              // }
            ],

            "wordwrap":[20,20,10],
            "annoAlign": ["end","start","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"%",
            "yAxisScale":"auto_zero_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 30], //[top,right,bottom,left]
            "margin_md": [30, 20, 25, 50],
            "margin_lg": [10, 20, 25, 50],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 420,

            "xAxisTextFormat_sm_md_lg" : ["%b %y", "%b %y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [4,9,9],
            "y_num_ticks_sm_md_lg" : [5,10,10],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["23/03/2020", 38],["15/06/2020", 0]],[["05/11/2020", 38],["02/12/2020", 0]],[["04/01/2021", 38],["29/03/2021", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.4], ["#ABCDEF", 0.4],["#ABCDEF", 0.4]],

            "centre_line" : true,
            "centre_line_value" : 100
    }
}
