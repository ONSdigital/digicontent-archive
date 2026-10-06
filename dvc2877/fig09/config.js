config = {
	"essential": {
		"graphic_data_url": "datanumeric.csv",
		"colour_palette": [
			"#959495",
			"#27A0CC",
			"#206095"
		],
		"text_colour_palette": [
			"#959495",
			"#1F80A3",
			"#206095"
		],
		"drawLegend": true,
		"sourceText": "Annual Survey of Hours and Earnings (ASHE) from the Office for National Statistics",
		"accessibleSummary": "The age that people have the highest median hourly earnings has increased to 47 in 2023.",
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

		"yDomain": [4,20],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%B %Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%d-%m-%Y",
		"yAxisLabel": "Hourly earnings (£)",
		"xAxisLabel": "Age",
		"zeroLine": "0",
		"annoarray": {
			"2013": {
				"xvalue": 38,
				"valuetext": "20/21",
				"yvalue":18.39,
				"ytext":13,
				"width": 120,
				"xnudge":-10,
				"anchor":"end",
				"align":"right"
			},
			"2018": {
				"xvalue": 40,
				"valuetext": "23",
				"yvalue":18.85,
				"ytext":7,
				"width": 150,
				"xnudge":-30,
				"anchor":"end",
				"align":"right"
			},
			"2023": {
				"xvalue": 47,
				"valuetext": "23",
				"yvalue":18.75,
				"ytext":14,
				"width": 150,
				"xnudge":10,
				"anchor":"start",
				"align":"left"
			}
		}
	},
	"optional": {
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 1],
			"lg": [1, 1]
		},
		"margin": {
			"sm": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 30
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 80
			},
			"lg": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 60
			}
		},
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 4,
			"md": 8,
			"lg": 8
		},
		"yAxisTicks": {
			"sm": 7,
			"md": 5,
			"lg":8
		},
		"addFirstDate": true,
		"addFinalDate": true,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
