config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": ["Public transport", "Driving"],
		"colour_palette": ["#206095", "#A09FA0"],
		"sourceText": "Early years and childcare statistics from Ofsted and Census 2021 data from the Office for National Statistics",
		"accessibleSummary":
			"Childcare accessibility by public transport was lowest in the West Midlands.",
		"xDomain": "auto"
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 15,
				"right": 15,
				"bottom": 20,
				"left": 110
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 20,
				"left": 130
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 20,
				"left": 130
			}
		},
		"seriesHeight": {
			"sm": 45,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 8
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
