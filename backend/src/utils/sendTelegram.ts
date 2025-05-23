// src/utils/sendTelegram.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); //โหลดค่าจาก .env

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('ไม่พบ TELEGRAM_BOT_TOKEN ใน .env');
}


export async function sendTelegramMessage(chatId: string, message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    console.log(`✅ ส่ง Telegram ถึง ${chatId}`);
  } catch (error) {
    console.error('❌ Telegram Error:', error)
  }
}
