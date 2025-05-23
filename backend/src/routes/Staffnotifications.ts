import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { sendTelegramMessage } from '../utils/sendTelegram';

const router = express.Router();

// 👉 ตั้งค่าเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432,
});

// ✅ Route สำหรับ staff เช็ก ticket ที่ "open"
router.get('/check-open/:staffId', async (req: Request, res: Response) => {
  const staffId = parseInt(req.params.staffId);
  let notify = false;
  let message = '';
  let notifications = [];

  if (isNaN(staffId)) {
    res.status(400).json({ error: 'Invalid staff ID' });
    return;
  }

  try {
    // ⚠️ ไม่กรอง user_id เพราะ staff ต้องเห็นทุกปัญหา
    const { rows: openTickets } = await pool.query(
      `SELECT id, ticket_id, title FROM tickets WHERE status = 'open'`
    );

    for (const ticket of openTickets) {
      // ตรวจสอบว่าพนักงานเคยได้รับแจ้งเตือน ticket นี้หรือยัง
      const { rowCount } = await pool.query(
        `SELECT 1 FROM notifications WHERE user_id = $1 AND ticket_id = $2 AND type = 'open_alert'`,
        [staffId, ticket.id]
      );

      const msg = ` ปัญหาใหม่ รหัส ${ticket.ticket_id} เข้ามาแล้ว`;

      if (rowCount === 0) {
        // ยังไม่มีแจ้งเตือน -> แทรกใหม่
        await pool.query(
          `INSERT INTO notifications (user_id, ticket_id, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [staffId, ticket.id, msg, 'open_alert']
        );

        // ✅ ส่งผ่าน Telegram ถ้ามี chat_id ของ staff
        const staffResult = await pool.query(
          `SELECT telegram_chat_id FROM users WHERE id = $1`,
          [staffId]
        );
        const telegramChatId = staffResult.rows[0]?.telegram_chat_id;

        if (telegramChatId) {
          await sendTelegramMessage(telegramChatId, msg);
        }

      }






      notifications.push({
        ticket_id: ticket.ticket_id,
        title: ticket.title,
        message: msg
      });
    }

    if (notifications.length > 0) {
      notify = true;
      message = 'มี ticket ใหม่เข้ามา';
    }

    res.status(200).json({ notify, message, notifications });
  } catch (err) {
    console.error('Error in /check-open:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
