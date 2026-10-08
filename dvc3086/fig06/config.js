config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#206095", "#871a5b", "#118c7b", "#959495", "#A8BD3A" ],
		"drawLegend": true, // set to false to remove the legend (still working on this)
		"someOtherVariable": "someOtherValue",
		"sourceText": "Business Insights and Conditions Survey from the Office for National Statistics",
		"accessibleSummary": "This stacked bar chart shows the work location as a percentage of businesses not permanently stopped trading, broken down by industry, weighted by employment, UK, 01 December 2023 to 31 December 2023. It shows that the ‘IT’ and ‘Professional, scientific and technical’ industries were most likely to adopt hybrid working",
		
		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisTickFormat": ".0p",
		"xAxisLabel": "",
		"stackOffset": "stackOffsetExpand",
		// options include
		// stackOffsetNone means the baseline is set at zero
		// stackOffsetExpand to do 100% charts
		// stackOffsetDiverging for data with positive and negative values
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
				"left": 180
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 210
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 210
			}
		},
		"seriesHeight": {
			"sm": 35,
			"md": 35,
			"lg": 35
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 6,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
};
