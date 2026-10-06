# Common occupations in high-emission industries

library(tidyverse)

# Industry section by common occupations
# Source: Census 2021, ONS
# URL: https://www.ons.gov.uk/datasets/create/filter-outputs/719df321-f9ee-411e-8cd8-76d29ea2c418#get-data

df <- read_csv("custom-filtered-2023-11-22T13_11_02Z.csv") %>% 
  filter(`Occupation (current) (105 categories)` != "Does not apply",
         `Industry (current) (19 categories)` %in%
           c("D Electricity, gas, steam and air conditioning supply",
             "C Manufacturing",
             "H Transport and storage",
             "A Agriculture, forestry and fishing",
             "E Water supply; sewerage, waste management and remediation activities")) %>% 
  group_by(`Occupation (current) (105 categories)`) %>% 
  summarise(value = sum(Observation)) %>% 
  select(name = `Occupation (current) (105 categories)`, value) %>% 
  mutate(name = str_trim(str_replace_all(name, "[:digit:]", "")),
         value = value/1000) %>% # thousands
  arrange(desc(value)) %>% 
  slice(1:12)

write_csv(df, "../data.csv")
