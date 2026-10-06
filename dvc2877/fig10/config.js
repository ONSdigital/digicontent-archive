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
		"sourceText": "Annual Survey of Hours and Earnings (ASHE) from the Office for National Statistics",
		"accessibleSummary": "Men’s hourly wage is higher than women’s at nearly all ages, but the gap has narrowed since 2013.",
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

		"xDomain": [-13,25],
		// either "auto" or an array for the x domain e.g. [0,2000] - DOES NOT WORK
		"xAxisTickFormat": {
			"sm": "%y",
			"md": "%y",
			"lg": "%y"
		},
		"yAxisFormat": ",.0f",
		"dateFormat": "%y",
		"yAxisLabel": "Hourly earnings (£)",
		"xAxisLabel": "Age",
		"CI_legend": true,
		"CI_legend_text": "Pay gap",
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
			"md": [1.2, 1],
			"lg": [1.2, 1]
		},
		"margin": {
			"sm": {
				"top": 70,
				"right": 20,
				"bottom": 40,
				"left": 30
			},
			"md": {
				"top": 70,
				"right": 20,
				"bottom": 40,
				"left": 25
			},
			"lg": {
				"top": 70,
				"right": 20,
				"bottom": 40,
				"left": 25
			}
		},
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis but it will always show the first and last date.
			"sm": 5,
			"md": 5,
			"lg": 5
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
