config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "Female", "max": "Male"},
		//the keys match the column names
		"colour_palette": ["#6749A6", "#2EA1A4"],
		"sourceText": "Census 2021 from the Office for National Statistics ",
		"accessibleSummary":
			"This chart shows the proportion of adults in each occupation type, broken down by age and sex. At all ages, Males are more likely to work as Managers, Directors and Senior Officials, in Skilled Trades Occuaptions or as Process, Plant and Machine Operatives. Females are more likely to work in Administrative and Secretarial, Sales and Customer Service, and Caring, Leisure and Other Service, or Occupations. Females are more likely to work in professional occupations until the ages of 60 to 69 years.",
		"numberFormat": ".0f",
		"xAxisLabel": "% of usual residents aged 16 and over in employment",
		"xDomain": [0, 35]
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
				"bottom": 40,
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
			"sm": 25,
			"md": 25,
			"lg": 25
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
