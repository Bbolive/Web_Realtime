# ⚡ Quick Start - Deploy บน Vercel

## 🚀 Deploy อย่างรวดเร็วใน 5 นาที

### วิธีที่ 1: ใช้ Script (แนะนำ)

#### Windows
```bash
# ดับเบิลคลิกไฟล์ deploy.bat
# หรือรันใน Command Prompt
deploy.bat
```

#### macOS/Linux
```bash
# ให้สิทธิ์การรัน
chmod +x deploy.sh

# รัน script
./deploy.sh
```

### วิธีที่ 2: Manual Deploy

#### 1. ติดตั้ง Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
vercel --prod
```

#### 4. ตั้งค่า Environment Variables
ไปที่ [Vercel Dashboard](https://vercel.com/dashboard) และเพิ่ม:
- `DB_HOST`
- `DB_USER` 
- `DB_PASSWORD`
- `DB_NAME`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

#### 5. Redeploy
```bash
vercel --prod
```

## 🔗 ได้รับ Link แล้ว!

เว็บไซต์ของคุณจะอยู่ที่:
```
https://your-app-name.vercel.app
```

## 📱 ทดสอบ

1. **เปิดเว็บไซต์** บน browser
2. **ทดสอบ responsive** บนมือถือ
3. **ทดสอบฟีเจอร์** ทั้งหมด
4. **ตรวจสอบ API** endpoints

## 🆘 ปัญหาที่พบบ่อย

### Build Error
```bash
npm run build
```

### Database Connection Error
- ตรวจสอบ Environment Variables
- ตรวจสอบ Database accessibility

### API ไม่ทำงาน
- ตรวจสอบ Function timeout
- ตรวจสอบ CORS settings

## 📞 Support

- 📖 [DEPLOYMENT_README.md](DEPLOYMENT_README.md) - คู่มือละเอียด
- 🌐 [Vercel Docs](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Happy Deploying! 🎉** 