config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#27A0CC",
		"pos_colour": "#F66068",
		"neg_colour": "#27A0CC",
		"sourceText": "Annual Population Survey from the Office for National Statistics",
		"accessibleSummary": "Here is the screen reader text describing the chart.",
		"dataLabels": {
			"show": 0,
			"numberFormat": ""
		},
		"xDomain": [0.30,-0.60],
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Pay gap"
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 1,
			"lg": 1
		},
		"aspectRatio": {
			"sm": [1, 2],
			"md": [1, 2],
			"lg": [1, 2]
		},
		"margin": {
			"sm": {
				"top": 70,
				"right": 18,
				"bottom": 50,
				"left": 200
			},
			"md": {
				"top": 70,
				"right": 18,
				"bottom": 50,
				"left": 250
			},
			"lg": {
				"top": 70,
				"right": 18,
				"bottom": 50,
				"left": 250
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 35,
			"lg": 35
		},
		"xAxisTicks": {
			"sm": 2,
			"md": 2,
			"lg": 4
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600,
		"dropYAxis": true
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
