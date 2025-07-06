@echo off
chcp 65001 >nul

REM 🚀 Golf Cart Management System - Deploy Script for Windows
REM สคริปต์สำหรับ deploy เว็บไซต์บน Vercel (Windows)

echo 🚀 เริ่มต้นการ Deploy บน Vercel...

REM ตรวจสอบว่าติดตั้ง Vercel CLI หรือไม่
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ไม่พบ Vercel CLI
    echo 📦 กำลังติดตั้ง Vercel CLI...
    npm install -g vercel
)

REM ตรวจสอบว่ามีไฟล์ที่จำเป็นหรือไม่
echo 📋 ตรวจสอบไฟล์ที่จำเป็น...

if not exist "package.json" (
    echo ❌ ไม่พบ package.json
    pause
    exit /b 1
)

if not exist "vercel.json" (
    echo ❌ ไม่พบ vercel.json
    pause
    exit /b 1
)

if not exist "next.config.mjs" (
    echo ❌ ไม่พบ next.config.mjs
    pause
    exit /b 1
)

echo ✅ ไฟล์ที่จำเป็นครบถ้วน

REM ตรวจสอบ Environment Variables
echo 🔧 ตรวจสอบ Environment Variables...

if not exist ".env.local" (
    echo ⚠️  ไม่พบไฟล์ .env.local
    echo 📝 สร้างไฟล์ .env.local สำหรับ local development
    
    (
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=your_password
        echo DB_NAME=golf_cart_db
        echo DB_PORT=3306
        echo.
        echo # App Configuration
        echo NEXTAUTH_SECRET=your-secret-key-here
        echo NEXTAUTH_URL=http://localhost:3000
    ) > .env.local
    
    echo ✅ สร้างไฟล์ .env.local เรียบร้อย
    echo ⚠️  อย่าลืมแก้ไขค่าในไฟล์ .env.local ให้ตรงกับ database ของคุณ
)

REM Build โปรเจค
echo 🔨 กำลัง build โปรเจค...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build สำเร็จ
) else (
    echo ❌ Build ล้มเหลว
    pause
    exit /b 1
)

REM Deploy บน Vercel
echo 🚀 กำลัง deploy บน Vercel...

REM ตรวจสอบว่ามีการ login Vercel หรือไม่
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 กำลัง login เข้า Vercel...
    vercel login
)

REM Deploy
vercel --prod

if %errorlevel% equ 0 (
    echo 🎉 Deploy สำเร็จ!
    echo.
    echo 📋 ขั้นตอนต่อไป:
    echo 1. ไปที่ Vercel Dashboard
    echo 2. ตั้งค่า Environment Variables:
    echo    - DB_HOST
    echo    - DB_USER
    echo    - DB_PASSWORD
    echo    - DB_NAME
    echo    - NEXTAUTH_SECRET
    echo    - NEXTAUTH_URL
    echo 3. Redeploy โปรเจค
    echo.
    echo 🔗 เว็บไซต์ของคุณจะอยู่ที่: https://your-app-name.vercel.app
) else (
    echo ❌ Deploy ล้มเหลว
    pause
    exit /b 1
)

echo.
echo 📚 สำหรับข้อมูลเพิ่มเติม ดูไฟล์ DEPLOYMENT_README.md
pause 