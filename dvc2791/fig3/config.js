config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#27A0CC","#206095","#003C57","#A8BD3A"
		],
		"drawLegend": false,
		"sourceText": "Monitor of Engagement with the Natural Environment and People and Nature Survey, Natural England",
		"accessibleSummary": "Multiple line chart showing the number of people visiting nature by the average number of visits per week in England between 2009 and 2022 with a gap in 2019. The chart suggests that more people are visiting nature in England but fewer people are making multiple visits per week.",
		"lineCurveType": "curveLinear", // Set the default line curve type
		// Examples of line curve types
		// "lineCurveType": "curveLinear", // Straight line segments
		// "lineCurveType": "curveStep", // Step-wise line
		// "lineCurveType": "curveStepBefore", // Step-before line
		// "lineCurveType": "curveStepAfter", // Step-after line
		// "lineCurveType": "curveBasis", // B-spline curve
		// "lineCurveType": "curveCardinal", // Cardinal spline curve
		// "lineCurveType": "curveCatmullRom" // Catmull-Rom spline curve
		// "lineCurveType": "curveMonotoneX" // Monotone spline curve

		"yDomain": [0,30],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %Y",
			"md": "%b %y",
			"lg": "%b %y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%d-%m-%Y",
		"yAxisLabel": "Visitors (millions)",
		"xAxisLabel": ""
	},
	"optional": {
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 1],
			"lg": [1, 1]
		},
		"margin": {
			"sm": {
				"top": 35,
				"right": 30,
				"bottom": 50,
				"left": 55
			},
			"md": {
				"top": 35,
				"right": 100,
				"bottom": 50,
				"left": 80
			},
			"lg": {
				"top": 35,
				"right": 100,
				"bottom": 50,
				"left": 60
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 5,
			"md": 5,
			"lg": 5
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 5,
			"lg": 5
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
