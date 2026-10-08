config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#2ea1a4",
			"#6749a6",
			"#27A0CC",
			"#F66068",
			"#9A86E9",
			"#118C7B"
		],
		"text_colour_palette": [
			"#206095",
			"#1F80A3",
			"#871A5B",
			"#6E7E26",
			"#F66068",
			"#118C7B"
		],
		"drawLegend": true,
		"drawlastpoint": false,
		"sourceText": "Marriages 2020 from the Office for National Statistics",
		"accessibleSummary": "Both men and women are getting married at older ages.",
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

		"yDomain": [20,40],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Median age at first marriage",
		"xAxisLabel": "Year",
		"zeroLine": "0"
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
				"bottom": 40,
				"left": 30
			},
			"md": {
				"top": 15,
				"right": 30,
				"bottom": 40,
				"left": 30
			},
			"lg": {
				"top": 30,
				"right": 30,
				"bottom": 40,
				"left": 30
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 3,
			"md": 3,
			"lg": 5
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 5,
			"lg":5
		},
		"addFirstDate": true,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
