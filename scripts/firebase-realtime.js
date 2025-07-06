// fetchFirebase.js
var admin = require("firebase-admin");

// ใช้ environment variables แทนการ require ไฟล์ JSON
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "location-ecca4",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "dec5fa4b17077f380dd5550464e6ea3093c3870a",
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnpJiOkIFAhN/9\npoX/99dIRRs2UdZgkBIgDkcmqFzaQXctxv+mfJmQqWacXGsQfkO8N1uM3ixxUTd3\nh7AQdid86NP7hPsPU8hT8eKxDSDfM5tjmHYhIlaMRHYOLaK+cEW+CVZpQgq7b71B\nRz2Iw7ye9Z9GI0x3fMEhZ1OvjTcVkNitV5JTaE7aOMFF3BzXupjyNoowVPARb4OS\nJhY2xNTiUzMXVAcxlWnc6WGkTWpWUCTbr7HmFMXt8BlqnCEds0VfBxHM945La27N\nrO9t9WsyHfvC5OZCgXcSBvNPWwJuOJNcV+R+88368Jill1Kx1vYgZtvaNi+CKk1n\nNUBExQ0JAgMBAAECggEAHQLticJ1M8Kq9rzyNJ1h6rZW4rwf4t8b2+NMqeJ6CyVI\nKCpnhJrMgo3mXYna12RaeYCE/ehW/ZdGB4/6RqcD52htgvn87qabpPdXuTch6K6I\nJiC01MAaBTU1zvdT0iwgzaXVB+sva0eHk3vuKLRi+IleMmeabJUw4QR+JYPFNBxw\nxDx9n5X4Hn12eEITsxEdnKArxl0o21feH8aWMvoq5GNqhNImBPXj6FQb6ntGEYN6\ntgcDlPoYDiwDvWnGt5ke81Wh9eVANlXYyEA8nnrdquiZSIxVtL8M3LKigU1N/oT4\nr+L6UVCrDW08a6QgZW1x9BIP5Kj7vxKctx0JFi3MzwKBgQDS4/ukfObqoau0oGeO\nDjMBVel3vyjNoDTQSbULSLSaqsYrUVqdP9i1UXFpFe7hi73Xk/WFOkABVf5Bc0OC\nsQ3+MCyUtChPG7r2njvKnAtK3jiscgWR7CIbwVH7Z/ESSVjpLlsQDteU8C8Ncxbk\nZ+FMRVFDaS2qfXEY+sPmPyp3xwKBgQDLgHIhuqkrgn6xzOj5QYbDqmQQV5PHsQ7J\njAdQ73omOm7jOVX5S+Fdd+6mGUL5C+es31DFr9KIV8soQZ5uVnA+fmr0MoDC+2lM\nIkg2Zg4DK3mAc6cy0PGb/VlD4fSooPPcrSShgkrTXUuTJTeObh+dvt55vReiNsqR\nQcx1edF0rwKBgHrEzdHMBIHC7DqSxrYj/f1hDjDvz8kk4pn+zq5q/PitQgAltCKm\n8HldmDAc3Jvgxfuh3uRYLLqaXRGtEDgc6pB3avyGhJDJC+ZV52jjvo8vHr8FAckZ\nNiICQL+imuySVngozEpk2YuS51FlFoaREs9b6xrbOAJwVE6+bRy02PwxAoGBAMFJ\n9x3iVdxlzkDDCGX3vzEKHpEHHe6GVi1JO4m8bKDyz3AzfV2UnTJSP/Kz+9DhZePl\nGKssHSQzf1t1OC5FG8e/+4aGkZahhZoy1bQVqymHmZhQQXcazuIC+U5oyCGC/x2T\ntz9QqhGog6f3qZU3NAB40od++3uv3yeo/7J1SmUxAoGASraP76FmEtglXZ5WCOZm\ngwsxeqRdndZZ+L1d82owF01yRrX8cYbpdpOg+HjAzLAI3r4XPoUI5I8iL2dSbeeG\nT8duHCJNBqf5TJxpUnXYCBgqkpvKMUtzfUt3OEF98pOLfMiqLW9s2ox8OJKcZH/T\nNjRNu5CdqNHWZOdUzIx5M4w=\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@location-ecca4.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "104270507851364323847",
  auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40location-ecca4.iam.gserviceaccount.com",
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://location-ecca4-default-rtdb.asia-southeast1.firebasedatabase.app"
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