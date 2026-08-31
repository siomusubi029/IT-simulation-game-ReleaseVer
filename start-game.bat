@echo off
setlocal
cd /d "%~dp0"

set "PORT=8094"
where python >nul 2>nul
if %errorlevel%==0 (
  set "PYTHON_CMD=python"
) else (
  set "PYTHON_CMD=py -3"
)

start "IT Simulation Server" /min cmd /c "cd /d ""%~dp0"" && %PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
