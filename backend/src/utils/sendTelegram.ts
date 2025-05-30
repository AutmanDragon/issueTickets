// src/utils/sendTelegram.ts
import axios from 'axios';

import dotenv from 'dotenv';
import { threadId } from 'worker_threads';
// import { text } from 'body-parser';
dotenv.config(); //โหลดค่าจาก .env

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('ไม่พบ TELEGRAM_BOT_TOKEN ใน .env');
}


export async function sendTelegramMessage(chatId: string, message: string, threadId?: number) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const payload: any = {
    chat_id: chatId,
    text: message,
  };
  console.log(threadId);
  //ถ้ามี threadId ให้เพิ่มเจข้าไป
  if (threadId) {
    payload.message_thread_id = threadId;
  }

  try {
    await axios.post(url, payload);
    console.log(`✅ ส่ง Telegram ถึง ${chatId} (thread: ${threadId || 'main'})`)
  }catch(error:any) {
    console.error('❌ Telegram Error:', error.response?.data || error.message);
  }
}



//chat id group staff
const STAFF_CHAT_ID ='-1002534344710';

//map department -> threadId
const STAFF_THREAD_IDS: Record<string, number> = {
  IT: 6,
  HR: 4,
  Sell:2,
};

export async function sendToStaffByDepartment(department: string, message: string){
  const threadId = STAFF_THREAD_IDS[department];
  console.log(message);
  if(!threadId) {
    console.error(`❌ ไม่พบ thread ID สำหรับ department: ${department}`);
    return
  }  
  console.log(STAFF_CHAT_ID, message, threadId);
  await sendTelegramMessage(STAFF_CHAT_ID, message, threadId);
}