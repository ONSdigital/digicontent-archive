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
                "xVal": "2020-02-29T00:00:00.000Z",
                "yVal": 1350,
                "path": "",
                "text": "UK lockdown starts",
                "textOffset": [0,0]
            }
              ,
              {
                "xVal": "2020-05-01T00:00:00.000Z",
                "yVal": 500,
                "path": "",
                "text": "13 May: lockdown restriction begin to be eased",
                "textOffset": [0,0]
              },
              {
                "xVal": "2020-06-05T00:00:00.000Z",
                "yVal": 500,
                "path": "",
                "text": "15 June: Re-opening of non-essential shops",
                "textOffset": [0,0]
              },

              {
                "xVal": "2020-07-05T00:00:00.000Z",
                "yVal": 1200,
                "path": "",
                "text": "4 July: Re-opening  of pubs and restaurants",
                "textOffset": [0,0]
              }
              ,

              {
                "xVal": "2020-08-08T00:00:00.000Z",
                "yVal": 1600,
                "path": "",
                "text": "3 August: Eat Out to Help Out begins",
                "textOffset": [0,0]
              }
            //  ,
            //
            //   {
            //     "xVal": "2020-01-01T00:00:00.000Z",
            //     "yVal": 9.8,
            //     "path": "",
            //     "text": "Beginning of movement restrictions due to COVID-19",
            //     "textOffset": [0,0]
            //   }
            ],

            "wordwrap":[5,10,11,10,15],
            "annoAlign": ["end","end","start","start","start"],
            "annotationBullet" : [
              // "Nov 2008- April 09 - financial crisis",
              // "December 2008: VAT rate cut to 15%",
              // "January 2010: VAT rate increased to 17.5%",
              // "January 2011: VAT rate increased to 20%",
              // "March 2020 – beginning of movement restrictions due to COVID-19"
            ],

            "circles" : false,
            "annotationCXCY":[
                ["1993","23"],
                ["1970","20"]
            ],
            "annotationColour": ["green"],

            "yAxisLabel":"£ million",
            "yAxisScale":[0,2400], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
            "yAxisBreak": false,
            "yAxisBreak_sm_md_lg": [65,65,65]
    },

    "optional" : {
            "margin_sm": [30, 20, 25, 45], //[top,right,bottom,left]
            "margin_md": [30, 110, 25, 45],
            "margin_lg": [10, 110, 25, 45],

            "aspectRatio_sm" : [16,13],
            "aspectRatio_md" : [16,12],
            "aspectRatio_lg" : [16,10],

            "mobileBreakpoint" : 414,

            "xAxisTextFormat_sm_md_lg" : ["%b ", "%b", "%b"],

            "x_num_ticks_sm_md_lg" : [5,6,6],
            "y_num_ticks_sm_md_lg" : [5,6,6],

            "lineMarkers" : false,

            "vertical_line" : true,
            "annotateLineX1_Y1_X2_Y2" : [
              [["2020 MAR", "1955"],["2020 MAR", "1200"]],
              [["2020 MAY", "990"],["2020 MAY", "300"]],
              [["2020 JUN", "1619"],["2020 JUN", "400"]],
              [["2020 JUL", "1840"],["2020 JUL", "900"]],
              [["2020 AUG", "2125"],["2020 AUG", "1500"]]
             ],

            "annotateRect" : true,
            "annotateRectX_Y" : [[["2008 NOV", 50],["2009 APR", 0]] ] ,
            "lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],

            "centre_line" : false,
            "centre_line_value" : 25
    }
}
