"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const app = (0, express_1.default)();
const port = 3000;
// 🌐 Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 📂 Serve uploads (เช่น รูปภาพ, ไฟล์เอกสาร)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// 📌 ใช้งาน API: /api/tickets
app.use('/api/tickets', ticketRoutes_1.default);
// ✅ ใช้งาน notification routes
app.use('/api/notification', notifications_1.default);
// 🚀 เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});
