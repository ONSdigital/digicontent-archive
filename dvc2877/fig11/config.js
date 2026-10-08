config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#2EA1A4",
			" #6749A6",
			"#27A0CC",
			"#A8BD3A",
			"#F66068",
			"#118C7B"
		],
		"sourceText": "Census 2011 and 2021 from the Office for National Statistics ",
		"accessibleSummary": "Women are more likely to provide unpaid care than men.",
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

		"xDomain": [16,100],
		// either "auto" or an array for the x domain e.g. [0,2000] - DOES NOT WORK
		"xAxisTickFormat": {
			"sm": "%y",
			"md": "%y",
			"lg": "%y"
		},
		"yAxisFormat": ",.0f",
		"dateFormat": "%y",
		"yAxisLabel": "% of people providing care",
		"xAxisLabel": "Age",
		"CI_legend": true,
		"CI_legend_text": "Gender gap",
		"zeroLine": "0"
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 2,
			"lg": 2
		},
		"aspectRatio": {
			"sm": [1.6, 1],
			"md": [1.4, 1],
			"lg": [1.4, 1]
		},
		"margin": {
			"sm": {
				"top": 60,
				"right": 20,
				"bottom": 40,
				"left": 30
			},
			"md": {
				"top": 60,
				"right": 25,
				"bottom": 40,
				"left": 30
			},
			"lg": {
				"top": 60,
				"right": 25,
				"bottom": 40,
				"left": 30
			}
		},
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis but it will always show the first and last date.
			"sm": 20,
			"md": 10,
			"lg": 10
		},
		"yAxisTicks": {
			"sm": 3,
			"md": 6,
			"lg":6
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600,
		"dropYAxis": true
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
