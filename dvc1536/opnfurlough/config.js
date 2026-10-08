var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": -25},{"x": 0, "y": 5}],
            "colour_palette": ["#F66068","#206095"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#F66068","#206095"],
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2020-06-28T00:00:00.000Z",
                "yVal": 64,
                "path": "",
                "text": "Furlough rates peaked at 3 times higher for those earning less than £20,000 in summer 2020",
                "textOffset": [0,0]
              },

              {
                "xVal": "2021-02-28T00:00:00.000Z",
                "yVal": 44,
                "path": "",
                "text": "Furlough rates were twice as high for those earning less than £20,000",
                "textOffset": [0,0]
              }
            ],

            "wordwrap":[20,20],
            "annoAlign": ["start","middle","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Proportion (%) furloughed",
            "yAxisScale":"auto_zero_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
      "margin_sm": [30, 30, 25, 35], //[top,right,bottom,left]
      "margin_md": [30, 82, 25, 35],
      "margin_lg": [30, 82, 25, 35],

            "aspectRatio_sm" : [3,3],
            "aspectRatio_md" : [5,3],
            "aspectRatio_lg" : [6,4],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b-%y", "%b-%y", "%b-%y"],

            "x_num_ticks_sm_md_lg" : [2,8,8],
            "y_num_ticks_sm_md_lg" : [4,4,4],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [/* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
