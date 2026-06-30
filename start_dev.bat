@echo off
echo ==================================================
echo Starting FinPilot Development Environment
echo ==================================================
echo.

echo [1/2] Setting up USB connection to phone...
:: Use the absolute path to adb in case it's not in the system path
"C:\Users\ritik\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:8000 tcp:8000
if %errorlevel% neq 0 (
    echo [WARNING] Could not connect to phone via USB. Make sure it is plugged in and USB debugging is enabled!
) else (
    echo [SUCCESS] USB bridge established! Your phone can now reach the backend.
)
echo.

echo [2/2] Starting Backend Server...
cd backend
..\.venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
