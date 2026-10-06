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
		"dyLabel": [
			7,
			5,
			3,
			5
		],
		"drawLegend": false,
		"sourceText": "Births in England and Wales from the Office for National Statistics",
		"accessibleSummary": "This line chart shows how the number of live births have been affected by significant events in history. The periods of world war one (1914 to 1918) and two (1939 to 1945) are highlighted on the chart. These periods see significant decreases. Following the introduction of the contraceptive pill on the NHS (1961) and the abortion act (1968), there was a sharp drop. Please download the dataset for more detail.",
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

		"yDomain": [0,1],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0%",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "% of women ",
		"xAxisLabel": "Age",
		"zeroLine": "0",
			
	// NEW: Include annations text here - this will also show up in the notes below the chart
	"annotationBullet": [
		"50% of women born in 1946 had a baby before the age of 24 years"

]
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
				"right": 10,
				"bottom": 50,
				"left": 75
			},
			"md": {
				"top": 45,
				"right": 20,
				"bottom": 50,
				"left": 75
			},
			"lg": {
				"top": 55,
				"right": 50,
				"bottom": 60,
				"left": 50
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 3,
			"md": 10,
			"lg": 10
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
