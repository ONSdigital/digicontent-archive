# % of jobs by in high emitting industries (2021)

library(tidyverse) ; library(sf)

# Employment (GB, 2021)
# Source: 2021 Census, ONS
# URL: https://www.ons.gov.uk/datasets/create/filter-outputs/ed4dac5b-347d-41fa-99ce-88a298a36ebc#get-data
df <- read_csv("custom-filtered-2023-11-23T10_37_53Z.csv") %>% 
  filter(`Industry (current) (19 categories)` != "Does not apply") %>% 
  select(AREACD = `Lower tier local authorities Code`,
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
  group_by(AREACD, industry) %>% 
  summarise(value = sum(value)) %>% 
  mutate(percent = value/sum(value)*100) %>% 
  filter(industry == "High-emission industry") %>% 
  select(AREACD, percent)

# Local authority districts
# Source: ONS Open Geography Portal
# URL: https://geoportal.statistics.gov.uk/datasets/ons::local-authority-districts-december-2021-gb-buc-1
sf <- read_sf("https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_December_2021_GB_BUC_2022/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson") %>%
  st_drop_geometry() %>% 
  select(AREACD = LAD21CD, AREANM = LAD21NM) %>% 
  filter(!str_detect(AREACD, "^S")) %>% 
  left_join(df, by = "AREACD")

write_csv(sf, "../data/data.csv")


