config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#206095",
			"#00000000",
			"00000000"
		],
		"labelFinalPoint": false,
		"reference_category": "",// Highlighted on each chart and doesn't get it's own chart - leave blank to turn off
		"sourceText": "Ricardo Energy and Environment, Office for National Statistics",
		"accessibleSummary": "Small multiple line charts showing total greenhouse gas emissions (residence basis) by industry in the UK between 1990 and 2022 (provisional). The charts suggest that emissions of most of the high-emitting industries have fallen since 1990.",
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

		"yDomain": [0,250],
		// either "auto" or an array for the y domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%b %y"
		},
		"xAxisNumberFormat": ".0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Million tonnes CO2e"
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
			"sm": 8,
			"md": 8,
			"lg": 8
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 5,
			"lg": 5
		},
		"addFirstDate": true,
		"addFinalDate": true,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
