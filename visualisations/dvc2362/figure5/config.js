var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": -600, "y": 70},{"x": -600, "y": 110},{"x": -600, "y": -40}],
            "colour_palette": ["#F66068", "#4d7789", "#22D0B6","#234677","#A8BD3A","#F66068","#003C57","#22D0B6","#746CB1"], //"#234677","#22D0B6"
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#F66068", "#4d7789", "#22D0B6","#234677","#A8BD3A","#F66068","#003C57","#22D0B6","#746CB1"],
            "sourceText":["Office for National Statistics – Index of Private Housing Rental Prices"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "04/10/2021",
                "yVal": 0.043,
                "path": "",
                "text": "Largest annual change since records began",
                "textOffset": [0,0],
                "text-align": "end",

              }
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

            "wordwrap":[15],
            "annoAlign": ["start"],
            "annotationBullet" : ["Dotted line shows start of the pandemic"],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Percentage change",
            "yAxisScale":[-0.01,0.05], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 40, 40, 15], //[top,right,bottom,left]
            "margin_md": [50, 40, 40, 15],
            "margin_lg": [30, 40, 40, 70],

            "aspectRatio_sm" : [16,16],
            "aspectRatio_md" : [16,14],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,
            "middleBreakpoint":  700,

            "xAxisTextFormat_sm_md_lg" : ["%Y", "%Y", "%Y"],

            "x_num_ticks_sm_md_lg" : [3,4,5],
            "y_num_ticks_sm_md_lg" : [5,5,5],

            "x_ticks_every": [12,12,12],

            "lineMarkers" : false,

            "vertical_line" : false,
            "annotateLineX1_Y1_X2_Y2" : [[["01/01/2022", "-0.01"],["01/01/2022", "0.05"]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["01/01/2022", 0],["01/11/2022", 0]], [["01/01/2022", 0.05],["01/11/2022", -0.01]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.02], ["#787878", 0.04]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
