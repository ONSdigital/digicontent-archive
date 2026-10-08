config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": ["Female", "Male"],
		"colour_palette": ["#6749A6","#2EA1A4"],
		"sourceText": "Census 2021 from the Office for National Statistics",
		"accessibleSummary": "Bar chart of National Statistics Socio-Economic Classification by sex showing female centenarians were around twice as likely to have never worked than males.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".1%"
		},
		"xDomain": [0, 0.3],
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Percentage of centenarians"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 20,
				"right": 20,
				"bottom": 50,
				"left": 150
			},
			"md": {
				"top": 20,
				"right": 20,
				"bottom": 50,
				"left": 150
			},
			"lg": {
				"top": 20,
				"right": 20,
				"bottom": 50,
				"left": 150
			}
		},
		"seriesHeight": {
			"sm": 53,
			"md": 53,
			"lg": 53
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 3,
			"lg": 3
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
