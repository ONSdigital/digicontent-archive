# High-emission industry workers - highest qualification

library(tidyverse)

# Industry section by highest qualification
# Source: Census 2021, ONS
# URL: https://www.ons.gov.uk/datasets/create/filter-outputs/0318795f-0026-4cfd-877a-638140ffc3b4#get-data

all <- read_csv("custom-filtered-2023-11-21T16_08_17Z.csv") %>% 
  filter(`Industry (current) (19 categories)`  != "Does not apply",
         `Highest level of qualification (8 categories)` != "Does not apply") %>% 
  group_by(`Highest level of qualification (8 categories)`) %>% 
  summarise(n = sum(Observation)) %>% 
  mutate(all = n/sum(n)) %>% 
  select(-n)

sub <- read_csv("custom-filtered-2023-11-21T16_08_17Z.csv") %>% 
  filter(`Highest level of qualification (8 categories)` != "Does not apply",
         `Industry (current) (19 categories)` %in%
           c("D Electricity, gas, steam and air conditioning supply",
             "C Manufacturing",
             "H Transport and storage",
             "A Agriculture, forestry and fishing",
             "E Water supply; sewerage, waste management and remediation activities")) %>% 
  group_by(`Highest level of qualification (8 categories)`) %>% 
  summarise(n = sum(Observation)) %>% 
  mutate(subset = n/sum(n)) %>% 
  select(-n)

df <- left_join(all, sub, by = "Highest level of qualification (8 categories)") %>% 
  mutate(name = case_when(
    `Highest level of qualification (8 categories)` == "No qualifications" ~ "No quals",
    `Highest level of qualification (8 categories)` == "Level 1 and entry level qualifications: 1 to 4 GCSEs grade A* to C, Any GCSEs at other grades, O levels or CSEs (any grades), 1 AS level, NVQ level 1, Foundation GNVQ, Basic or Essential Skills" ~ "Level 1",
    `Highest level of qualification (8 categories)` == "Level 2 qualifications: 5 or more GCSEs (A* to C or 9 to 4), O levels (passes), CSEs (grade 1), School Certification, 1 A level, 2 to 3 AS levels, VCEs, Intermediate or Higher Diploma, Welsh Baccalaureate Intermediate Diploma, NVQ level 2, Intermediate GNVQ, City and Guilds Craft, BTEC First or General Diploma, RSA Diploma" ~ "Level 2",
    `Highest level of qualification (8 categories)` == "Apprenticeship" ~ "Apprenticeship",
    `Highest level of qualification (8 categories)` == "Level 3 qualifications: 2 or more A levels or VCEs, 4 or more AS levels, Higher School Certificate, Progression or Advanced Diploma, Welsh Baccalaureate Advance Diploma, NVQ level 3; Advanced GNVQ, City and Guilds Advanced Craft, ONC, OND, BTEC National, RSA Advanced Diploma" ~ "Level 3",
    `Highest level of qualification (8 categories)` == "Level 4 qualifications or above: degree (BA, BSc), higher degree (MA, PhD, PGCE), NVQ level 4 to 5, HNC, HND, RSA Higher Diploma, BTEC Higher level, professional qualifications (for example, teaching, nursing, accountancy)" ~ "Level 4 or above",
    `Highest level of qualification (8 categories)` == "Other: vocational or work-related qualifications, other qualifications achieved in England or Wales, qualifications achieved outside England or Wales (equivalent not stated or unknown)" ~ "Other"),
    name = as_factor(name),
    name = fct_relevel(name, "No quals", "Level 1", "Level 2", "Apprenticeship")
  ) %>% 
  select(name,
         min = all,
         max = subset) %>% 
  arrange(name)

write_csv(df, "../data.csv")
