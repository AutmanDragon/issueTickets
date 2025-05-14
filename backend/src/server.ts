import express from 'express';
import cors from 'cors';
import path from 'path';
import ticketRoutes from './routes/ticketRoutes';

import notificationsRouter from './routes/notifications';



const app = express();
const port = 3000;

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Serve uploads (เช่น รูปภาพ, ไฟล์เอกสาร)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 📌 ใช้งาน API: /api/tickets
app.use('/api/tickets', ticketRoutes);

// ✅ ใช้งาน notification routes
app.use('/api/notifications', notificationsRouter);
console.log('notificationsRouter:', typeof notificationsRouter);


// 🚀 เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});
