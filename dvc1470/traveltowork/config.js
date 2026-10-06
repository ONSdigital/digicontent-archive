var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": -60},{"x": 0, "y": 0},{"x": 0, "y": 12}],
            "colour_palette": ["#206095","#118C7B","#871A5B"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#118C7B","#871A5B"],
            "sourceText":["Office for National Statistics – Opinions and Lifestyle Survey (COVID-19 module)"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [
                                  {
                          "xVal": "2021-07-19T00:00:00.000Z",
                          "yVal": 51,
                          "path": "",
                          "text": "Restrictions lifted in England and Scotland",
                          "textOffset": [2,-55]
                        },
                        {
                            "xVal": "2021-08-16T00:00:00.000Z",
                            "yVal": 55,
                            "path": "",
                            "text": "Double vaccinated no longer required to isolate in England",
                            "textOffset": [-2,-55]
                          }


            ],

            "wordwrap":[20,20,10],
            "annoAlign": ["end","start","start","end","start"],
            "annotationBullet" : ["1 Restrictions lifted", "2 Double vaccinated no longer required to isolate"],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            // "annotationColour": ["green"],

            "yAxisLabel":"%",
            "yAxisScale":[0,60], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [70, 30, 25, 30], //[top,right,bottom,left]
            "margin_md": [75, 140, 25, 30],
            "margin_lg": [75, 140, 25, 30],

            "aspectRatio_sm" : [16,20],
            "aspectRatio_md" : [16,10],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b-%y", "%b-%y", "%b-%y"],

            "x_num_ticks_sm_md_lg" : [5,6,6],
            "y_num_ticks_sm_md_lg" : [5,5,5],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [[["19/07/2021", 0],["19/07/2021", 60]],[["16/08/2021", 0],["16/08/2021", 60]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["04/01/2021", 60],["28/03/2021", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.3]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
