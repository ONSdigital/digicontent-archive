config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": {  "max": "Women", "min": "Men" },
		//the keys match the column names
		"colour_palette": [  "#6749A6","#2EA1A4"],
		"sourceText": "Annual Population Survey from the Office for National Statistics",
		"accessibleSummary":
			"Here is the screenreader text describing the chart.",
		"numberFormat": ".0f",
		"xAxisLabel": "Median pay",
		"xDomain": [10, 24]
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 5,
				"right": 20,
				"bottom": 40,
				"left": 150
			},
			"md": {
				"top": 5,
				"right": 20,
				"bottom": 40,
				"left": 200
			},
			"lg": {
				"top": 5,
				"right": 20,
				"bottom": 40,
				"left": 200
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 5,
			"md": 6,
			"lg": 8
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	}
};
