var dvc = {
    "essential" : {
            "graphic_data_url": "../data.csv",
            "chart_title": "Production",
            "chart_subtitle":"In June 2002 production in the UK fell by 5.4% amid the Golden Jubilee celebrations.",
            "thisline": "output",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": 0},{"x": 0, "y": 7},{"x": 0, "y": -43}],
            "colour_palette": ["#00a3a6","#27A0CC","#F66068"],
            "linestyle": ["2 0","5 5","2 0"],
            "line1width": ["20px","10px","20px"],
            "line2width": ["0px","10px","0px"],
            "annooffset": 0,
            "sourceText":["Office for National Statistics - Index of production, GDP first quarterly estimate"],
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
              {
                "xVal": "2012-08-23T00:00:00.000Z",
                "yVal": 5.1,
                "path": "",
                "text": "London 2012 Olympic and Paralympic games",
                "textOffset": [0,0]
              },

              {
                "xVal": "2002-06-01T00:00:00.000Z",
                "yVal": 4.2,
                "path": "",
                "text": "Golden Jubilee",
                "textOffset": [0,0]
              }
            ],

            "wordwrap":[10,20,10],
            "annoAlign": ["middle","middle","end"],
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
      "margin_sm": [30, 25, 30, 30], //[top,right,bottom,left]
      "margin_md": [30, 25, 30, 30],
      "margin_lg": [30, 25, 30, 30],

            "aspectRatio_sm" : [16,12],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,12],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%Y", "%Y", " %Y"],

            "x_num_ticks_sm_md_lg" : [2,2,2],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : false,

            "vertical_line" : false,
            "annotateLineX1_Y1_X2_Y2" : [/* [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] */],

            "annotateRect" : true,
            "annotateRectX_Y" : [
              [["01/05/2002", 4],["31/06/2002", -6]],
              [["01/07/2012", 2],["30/09/2012", -6]],
              [["01/01/1984", 60],["30/09/1985", -20]]
            ] ,
            "lineColor_opcty" : [["#888", 0.2], ["#888", 0.2], ["#888", 0.2]],

            "centre_line" : false,
            "centre_line_value" : 0
    }
}
