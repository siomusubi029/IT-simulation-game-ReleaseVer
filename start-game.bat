@echo off
setlocal
cd /d "%~dp0"

set "PORT=8094"
set "BUNDLED_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
where python >nul 2>nul
if %errorlevel%==0 (
  set "PYTHON_CMD=python"
) else if exist "%BUNDLED_PYTHON%" (
  set "PYTHON_CMD=%BUNDLED_PYTHON%"
) else (
  set "PYTHON_CMD=py -3"
)

start "IT Simulation Server" /min cmd /c "cd /d ""%~dp0"" && %PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/game/game.html"
