
import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

// 👉 ตั้งค่าเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432,
});

// ✅ Route สำหรับเช็ก ticket ที่ "open"
router.get('/check-open/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  let notify = false;
  let message = '';
  let notifications = [];

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const { rows: openTickets } = await pool.query(
      `SELECT id, ticket_id, title FROM tickets WHERE user_id = $1 AND status = 'open'`,
      [userId]
    );

    for (const ticket of openTickets) {
      const { rowCount } = await pool.query(
        `SELECT 1 FROM notifications WHERE user_id = $1 AND ticket_id = $2 AND type = 'open_alert'`,
        [userId, ticket.id]
      );

      if (rowCount === 0) {
        const msg = `มี ticket รหัส ${ticket.ticket_id} เข้ามาใหม่`;

        await pool.query(
          `INSERT INTO notifications (user_id, ticket_id, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [userId, ticket.id, msg, 'open_alert']
        );

        notifications.push({
          ticket_id: ticket.ticket_id,
          title: ticket.title,
          message: msg
        });
      } else {
        notifications.push({
          ticket_id: ticket.ticket_id,
          title: ticket.title,
          message: `มี ticket รหัส ${ticket.ticket_id} เข้ามาใหม่`
        });
      }
    }

    if (openTickets.length > 0) {
      notify = true;
      message = 'พบ ticket ที่เปิดใหม่';
    }

    res.status(200).json({ notify, message, notifications });
  } catch (err) {
    console.error('Error in /check-open:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
