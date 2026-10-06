var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "There has been a steady decrease in the proportion of adults feeling that it will take more than a year for life to return to normal", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d-%b",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": -1, "y": -5},{"x": -1, "y": 16},{"x": 0, "y": 2},{"x": 0, "y": -1},{"x": 0, "y": 2}],
            "colour_palette": ["#206095","#A8BD3A","#7f7f7f","#003C57","#aaa","#871A5B","#F66068","#746CB1","#22D0B6"],
            "colour_palette_direct_labels": ["#206095","#8A9B2E","#7f7f7f","#003C57","#767676","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["Office for National Statistics – Opinions and Lifestyle Survey"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            // {
              //   "xVal": "2003-06-23T00:00:00.000Z",
              //   "yVal": 160,
              //   "path": "",
              //   "text": "Lorem ipsum dolor sit amet, consectetur",
              //   "textOffset": [0,0]
              // },
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

            "wordwrap":[30,20,10],
            "annoAlign": ["middle","middle","end"],
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
            "margin_sm": [58, 13, 200, 25], //[top,right,bottom,left]
            "margin_md": [58, 150, 25, 35],
            "margin_lg": [10, 150, 25, 35],

            "aspectRatio_sm" : [16,10],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 520,

            "xAxisTextFormat_sm_md_lg" : ["%b", "%b", "%b"],

            "x_num_ticks_sm_md_lg" : [4,9,9],
            "y_num_ticks_sm_md_lg" : [5,5,11],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [
              [["16-Apr", "0"],["16-Apr", "50"]],
              [["15-Jun", "0"],["15-Jun", "50"]],
              [["3-Aug", "0"],["3-Aug", "50"]],
              [["2-Dec", "0"],["2-Dec", "50"]]
            ],

            "annotateRect" : true,
            "annotateRectX_Y" : [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
