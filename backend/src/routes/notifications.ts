import express, { Request, Response } from 'express';
import { Pool } from 'pg';

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
  } else {
    try {
      const result = await pool.query(
        `SELECT id, title FROM tickets WHERE user_id = $1 AND status = 'in_progress'`,
        [userId]
      );

      const inProgressTickets = result.rows;
      const newNotifications = [];

      for (const ticket of inProgressTickets) {
        const exists = await pool.query(
          `SELECT 1 FROM notifications WHERE user_id = $1 AND ticket_id = $2`,
          [userId, ticket.id]
        );

        if (exists.rowCount === 0) {
          const message = `เจ้าหน้าที่กำลังดำเนินการกับ ticket: ${ticket.title}`;
          await pool.query(
            `INSERT INTO notifications (user_id, ticket_id, message) VALUES ($1, $2, $3)`,
            [userId, ticket.id, message]
          );
          newNotifications.push({ ticket_id: ticket.id, title: ticket.title, message });
        }
      }

      if (newNotifications.length > 0) {
        res.status(200).json({
          notify: true,
          message: 'พบการอัปเดตใหม่',
          notifications: newNotifications,
        });
      } else {
        res.json({ notify: false });
      }

    } catch (err) {
      console.error('Error in /check-inprogress:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// ✅ ดึง notifications ทั้งหมดของผู้ใช้
router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
  } else {
    try {
      const result = await pool.query(
        `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// ✅ mark notification ว่าอ่านแล้ว
router.post('/mark-read/:notificationId', async (req: Request, res: Response) => {
  const notificationId = parseInt(req.params.notificationId);

  if (isNaN(notificationId)) {
    res.status(400).json({ error: 'Invalid notification ID' });
  } else {
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
  }
});

export default router;
