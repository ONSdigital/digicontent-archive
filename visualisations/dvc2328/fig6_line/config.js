var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 0},{"x": 0, "y": -9},{"x": 0, "y": 10},{"x": 0, "y": -8}],
            "colour_palette": ["#206095","#27A0CC","#871A5B","#A8BD3A","#F66068","#003C57","#118C7B","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#057FAC","#871A5B","#8A9B2E","#FFF","#003C57","#118C7B","#746CB1","#1AA590"],
            "sourceText":["Office for National Statistics – Business Insights and Conditions Survey"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2022-09-01T00:00:00.000Z",
                "yVal": 51,
                "path": "",
                "text": "Accommodation data only available for July, September and October",
                "textOffset": [7,0]
              },
              //
              // {
              //   "xVal": "1995-06-23T00:00:00.000Z",
              //   "yVal": 120,
              //   "path": "",
              //   "text": "adipiscing elit, sed do eiusmod",
              //   "textOffset": [0,0]
              // },
              //
              // {
              //   "xVal": "2011-06-01T00:00:00.000Z",
              //   "yVal": 60,
              //   "path": "",
              //   "text": "incididunt ut labore et dolor",
              //   "textOffset": [0,0]
              // }
            ],

            "wordwrap":[25,20,10],
            "annoAlign": ["end","middle","end"],
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
            "margin_sm": [30, 10, 25, 35], //[top,right,bottom,left]
            "margin_md": [30, 180, 25, 35],
            "margin_lg": [10, 180, 25, 35],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 550,

            "xAxisTextFormat_sm_md_lg" : ["%b-%y", "%b-%y", "%b-%y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
