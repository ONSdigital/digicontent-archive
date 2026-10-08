config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": ["Very good or good health", "Fair health", "Bad or very bad health"],
		"colour_palette": ["#206095","#27A0CC", "#871A5B" ],
		"sourceText": "Census 2021 from the Office for National Statistics",
		"accessibleSummary": "Bar chart of residence type and household size by general health showing centenarians living alone were the most likely to be in very good or good health.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".2%"
		},
		"xDomain": [0, 0.6],
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Percentage of centenarians"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 20,
				"right": 20,
				"bottom": 50,
				"left": 150
			},
			"md": {
				"top": 20,
				"right": 20,
				"bottom": 50,
				"left": 150
			},
			"lg": {
				"top": 20,
				"right": 20,
				"bottom": 50,
				"left": 150
			}
		},
		"seriesHeight": {
			"sm": 70,
			"md": 70,
			"lg": 70
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 5,
			"lg": 5
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
