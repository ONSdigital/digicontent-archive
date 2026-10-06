config = {
	"essential": {
		"graphic_data_url": "datanumeric.csv",
		"colour_palette": [
			"#959495",
			"#206095",
			"#27A0CC",
			"#A8BD3A",
			"#F66068",
			"#118C7B"
		],
		"text_colour_palette": [
			"#959495",
			"#206095",
			"#1F80A3",
			"#6E7E26",
			"#F66068",
			"#118C7B"
		],
		"drawLegend": true,
		"sourceText": "Annual Population Survey from the Office of National Statistics",
		"accessibleSummary": "A greater proportion of people aged over 60 owned their homes outright in 2013 and 2022 than in 2004.",
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
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%B %Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "%d-%m-%Y",
		"yAxisLabel": "% of people who own their home outright",
		"xAxisLabel": "Age",
		"zeroLine": "0",
		"annoarray": {
			"2004": {
				"xvalue": 63,
				"valuetext": "20/21",
				"yvalue":51.8,
				"ytext":52,
				"width": 150,
				"xnudge":20,
				"anchor":"start",
				"align":"left"
			},
			"2022": {
				"xvalue": 61,
				"valuetext": "23",
				"yvalue":52.6,
				"ytext":60,
				"width": 150,
				"xnudge":-20,
				"anchor":"end",
				"align":"right"
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
				"left": 30
			},
			"lg": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 30
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
