# Ruta al backend
$backendPath = "D:\Escritorio\Proyectos\Dinamango\back"
# Ruta al frontend
$frontendPath = "D:\Escritorio\Proyectos\Dinamango\front"

# Comandos
$backendCommand = "dotnet run"
$frontendCommand = "npm.cmd run dev"

# Ejecutar backend con título
Start-Process powershell -ArgumentList "cd `"$backendPath`"; $backendCommand"

# Ejecutar frontend con título
Start-Process powershell -ArgumentList "cd `"$frontendPath`"; $frontendCommand"