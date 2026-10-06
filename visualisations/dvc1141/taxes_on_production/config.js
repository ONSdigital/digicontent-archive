var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%Y %b",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#27A0CC","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [


            {
                "xVal": "2009-01-23T00:00:00.000Z",
                "yVal": 5.5,
                "path": "",
                "text": "Financial crisis",
                "textOffset": [0,0]
            }
              ,
              {
                "xVal": "2008-09-23T00:00:00.000Z",
                "yVal": 10,
                "path": "",
                "text": "VAT rate cut to 15%",
                "textOffset": [0,0]
              },

              {
                "xVal": "2010-03-01T00:00:00.000Z",
                "yVal": 14,
                "path": "",
                "text": "VAT rate increased to 17.5%",
                "textOffset": [0,0]
              },

              {
                "xVal": "2011-03-01T00:00:00.000Z",
                "yVal": 11.8,
                "path": "",
                "text": "VAT rate increased to 20%",
                "textOffset": [0,0]
              },

              {
                "xVal": "2020-01-01T00:00:00.000Z",
                "yVal": 9.8,
                "path": "",
                "text": "Beginning of movement restrictions due to COVID-19",
                "textOffset": [0,0]
              }
            ],

            "wordwrap":[10,10,10,10,15],
            "annoAlign": ["middle","end","start","start","end"],
            "annotationBullet" : [
              "Nov 2008- April 09 - financial crisis",
              "December 2008: VAT rate cut to 15%",
              "January 2010: VAT rate increased to 17.5%",
              "January 2011: VAT rate increased to 20%",
              "March 2020 – beginning of movement restrictions due to COVID-19"
            ],

            "circles" : false,
            "annotationCXCY":[
                ["1993","23"],
                ["1970","20"]
            ],
            "annotationColour": ["green"],

            "yAxisLabel":"£ billion",
            "yAxisScale":[0,14], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 25], //[top,right,bottom,left]
            "margin_md": [30, 110, 25, 25],
            "margin_lg": [10, 110, 25, 25],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%y", "%Y", "%Y"],

            "x_num_ticks_sm_md_lg" : [6,9,9],
            "y_num_ticks_sm_md_lg" : [5,6,6],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [
              [["2008 DEC", "6.731"],["2008 DEC", "10"]],
              [["2010 JAN", "8.2"],["2010 JAN", "14"]],
              [["2011 JAN", "9.1"],["2011 JAN", "12"]],
              [["2020 MAR", "11.5"],["2020 MAR", "8"]]
             ],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["2008 NOV", 50],["2009 APR", 0]] ] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
