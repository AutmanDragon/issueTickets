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

const notifiedTicketIds: Record<number, number[]> = {};

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

      console.log('Query result:', result.rows);

      const previouslyNotified = notifiedTicketIds[userId] || [];
      const newTickets = result.rows.filter(
        (ticket) => !previouslyNotified.includes(ticket.id)
      );

      if (newTickets.length > 0) {
        if (!notifiedTicketIds[userId]) {
          notifiedTicketIds[userId] = [];
        }
        notifiedTicketIds[userId].push(...newTickets.map((t) => t.id));

        res.status(200).json({
          notify: true,
          message: 'เรากำลังแก้ไขปัญหาของคุณ',
          tickets: newTickets,
        });
      } else {
        res.json({ notify: false });
      }

    } catch (err) {
      console.error('Error fetching ticket notifications:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
