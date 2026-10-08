config = {
	"graphicDataURL": "data.csv",
	"colourPalette": ONSlinePalette,
	"sourceText": "Registration and Population Interactions Database from the Department for Work and Pensions and International Passenger Survey from the Office for National Statistics",
	"accessibleSummary": "The chart canvas is hidden from screen readers. The main message is summarised by the chart title and the data behind the chart is available to download below.",
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
	"yDomainMin": "auto",
	// "auto" (smart zero baseline), "data" (exact min), or numeric value
	"yDomainMax": "auto",
	// "auto" (smart zero baseline), "data" (exact max), or numeric value
	"xAxisTickFormat": {
		"sm": "%b %y",
		"md": "%b %y",
		"lg": "%b %y"
	},
	"dateFormat": "%b-%y",
	"xAxisNumberFormat": ".0f",
	"yAxisNumberFormat": ",.0f",
	"xAxisLabel": "Year ending",
	"yAxisLabel": "British nationals",
	"zeroLine": "0",
	"chartEvery": {
		"sm": 1,
		"md": 1,
		"lg": 1
	},
	"aspectRatio": {
		"sm": [3, 2],
		"md": [4, 2],
		"lg": [6, 2]
	},
	"margin": {
		"sm": {
			"top": 52,
			"right": 23,
			"bottom": 50,
			"left": 54
		},
		"md": {
			"top": 52,
			"right": 23,
			"bottom": 50,
			"left": 54
		},
		"lg": {
			"top": 52,
			"right": 23,
			"bottom": 50,
			"left": 54
		}
	},
	"chartGap": 20,
	"xAxisTickMethod": "interval", // "interval" or "total"
	"xAxisTickCount": { // for "total" method
		"sm": 4,
		"md": 5,
		"lg": 6
	},
	"addFinalDate":true,
	"xAxisTickInterval": { // for "interval" method
		"unit": "year", // "year", "month", "quarter", "day"
		"step": { // every x "units"
			"sm": 4,
			"md": 2,
			"lg": 2
		}
	},
	"labelSpans": {
		"enabled": false,
		timeUnit: 'quarter',//set to "day","month",'quarter' or 'year'
		secondaryTimeUnit: 'auto'//can be 'auto' or false to disable. set to "day","month",'quarter' or 'year' to override
	},
	"yAxisTicks": {
		"sm": 3,
		"md": 5,
		"lg": 8
	},
	"dropYAxis": true,
	"freeYAxisScales": false, //If true dropYAxis will be ignored - each chart will always have a y-axis
	"addEndMarkers": true,
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
