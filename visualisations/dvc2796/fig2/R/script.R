# High emission industries over time (1990 - 2022)

library(tidyverse) ; library(httr) ; library(readxl)

# GHG emissions -----------------------------------------------------------------------

# Greenhouse gas emissions by industry
# Source: ONS - Environmental Accounts
# URL: https://www.ons.gov.uk/economy/environmentalaccounts/datasets/ukenvironmentalaccountsatmosphericemissionsgreenhousegasemissionsbyeconomicsectorandgasunitedkingdom
tmp <- tempfile(fileext = ".xlsx")
GET(url = "https://www.ons.gov.uk/file?uri=/economy/environmentalaccounts/datasets/ukenvironmentalaccountsatmosphericemissionsgreenhousegasemissionsbyeconomicsectorandgasunitedkingdom/provisional/provisionalatmoshpericemissionsghg.xlsx", write_disk(tmp))
df <- read_xlsx(tmp, sheet = "GHG total ", range = "A4:AJ24") %>% 
  filter(...1 %in% c("D","C","H","A","E")) %>% 
  select(industry = ...3, 4:36) %>% 
  pivot_longer(-industry, names_to = "date", values_to = "value") %>% 
  mutate(value = value/1000) %>% 
  pivot_wider(names_from = industry, values_from = value) %>% 
  rename(`Electricity and gas` = `Electricity, gas, steam and air conditioning supply`,
         `Transportation and storage` = `Transport and storage`,
         `Water and waste management` = `Water supply; sewerage, waste management and remediation activities`)

write_csv(df, "../data.csv")
