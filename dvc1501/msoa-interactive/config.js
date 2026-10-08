var dvc = {
  // essential is for things that need changing
  essential: {
    title: "This is the title",
    sourceText: "Office for National Statistics",
    legend_labels: ["Deaths not due to COVID-19", "Deaths due to COVID-19", "All deaths - Five-year average", "National periods of increased deaths"]
  },
  // optional is for the rest
  optional: {
    colour_palette: ["#27A0CC", "#F66068", "#3a4c54", "#a0a0a0"],
    tick_format: "%b %Y",
    breakpoint_sm: 470, // mobile
    breakpoint_md: 600, // tablet
    height_width_ratio: 0.7,
    text_wrap: {
      sm: 95,
      md: 140,
      lg: 200
    },
    yAnnotation: {
      sm: 31,
      md: 16,
      lg: 0
    },
    margin: {
      sm: {
        top: 150,
        right: 30,
        bottom: 30,
        left: 30
      },
      md: {
        top: 110,
        right: 30,
        bottom: 30,
        left: 30
      },
      lg: {
        top: 95,
        right: 30,
        bottom: 30,
        left: 30
      }
    }
  }
}
