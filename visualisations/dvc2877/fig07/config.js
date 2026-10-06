config = {
	"essential": {
		"graphic_data_url": "datanumeric.csv",
		"colour_palette": [
			"#206095",
			"#27A0CC",
			"#959495"
		],
		"labelFinalPoint": true,
		"reference_category": "",// Highlighted on each chart and doesn't get it's own chart - leave blank to turn off
		"sourceText": "Annual Population Survey from the Office for National Statistics",
		"accessibleSummary": "The proportions of people who own their own home has decreased since 2004.",
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

		"yDomain": [0,80],
		// either "auto" or an array for the y domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%b %y"
		},
		"xAxisNumberFormat": ".0f",
		"dateFormat": "%d/%m/%Y",
		"yAxisLabel": " % people who own their home",
		"xAxisLabel": "Age",
		"zeroLine": "0",
		"annoarray": {
			"2004": {
				"xvalue": 32,
				"valuetext": "20/21",
				"yvalue":52.1,
				"xtext":36,
				"ytext":40,
				"width": 100,
				"xnudge":-10,
				"anchor":"end",
				"align":"right"
			},
			"2012": {
				"xvalue": 35,
				"valuetext": "23",
				"yvalue":50.9,
				"xtext":36,
				"ytext":40,
				"width": 100,
				"xnudge":10,
				"anchor":"start",
				"align":"left"
			},
			"2017": {
				"xvalue": 35,
				"valuetext": "23",
				"yvalue":50.2,
				"xtext":36,
				"ytext":40,
				"width": 100,
				"xnudge":10,
				"anchor":"start",
				"align":"left"
			},
			"2022": {
				"xvalue": 36,
				"valuetext": "23",
				"yvalue":50.2,
				"xtext":36,
				"ytext":40,
				"width": 100,
				"xnudge":10,
				"anchor":"start",
				"align":"left"
			}
		}

	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 2,
			"lg": 2
		},
		"aspectRatio": {
			"sm": [1.5, 1],
			"md": [1.5, 1],
			"lg": [1.5, 1]
		},
		"margin": {
			"sm": {
				"top": 55,
				"right": 18,
				"bottom": 50,
				"left": 30
			},
			"md": {
				"top": 55,
				"right": 30,
				"bottom": 50,
				"left": 30
			},
			"lg": {
				"top": 55,
				"right": 30,
				"bottom": 50,
				"left": 30
			}
		},
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis - always including the first and last date
			"sm": 5,
			"md": 5,
			"lg": 5
		},
		"yAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg":8
		},
		"addFirstDate": false,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
