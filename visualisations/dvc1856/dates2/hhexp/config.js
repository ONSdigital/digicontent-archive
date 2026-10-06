var dvc = {
    "essential" : {
            "graphic_data_url": "../data.csv",
            "chart_title": "Household spending",
            "chart_subtitle":"Subtitle text ",
            "thisline": "hhexp",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#a8bd3a","#27A0CC","#F66068"],
            "linestyle": ["2 0","5 5","2 0"],
            "line1width": ["20px","10px","20px"],
            "line2width": ["0px","10px","0px"],
            "annooffset": 0,
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            // {
            //     "xVal": "1974-06-23T00:00:00.000Z",
            //     "yVal": 20,
            //     "path": "",
            //     "text": "Strikes and three day week",
            //     "textOffset": [0,0]
            //   },
            //
            //   {
            //     "xVal": "1984-06-23T00:00:00.000Z",
            //     "yVal": 20,
            //     "path": "",
            //     "text": "Miner's strikes",
            //     "textOffset": [0,0]
            //   }
            ],

            "wordwrap":[20,20],
            "annoAlign": ["middle","middle"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"%",
            "yAxisScale":"auto_min_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
      "margin_sm": [20, 20, 30, 30], //[top,right,bottom,left]
      "margin_md": [20, 20, 30, 30],
      "margin_lg": [20, 20, 30, 30],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%Y", "%Y", " %Y"],

            "x_num_ticks_sm_md_lg" : [5,5,5],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : false,

            "vertical_line" : false,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [
              [["01/03/1973", 6],["30/09/1975", -5]],
              [["01/03/1979", 6],["31/03/1981", -5]],
                [["01/01/1984", 6],["30/09/1985", -5]]
              ],
            "lineColor_opcty" : [["#888", 0.2], ["#888", 0.2], ["#888", 0.2]],

            "centre_line" : true,
            "centre_line_value" : 0
    }
}
