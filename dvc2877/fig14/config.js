config = {
	"essential": {
		"accessibleSummary":
			"People retired at older ages in 2021 than in 2011.",
		"sourceText": "Census 2011 and Census 2021 from the Office for National Statistics",
		"graphic_data_url": "data.csv",
		"comparison_data": "comparison.csv",
		"dataType": "percentage",
		// dataType can be a 'percentage' or 'numbers' where it works out the percentage in the script
		"colour_palette": ["#9A86E9", "#3fb0b3"],
		// this is the lighter palette for reference lines ["#9A86E9", "#3fb0b3"]
		"comparison_colour_palette": ["#5c5185", "#306970"],
		"legend": ["2021", "2011"],
		"xAxislabel": ["Percentage retired"],
		"yAxislabel": ["Age"]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 30,
				"right": 13,
				"bottom": 50,
				"left": 18
			},
			"md": {
				"top": 30,
				"right": 15,
				"bottom": 50,
				"left": 15
			},
			"lg": {
				"top": 30,
				"right": 15,
				"bottom": 50,
				"left": 15
			},
			"centre": 60
		},
		"seriesHeight": {
			"sm": 6,
			"md": 8,
			"lg": 8
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 4,
			"lg": 4
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 1 }
};
