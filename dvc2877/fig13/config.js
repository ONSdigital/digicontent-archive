config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": [
			"#27A0CC",
			"#206095",
			"#871A5B",
			"#A8BD3A",
			"#F66068",
			"#118C7B"
		],
		"text_colour_palette": [
			"#1F80A3",
			"#206095",
			"#871A5B",
			"#6E7E26",
			"#F66068",
			"#118C7B"
		],
		"drawLegend": true,
		"drawlastpoint": false,
		"sourceText": "Understanding Society, Main survey, Waves 3 and 13",
		"accessibleSummary": "People are becoming grandparents later in life.",
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

		"yDomain": [0,100],
		// either "auto" or an array for the x domain e.g. [0,2000]
		"xAxisTickFormat": {
			"sm": "%b %y",
			"md": "%b %y",
			"lg": "%B %Y"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisNumberFormat": ".0f",
		"dateFormat": "",
		"yAxisLabel": "Percentage of people with a grandchild",
		"xAxisLabel": "Age",
		"zeroLine": "0",
		"annoarray": {
			"2021 to 2022": {
				"value": 64.8,
				"valuetext": "20/21",
				"yvaluepos":50,
				"ytext":45,
				"width": 180,
				"xnudge":10,
				"anchor":"start",
				"align":"left"
			},
			"2011 to 2012": {
				"value": 60.3,
				"valuetext": "23",
				"yvaluepos":50,
				"ytext":85,
				"width": 180,
				"xnudge":-10,
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
				"left": 35
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 35
			},
			"lg": {
				"top": 35,
				"right": 20,
				"bottom": 50,
				"left": 35
			}
		},
		"labelnudge":[10,-10],
		"xAxisTicks": { // this is the number of ticks on the x axis - add the first and last date with the options below
			"sm": 4,
			"md": 4,
			"lg": 8
		},
		"yAxisTicks": {
			"sm": 7,
			"md": 5,
			"lg":8
		},
		"addFirstDate": true,
		"addFinalDate": false,
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
