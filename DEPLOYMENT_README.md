# 🚀 การ Deploy บน Vercel

## ภาพรวม
คู่มือการ deploy เว็บไซต์ระบบจัดการรถกอล์ฟบน Vercel เพื่อสร้าง public link

## 📋 ขั้นตอนการ Deploy

### 1. เตรียมโปรเจค

#### ตรวจสอบไฟล์ที่จำเป็น
- ✅ `package.json` - กำหนด dependencies และ scripts
- ✅ `vercel.json` - กำหนดค่า Vercel deployment
- ✅ `.gitignore` - ไม่ push ไฟล์ที่ไม่จำเป็น
- ✅ `next.config.mjs` - กำหนดค่า Next.js

#### ตรวจสอบ Environment Variables
สร้างไฟล์ `.env.local` (ไม่ push ไป git):
```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306

# App Configuration
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 2. Deploy บน Vercel

#### วิธีที่ 1: ใช้ Vercel CLI (แนะนำ)

1. **ติดตั้ง Vercel CLI**
```bash
npm install -g vercel
```

2. **Login เข้า Vercel**
```bash
vercel login
```

3. **Deploy โปรเจค**
```bash
vercel
```

4. **ตั้งค่า Environment Variables**
```bash
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add NEXTAUTH_SECRET
```

5. **Redeploy หลังจากตั้งค่า env**
```bash
vercel --prod
```

#### วิธีที่ 2: ใช้ GitHub Integration

1. **Push โค้ดไป GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/golf-cart-management.git
git push -u origin main
```

2. **เชื่อมต่อกับ Vercel**
- ไปที่ [vercel.com](https://vercel.com)
- Login ด้วย GitHub
- คลิก "New Project"
- เลือก repository
- ตั้งค่า Environment Variables
- คลิก "Deploy"

### 3. ตั้งค่า Custom Domain (ไม่บังคับ)

1. **ใน Vercel Dashboard**
- ไปที่ Project Settings
- คลิก "Domains"
- เพิ่ม custom domain

2. **ตั้งค่า DNS**
- เพิ่ม CNAME record ชี้ไป `cname.vercel-dns.com`

## 🔧 การตั้งค่า Environment Variables

### ใน Vercel Dashboard
1. ไปที่ Project Settings
2. คลิก "Environment Variables"
3. เพิ่มตัวแปรต่อไปนี้:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` หรือ `your-db-host.com` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_NAME` | Database name | `golf_cart_db` |
| `DB_PORT` | Database port | `3306` |
| `NEXTAUTH_SECRET` | Secret key for authentication | `your-secret-key-here` |
| `NEXTAUTH_URL` | App URL | `https://your-app.vercel.app` |

### ใน Local Development
สร้างไฟล์ `.env.local`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=golf_cart_db
DB_PORT=3306
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📊 การตรวจสอบ Deployment

### 1. ตรวจสอบ Build Logs
- ไปที่ Vercel Dashboard
- คลิก "Deployments"
- ดู build logs

### 2. ตรวจสอบ Function Logs
- ไปที่ "Functions" tab
- ดู logs ของ API routes

### 3. ตรวจสอบ Performance
- ใช้ Vercel Analytics
- ตรวจสอบ Core Web Vitals

## 🔄 การ Update เว็บไซต์

### วิธีที่ 1: Auto Deploy (แนะนำ)
- Push โค้ดใหม่ไป GitHub
- Vercel จะ auto deploy อัตโนมัติ

### วิธีที่ 2: Manual Deploy
```bash
vercel --prod
```

## 🛠️ การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. Build Error
```bash
# ตรวจสอบ build locally
npm run build
```

#### 2. Database Connection Error
- ตรวจสอบ Environment Variables
- ตรวจสอบ Database accessibility
- ตรวจสอบ Firewall settings

#### 3. API Routes ไม่ทำงาน
- ตรวจสอบ Function timeout
- ตรวจสอบ CORS settings
- ตรวจสอบ API routes path

### การ Debug
```bash
# ดู logs
vercel logs

# ดู function logs
vercel logs --function=api/your-function
```

## 📱 การทดสอบ

### 1. ทดสอบบน Desktop
- เปิดเว็บไซต์บน browser
- ทดสอบทุกฟีเจอร์

### 2. ทดสอบบน Mobile
- ใช้ Chrome DevTools
- ทดสอบ responsive design

### 3. ทดสอบ API
- ใช้ Postman หรือ curl
- ทดสอบทุก endpoints

## 🔒 Security

### 1. Environment Variables
- อย่า commit `.env` files
- ใช้ Vercel Environment Variables

### 2. Database Security
- ใช้ strong passwords
- จำกัด database access
- ใช้ SSL connection

### 3. API Security
- ตรวจสอบ input validation
- ใช้ proper authentication
- จำกัด CORS origins

## 📈 Monitoring

### 1. Vercel Analytics
- เปิดใช้งานใน Project Settings
- ติดตาม performance

### 2. Error Tracking
- ใช้ Vercel Function Logs
- ติดตาม errors

### 3. Performance Monitoring
- ตรวจสอบ Core Web Vitals
- ติดตาม loading times

## 🎯 Best Practices

1. **ใช้ Environment Variables** สำหรับ sensitive data
2. **Test locally** ก่อน deploy
3. **Monitor performance** หลัง deploy
4. **Use proper git workflow** สำหรับ version control
5. **Backup database** อย่างสม่ำเสมอ
6. **Document changes** ใน README

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ Vercel Documentation
2. ดู Vercel Community Forum
3. ติดต่อ Vercel Support
4. ตรวจสอบ GitHub Issues

---

**Happy Deploying! 🚀** 