# การตั้งค่าโปรเจค

## 1. การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักของโปรเจคและเพิ่มข้อมูลต่อไปนี้:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=golfcarts

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 2. การตั้งค่าฐานข้อมูล MySQL

1. คัดลอกไฟล์ `lib/db.example.js` เป็น `lib/db.js` (ถ้ายังไม่มี)
2. ข้อมูลการเชื่อมต่อฐานข้อมูลจะถูกอ่านจาก environment variables ใน `lib/db.js`:

```javascript
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '4447',
  database: process.env.DB_NAME || 'golfcarts',
});
```

## 3. การตั้งค่า Firebase

1. คัดลอกไฟล์ `pages/serviceAccountKey.example.json` เป็น `pages/serviceAccountKey.json`
2. ดาวน์โหลด Service Account Key จาก Firebase Console:
   - ไปที่ Firebase Console > Project Settings > Service Accounts
   - คลิก "Generate new private key"
   - เปิดไฟล์ JSON ที่ดาวน์โหลดมาและคัดลอกเนื้อหาไปใส่ใน `pages/serviceAccountKey.json`

## 4. การตั้งค่า Firebase Client

Firebase client configuration จะถูกอ่านจาก environment variables ใน `lib/firebaseClient.js`:

```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... และอื่นๆ
};
```

## 5. การติดตั้ง Dependencies

```bash
npm install
```

## 6. การรันโปรเจค

```bash
npm run dev
```

## หมายเหตุ

- ไฟล์ `pages/serviceAccountKey.json` จะไม่ถูก commit ไปยัง Git repository เพื่อความปลอดภัย
- ใช้ไฟล์ `.example` เป็นเทมเพลตสำหรับการตั้งค่า
- ข้อมูลการเชื่อมต่อฐานข้อมูลและ Firebase จะถูกอ่านจาก environment variables 