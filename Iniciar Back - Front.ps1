# Ruta al backend
$backendPath = "E:\Dinamango\back"
# Ruta al frontend
$frontendPath = "E:\Dinamango\front"

# Comandos
$backendCommand = "dotnet run"
$frontendCommand = "npm.cmd run dev"

# Ejecutar backend con título
Start-Process powershell -ArgumentList "cd `"$backendPath`"; $backendCommand"

# Ejecutar frontend con título
Start-Process powershell -ArgumentList "cd `"$frontendPath`"; $frontendCommand"