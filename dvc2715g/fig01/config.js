var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "Line chart showing the number of centenarians in England and Wales increased rapidly from the second half of the 20th century.", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#057FAC","#003C57","#118C7B","#8A9B2E","#871A5B","#F66068","#746CB1","#1AA590"],
            "sourceText":["Historic Census data (1921 to 2021) from the Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "1938-06-23T00:00:00.000Z",
                "yVal": 2800,
                "path": "",
                "text": "No census due to WWII",
                "textOffset": [0,0]
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

            "wordwrap":[18,18,18],
            "annoAlign": ["middle","middle","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"",
            "yAxisScale":[0,14000], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 55], //[top,right,bottom,left]
            "margin_md": [30, 82, 25, 55],
            "margin_lg": [10, 82, 25, 55],

            "aspectRatio_sm" : [16,14],
            "aspectRatio_md" : [16,11],
            "aspectRatio_lg" : [16,11],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%y", "%Y", "%Y"],

            "x_num_ticks_sm_md_lg" : [6,6,6],
            "y_num_ticks_sm_md_lg" : [6,6,6],

            "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [[["1938", "1900"],["1941", "200"]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
