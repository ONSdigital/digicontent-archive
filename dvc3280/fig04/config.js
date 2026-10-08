config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#959495",
			"#871A5B",
			"#F66068",
			"#A8BD3A",
			"#206095",
			"#959495",
			"#959495",
			"#118C7B"
		],
		"text_colour_palette": [
			"#626162",
			"#871A5B",
			"#F66068",
			"#6E7E26",
			"#206095",
			"#626162",
			"#626162",
			"#118C7B"
		],
		"drawLegend": false,
		"sourceText": "Subnational population projections and mid-year estimates for England from the Office for National Statistics",
		"accessibleSummary": "This chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
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

		"yDomain": "auto",
		// "yDomain": [-10000,30000],
		// either "auto", "autoAll" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%Y",
		"yAxisLabel": "Population",
		"xAxisLabel": "",
		"defaultOption": "Adur",
		"zeroLine": "0"
	},
	"optional": {
		"aspectRatio": {
			"sm": [1.4, 1],
			"md": [1.6, 1],
			"lg": [1.6, 1]
		},
		"margin": {
			"sm": {
				"top": 45,
				"right": 30,
				"bottom": 50,
				"left": 65
			},
			"md": {
				"top": 45,
				"right": 100,
				"bottom": 50,
				"left": 65
			},
			"lg": {
				"top": 45,
				"right": 100,
				"bottom": 50,
				"left": 65
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 2,
			"md": 2,
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
