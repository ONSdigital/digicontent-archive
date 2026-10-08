config = {
  graphic_data_url:"data.csv",
  colour_palette: {
    type:"categorical",
    // type can be mono, divergent, categorical
    colours: ["#206095", "#2c7fb8","#41b6c4","#118C7B"],
    reverse: ["#F66068","#c6c6c6","#22D0B6", "#118C7B"],
    mobile: ["#c51b7d","#c6c6c6","#a1d76a", "#4d9221"]
    // colours is an array for the colours of the bars
    // e.g. if mono use ["206095"]
    // e.g if divergent you can use ["#206095","#F66068"]
    // e.g if categorical ["#118C7B","#22D0B6","#6D6D6D","#F66068","#871A5B"]
  },
  numberFormat:".1%",
  rowWidth:"80",
  // rowWidth set the width of y category column in pixel
  accessibleSummary:"One in four young people in the lowest-income households feel people like them don’t have much of a chance in life.",
  sourceText:"COVID Social Mobility and Opportunities (COSMO) study: Wave 1 from the University College London, Sutton Trust and Kantar Public",
  threshold_sm:500
};
