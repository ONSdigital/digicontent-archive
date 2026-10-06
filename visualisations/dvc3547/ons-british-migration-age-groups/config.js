config = {
  graphicDataUrl: "data.csv",
  showMarkers: true,
  showLine: true,
  colourPalette: ONSpalette,
  lineColour: ONScolours.black,
  sourceText: "Registration and Population Interactions Database from the Department for Work and Pensions",
  accessibleSummary: "The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
  xAxisTickFormat: {
    sm: "%b-%y",
    md: "%b-%y",
    lg: "%b-%y",
  },
  xAxisNumberFormat: ".0f",
  yAxisTickFormat: ",.0f",
  dateFormat: "%b-%y",
  //the format your date data has in data.csv
  yDomain: "auto",
  // either "auto" or an array for the x domain e.g. [0,100]
  lineSeries: "Net migration",
  yAxisLabel: "British nationals",
  xAxisLabel: "Year ending",
  stackOffset: "stackOffsetDiverging",
  // options include
  // stackOffsetNone means the baseline is set at zero
  // stackOffsetExpand to do 100% charts
  // stackOffsetDiverging for data with positive and negative values
  stackOrder: "stackOrderNone",
  // other options include
  // stackOrderNone means the order is taken from the datafile
  // stackOrderAppearance the earliest series (according to the maximum value) is at the bottom
  // stackOrderAscending the smallest series (according to the sum of values) is at the bottom
  // stackOrderDescending the largest series (according to the sum of values) is at the bottom
  // stackOrderReverse reverse the order as set from the data file
  margin: {
    sm: {
      top: 50,
      right: 20,
      bottom: 60,
      left: 61,
    },
    md: {
      top: 50,
      right: 20,
      bottom: 60,
      left: 61,
    },
    lg: {
      top: 50,
      right: 20,
      bottom: 60,
      left: 61,
    },
  },
  chartGap: 30,
  chartEvery: {
    sm: 2,
    md: 2,
    lg: 4,
  },
  aspectRatio: {
    sm: [1.25, 1],
    md: [1.5, 1],
    lg: [3, 6],
  },
  xAxisTicksEvery: {
    // this is the interval of ticks on the x axis - always including the first and last date
    sm: 12,
    md: 2,
    lg: 7,
  },
  yAxisTicks: {
    sm: 3,
    md: 4,
    lg: 6,
  },
  addFirstDate: false,
  addFinalDate: true,
  legendColumns: 4,
  dropYAxis: true,
  labelSpans: {
    enabled: false,
    timeUnit:"month",//"day","month","year"
    secondaryTimeUnit: "auto",//"auto" or define "day","month","year". false to disable
  },
  elements: { select: 0, nav: 0, legend: 0, titles: 0 },
  chartBuild: {},
};
