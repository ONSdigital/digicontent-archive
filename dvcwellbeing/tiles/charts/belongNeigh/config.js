var dvc = {
    "essential": {
        //data to use for chart
        "graphic_data_url": "../../datacharts.csv",
        //chart colour
        "colour_palette": ["#206095"],
        "negative_colour": ["#118C7B"],
        //x values are not loaded as dates but option to do so exists below
        //Set alternative screenreader text if more detail than default is needed
        "screenreadertext": "",
        //Source
        "sourceText": [],
        //desktop annotations (double space for new line)
        "annotationChart": [],
        // mobile annotations
        "annotationBullet": [],
        //position of annotaions specified using x, y values
        "annotationXY": [],
        //annotation alignment (start, middle or end)
        "annotationAlign": [],
        //y axis label
        "yAxisLabel": "",
        //set y axis break to true if y axis dosen't start at 0 and doesn't contain negative values
        //this enables the x axis to be dropped
        "yAxisBreak": false,
        //specifies position of "break" icon
        "yAxisBreak_sm_md_lg": [4, 4, 4]
    },
    "optional": {
        //specifies margins at different window sizes
        "margin_sm": [105, 50, 25, 30],
        "margin_md": [105, 50, 25, 30],
        "margin_lg": [105, 50, 25, 30],
        //specifies aspect ratio of chart at different window sizes
        "aspectRatio_sm": [14, 10],
        "aspectRatio_md": [14, 10],
        "aspectRatio_lg": [14, 10],
        //specifies smallest breakpoint (for mobile users)
        "mobileBreakpoint": 610,
        //specified the number of ticks required on the y axis at different window sizes
        "y_num_ticks_sm_md_lg": [3, 3, 3],
        //draws vertical_lines if required for annotations (set to true or false)
        "vertical_line": false,
        //define start and end points of any annotation lines
        "annotateLineX1_Y1_X2_Y2": [],
        //draws rectangles if required for annotations (set to true or false)
        "annotateRect": false,
        //define start and end points of rectangles
        "annotateRectX_Y": [],
        //defines colour and opacity of rectangles
        "rectStyle": [],
        //draws a line with a heavier stroke, used if the x axis is dropped or the data has negative and positive values
        "centre_line": true,
        "centre_line_value": 0
    }
}
