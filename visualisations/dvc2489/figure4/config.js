config={
  "essential": {
    "graphic_data_url": "data.csv",
    "pos_neg_colour": ["#F66068","#206095","#A09FA0"],
    // "colour_palette": {
    //
    //
    //   // type:"custom",
    //   // palette:["#206095","#F66068","#C6C6C6","#A8BD3A","#27A0CC"],
    //
    //   type:"sequential",
    //   palette:"YlGnBu"
    //   // options include custom, sequential or qualitative
    //   // for custom, this is a colour for each series
    //   // for sequential, this accepts a colour brewer palette eg. YlGnBu
    //   // for qualitative, this accepts a colour brewer palette e.g Accent
    // },
    "sourceText": "Citizens Advice – Clients by issue",
    "circleRadius": 13,
    "accessibleSummary":"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
  },
  "optional": {
    "seriesHeight":{
      "sm":60,
      "md":45,
      "lg":42
    },
    "margin": {
      "sm": {
        "top": 55,
        "right": 220,
        "bottom": 20,
        "left": 30
      },
      "md": {
        "top": 50,
        "right": 300,
        "bottom": 50,
        "left": 30
      },
      "lg": {
        "top": 50,
        "right": 400,
        "bottom": 50,
        "left": 50
      }
    },
    "rankCutOff": 9,
    "properPositions": true,
    "mobileBreakpoint": 440,
    "mediumBreakpoint": 600
  }
};
