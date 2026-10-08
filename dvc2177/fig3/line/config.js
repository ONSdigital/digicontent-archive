var dvc = {
  essential: {
    graphic_data_url: "data.csv",
    screenreadertext: "", //will replace default screenreader text - use if fuller description needed
    dateFormat: "%d/%m/%Y",
    legendStyle: "line",
    directLabeling: false,
    directLabelingAdjust: [
      { x: 0, y: 0 },
      { x: 0, y: 7 },
      { x: 0, y: -43 },
    ],
    colour_palette: [
      "#206095",
      "#118C7B",
      "#871A5B",
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
      "#057FAC",
      "#003C57",
      "#118C7B",
      "#8A9B2E",
      "#871A5B",
      "#F66068",
      "#746CB1",
      "#1AA590",
    ],
    sourceText: ["Office for National Statistics - Producer Price Index"],
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
      // {
      //   "xVal": "2011-06-01T00:00:00.000Z",
      //   "yVal": 60,
      //   "path": "",
      //   "text": "incididunt ut labore et dolor",
      //   "textOffset": [0,0]
      // }
    ],

    wordwrap: [30, 20, 10],
    annoAlign: ["middle", "middle", "end"],
    annotationBullet: [
      /*"An annotation","Another annotation"*/
    ],

    circles: false,
    // "annotationCXCY":[
    //     ["Jan-93","68.4"],
    //     ["Jan-08","73"]
    // ],
    //"annotationColour": ["green"],

    yAxisLabel: "%",
    chartName: "England",
    yAxisScale: [0, 10], //Options: auto_min_max, auto_zero_max, or specify array eg [-20,100]
    yAxisBreak: false,
    yAxisBreak_sm_md_lg: [65, 65, 65],
  },

  optional: {
    margin_sm: [20, 30, 25, 35], //[top,right,bottom,left]
    margin_md: [20, 30, 25, 30],
    margin_lg: [20, 30, 25, 25],

    aspectRatio_sm: [2, 1],
    aspectRatio_md: [4, 1],
    aspectRatio_lg: [4, 1],

    mobileBreakpoint: 414,

    xAxisTextFormat_sm_md_lg: ["%b %Y", "%b %Y", "%b %Y"],

    x_num_ticks_sm_md_lg: [92, 92, 92],
    y_num_ticks_sm_md_lg: [2, 4, 4],

    lineMarkers: false,

    datesToShow: ["12/12/2020", "18/05/2021", "26/12/2021", "05/09/2022"],
    vertical_line: true,
    annotateLineX1_Y1_X2_Y2: [
      [
        ["18/05/2021", "10"],
        ["18/05/2021", "0"],
      ],
      [
        ["26/12/2021", "10"],
        ["26/12/2021", "0"],
      ],
    ],

    annotateRect: true,
    annotateRectX_Y: [
      /* [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]]*/
    ],
    lineColor_opcty: [
      ["#ABCDEF", 0.2],
      ["#888", 0.4],
    ],

    centre_line: false,
    centre_line_value: 25,
  },
};
