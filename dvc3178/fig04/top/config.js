config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#003C57",
			"#118C7B",
			"#871A5B",
			"#A8BD3A",
			"#F66068"
		],
		"sourceText": "",
		"accessibleSummary": "This chart is hidden from screenreaders. Data is available to download below.",
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

		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"yAxisFormat": ",.0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Number of first-time buyer mortgage sales",
		"zeroLine": "-500"
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 1,
			"lg": 1
		},
		"aspectRatio": {
			"sm": [1.3, 1],
			"md": [2.3, 1],
			"lg": [2.3, 1]
		},
		"margin": {
			"sm": {
				"top": 50,
				"right": 20,
				"bottom": 25,
				"left": 62
			},
			"md": {
				"top": 50,
				"right": 30,
				"bottom": 25,
				"left": 62
			},
			"lg": {
				"top": 50,
				"right": 20,
				"bottom": 25,
				"left": 62
			}
		},
		"chartGap": 20,
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis but it will always show the first and last date.
			"sm": 4,
			"md": 3,
			"lg": 3
		},
		"yAxisTicks": {
			"sm": 5,
			"md": 5,
			"lg": 5
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600,
		"dropYAxis": true,
		"freeYAxisScales": true //If true dropYAxis will be ignored - each chart will always have a y-axis
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 }
};
