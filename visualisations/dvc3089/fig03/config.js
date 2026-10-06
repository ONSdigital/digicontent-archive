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
		"sourceText": "Births in England and Wales from the Office for National Statistics",
		"accessibleSummary": "This line chart shows how the total fertility rate has been falling since the early 2010s. Following the introduction of the contraceptive pill on the NHS in 1961 and the abortion act in 1968, there was a sharp drop in the rate, plateauing from the 1980s to the early 2000s. Please download the dataset for more detail.",
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

		"yDomain": [0,3],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%Y",
			"md": "%Y",
			"lg": "%Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".1f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": "Total fertility rate",
		"xAxisLabel": "Year",
		"zeroLine": "0",
			
	// NEW: Include annations text here - this will also show up in the notes below the chart
	"annotationBullet": [
		"World War 2",
		"Contraceptive pill first available on NHS",
		"Contraceptive pill available more widely",
		"Abortion Act came into force"
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
				"right": 15,
				"bottom": 50,
				"left": 40
			},
			"md": {
				"top": 50,
				"right": 20,
				"bottom": 50,
				"left": 40
			},
			"lg": {
				"top": 60,
				"right": 20,
				"bottom": 50,
				"left": 40
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 3,
			"md": 10,
			"lg": 10
		},
		"yAxisTicks": {
			"sm": 3,
			"md": 6,
			"lg":6
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
