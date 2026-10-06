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
		"sourceText": "Births data from the Office for National Statistics",
		"accessibleSummary": "The age of first-time mothers has been increasing steadily since 1970.",
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

		"yDomain": [20,30],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Age of first-time mother",
		"xAxisLabel": "Year",
		"zeroLine": "0"
	},
	"optional": {
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 2],
			"lg": [1, 2]
		},
		"margin": {
			"sm": {
				"top": 30,
				"right": 20,
				"bottom": 40,
				"left": 35
			},
			"md": {
				"top": 45,
				"right": 20,
				"bottom": 40,
				"left": 30
			},
			"lg": {
				"top": 45,
				"right": 20,
				"bottom": 40,
				"left": 30
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 3,
			"md": 4,
			"lg": 5
		},
		"yAxisTicks": {
			"sm": 7,
			"md": 5,
			"lg":8
		},
		"addFirstDate": true,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
