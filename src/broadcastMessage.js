import axios from "axios";

// TELEGRAM BOT SOZLAMALARI — boshqa fayllardagi bilan bir xil
const BOT_TOKEN = "8662301963:AAH2CDSG36iZR-tSoOavYI7sNxE1jzfeTNQ";

// Har bir xabar orasida necha millisekund kutish (Telegram limitiga
// tegib qolmaslik uchun)
const DELAY_BETWEEN_MESSAGES = 120;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================
// BARCHA FOYDALANUVCHILARGA XABAR YUBORISH
//
// users — Firestore'dan olingan foydalanuvchilar ro'yxati
//         (har birida telegramId bo'lishi kerak)
// messageText — yuboriladigan matn
// onProgress — (sent, total) — har bir xabardan keyin chaqiriladi,
//              UI'da progress ko'rsatish uchun
//
// Qaytaradi: { successCount, failCount }
// =============================================================
export async function sendBroadcast(users, messageText, onProgress) {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    try {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: user.telegramId,
        text: messageText,
      });
      successCount += 1;
    } catch (error) {
      // Sabablari turlicha bo'lishi mumkin: foydalanuvchi botni
      // bloklagan, ID noto'g'ri va h.k. — shunchaki o'tkazib
      // yuboramiz, dastur to'xtamaydi.
      console.warn(
        "Xabar yuborilmadi:",
        user.telegramId,
        error?.response?.data?.description || error.message
      );
      failCount += 1;
    }

    if (onProgress) {
      onProgress(i + 1, users.length);
    }

    // Oxirgi xabardan keyin kutish shart emas
    if (i < users.length - 1) {
      await sleep(DELAY_BETWEEN_MESSAGES);
    }
  }

  return { successCount, failCount };
}
