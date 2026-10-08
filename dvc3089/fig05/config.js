config = {
	"essential": {
		"graphic_data_url": "datanumeric.csv",
		"colour_palette": [
			"#206095",
			"#27A0CC",
			"#dadada"
		],
		"labelFinalPoint": false,
		"reference_category": "",// Highlighted on each chart and doesn't get it's own chart - leave blank to turn off
		"legendLabel": "Selected year of birth of women",
		"allLabel": "Women born in other years",
		"sourceText": "Birth registrations from the Office for National Statistics",
		"accessibleSummary": "This small multiple line chart shows that babies are increasingly being born to older mothers. Please download the dataset for more detail.",
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
		"yAxisLabel": "Live births per 1,000 women",
		"xAxisLabel": "Age",
		"zeroLine": "0",
		"interpolateGaps": false

	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 2,
			"lg": 2
		},
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 1],
			"lg": [1, 1]
		},
		"margin": {
			"sm": {
				"top": 45,
				"right": 30,
				"bottom": 50,
				"left": 40
			},
			"md": {
				"top": 45,
				"right": 30,
				"bottom": 50,
				"left": 40
			},
			"lg": {
				"top": 45,
				"right": 30,
				"bottom": 50,
				"left": 40
			}
		},
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis - always including the first and last date
			"sm": 10,
			"md": 10,
			"lg": 10
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 5,
			"lg":5
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
