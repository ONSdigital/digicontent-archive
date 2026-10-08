var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 5, "y": -30},{"x": 5, "y": -20}],
            "colour_palette": ["#206095","#871A5B","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#871A5B","#003C57","#118C7B","#8A9B2E","#871A5B","#F66068","#746CB1","#1AA590"],
            "translateVals": [[-5,-20],[15,0],[10,0]],
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "1989",
                "yVal": 180000,
                "path": "",
                "text": "Change in way flu and pneumonia deaths were counted¹",
                "number": "1",
                "textOffset": [-5,-20]
            },
            {
                "xVal": "1918",
                "yVal": 165000,
                "path": "",
                "text": "Spanish flu",
                "number": "2",
                "textOffset": [15,0]
            },
            {
                "xVal": "2000",
                "yVal": 140000,
                "path": "",
                "text": "Flu vaccination extended to all adults over 65",
                "number": "3",
                "textOffset": [10,0]
            }
            ],

            "wordwrap":[30,12,6],
            "annoAlign": ["middle","start","start"],
            "annotationBullet" : ["Change in way flu and pneumonia deaths were counted","Spanish flu","Flu vaccination extended to all adults over 65"],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Yearly deaths",
            "yAxisScale":[0,180000], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [40, 17, 25, 65], //[top,right,bottom,left]
            "margin_md": [40, 102, 25, 65],
            "margin_lg": [40, 102, 25, 65],

            "aspectRatio_sm" : [16,20],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 500,

            "xAxisTextFormat_sm_md_lg" : ["%Y", "%Y", "%Y"],

            "x_num_ticks_sm_md_lg" : [4,9,9],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : true,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [[["2000", 180000],["2000", 0]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["1983", 180000],["1992", 0]]] ,
            "lineColor_opcty" : [["#206095", 0.2]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
