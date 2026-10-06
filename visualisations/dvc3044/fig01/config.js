config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#27A0CC",
			"#871A5B",
			"#A8BD3A",
			"#F66068",
			"#118C7B"
		],
		"text_colour_palette": [
			"#27A0CC",
			"#1F80A3",
			"#871A5B",
			"#6E7E26",
			"#F66068",
			"#118C7B"
		],
		"drawLegend": true,
		"sourceText": "Crime Survey for England and Wales (CSEW) from the Office for National Statistics",
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

		"yDomain": [0,0.08],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0%",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Prevalence of stalking",
		"xAxisLabel": "Year ending (March)",
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
				"top": 40,
				"right": 30,
				"bottom": 50,
				"left": 60
			},
			"md": {
				"top": 40,
				"right": 30,
				"bottom": 50,
				"left": 60
			},
			"lg": {
				"top": 40,
				"right": 30,
				"bottom": 50,
				"left": 60
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 6,
			"md": 6,
			"lg": 12
		},
		"yAxisTicks": {
			"sm": 4,
			"md": 4,
			"lg": 4
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
