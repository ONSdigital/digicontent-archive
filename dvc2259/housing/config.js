config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#206095", "#27A0CC", "#871A5B", "#A8BD3A", "#F66068"],
		"drawLegend": true, // set to false to remove the legend (still working on this)
		"someOtherVariable": "someOtherValue",
		"sourceText": "Census 2021 from the Office for National Statistics",
		"accessibleSummary": "This chart shows the proportion of those living in each housing tenure by age. Those aged over 60 years were more likely to own their homes outright, while younger adults were more likely to rent privately",

		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisTickFormat": ".0f",
		"xAxisLabel": "% of usual residents in households",
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
				"right": 20,
				"bottom": 50,
				"left": 120
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 120
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 120
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 30,
			"lg": 30
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
