config = {
	"essential": {
		"accessibleSummary":
			"This chart has been hidden from screen readers. The main message of the chart is summarised in the chart title.",
		"sourceText": "Population estimates from the Office for National Statistics",
		"graphic_data_url": "data.csv",
		"comparison_data": "comparison.csv",
		// "comparison_time_data": "comparison-time.csv",
		"dataType": "numbers",
		// dataType can be a "percentage" or "numbers" where it works out the percentage in the script
		"colour_palette": ["#9A86E9", "#2EA1A4"],
		// this is the lighter palette for reference lines ["#9A86E9", "#3fb0b3"]
		"comparison_colour_palette": ["#222222", "#222222"],
		// "legend": ["Selected area", "2011"],
		"xAxislabel": ["Persons"],
		"initialSelection": 2,
		"defaultArea": "K04000001"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 30,
				"right": 10,
				"bottom": 35,
				"left": 13
			},
			"md": {
				"top": 30,
				"right": 10,
				"bottom": 50,
				"left": 13
			},
			"lg": {
				"top": 30,
				"right": 10,
				"bottom": 50,
				"left": 13
			},
			"centre": 60
		},
		"seriesHeight": {
			"sm": 5,
			"md": 7,
			"lg": 7
		},
		"xAxisTicks": {
			"sm": 2,
			"md": 4,
			"lg": 4
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 1, "nav": 0, "legend": 1, "titles": 1 }
};
