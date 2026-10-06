config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#f66068","#206095" ],
		"sourceText": "COVID Social Mobility and Opportunities (COSMO) study: Wave 1 from the University College London, Sutton Trust and Kantar Public",
		"accessibleSummary": "Young people in long-term unemployed or “never worked” households were more likely to feel people like them don’t have much of a chance in life .",
		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisTickFormat": ".0f",
		"xAxisLabel": "%",
		"stackOffset": "stackOffsetNone",
		// options include
		// stackOffsetNone means the baseline is set at zero
		// stackOffsetExpand to do 100% charts
		// stackOffsetDivergine for data with positive and negative values
		"stackOrder": "stackOrderNone"
		// other options include
		// stackOrderNone means the order is taken from the datafile
		// stackOrderAppearance the earliest series (according to the maximum value) is at the bottom
		// stackOrderAscending the smallest series (according to the sum of values) is at the bottom
		// stackOrderDescending the largest series (according to the sum of values) is at the bottom
		// stackOrderReverse reverse the order as set from the data file
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 1,
			"lg": 1 // This indicates you want 2 charts side by side
		},
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 1],
			"lg": [1.6, 2] //lg: [1.6, 2], can be used to make a 2x wide grid
		},
		"margin": {
			"sm": {
				"top": 45,
				"right": 15,
				"bottom": 40,
				"left": 150
			},
			"md": {
				"top": 45,
				"right": 20,
				"bottom": 40,
				"left": 200
			},
			"lg": {
				"top": 45,
				"right": 20,
				"bottom": 40,
				"left": 200
			}
		},
		"seriesHeight": {
			"sm": 55,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 2,
			"md": 2,
			"lg": 5
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
