import express, { Request, Response } from "express";
import { Pool } from "pg";
import { sendToStaffByDepartment } from "../utils/sendTelegram";

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "123456",
  port: 5432,
});

async function checkAndNotifyTicketsByStatus(status: string, staffId: number, type: string) {
  
  const { rows: tickets } = await pool.query(
    `SELECT id, ticket_id, department, user_id,title FROM tickets WHERE status = $1`,
    [status]
  );
   
  const notifications = [];

  for (const ticket of tickets) {
    const { rowCount } = await pool.query(
      `SELECT 1 FROM notifications WHERE user_id = $1 AND ticket_id = $2 AND type = $3`,
      [staffId, ticket.id, type]
    );
 
    const msg = `[${status.toUpperCase()}] Ticket : ${ticket.ticket_id} (${ticket.title})\nแผนก: ${ticket.department} ${ticket.user_id} `;

    if (rowCount === 0) {
      await pool.query(
        `INSERT INTO notifications (user_id, ticket_id, message, type, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [staffId, ticket.id, msg, type]
      );

      await sendToStaffByDepartment(ticket.department, msg);

      notifications.push({
        ticket_id: ticket.ticket_id,
        title: ticket.title,
        message: msg,
      });
    }
  }

  return notifications;
}

router.get("/check-open/:staffId", async (req: Request, res: Response) => {
  const staffId = parseInt(req.params.staffId);

  if (isNaN(staffId)) {
    res.status(400).json({ error: "Invalid staff ID" });
    return;
  }

  let allNotifications: any[] = [];

  try {
   console.log(req.params);
    const openNotis = await checkAndNotifyTicketsByStatus('open', staffId, 'open_alert');
    if (staffId == 1){
      const inProgressNotis = await checkAndNotifyTicketsByStatus('in_progress', staffId, 'in_progress_alert');
    const doneNotis = await checkAndNotifyTicketsByStatus('done', staffId, 'done_alert');
    allNotifications = [...inProgressNotis, ...doneNotis]
    }
    

    allNotifications = [...openNotis];

    const notify = allNotifications.length > 0;
    const message = notify ? "มีการอัปเดตสถานะของ ticket ใหม่" : "";

    res.status(200).json({
      notify,
      message,
      notifications: allNotifications
    });
  } catch (err) {
    console.error("Error in /check-open:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
