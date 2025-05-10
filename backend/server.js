const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// 📂 สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🖼️ เปิด static ไฟล์ให้ frontend ใช้งานได้ เช่น localhost:3000/uploads/ชื่อไฟล์
app.use('/uploads', express.static('uploads'));

// 🔗 เชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // เปลี่ยนตามชื่อ database ที่คุณใช้จริง
  password: '123456',
  port: 5432,
});

// 📁 ตั้งค่า multer สำหรับจัดการไฟล์ที่แนบ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ ตรวจสอบชนิดไฟล์ก่อนอนุญาตให้แนบ
const uploads = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('ไฟล์ไม่อนุญาต: ต้องเป็น jpg, png, pdf, doc, xls เท่านั้น'));
    }
  }
});

// 📩 API: รับฟอร์มแจ้งปัญหา + แนบไฟล์
app.post('/api/tickets', uploads.array('files'), async (req, res) => {

  const { title, description, type, priority, contact, department } = req.body;
  const uploadFiles = req.files || [];
  const filenames = uploadFiles.map(f => f.filename); // เป็น array

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

// ✅ API: เปลี่ยนสถานะของ ticket ตาม id
app.put('/api/tickets/:id', async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;
  console.log(status)
  try {
    await pool.query(
      'UPDATE tickets SET status = $1 WHERE id = $2',
      [status, ticketId]
    )
    res.status(200).json({ message: 'Status updated' })
  } catch (error) {
    console.error('Error updating status:', error)
    res.status(500).json({ error: 'Failed to update status' })
  }
})


// API: สำหรับดึงTicket ไปใช้หน้า browser
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, type, priority, contact, department, file_path, status FROM tickets 
      ORDER BY ID ASC`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// 🚀 เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);

});
