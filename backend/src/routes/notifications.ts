import express, { Request, Response } from 'express';
import { Pool } from 'pg';

import { io, connectedUsers } from '../server';

const router = express.Router();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432,
});

// ✅ ตรวจสอบ tickets ที่ in_progress และสร้าง notifications ใหม่หากยังไม่มี
router.get('/check-inprogress/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, ticket_id, title FROM tickets WHERE user_id = $1 AND status = 'in_progress'`,
      [userId]
    );

    const inProgressTickets = result.rows;
    const newNotifications = [];

    for (const ticket of inProgressTickets) {
      const exists = await pool.query(
        `SELECT 1 FROM notifications WHERE user_id = $1 AND ticket_id = $2 AND type = 'in_progress_alert'`,
        [userId, ticket.id]
      );

      if (exists.rowCount === 0) {
        const message = `เจ้าหน้าที่กำลังดำเนินการกับ tickets รหัส ${ticket.ticket_id}`;
        await pool.query(
          `INSERT INTO notifications (user_id, ticket_id, message, type, created_at) VALUES ($1, $2, $3, $4, NOW())`,
          [userId, ticket.id, message, 'in_progress_alert']
        );

        // ✅ ส่งผ่าน WebSocket ถ้า user ออนไลน์
        const socketId = connectedUsers.get(userId);
        if (socketId) {
          io.to(socketId).emit('notification:new', {
            userId,
            message,
            ticketId: ticket.id,
            ticketCode: ticket.ticket_id,
            type: 'in_progress_alert',
            timestamp: new Date().toISOString(),
          });
        }

        newNotifications.push({ ticket_id: ticket.ticket_id, title: ticket.title, message });
      }
    }

    // ✅ สำคัญ: ตอบ notify: true ทุกครั้งถ้ามี ticket in_progress (ไม่ว่ามี insert ใหม่หรือไม่)
    if (inProgressTickets.length > 0) {
      res.status(200).json({
        notify: true,
        message: 'พบ ticket ที่กำลังดำเนินการ',
        notifications: inProgressTickets.map(ticket => ({
          ticket_id: ticket.ticket_id,
          title: ticket.title,
          message: `เจ้าหน้าที่กำลังดำเนินการกับ tickets รหัส ${ticket.ticket_id}`
        }))
      });
    } else {
      res.json({ notify: false });
    }

  } catch (err) {
    console.error('Error in /check-inprogress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ดึง notifications ทั้งหมดของผู้ใช้
router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const result = await pool.query(`
      SELECT n.*, t.ticket_id AS ticket_code
      FROM notifications n
      LEFT JOIN tickets t ON n.ticket_id = t.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ mark notification ว่าอ่านแล้ว
router.post('/mark-read/:notificationId', async (req: Request, res: Response) => {
  const notificationId = parseInt(req.params.notificationId);

  if (isNaN(notificationId)) {
    res.status(400).json({ error: 'Invalid notification ID' });
    return;
  }

  try {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1`,
      [notificationId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ตรวจสอบ tickets ที่ done และสร้าง notifications ใหม่หากยังไม่มี
router.get('/check-done/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, title, ticket_id FROM tickets WHERE user_id = $1 AND status = 'done'`,
      [userId]
    );

    const doneTickets = result.rows;
    const newNotifications = [];

    for (const ticket of doneTickets) {
      const exists = await pool.query(
        `SELECT 1 FROM notifications WHERE user_id = $1 AND ticket_id = $2 AND type = 'done_alert'`,
        [userId, ticket.id]
      );

      if (exists.rowCount === 0) {
        const message = `เจ้าหน้าที่ดำเนินการเสร็จสิ้นแล้วสำหรับ Ticket รหัส ${ticket.ticket_id}`;

        await pool.query(
          `INSERT INTO notifications (user_id, ticket_id, message, type, created_at)
   VALUES ($1, $2, $3, $4, NOW())`,
          [userId, ticket.id, message, 'done_alert']
        );

        // ✅ ส่งผ่าน WebSocket ถ้า user ออนไลน์
        const socketId = connectedUsers.get(userId);
        if (socketId) {
          io.to(socketId).emit('notification:new', {
            userId,
            message,
            ticketId: ticket.id,
            ticketCode: ticket.ticket_id,
            type: 'done_alert',
            timestamp: new Date().toISOString(),
          });
        }

        newNotifications.push({
          ticket_id: ticket.ticket_id,
          title: ticket.title,
          message,
        });

      }
    }

    if (newNotifications.length > 0) {
      res.status(200).json({
        notify: true,
        message: 'พบงานที่เสร็จสมบูรณ์',
        notifications: newNotifications,
      });
    } else {
      res.json({ notify: false });
    }

  } catch (err) {
    console.error('Error in /check-done:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
