config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#6390B5 ",
			"#003C57",
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
"sourceText": "Rail Delivery Group",
		"accessibleSummary": "A line chart showing the number of train tickets over time. The chart title describes the chart and the data is in the data download.",
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
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%b %Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ",.1f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Tickets sold (millions)",
		"xAxisLabel": "",
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
				"top": 15,
				"right": 5,
				"bottom": 25,
				"left": 55
			},
			"md": {
				"top": 15,
				"right": 5,
				"bottom": 25,
				"left": 80
			},
			"lg": {
				"top": 30,
				"right": 5,
				"bottom": 25,
				"left": 30
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
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
