config = {
  graphic_data_url:"data.csv",
  colour_palette: {
    type:"categorical",
    // type can be mono, divergent, categorical
    colours:["#206095", "#27A0CC","#871A5B", "#A8BD3A","#F66068"]
    // colours is an array for the colours of the bars
    // e.g. if mono use ["206095"]
    // e.g if divergent you can use ["#206095","#F66068"]
    // e.g if categorical ["#206095", "#27A0CC","#871A5B", "#A8BD3A","#F66068"]
  },
  numberFormat:".0%",
  rowWidth:"150",
  // rowWidth set the width of y category column in pixel
  accessibleSummary:"Split bar chart of the personal characteristics for pupils in England by overall effectiveness grade in academic year ending 2010. The chart shows that children with special educational needs are less likely to go to a better-rated school.",
  sourceText:"Ministry of Justice and Department for Education data share",
  threshold_sm:500
};
