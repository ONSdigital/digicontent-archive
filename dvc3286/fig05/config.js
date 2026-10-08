config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#27A0CC",
		"sourceText": "Population estimates from the Office for National Statistics",
		"accessibleSummary": "Here is the screen reader text describing the chart.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".1f"
		},
		"xDomain": [-2,2],
		"add_reference_line": true,
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Rate per 100 population"
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 3,
			"lg": 3
		},
		// "aspectRatio": {
		// 	"sm": [1, 2],
		// 	"md": [1, 2],
		// 	"lg": [1, 2]
		// },
		"margin": {
			"sm": {
				"top": 55,
				"right": 14,
				"bottom": 50,
				"left": 130
			},
			"md": {
				"top": 55,
				"right": 14,
				"bottom": 50,
				"left": 106
			},
			"lg": {
				"top": 55,
				"right": 14,
				"bottom": 50,
				"left": 106
			}
		},
		"seriesHeight": {
			"sm": 25,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 2,
			"lg": 2
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600,
		"dropYAxis": true
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
