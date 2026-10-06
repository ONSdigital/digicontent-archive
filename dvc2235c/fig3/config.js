config = {
  graphic_data_url:"data_split2.csv",
  colour_palette: {
    type:"categorical",
    // type can be mono, divergent, categorical
    colours: ["#41b6c4","#2c7fb8", "#253494",],
    reverse: ["#F66068","#c6c6c6","#22D0B6", "#118C7B"],
    mobile: ["#c51b7d","#c6c6c6","#a1d76a", "#4d9221"]
    // colours is an array for the colours of the bars
    // e.g. if mono use ["206095"]
    // e.g if divergent you can use ["#206095","#F66068"]
    // e.g if categorical ["#118C7B","#22D0B6","#6D6D6D","#F66068","#871A5B"]
  },
  numberFormat:",.1%",
  rowWidth:"180",
  // rowWidth set the width of y category column in pixel
  accessibleSummary:"This chart shows ethnic group by unpaid care provision, of those aged 5 years and over, in England and Wales. Around 1 in 20 people identifying as “White: Gypsy or Irish Traveller” provided unpaid care for at least 50 hours a week. The underlying data is available in the accompanying data download.",
  sourceText:"Census 2021 from the Office for National Statistics",
  mobileBreakpoint: 510,
  mediumBreakpoint: 600,
};
