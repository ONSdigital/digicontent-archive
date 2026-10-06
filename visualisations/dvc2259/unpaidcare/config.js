config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "Female", "max": "Male" },
		//the keys match the column names
		"colour_palette": ["#6749A6", "#2EA1A4"],
		"sourceText": "Census 2021 from the Office for National Statistics",
		"accessibleSummary":
			"This chart shows the proportion of adults providing unpaid care by age group. Those aged 50 to 59 years were more likely to be providing unpaid care. Females were more likely than males to be providing unpaid care up until the age of 80-89, when more males provided unpaid care than females",
		"numberFormat": ".0f",
		"xAxisLabel": "% of usual residents aged 5 years and over",
		"xDomain": [0, 25]
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 5,
				"right": 20,
				"bottom": 20,
				"left": 100
			},
			"md": {
				"top": 5,
				"right": 20,
				"bottom": 20,
				"left": 100
			},
			"lg": {
				"top": 5,
				"right": 20,
				"bottom": 40,
				"left": 100
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	}
};
