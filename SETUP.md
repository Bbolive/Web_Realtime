# การตั้งค่าโปรเจค

## 1. การตั้งค่าฐานข้อมูล MySQL

1. คัดลอกไฟล์ `lib/db.example.js` เป็น `lib/db.js`
2. แก้ไขข้อมูลการเชื่อมต่อฐานข้อมูลใน `lib/db.js`:

```javascript
const connection = await mysql.createConnection({
  host: '127.0.0.1',       // ปรับเป็น host ของคุณ
  user: 'your_username',   // ใส่ชื่อ user ของ MySQL
  password: 'your_password', // รหัสผ่าน MySQL
  database: 'your_database', // ชื่อฐานข้อมูลที่ต้องการใช้
});
```

## 2. การตั้งค่า Firebase

1. คัดลอกไฟล์ `pages/serviceAccountKey.example.json` เป็น `pages/serviceAccountKey.json`
2. ดาวน์โหลด Service Account Key จาก Firebase Console:
   - ไปที่ Firebase Console > Project Settings > Service Accounts
   - คลิก "Generate new private key"
   - เปิดไฟล์ JSON ที่ดาวน์โหลดมาและคัดลอกเนื้อหาไปใส่ใน `pages/serviceAccountKey.json`

## 3. การติดตั้ง Dependencies

```bash
npm install
```

## 4. การรันโปรเจค

```bash
npm run dev
```

## หมายเหตุ

- ไฟล์ `lib/db.js` และ `pages/serviceAccountKey.json` จะไม่ถูก commit ไปยัง Git repository เพื่อความปลอดภัย
- ใช้ไฟล์ `.example` เป็นเทมเพลตสำหรับการตั้งค่า 