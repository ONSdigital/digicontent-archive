$dash = [char]0x2013  # en-dash
$inputFile = "q:\visualisations\dvc3500-3599\dvc3547-british-nationals\australia-stocks-age-group\data.csv"
$outputFile = "q:\visualisations\dvc3500-3599\dvc3547-british-nationals\australia-stocks-age-group\data10yr.csv"

# Read file as UTF-8
$lines = [System.IO.File]::ReadAllLines($inputFile, [System.Text.Encoding]::UTF8)

# Parse into lookup: key = "year|series" -> value
$lookup = @{}
foreach ($line in ($lines | Select-Object -Skip 1)) {
    $parts = $line -split ','
    $key = "$($parts[0])|$($parts[1])"
    $lookup[$key] = [int]$parts[2]
}

# Check a sample key
Write-Host "Sample key check: 1996|0${dash}4 = $($lookup["1996|0${dash}4"])"

# Define grouped series
$groups = [ordered]@{
    "0${dash}9"   = @("0${dash}4", "5${dash}9")
    "10${dash}19" = @("10${dash}14", "15${dash}19")
    "20${dash}29" = @("20${dash}24", "25${dash}29")
    "30${dash}39" = @("30${dash}34", "35${dash}39")
    "40${dash}49" = @("40${dash}44", "45${dash}49")
    "50${dash}59" = @("50${dash}54", "55${dash}59")
    "60${dash}69" = @("60${dash}64", "65${dash}69")
    "70+"         = @("70${dash}74", "75+")
}

$years = 1996..2025
$output = [System.Collections.Generic.List[string]]::new()
$output.Add("date,series,British migrants")

foreach ($group in $groups.GetEnumerator()) {
    foreach ($year in $years) {
        $total = 0
        foreach ($src in $group.Value) {
            $key = "$year|$src"
            if ($lookup.ContainsKey($key)) {
                $total += $lookup[$key]
            } else {
                Write-Warning "Missing key: $key"
            }
        }
        $output.Add("$year,$($group.Key),$total")
    }
}

[System.IO.File]::WriteAllLines($outputFile, $output, [System.Text.Encoding]::UTF8)
Write-Host "Done. Rows written: $($output.Count - 1)"
