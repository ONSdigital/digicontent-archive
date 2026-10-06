var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%b-%y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 2},{"x": 0, "y": 3}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#057FAC","#003C57","#118C7B","#8A9B2E","#871A5B","#F66068","#746CB1","#1AA590"],
            "sourceText":["Office for National Statistics -UK Trade"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2019-02-25T00:00:00.000Z",
                "yVal": 4.5,
                "path": "",
                "text": "Brexit deadline",
                "textOffset": [0,0]
              },
              {
                  "xVal": "2019-09-25T00:00:00.000Z",
                  "yVal": 4.5,
                  "path": "",
                  "text": "Brexit deadline",
                  "textOffset": [0,0]
                },
                {
                    "xVal": "2020-07-03T00:00:00.000Z",
                    "yVal": 4.5,
                    "path": "",
                    "text": "Coronavirus pandemic",
                    "textOffset": [0,0]
                  }
              //,
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

            "wordwrap":[10,10,10],
            "annoAlign": ["end","end","middle"],
            "annotationBullet" : ["March 2019: Brexit deadline", "October 2019: Brexit deadline", "March 2020 onwards: Coronavirus pandemic"],


            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"£ billion, seasonally adjusted",
            "yAxisScale":[0,5], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 30], //[top,right,bottom,left]
            "margin_md": [30, 130, 25, 30],
            "margin_lg": [10, 130, 25, 30],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b %y", "%b %y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,6,6],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [ [["Mar-19", "5"],["Mar-19", "0"]], [["Oct-19", "5"],["Oct-19", "0"]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["Mar-20", 5],["Nov-20", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
