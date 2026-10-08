config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "Female", "max": "Male" },
		//the keys match the column names
		"colour_palette": ["#6749A6", "#2EA1A4"],
		"sourceText": "Census 2021 from the Office for National Statistics",
		"accessibleSummary":
			"This chart shows the proportion of males and females achieving Level 4 qualifications by age group. In older age groups, females were less likely to have achieved Level 4 qualifications than males. However, this changes for those aged 40 to 49 years and younger, where women are more likely to have achieved Level 4 qualifications",
		"numberFormat": ".0f",
		"xAxisLabel": "% of usual residents aged 16 and over",
		"xDomain": [0, 60]
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 5,
				"right": 20,
				"bottom": 40,
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
