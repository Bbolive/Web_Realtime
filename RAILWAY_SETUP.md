# 🚀 คู่มือการตั้งค่า Railway Database

## ขั้นตอนที่ 1: สร้าง Database บน Railway

### 1. ไปที่ Railway
- เปิดเบราว์เซอร์ไปที่ [railway.app](https://railway.app)
- Login ด้วย GitHub account

### 2. สร้าง Project ใหม่
- คลิก "New Project"
- เลือก "Start from scratch"
- ตั้งชื่อ project เช่น "golf-cart-db"

### 3. เพิ่ม MySQL Database
- คลิก "Add Service"
- เลือก "Database" > "MySQL"
- รอให้สร้างเสร็จ

## ขั้นตอนที่ 2: ดูข้อมูลการเชื่อมต่อ

### 1. เข้าไปที่ MySQL Database
- คลิกที่ MySQL service ใน project
- ไปที่ "Connect" tab

### 2. คัดลอกข้อมูลการเชื่อมต่อ
คุณจะเห็นข้อมูลเหล่านี้:
```
Host: containers-us-west-XX.railway.app
Port: XXXXX
Database: railway
Username: root
Password: XXXXXXXXX
```

## ขั้นตอนที่ 3: สร้างตารางใน Database

### 1. เข้าไปที่ Query Tab
- คลิกที่ MySQL service
- ไปที่ "Query" tab

### 2. รัน SQL Script
- คัดลอกเนื้อหาจากไฟล์ `scripts/railway-setup.sql`
- วางใน Query editor
- คลิก "Run" เพื่อสร้างตาราง

## ขั้นตอนที่ 4: ตั้งค่า Environment Variables ใน Vercel

### 1. ไปที่ Vercel Dashboard
- เปิด [vercel.com/dashboard](https://vercel.com/dashboard)
- เลือก project "web-realtime"

### 2. เพิ่ม Environment Variables
ไปที่ **Settings** > **Environment Variables** และเพิ่ม:

```
DB_HOST=containers-us-west-XX.railway.app
DB_PORT=XXXXX
DB_USER=root
DB_PASSWORD=XXXXXXXX
DB_NAME=railway
```

### 3. ตั้งค่า Environment
- เลือก **Production** สำหรับทุกตัวแปร
- คลิก "Save"

## ขั้นตอนที่ 5: Redeploy เว็บไซต์

### 1. ใช้ Vercel CLI
```bash
vercel --prod
```

### 2. หรือใช้ Vercel Dashboard
- ไปที่ "Deployments" tab
- คลิก "Redeploy" ที่ deployment ล่าสุด

## การตรวจสอบ

### 1. ทดสอบการเชื่อมต่อ
- เปิดเว็บไซต์ https://web-realtime.vercel.app
- ทดสอบ login และฟีเจอร์ต่างๆ

### 2. ตรวจสอบ Database
- ไปที่ Railway Dashboard
- ดูที่ "Query" tab เพื่อตรวจสอบข้อมูล

## ข้อมูลสำคัญ

### Railway Free Tier
- **Storage:** 1GB
- **Bandwidth:** 100GB/month
- **Database:** MySQL 8.0
- **Backup:** Automatic

### การ Monitor
- ไปที่ Railway Dashboard
- ดู "Metrics" tab สำหรับการใช้งาน

## การแก้ไขปัญหา

### ปัญหา: ไม่สามารถเชื่อมต่อ Database
**วิธีแก้:**
1. ตรวจสอบ Environment Variables
2. ตรวจสอบ Railway service status
3. ตรวจสอบ Firewall settings

### ปัญหา: ตารางไม่ถูกสร้าง
**วิธีแก้:**
1. รัน SQL script อีกครั้ง
2. ตรวจสอบ syntax ใน Query editor
3. ดู error logs

## การ Backup

### Automatic Backup
Railway จะ backup ข้อมูลอัตโนมัติทุกวัน

### Manual Backup
1. ไปที่ "Query" tab
2. รัน: `mysqldump -u root -p railway > backup.sql`

## การ Upgrade

### เมื่อต้องการเพิ่ม Storage
1. ไปที่ Railway Dashboard
2. คลิก "Upgrade" ใน project
3. เลือก plan ที่ต้องการ

---

**หมายเหตุ:** หลังจากตั้งค่าเสร็จแล้ว เว็บไซต์จะสามารถทำงานได้จาก Vercel และเชื่อมต่อกับ Railway database ได้ 