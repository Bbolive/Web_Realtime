// fetchFirebase.js
var admin = require("firebase-admin");

// สมมติว่าไฟล์ serviceAccountKey.json อยู่ในโฟลเดอร์เดียวกับไฟล์นี้
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://location-ecca4-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

async function fetchData() {
  const ref = db.ref("daily_logs/2025-06-27");
  ref.once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      console.log("No data found.");
      return;
    }
    // วนลูปแสดงข้อมูล
    Object.entries(data).forEach(([userId, userData]) => {
      console.log(`User: ${userId}`);
      if (userData.logs) {
        Object.entries(userData.logs).forEach(([logId, log]) => {
          let lat = "", lng = "";
          if (log.value) {
            const match = log.value.match(/lat:([0-9.\-]+),lng:([0-9.\-]+)/);
            if (match) {
              lat = match[1];
              lng = match[2];
            }
          }
          console.log(`  LogID: ${logId} | Timestamp: ${log.timestamp} | Lat: ${lat} | Lng: ${lng}`);
        });
      }
    });
    process.exit(0);
  }, (error) => {
    console.error("Error fetching data:", error);
    process.exit(1);
  });
}

fetchData(); 