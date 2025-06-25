# PowerShell script to capture browser console errors
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "http://localhost:3001/login"
$debugPort = 9222

# Start Chrome with remote debugging
Start-Process $chromePath -ArgumentList "--remote-debugging-port=$debugPort", $url

Write-Host "Chrome started with debugging on port $debugPort"
Write-Host "Access chrome://inspect in another Chrome window to see console"