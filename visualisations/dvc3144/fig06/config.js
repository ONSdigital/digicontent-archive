config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "Suicide", "max": "Other death" },
		//the keys match the column names
		"colour_palette": ["#206095","#7c7c7c"],
		"sourceText": "Growing Up in England and death registration datasets from the Office for National Statistics",
		"accessibleSummary":"A dot plot with confidence intervals. This chart is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
		"numberFormat": ".1f",
		"xAxisTickFormat": ".0f",
		"xAxisLabel": "rate per 100,000 person years",
		"xDomain": [0,20],
		// either auto or a custom domain as an array e.g [0,100]
		"showDataLabels":false
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 5,
				"right": 14,
				"bottom": 40,
				"left": 115
			},
			"md": {
				"top": 5,
				"right": 25,
				"bottom": 40,
				"left": 210
			},
			"lg": {
				"top": 5,
				"right": 25,
				"bottom": 40,
				"left": 210
			}
		},
		"seriesHeight": {
			"sm": 55,
			"md": 45,
			"lg": 45
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 8
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	}
};
