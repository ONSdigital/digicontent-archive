config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#206095","#A09FA0", "#F66068","#27A0CC", "#871A5B", "#A8BD3A"],
		"drawLegend": true, // set to false to remove the legend (still working on this)
		"someOtherVariable": "someOtherValue",
		"sourceText": "COVID Social Mobility and Opportunities (COSMO) study: Wave 1 from the University College London, Sutton Trust and Kantar Public",
		"accessibleSummary": "Parents on the highest incomes were more likely to report always speaking with their children about school reports.",

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
		"margin": {
			"sm": {
				"top": 15,
				"right": 15,
				"bottom": 50,
				"left": 140
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 160
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 160
			}
		},
		"seriesHeight": {
			"sm": 55,
			"md": 50,
			"lg": 50
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
};
