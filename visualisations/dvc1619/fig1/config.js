var dvc = {
    "essential" : {
            "graphic_data_url": "data.csv",
            "screenreadertext": "", //will replace default screenreader text - use if fuller description needed
            "dateFormat":"%d/%m/%Y",
            "legendStyle": "line",
            "directLabeling" : true,
            "directLabelingAdjust" : [{"x": 0, "y": 2},{"x": 0, "y": -30},{"x": 0, "y": 16},{"x": 0, "y": -5}],
            "colour_palette": ["#206095","#118C7B","#27A0CC","#A8BD3A"],
            // for darker text required by accessibility rules on colour contrast
            "colour_palette_labels": ["#206095","#118C7B","#27A0CC","#8A9B2E"],
            "sourceText":["Office for National Statistics – Opinions and Lifestyle Survey (COVID-19 module)"],
            "sourceURL":["http://www.ons.gov.uk"],
            "draggable": false,
            "annotationsChart" : [

                  //           {
                  //   "xVal": "2021-02-22T00:00:00.000Z",
                  //   "yVal": 105,
                  //   "path": "",
                  //   "text": "Roadmap out of lockdown announced for England",
                  //   "textOffset": [-2,-52]
                  // },
                  {
                      "xVal": "2021-03-28T00:00:00.000Z",
                      "yVal": 105,
                      "path": "",
                      "text": "Meeting outdoors in England",
                      "textOffset": [2,-7]
                    },
                    {
                        "xVal": "2021-04-12T00:00:00.000Z",
                        "yVal": 105,
                        "path": "",
                        "text": "Outdoor dining in England",
                        "textOffset": [1.5,-22]
                      },
                      {
                          "xVal": "2021-05-17T00:00:00.000Z",
                          "yVal": 105,
                          "path": "",
                          "text": "Indoor mixing with rule of six",
                          "textOffset": [1.5,-7]
                        },
                        {
                            "xVal": "2021-07-19T00:00:00.000Z",
                            "yVal": 105,
                            "path": "",
                            "text": "Restrictions lifted in England and Scotland",
                            "textOffset": [1.5,-60]
                          },
                          {
                              "xVal": "2021-08-16T00:00:00.000Z",
                              "yVal": 105,
                              "path": "",
                              "text": "Double vaccinated no longer required to isolate in England",
                              "textOffset": [1.5,-52]
                            }
            ],

            "wordwrap":[17,10,15,15,15],
            "annoAlign": ["end","start","start","end","start"],
            "annotationBullet" : ["1 Meeting outdoors", "2 Outdoor dining", "3 Indoor mixing with rule of six", "4 Restrictions lifted", "5 Double vaccinated no longer required to isolate"],

            "circles" : false,
            // "annotationCXCY":[
            //     ["Jan-93","68.4"],
            //     ["Jan-08","73"]
            // ],
            // "annotationColour": ["green"],

            "yAxisLabel":"%",
            "yAxisScale":[0,100], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [65, 48, 25, 35], //[top,right,bottom,left]
            "margin_md": [90, 120, 25, 35],
            "margin_lg": [90, 120, 25, 35],

            "aspectRatio_sm" : [16,20],
            "aspectRatio_md" : [16,10],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b-%y", "%b-%y", "%b-%y"],

            "x_num_ticks_sm_md_lg" : [3,6,6],
            "y_num_ticks_sm_md_lg" : [5,5,5],

            "lineMarkers" : false,

            "vertical_line" : true,
            // "annotateLineX1_Y1_X2_Y2" : [[["04/01/2021", 0],["04/01/2021", 100]],[["22/02/2021", 0],["22/02/2021", 100]],[["28/03/2021", 0],["28/03/2021", 100]],[["12/04/2021", 0],["12/04/2021", 100]],[["17/05/2021", 0],["17/05/2021", 100]],[["19/07/2021", 0],["19/07/2021", 100]],[["16/08/2021", 0],["16/08/2021", 100]]],
            "annotateLineX1_Y1_X2_Y2" : [[["28/03/2021", 0],["28/03/2021", 100]],[["12/04/2021", 0],["12/04/2021", 100]],[["17/05/2021", 0],["17/05/2021", 100]],[["19/07/2021", 0],["19/07/2021", 115]],[["16/08/2021", 0],["16/08/2021", 100]]],

            "annotateRect" : true,
            "annotateRectX_Y" : [ [["04/01/2021", 100],["28/03/2021", 0]]] ,
            "lineColor_opcty" : [["#ABCDEF", 0.3]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
