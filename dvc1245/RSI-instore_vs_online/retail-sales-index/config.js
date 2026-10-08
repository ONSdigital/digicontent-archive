var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%b-%y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 0},{"x": 0, "y": 7}],
            "colour_palette": ["#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#003C57","#118C7B","#8A9B2E","#871A5B","#F66068","#746CB1","#1AA590"],
            "sourceText":[],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2020-04-15T00:00:00.000Z",
                "yVal": 80,
                "path": "",
                "text": "Spring 2020 Lockdown",
                "textOffset": [0,0]
              },

              {
                "xVal": "2020-11-25T00:00:00.000Z",
                "yVal": 125,
                "path": "",
                "text": "Autumn/Winter 2020 restrictions",
                "textOffset": [0,0]
              // },

            //   {
            //     "xVal": "2021-02-20T00:00:00.000Z",
            //     "yVal": 75,
            //     "path": "",
            //     "text": "Early 2021 Lockdown",
            //     "textOffset": [0,0]
              }
            ],

            "wordwrap":[5,20,10],
            "annoAlign": ["middle","middle","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Retail sales index (February 2020 = 100)",
            "yAxisScale":"auto_min_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 20, 25, 35], //[top,right,bottom,left]
            "margin_md": [30, 85, 25, 35],
            "margin_lg": [10, 82, 25, 35],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,6],
            "aspectRatio_lg" : [16,4],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b %y", "%b %y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [1,8,4],
            "y_num_ticks_sm_md_lg" : [4,4,4],

            "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotate_format": "%d/%m/%Y",
            "annotateRect" : true,
            "annotateRectX_Y" : [ [["23/03/2020", 165],["13/05/2020", 28]], [["14/10/2020", 170],["04/01/2021", 28]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#ABCDEF", 0.2],["#ABCDEF", 0.2],["#ABCDEF", 0.2]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
