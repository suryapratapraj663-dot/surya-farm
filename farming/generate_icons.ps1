Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot 'icons'
if (!(Test-Path $dir)) { 
    New-Item -ItemType Directory -Path $dir | Out-Null 
}

function Create-AppIcon([string]$filePath, [int]$size, [string]$bgColorHex, [string]$borderColorHex, [string]$symbol) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($bgColorHex))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    $bgBrush.Dispose()

    # Draw rounded circle border
    $penWidth = [Math]::Max(4, [int]($size * 0.04))
    $pen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml($borderColorHex), $penWidth)
    $margin = [int]($size * 0.08)
    $dia = $size - (2 * $margin)
    $g.DrawEllipse($pen, $margin, $margin, $dia, $dia)
    $pen.Dispose()

    # Draw Emoji Icon
    $fontSize = [int]($size * 0.42)
    $font = New-Object System.Drawing.Font('Segoe UI Emoji', $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = [System.Drawing.Brushes]::White
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($symbol, $font, $textBrush, [System.Drawing.RectangleF]::new(0, 0, $size, $size), $format)

    $font.Dispose()
    $format.Dispose()
    $g.Dispose()

    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $filePath"
}

# Farmer Icons
Create-AppIcon "$dir\farmer-192.png" 192 "#0a1e12" "#10b981" ([char]::ConvertFromUtf32(0x1F33E))
Create-AppIcon "$dir\farmer-512.png" 512 "#0a1e12" "#10b981" ([char]::ConvertFromUtf32(0x1F33E))

# Buyer Icons
Create-AppIcon "$dir\buyer-192.png" 192 "#1f1505" "#f59e0b" ([char]::ConvertFromUtf32(0x1F3E2))
Create-AppIcon "$dir\buyer-512.png" 512 "#1f1505" "#f59e0b" ([char]::ConvertFromUtf32(0x1F3E2))

# Portal Icons
Create-AppIcon "$dir\portal-192.png" 192 "#0a110c" "#34d399" ([char]::ConvertFromUtf32(0x1F331))
Create-AppIcon "$dir\portal-512.png" 512 "#0a110c" "#34d399" ([char]::ConvertFromUtf32(0x1F331))

Write-Host "All icons generated cleanly!"
