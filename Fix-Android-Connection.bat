@echo off
echo =======================================================
echo Restoring USB connection between Android Phone and PC...
echo =======================================================
"C:\Users\ritik\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:8000 tcp:8000
echo.
echo Done! Your phone can now talk to the backend server again.
echo You may close this window.
pause
