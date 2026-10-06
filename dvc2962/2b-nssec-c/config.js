config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "Inital model", "max": "Fully adjusted" },
		//the keys match the column names
		"colour_palette": ["#c8c8c8", "#206095"],
		"sourceText": "Census 2011 from the Office for National Statistics and birth and death registration data for England and Wales",
		"accessibleSummary":
			"",
		"numberFormat": ".0%",
		"xAxisTickFormat": ".1f",
		"numberFormat": ".1%",
		"xAxisLabel": "",
		"xDomain": [0.7, 3.7]
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 70,
				"right": 10,
				"bottom": 50,
				"left": 200
			},
			"md": {
				"top": 70,
				"right": 20,
				"bottom": 50,
				"left": 225
			},
			"lg": {
				"top": 70,
				"right": 20,
				"bottom": 50,
				"left": 225
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 5,
			"lg": 5
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	}
};