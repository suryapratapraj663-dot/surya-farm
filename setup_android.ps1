# Setup Android Project Icons and Folders
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$kisanDst = Join-Path $root 'android\SuryaKisanApp\app\src\main\res\mipmap-xxxhdpi'
if (!(Test-Path $kisanDst)) { New-Item -ItemType Directory -Path $kisanDst -Force | Out-Null }
if (Test-Path "$root\icons\farmer-512.png") {
    Copy-Item "$root\icons\farmer-512.png" "$kisanDst\ic_launcher.png" -Force
    Copy-Item "$root\icons\farmer-512.png" "$kisanDst\ic_launcher_round.png" -Force
}

$vyapariDst = Join-Path $root 'android\SuryaVyapariApp\app\src\main\res\mipmap-xxxhdpi'
if (!(Test-Path $vyapariDst)) { New-Item -ItemType Directory -Path $vyapariDst -Force | Out-Null }
if (Test-Path "$root\icons\buyer-512.png") {
    Copy-Item "$root\icons\buyer-512.png" "$vyapariDst\ic_launcher.png" -Force
    Copy-Item "$root\icons\buyer-512.png" "$vyapariDst\ic_launcher_round.png" -Force
}

Write-Host "Android app icons placed successfully!"

