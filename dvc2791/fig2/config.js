config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#A8BD3A",
			"#00000000",
			"00000000"
		],
		"labelFinalPoint": false,
		"reference_category": "",// Highlighted on each chart and doesn't get it's own chart - leave blank to turn off
		"sourceText": "People and Nature Survey, Natural England",
		"accessibleSummary": "Line charts showing the reasons for not spending time in green and natural spaces by adults who had not visited such spaces in the last 14 days in England between April 2020 and March 2023. The charts suggest that poor health and being busy at work and home are barriers to visiting nature.",
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

		"yDomain": [0,80],
		// either "auto" or an array for the y domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%b %y"
		},
		"xAxisNumberFormat": ".0f",
		"dateFormat": "%d-%m-%Y",
		"yAxisLabel": "%"
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
			"sm": 12,
			"md": 12,
			"lg": 12
		},
		"yAxisTicks": {
			"sm": 3,
			"md": 3,
			"lg": 3
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
