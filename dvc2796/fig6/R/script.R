# High-emission industry workers - age group

library(tidyverse)

# Industry section by age group
# Source: Census 2021, ONS
# URL: https://www.ons.gov.uk/datasets/create/filter-outputs/04cee1ef-ba13-4eed-b014-77ec501219be#get-data

all <- read_csv("custom-filtered-2023-11-23T14_09_13Z.csv") %>% 
  filter(`Industry (current) (19 categories)`  != "Does not apply",
         `Age (6 categories)` != "Aged 15 years and under") %>% 
  group_by(`Age (6 categories)`) %>% 
  summarise(n = sum(Observation)) %>% 
  mutate(all = n/sum(n)) %>% 
  select(-n)

sub <- read_csv("custom-filtered-2023-11-23T14_09_13Z.csv") %>% 
  filter(`Age (6 categories)` != "Aged 15 years and under",
         `Industry (current) (19 categories)` %in%
           c("D Electricity, gas, steam and air conditioning supply",
             "C Manufacturing",
             "H Transport and storage",
             "A Agriculture, forestry and fishing",
             "E Water supply; sewerage, waste management and remediation activities")) %>% 
  group_by(`Age (6 categories)`) %>% 
  summarise(n = sum(Observation)) %>% 
  mutate(subset = n/sum(n)) %>% 
  select(-n)

df <- left_join(all, sub, by = "Age (6 categories)") %>% 
  mutate(name = str_remove_all(`Age (6 categories)`, "Aged ")) %>% 
  select(name,
         min = all,
         max = subset) %>% 
  arrange(name)

write_csv(df, "../data.csv")
