var dvc = {
  essential: {
    graphic_data_url: "data.csv",
    screenreadertext:
      "The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.", //will replace default screenreader text - use if fuller description needed
    dateFormat: "",
    legendStyle: "line",
    directLabeling: false,
    directLabelingAdjust: [
      { x: 0, y: -30 },
      { x: 20, y: -100 },
      { x: 0, y: -100 },
    ],
    drawColumn: ["true", "true", "false", "false", "false", "false"],
    colour_palette: [
      "#206095",
      "#118C7B",
      "#003C57",
      "#118C7B",
      "#A8BD3A",
      "#871A5B",
      "#F66068",
      "#746CB1",
      "#22D0B6",
    ],
    // for darker text required by accessibility rules on colour contrast
    colour_palette_labels: [
      "#206095",
      "#118C7B",
      "#003C57",
      "#118C7B",
      "#8A9B2E",
      "#871A5B",
      "#F66068",
      "#746CB1",
      "#1AA590",
    ],
    sourceText: [
      "Office for National Statistics - Coronavirus Infection Survey",
    ],
    sourceURL: ["http://www.ons.gov.uk"],
    draggable: false,
    annotationsChart: [
      // {
      //   "xVal": "2003-06-23T00:00:00.000Z",
      //   "yVal": 160,
      //   "path": "",
      //   "text": "Lorem ipsum dolor sit amet, consectetur",
      //   "textOffset": [0,0]
      // },
      //
      // {
      //   "xVal": "1995-06-23T00:00:00.000Z",
      //   "yVal": 120,
      //   "path": "",
      //   "text": "adipiscing elit, sed do eiusmod",
      //   "textOffset": [0,0]
      // },
      //
      {
        xVal: 13,
        yVal: 20,
        path: "",
        text: "Days since follow-up",
        textOffset: [0, 0],
      },
    ],

    wordwrap: [30, 20, 10],
    annoAlign: ["start", "middle", "end"],
    annotationBullet: [
      /*"An annotation","Another annotation"*/
    ],

    circles: false,
    // "annotationCXCY":[
    //     ["Jan-93","68.4"],
    //     ["Jan-08","73"]
    // ],
    //"annotationColour": ["green"],

    yAxisLabel: "Cumulative percentage",
    xAxisLabel: "Weeks since follow-up",
    yAxisScale: [0,20],//"auto_zero_max", //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
    yAxisBreak: false,
    yAxisBreak_sm_md_lg: [65, 65, 65],
  },

  optional: {
    margin_sm: [30, 20, 40, 35], //[top,right,bottom,left]
    margin_md: [30, 20, 40, 35],
    margin_lg: [10, 20, 40, 35],

    aspectRatio_sm: [16, 13],
    aspectRatio_md: [16, 12],
    aspectRatio_lg: [16, 10],

    mobileBreakpoint: 590,

    xAxisTextFormat_sm_md_lg: ["%y", "%Y", "%b %y"],

    x_num_ticks_sm_md_lg: [5, 5, 5],
    y_num_ticks_sm_md_lg: [5, 11, 11],

    lineMarkers: false,

    vertical_line: true,
    annotateLineX1_Y1_X2_Y2: [
      [
        ["12", "18"],
        ["12", "0"],
      ],
    ],

    annotateRect: false,
    annotateRectX_Y: [
      /* [["84", 22],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/
    ],
    lineColor_opcty: [
      ["#ABCDEF", 0.1],
      ["#888", 0.4],
    ],

    centre_line: false,
    centre_line_value: 25,
  },
};
