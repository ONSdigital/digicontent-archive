config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#00A3A6",
			"#00000000",
			"00000000"
		],
		"labelFinalPoint": false,
		"reference_category": "",// Highlighted on each chart and doesn't get it's own chart - leave blank to turn off
		"sourceText": "Natural Capital Accounts (based on recreation surveys from UK public bodies) from the Office for National Statistics",
		"accessibleSummary": "Line charts showing change in the number of visits to, time spent in, and health benefits from nature in the UK between 2009 and 2022. The charts suggest that fewer people have gained health benefits from outdoor recreation since 2020.",
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

		"yDomain": [80,160],
		// either "auto" or an array for the y domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%b %y"
		},
		"xAxisNumberFormat": ".0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Index 2009 = 100"
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 2,
			"lg": 3
		},
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 1],
			"lg": [1, 1]
		},
		"margin": {
			"sm": {
				"top": 45,
				"right": 50,
				"bottom": 50,
				"left": 60
			},
			"md": {
				"top": 45,
				"right": 50,
				"bottom": 50,
				"left": 60
			},
			"lg": {
				"top": 45,
				"right": 50,
				"bottom": 50,
				"left": 60
			}
		},
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis - always including the first and last date
			"sm": 4,
			"md": 2,
			"lg": 5
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 5,
			"lg": 5
		},
		"addFirstDate": true,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
