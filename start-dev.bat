@echo off
chcp 65001 >nul
title LEXUS-CPO 開發伺服器
cd /d "%~dp0"

REM 多數安裝路徑；若你的 Node 在別處，可改成自己的路徑
set "NODE_DIR=C:\Program Files\nodejs"
if not exist "%NODE_DIR%\node.exe" (
  echo [錯誤] 找不到 Node.js（預期在 %NODE_DIR%）
  echo 請安裝或修改本 bat 檔開頭的 NODE_DIR
  pause
  exit /b 1
)

set "PATH=%NODE_DIR%;%PATH%"

echo ========================================
echo   LEXUS CPO - 啟動開發伺服器
echo ========================================
echo 網址: http://localhost:3000
echo 後台: http://localhost:3000/admin （密碼 881231）
echo 關閉視窗或按 Ctrl+C 可停止
echo ========================================
echo.

"%NODE_DIR%\corepack.cmd" pnpm dev

echo.
echo 伺服器已結束。
pause
