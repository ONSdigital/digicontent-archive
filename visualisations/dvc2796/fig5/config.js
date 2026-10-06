config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": ["All industries", "High-emission industries"],
		"colour_palette": ["#A09FA0","#206095"],
		"sourceText": "2021 Census from the Office for National Statistics",
		"accessibleSummary":
			"Dot plot showing the percentage of workers in high-emissions industries and all industries by highest formal qualification in England and Wales during 2021. The chart suggests that workers in high-emissions industries are less likely to have formal qualifications.",
		"xDomain": [0,0.5]
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 15,
				"right": 20,
				"bottom": 20,
				"left": 120
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 20,
				"left": 120
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 20,
				"left": 120
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
