import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// import notificationRoutes from './router/notifications'; // ✅ ยัง import ได้เหมือนเดิม

const app = express(); // ✅ ต้องอยู่ก่อนใช้ app
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// ✅ ใช้ได้แล้ว เพราะประกาศ app แล้ว
// app.use('/api/notifications', notificationRoutes);



// :open_file_folder: Create uploads folder if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// :frame_photo: Serve static files for frontend, e.g., localhost:3000/uploads/filename
app.use('/uploads', express.static('uploads'));

// :link: Connect to PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Change to your actual database name
    password: '123456',
    port: 5432,
});

// :file_folder: Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) {
        cb(null, 'uploads/');
    },

    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// :white_check_mark: Validate file types before allowing uploads
const uploads = multer({
    storage: storage,
    fileFilter: function (
        req,
        file,
        cb
    ) {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true); // ✅ ปล่อยให้ TypeScript เดา type เอง
        } else {
            cb(new Error('Invalid file type: must be jpg, png, pdf, doc, xls only'));
        }
    }
});


// :envelope_with_arrow: API: Receive problem report form + file attachment
app.post('/api/tickets', uploads.array('files'), async (req: Request, res: Response) => {
    const { title, description, type, priority, contact, department } = req.body;
    const uploadFiles = req.files as Express.Multer.File[] || [];
    const filenames = uploadFiles.map(f => f.filename); // Array of filenames

    try {
        const result = await pool.query(
            `INSERT INTO tickets (title, description, type, priority, contact, department, file_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
            [title, description, type, priority, contact, department, JSON.stringify(filenames)]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting ticket:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// :white_check_mark: API: Update ticket status by id
app.put('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const { status } = req.body;
    console.log(status);
    try {
        await pool.query(
            'UPDATE tickets SET status = $1 WHERE id = $2',
            [status, ticketId]
        );
        res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// API: Fetch tickets for browser
app.get('/api/tickets', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, type, priority, contact, department, file_path, status, created_at, dev FROM tickets 
      ORDER BY ID ASC`
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    
});





// :rocket: Start server
app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});