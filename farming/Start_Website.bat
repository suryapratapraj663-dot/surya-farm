@echo off
title SURYA FARMING (सूर्य फार्मिंग) Web Server
color 0A
cd /d "%~dp0"
cls
echo ======================================================================
echo          🌾 SURYA FARMING (सूर्य फार्मिंग) WEB SERVER ACTIVE 🌾
echo ======================================================================
echo.
echo  [1] Computer Browser Links:
echo      👉 Farmer App (किसान):  http://localhost:8080/farmer.html
echo      👉 Buyer App (व्यापारी): http://localhost:8080/buyer.html
echo      👉 Main Portal (होम):   http://localhost:8080/
echo.
echo  [2] Phone Me Chalane Ke Liye:
echo      (Phone aur Computer ek hi Wi-Fi/Hotspot se jude hon)
echo      👉 http://localhost:8080/farmer.html
echo.
echo  ⚠️ ZAROORI:
echo  Is kaali window ko BAND NA KAREIN, chalne dein (minimize kar dein)!
echo ======================================================================
echo.
echo  Server shuru ho raha hai... 2 second me browser apne-aap khulega.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8080/farmer.html"
python -m http.server 8080
if %ERRORLEVEL% NEQ 0 (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
)
pause
