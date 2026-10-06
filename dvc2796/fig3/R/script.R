library(tidyverse)

# Employment by country and England region (GB, 2021)
# Source: 2021 Census, ONS
# URL: https://www.ons.gov.uk/datasets/create/filter-outputs/08e2eb7e-b94a-4123-a973-fffed4b7665d#get-data
df <- read_csv("custom-filtered-2023-11-23T13_19_23Z.csv") %>% 
  filter(`Industry (current) (19 categories)` != "Does not apply") %>% 
  select(name = Regions,
         industry = `Industry (current) (19 categories)`,
         value = Observation) %>% 
  mutate(industry = case_when(
    industry %in%
      c("D Electricity, gas, steam and air conditioning supply",
        "C Manufacturing",
        "H Transport and storage",
        "A Agriculture, forestry and fishing",
        "E Water supply; sewerage, waste management and remediation activities")
    ~ "High-emission industry",
    TRUE ~ industry)
  ) %>% 
  group_by(name, industry) %>% 
  summarise(value = sum(value)) %>% 
  mutate(prop = value/sum(value)) %>% 
  filter(industry == "High-emission industry") %>% 
  select(name, value = prop) %>% 
  arrange(desc(value))

write_csv(df, "../data.csv")
