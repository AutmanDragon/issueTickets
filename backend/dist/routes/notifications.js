"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/notifications.ts
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const router = express_1.default.Router();
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
});
const notifiedTicketIds = {};
// ✅ ตรงนี้คือบรรทัดที่ error:
router.get('/check-inprogress/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const result = await pool.query(`SELECT id, title FROM tickets WHERE user_id = $1 AND status = 'in_progress'`, [userId]);
        const previouslyNotified = notifiedTicketIds[userId] || [];
        const newTickets = result.rows.filter((ticket) => !previouslyNotified.includes(ticket.id));
        if (newTickets.length > 0) {
            if (!notifiedTicketIds[userId]) {
                notifiedTicketIds[userId] = [];
            }
            notifiedTicketIds[userId].push(...newTickets.map((t) => t.id));
            return res.status(200).json({
                notify: true,
                message: 'เรากำลังแก้ไขปัญหาของคุณ',
                tickets: newTickets,
            });
        }
        return res.json({ notify: false });
    }
    catch (err) {
        console.error('Error fetching ticket notifications:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// ✅ export แบบนี้
exports.default = router;
