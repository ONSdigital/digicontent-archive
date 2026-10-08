var dvc = {
    "essential" : {
            "graphic_data_url": "data3.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : false,
            "directLabelingAdjust" : [{"x": 0, "y": -10},{"x": 0, "y": -20},{"x": 0, "y": -43}],
            "colour_palette": ["#206095","#871A5B","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#871A5B","#003C57","#118C7B","#A8BD3A","#871A5B","#F66068","#746CB1","#22D0B6"],
            "sourceText":["Office for National Statistics"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
            {
                "xVal": "2003-06-23T00:00:00.000Z",
                "yVal": 160,
                "path": "",
                "text": "Lorem ipsum dolor sit amet, consectetur",
                "textOffset": [0,0]
              },

              {
                "xVal": "1995-06-23T00:00:00.000Z",
                "yVal": 120,
                "path": "",
                "text": "adipiscing elit, sed do eiusmod",
                "textOffset": [0,0]
              },

              {
                "xVal": "2011-06-01T00:00:00.000Z",
                "yVal": 60,
                "path": "",
                "text": "incididunt ut labore et dolor",
                "textOffset": [0,0]
              }
            ],

            "wordwrap":[30,20,10],
            "annoAlign": ["middle","middle","end"],
            "annotationBullet" : [/*"An annotation","Another annotation"*/],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            //"annotationColour": ["green"],

            "yAxisLabel":"Weekly deaths",
            "yAxisScale":"auto_zero_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 10, 25, 55], //[top,right,bottom,left]
            "margin_md": [30, 10, 25, 55],
            "margin_lg": [30, 10, 25, 55],

            "aspectRatio_sm" : [16,16],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%y", "%b %Y", "%b %y"],

            "x_num_ticks_sm_md_lg" : [6,4,4],
            "y_num_ticks_sm_md_lg" : [5,11,11],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [[["29/01/2020", 1200],["29/01/2020", 0]]],
            "annotateLineText": ["First confirmed UK COVID-19 case"],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["01/01/2018", 1200],["01/04/2018", 0]],[["01/12/2018", 1200],["01/04/2019", 0]],[["01/12/2019", 1200],["01/04/2020", 0]],[["01/12/2020", 1200],["01/04/2021", 0]],[["01/12/2021", 1200],["01/04/2022", 0]]] ,
            "lineColor_opcty" : [["#dadada", 0.6],["#dadada", 0.6],["#dadada", 0.6],["#dadada", 0.6],["#dadada", 0.6],["#dadada", 0.6]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
