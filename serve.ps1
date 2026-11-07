# SURYA FARMING - Multi-Device HTTP Web Server
$port = 8080
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

# Determine active IPv4 addresses
$ips = @()
try {
    $netIPs = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
              Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' } |
              Select-Object -ExpandProperty IPAddress
    if ($netIPs) { $ips += $netIPs }
} catch {}

if ($ips.Count -eq 0) {
    try {
        $hostName = [System.Net.Dns]::GetHostName()
        $dnsIPs = [System.Net.Dns]::GetHostAddresses($hostName) | 
                  Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork } | 
                  ForEach-Object { $_.IPAddressToString }
        if ($dnsIPs) { $ips += $dnsIPs }
    } catch {}
}

$listener = $null
$portsToTry = @(8080, 8000, 8888, 5000)

foreach ($p in $portsToTry) {
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $p)
        $listener.Start()
        $port = $p
        break
    } catch {
        $listener = $null
    }
}

if (-not $listener) {
    Write-Host "FATAL: Could not bind to any port."
    exit 1
}

$crlf = [char]13 + [char]10

Write-Host "======================================================="
Write-Host "  SURYA FARMING WEB SERVER ACTIVE"
Write-Host "======================================================="
Write-Host "  Computer Browser:"
Write-Host "     http://localhost:$port/"
Write-Host "     http://localhost:$port/farmer.html"
Write-Host "     http://localhost:$port/buyer.html"
Write-Host ""
Write-Host "  Phone Browser (Same Wi-Fi / Hotspot):"
foreach ($ip in $ips) {
    Write-Host "     http://${ip}:${port}/farmer.html (Kisan App)"
    Write-Host "     http://${ip}:${port}/buyer.html  (Vyapari App)"
}
Write-Host "======================================================="
Write-Host "Listening for requests..."

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($true) {
    $client = $null
    try {
        $client = $listener.AcceptTcpClient()
        $client.ReceiveTimeout = 5000
        $client.SendTimeout = 5000
        
        $remote = $client.Client.RemoteEndPoint.ToString()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)

        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($requestLine)) {
            $client.Close()
            continue
        }

        while (($line = $reader.ReadLine()) -and ($line -ne "")) {}

        $parts = $requestLine -split " "
        $method = $parts[0]
        $url = if ($parts.Length -gt 1) { $parts[1] } else { "/" }

        $path = $url.Split('?')[0].TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") {
            $path = "index.html"
        }

        $decodedPath = [System.Uri]::UnescapeDataString($path)
        $filePath = Join-Path $root $decodedPath

        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] $remote -> $method $decodedPath"

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            $h = "HTTP/1.1 200 OK" + $crlf +
                 "Content-Type: " + $mime + $crlf +
                 "Content-Length: " + $bytes.Length + $crlf +
                 "Access-Control-Allow-Origin: *" + $crlf +
                 "Cache-Control: no-cache" + $crlf +
                 "Connection: close" + $crlf + $crlf

            $hb = [System.Text.Encoding]::UTF8.GetBytes($h)
            $stream.Write($hb, 0, $hb.Length)

            if ($method -ne "HEAD") {
                $stream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $nf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: " + $decodedPath)
            $h = "HTTP/1.1 404 Not Found" + $crlf +
                 "Content-Type: text/plain" + $crlf +
                 "Content-Length: " + $nf.Length + $crlf +
                 "Connection: close" + $crlf + $crlf
            $hb = [System.Text.Encoding]::UTF8.GetBytes($h)
            $stream.Write($hb, 0, $hb.Length)
            if ($method -ne "HEAD") {
                $stream.Write($nf, 0, $nf.Length)
            }
        }

        $stream.Flush()
    } catch {
        # Catch connection resets
    } finally {
        if ($client) {
            try { $client.Close() } catch {}
        }
    }
}
