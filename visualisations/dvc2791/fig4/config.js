config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#206095",
			"#27A0CC",
			"#871A5B",
			"#A8BD3A",
			"#F66068",
			"#118C7B"
		],
		"drawLegend": false,
		"sourceText": "Time Use Survey, Office for National Statistics",
		"accessibleSummary": "Multiple line chart showing the average minutes spent each day doing specified activities by all adults in the UK between March 2020 and March 2023. The chart suggests that people in the UK are spending less time walking for exercise on average since March 2021.",
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

		"yDomain": [0,20],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %Y",
			"md": "%b %y",
			"lg": "%b %y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%d-%m-%Y",
		"yAxisLabel": "Average daily time (minutes)",
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
			"sm": 2,
			"md": 5,
			"lg": 3
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
