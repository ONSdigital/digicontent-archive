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
		"drawLegend": false,
		"sourceText": "Population estimates from the Office for National Statistics",
		"accessibleSummary": "Here is the screen reader text describing the chart.",
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

		"yDomain": [-100000,850000],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ",.0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Persons",
		"xAxisLabel": "",
		"zeroLine": "0"
	},
	"optional": {
		"aspectRatio": {
			"sm": [1.8, 1],
			"md": [1.8, 1],
			"lg": [1.8, 1]
		},
		"margin": {
			"sm": {
				"top": 15,
				"right": 35,
				"bottom": 45,
				"left": 65
			},
			"md": {
				"top": 15,
				"right": 35,
				"bottom": 45,
				"left": 65
			},
			"lg": {
				"top": 30,
				"right": 35,
				"bottom": 45,
				"left": 65
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 2,
			"md": 2,
			"lg": 1
		},
		"xAxisTicks_every": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 25,
			"md": 20,
			"lg": 15
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 7,
			"lg":7
		},
		"addFirstDate": true,
		"addFinalDate": true,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
