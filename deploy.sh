#!/bin/bash

# 🚀 Golf Cart Management System - Deploy Script
# สคริปต์สำหรับ deploy เว็บไซต์บน Vercel

echo "🚀 เริ่มต้นการ Deploy บน Vercel..."

# ตรวจสอบว่าติดตั้ง Vercel CLI หรือไม่
if ! command -v vercel &> /dev/null; then
    echo "❌ ไม่พบ Vercel CLI"
    echo "📦 กำลังติดตั้ง Vercel CLI..."
    npm install -g vercel
fi

# ตรวจสอบว่ามีไฟล์ที่จำเป็นหรือไม่
echo "📋 ตรวจสอบไฟล์ที่จำเป็น..."

if [ ! -f "package.json" ]; then
    echo "❌ ไม่พบ package.json"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "❌ ไม่พบ vercel.json"
    exit 1
fi

if [ ! -f "next.config.mjs" ]; then
    echo "❌ ไม่พบ next.config.mjs"
    exit 1
fi

echo "✅ ไฟล์ที่จำเป็นครบถ้วน"

# ตรวจสอบ Environment Variables
echo "🔧 ตรวจสอบ Environment Variables..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  ไม่พบไฟล์ .env.local"
    echo "📝 สร้างไฟล์ .env.local สำหรับ local development"
    cat > .env.local << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=golf_cart_db
DB_PORT=3306

# App Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
EOF
    echo "✅ สร้างไฟล์ .env.local เรียบร้อย"
    echo "⚠️  อย่าลืมแก้ไขค่าในไฟล์ .env.local ให้ตรงกับ database ของคุณ"
fi

# Build โปรเจค
echo "🔨 กำลัง build โปรเจค..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build สำเร็จ"
else
    echo "❌ Build ล้มเหลว"
    exit 1
fi

# Deploy บน Vercel
echo "🚀 กำลัง deploy บน Vercel..."

# ตรวจสอบว่ามีการ login Vercel หรือไม่
if ! vercel whoami &> /dev/null; then
    echo "🔐 กำลัง login เข้า Vercel..."
    vercel login
fi

# Deploy
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deploy สำเร็จ!"
    echo ""
    echo "📋 ขั้นตอนต่อไป:"
    echo "1. ไปที่ Vercel Dashboard"
    echo "2. ตั้งค่า Environment Variables:"
    echo "   - DB_HOST"
    echo "   - DB_USER"
    echo "   - DB_PASSWORD"
    echo "   - DB_NAME"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL"
    echo "3. Redeploy โปรเจค"
    echo ""
    echo "🔗 เว็บไซต์ของคุณจะอยู่ที่: https://your-app-name.vercel.app"
else
    echo "❌ Deploy ล้มเหลว"
    exit 1
fi

echo ""
echo "📚 สำหรับข้อมูลเพิ่มเติม ดูไฟล์ DEPLOYMENT_README.md" 