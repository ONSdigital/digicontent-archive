config = {
  graphic_data_url:"data.csv",
  colour_palette: {
    type:"categorical",
    // type can be mono, divergent, categorical
    colours: ["#118C7B", "#22D0B6","#c6c6c6","#F66068"],
    reverse: ["#F66068","#c6c6c6","#22D0B6", "#118C7B"],
    mobile: ["#c51b7d","#c6c6c6","#a1d76a", "#4d9221"]
    // colours is an array for the colours of the bars
    // e.g. if mono use ["206095"]
    // e.g if divergent you can use ["#206095","#F66068"]
    // e.g if categorical ["#118C7B","#22D0B6","#6D6D6D","#F66068","#871A5B"]
  },
  numberFormat:".0%",
  rowWidth:"110",
  // rowWidth set the width of y category column in pixel
  accessibleSummary:"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
  sourceText:"Office for National Statistics – Opinions and Lifestyle Survey",
  threshold_sm:500
};
