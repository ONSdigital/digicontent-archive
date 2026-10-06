library(tidyverse) ; library(readxl)

visits <- read_xlsx("C:/Users/partrh/Office for National Statistics/Natural Capital - PST/detailed_summary_tables.xlsx",
                    sheet = "Table 16", skip = 4) %>% 
  filter(Country == "UK",
         Habitat == "All habitats") %>% 
  select(date = Year,
         visits = `Physical flow (number of outdoor recreation visits, million)`) %>% 
  
  arrange(date)

time <- read_xlsx("C:/Users/partrh/Office for National Statistics/Natural Capital - PST/detailed_summary_tables.xlsx",
                  sheet = "Table 16", skip = 4) %>% 
  filter(Country == "UK",
         Habitat == "All habitats") %>% 
  select(date = Year,
         time = `Physical flow (Time spent during and travelling to recreation visits, million hours)`) %>% 
  
  arrange(date)

health <- read_xlsx("C:/Users/partrh/Office for National Statistics/Natural Capital - PST/detailed_summary_tables.xlsx",
                    sheet = "Table 14", skip = 4) %>% 
  filter(Country == "UK",
         Habitat == "All habitats") %>% 
  select(date = Year,
         health = `Physical flow (number of people gaining health benefits from recreation, million)`) %>% 
  
  arrange(date)

value <- read_xlsx("C:/Users/partrh/Office for National Statistics/Natural Capital - PST/detailed_summary_tables.xlsx",
                   sheet = "Table 14", skip = 4) %>% 
  filter(Country == "UK",
         Habitat == "All habitats") %>% 
  select(date = Year,
         value = `Annual value (£ million, 2022 prices)`) %>% 
  
  arrange(date)

df <- left_join(visits, time, by = "date") %>% 
  left_join(health, by = "date") %>% 
  left_join(value, by = "date") %>% 
  pivot_longer(-date, names_to = "indicator", values_to = "value") %>% 
  group_by(indicator) %>% 
  mutate(index = round(100 * value / value[1], 0)) %>% 
  select(-value) %>% 
  pivot_wider(names_from = indicator, values_from = index) 

write_csv(df, "../data.csv")

