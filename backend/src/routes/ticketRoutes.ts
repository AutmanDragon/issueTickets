import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Pool } from 'pg';
import fs from 'fs';
import dayjs from 'dayjs';

const router = express.Router();

// 🔌 เชื่อมต่อ PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // เปลี่ยนเป็นชื่อฐานข้อมูลจริง
    password: '123456',
    port: 5432,
});

// 🗂 สร้างโฟลเดอร์ upload ถ้ายังไม่มี
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 📤 ตั้งค่า multer สำหรับอัพโหลดไฟล์
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploads = multer({
    storage: storage,
    fileFilter: (_, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
        const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeValid = allowedTypes.test(file.mimetype);
        return extValid && mimeValid ? cb(null, true) : cb(new Error('Invalid file type'));
    }
});

// 🔑 ฟังก์ชันสร้าง ticket_id แบบ TK + YYMMDD + running number 2 หลัก
async function generateTicketId(): Promise<string> {
    const today = dayjs();
    const year = today.format("YY");
    const month = today.format("MM");
    const day = today.format("DD");

    const datePart = `${year}${month}${day}`; // เช่น 250515

    const result = await pool.query(
        `SELECT COUNT(*) FROM tickets WHERE TO_CHAR(created_at, 'YYMMDD') = $1`,
        [datePart]
    );

    const count = parseInt(result.rows[0].count, 10) + 1;
    const sequence = count.toString().padStart(2, '0'); // 01, 02, 03...

    return `TK${datePart}${sequence}`;
}

// 📥 POST /api/tickets - รับข้อมูลฟอร์ม + ไฟล์
router.post('/', uploads.array('files'), async (req: Request, res: Response) => {
    const { title, description, type, priority, contact, department } = req.body;
    const uploadFiles = req.files as Express.Multer.File[] || [];
    const filenames = uploadFiles.map(f => f.filename);

    try {
        const ticketId = await generateTicketId();

        const result = await pool.query(
            `INSERT INTO tickets 
                (ticket_id, title, description, type, priority, contact, department, file_path)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [ticketId, title, description, type, priority, contact, department, JSON.stringify(filenames)]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting ticket:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🛠 PUT /api/tickets/:id - อัปเดตสถานะ ticket
router.put('/:id', async (req: Request, res: Response) => {
    const { status } = req.body;
    const ticketId = req.params.id;

    try {
        await pool.query(
            'UPDATE tickets SET status = $1 WHERE id = $2',
            [status, ticketId]
        );
        res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        console.error('Error updating ticket:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// 📄 GET /api/tickets - ดึงรายการ ticket ทั้งหมด
router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, ticket_id, title, description, type, priority, contact, department, file_path, status, created_at, dev 
             FROM tickets ORDER BY id ASC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
