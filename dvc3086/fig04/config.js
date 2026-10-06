config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#206095", "#871a5b", "#118c7b", "#A8BD3A", "#F66068"],
		"drawLegend": true, // set to false to remove the legend (still working on this)
		"someOtherVariable": "someOtherValue",
		"sourceText": "Opinions and Lifestyle Survey from the Office for National Statistics",
		"accessibleSummary": "This chart shows the percentage among working adults who have worked in the past seven days by occupation group, Great Britain, 10 April 2024 to 30 June 2024. It shows that workers in more senior and professional occupations are more likely to hybrid work.",
		
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
				"right": 18,
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
			"sm": 30,
			"md": 30,
			"lg": 30
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
