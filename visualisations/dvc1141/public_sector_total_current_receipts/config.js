var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": -0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            // {
            //     "xVal": "1936-06-23T00:00:00.000Z",
            //     "yVal": 22,
            //     "path": "",
            //     "text": "A pre-war increase in receipts, in terms of GDP ",
            //     "textOffset": [0,0]
            //   },
            //
            //   {
            //     "xVal": "1950-06-23T00:00:00.000Z",
            //     "yVal": 50,
            //     "path": "",
            //     "text": "Post war saw the highest proportion of receipts in terms of GDP",
            //     "textOffset": [0,0]
            //   },

              {
                "xVal": "1987-06-01T00:00:00.000Z",
                "yVal": 32,
                "path": "",
                "text": "Largest contraction of receipts in terms of GDP",
                "textOffset": [0,0]
              },
              {
                "xVal": "2020-11-01T00:00:00.000Z",
                "yVal": 32,
                "path": "",
                "text": "Coronavirus pandemic, full year data not yet available",
                "textOffset": [0,0]
              }
            ],

            "wordwrap":[/*15,18,*/10,10],
            "annoAlign": [/*"end","start", */"middle", "middle"],
            "annotationBullet" : [
              // "1937/38 - pre-war: increase in receipts in terms of GDP",
              // "1949/50 – post war: the highest proportion of receipts in terms of GDP",
              "Financial year ending 1982 to financial year ending 1994 – largest contraction of receipts in terms of GDP",
              "Financial year ending 2021: Coronavirus pandemic, full year data not yet available"
            ],

            "circles" : false,
            "annotationCXCY":[
                ["1993","23"],
                ["1970","20"]
            ],
            "annotationColour": ["green"],

            "yAxisLabel":"% of nominal GDP",
            "yAxisScale":[0,45], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 25], //[top,right,bottom,left]
            "margin_md": [30, 40, 25, 25],
            "margin_lg": [10, 40, 25, 25],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%y", "%Y", "%Y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [ [["1937", "15"],["1937", "25.7"]], [["1949", "44.2"],["1949", "49"]] ],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["1982", 45],["1994", 0]] , [["2020", 45],["2021", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
