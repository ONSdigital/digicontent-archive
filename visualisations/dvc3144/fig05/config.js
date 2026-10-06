config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "Male", "max": "Female" },
		//the keys match the column names
		"colour_palette": ["#6749A6","#2EA1A4"],
		"sourceText": "Growing Up in England and death registration datasets from the Office for National Statistics",
		"accessibleSummary":"A dot plot with confidence intervals. This chart is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
		"numberFormat": ".1f",
		"xAxisTickFormat": ".1f",
		"xAxisLabel": "Hazard ratio",
		"reference": "No SEN",
		"xDomain": [0.4,1.6],
		// either auto or a custom domain as an array e.g [0,100]
		"showDataLabels":false
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 45,
				"right": 14,
				"bottom": 65,
				"left": 140
			},
			"md": {
				"top": 45,
				"right": 14,
				"bottom": 65,
				"left": 140
			},
			"lg": {
				"top": 45,
				"right": 14,
				"bottom": 65,
				"left": 140
			}
		},
		"seriesHeight": {
			"sm": 50,
			"md": 55,
			"lg": 55
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 6,
			"lg": 6
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	}
};
