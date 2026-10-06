var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": -520, "y": -40},{"x": -520, "y": -95},{"x": -520, "y": -25},],
            "colour_palette": ["#A8BD3A","#22D0B6","#003C57","#A8BD3A","#F66068","#003C57","#22D0B6","#746CB1"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#A8BD3A","#22D0B6","#003C57","#A8BD3A","#F66068","#003C57","#22D0B6","#746CB1"],
            "sourceText":["Bank of England – Effective interest rates and official Bank Rate"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
        //     {
        //         "xVal": "06/01/2020",
        //         "yVal": 5,
        //         "path": "",
        //         "text": "Start of the pandemic",
        //         "textOffset": [10,0]
        //       }
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

            "wordwrap":[10,20,10],
            "annoAlign": ["start"],
            "annotationBullet" : ["Dotted line shows start of the pandemic"],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"",
            "yAxisScale":[0,0.07], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [10, 40, 40, 15], //[top,right,bottom,left]
            "margin_md": [10, 40, 40, 15],
            "margin_lg": [10, 40, 40, 150],

            "aspectRatio_sm" : [16,16],
            "aspectRatio_md" : [16,14],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,
            "middleBreakpoint":  700,

            "xAxisTextFormat_sm_md_lg" : ["%Y", "%Y", "%Y"],

            "x_num_ticks_sm_md_lg" : [3,4,5],
            "y_num_ticks_sm_md_lg" : [5,5,5],

            "x_ticks_every": [48,24,24],

            "lineMarkers" : false,

            "vertical_line" : false,
            "annotateLineX1_Y1_X2_Y2" : [[["01/06/2020", "-50"],["01/06/2020", "500"]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
