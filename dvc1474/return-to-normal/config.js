var dvc = {
        "essential" : {
                "graphic_data_url": "data.csv",
                "screenreadertext": "3 in 10 (30%) adults this week reported they felt it will take less than six months for life to return to normal",
                "dateFormat":"%d/%m/%Y",
                "legendStyle": "line",
                "directLabeling" : false,
                "directLabelingAdjust" : [{"x": 0, "y": 5},{"x": 0, "y": 5}],
                "colour_palette": ["#206095","#A8BD3A","#118C7B"],
                "colour_palette_direct_labels": ["#206095","#8A9B2E","#118C7B"],
                "sourceText":["Office for National Statistics – Opinions and Lifestyle Survey"],
                "sourceURL":["http://www.ons.gov.uk"],
                "draggable": false,
                "annotationsChart" : [

                ],

                "wordwrap":[30,20,10],
                "annoAlign": ["middle","middle","end"],
                "annotationBullet" : [],

                "circles" : false,

                "yAxisLabel":"%",
                "yAxisScale":"auto_zero_max",
                "yAxisBreak": false,
                "yAxisBreak_sm_md_lg": [65,65,65]
        },

        "optional" : {
                "margin_sm": [70, 13, 400, 25],
                "margin_md": [95, 175, 25, 35],
                "margin_lg": [20, 175, 25, 35],

                "aspectRatio_sm" : [16,10],
                "aspectRatio_md" : [16,10],
                "aspectRatio_lg" : [16,10],

                "mobileBreakpoint" : 690,

                "xAxisTextFormat_sm_md_lg" : ["%b", "%b", "%b"],

                "x_num_ticks_sm_md_lg" : [2,9,9],
                "y_num_ticks_sm_md_lg" : [5,5,11],

                "lineMarkers" : false,

                "vertical_line" : true,
                "annotateLineX1_Y1_X2_Y2" : [
                  [["16/04/2020", "0"],["16/04/2020", "55"]],
                  [["15/06/2020", "0"],["15/06/2020", "50"]],
                  [["02/12/2020", "0"],["02/12/2020", "60"]],
                  [["05/01/2021", "0"],["05/01/2021", "46"]],
                  [["28/03/2021", "0"],["28/03/2021", "60"]],
                  [["12/04/2021", "0"],["12/04/2021", "45"]],
                  [["17/05/2021", "0"],["17/05/2021", "35"]],
                  [["14/06/2021", "0"],["14/06/2021", "26"]]
                ],

                "annotateRect" : true,
                "annotateRectX_Y" : [] ,
                "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

                "centre_line" : false,
                "centre_line_value" : 25
        }
    }
