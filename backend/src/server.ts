import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import ticketRoutes from './routes/ticketRoutes';
import notificationsRouter from './routes/notifications';

import staffNotificationRoutes from './routes/Staffnotifications'

const app = express();
const port = 3000;

// ⏫ สร้าง HTTP server
const server = http.createServer(app);

// ⏫ สร้าง socket.io instance
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // ระวังใน production!
  },
});

// ⏫ Map เก็บ socket.id ของผู้ใช้แต่ละคน
const connectedUsers = new Map<number, string>();

// ⏫ จัดการการเชื่อมต่อของ client
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('register', (userId: number) => {
    connectedUsers.set(userId, socket.id);
    console.log(`📌 Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (const [userId, sid] of connectedUsers.entries()) {
      if (sid === socket.id) {
        connectedUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
  });
});

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 📌 Routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationsRouter);

app.use('/api/staff-notifications', staffNotificationRoutes);


// 🟢 Export WebSocket instance ให้ routes ใช้
export { io, connectedUsers };

// 🚀 Start server
server.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
