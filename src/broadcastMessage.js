import axios from "axios";

const BOT_TOKEN = "8911264991:AAFCfdZdZmZPsLx_oNpfsxC4bKqoeX2IdDA";
const DELAY_BETWEEN_MESSAGES = 120;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendBroadcast(users, messageText, imageUrl, onProgress) {
  let successCount = 0;
  let failCount = 0;

  const cleanUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";
  const isValidImageUrl =
    cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://");

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    try {
      if (isValidImageUrl) {
        // WebP formatidaligini tekshiramiz
        const isWebp = cleanUrl.toLowerCase().includes(".webp");

        // WebP bo'lsa sendDocument, boshqa formatlar (jpg, png) uchun sendPhoto
        const endpoint = isWebp ? "sendDocument" : "sendPhoto";
        const payloadKey = isWebp ? "document" : "photo";

        await axios.post(
          `https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`,
          {
            chat_id: user.telegramId,
            [payloadKey]: cleanUrl,
            caption: messageText,
            parse_mode: "HTML",
          }
        );
      } else {
        // Oddiy matn
        await axios.post(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            chat_id: user.telegramId,
            text: messageText,
            parse_mode: "HTML",
          }
        );
      }
      successCount += 1;
    } catch (error) {
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

    if (i < users.length - 1) {
      await sleep(DELAY_BETWEEN_MESSAGES);
    }
  }

  return { successCount, failCount };
}

//
//

// import axios from "axios";

// const BOT_TOKEN = "8911264991:AAFCfdZdZmZPsLx_oNpfsxC4bKqoeX2IdDA";
// const DELAY_BETWEEN_MESSAGES = 120;

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export async function sendBroadcast(users, messageText, imageUrl, onProgress) {
//   let successCount = 0;
//   let failCount = 0;

//   // Link rostdan ham rasm fayliga olib borishini tekshirish
//   const cleanUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";
//   const isValidImageUrl =
//     cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://");

//   for (let i = 0; i < users.length; i++) {
//     const user = users[i];

//     try {
//       if (isValidImageUrl) {
//         // Rasm va tagida matn yuborish
//         await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
//           chat_id: user.telegramId,
//           photo: cleanUrl,
//           caption: messageText,
//           parse_mode: "HTML",
//         });
//       } else {
//         // Faqat matn yuborish
//         await axios.post(
//           `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
//           {
//             chat_id: user.telegramId,
//             text: messageText,
//             parse_mode: "HTML",
//           }
//         );
//       }
//       successCount += 1;
//     } catch (error) {
//       // Agar sendPhoto xato bersa (masalan link noto'g'ri bo'lsa), zaxira sifatida oddiy text yuborib ko'ramiz
//       if (isValidImageUrl) {
//         try {
//           await axios.post(
//             `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
//             {
//               chat_id: user.telegramId,
//               text: messageText,
//               parse_mode: "HTML",
//             }
//           );
//           successCount += 1;
//         } catch (fallbackError) {
//           console.warn(
//             "Xabar yuborilmadi:",
//             user.telegramId,
//             fallbackError?.response?.data?.description
//           );
//           failCount += 1;
//         }
//       } else {
//         console.warn(
//           "Xabar yuborilmadi:",
//           user.telegramId,
//           error?.response?.data?.description
//         );
//         failCount += 1;
//       }
//     }

//     if (onProgress) {
//       onProgress(i + 1, users.length);
//     }

//     if (i < users.length - 1) {
//       await sleep(DELAY_BETWEEN_MESSAGES);
//     }
//   }

//   return { successCount, failCount };
// }

// import axios from "axios";

// // TELEGRAM BOT SOZLAMALARI — boshqa fayllardagi bilan bir xil
// const BOT_TOKEN = "8911264991:AAFCfdZdZmZPsLx_oNpfsxC4bKqoeX2IdDA";

// // Har bir xabar orasida necha millisekund kutish (Telegram limitiga
// // tegib qolmaslik uchun)
// const DELAY_BETWEEN_MESSAGES = 120;

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // =============================================================
// // BARCHA FOYDALANUVCHILARGA XABAR YUBORISH
// //
// // users — Firestore'dan olingan foydalanuvchilar ro'yxati
// //         (har birida telegramId bo'lishi kerak)
// // messageText — yuboriladigan matn
// // onProgress — (sent, total) — har bir xabardan keyin chaqiriladi,
// //              UI'da progress ko'rsatish uchun
// //
// // Qaytaradi: { successCount, failCount }
// // =============================================================
// export async function sendBroadcast(users, messageText, onProgress) {
//   let successCount = 0;
//   let failCount = 0;

//   for (let i = 0; i < users.length; i++) {
//     const user = users[i];

//     try {
//       await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
//         chat_id: user.telegramId,
//         text: messageText,
//       });
//       successCount += 1;
//     } catch (error) {
//       // Sabablari turlicha bo'lishi mumkin: foydalanuvchi botni
//       // bloklagan, ID noto'g'ri va h.k. — shunchaki o'tkazib
//       // yuboramiz, dastur to'xtamaydi.
//       console.warn(
//         "Xabar yuborilmadi:",
//         user.telegramId,
//         error?.response?.data?.description || error.message
//       );
//       failCount += 1;
//     }

//     if (onProgress) {
//       onProgress(i + 1, users.length);
//     }

//     // Oxirgi xabardan keyin kutish shart emas
//     if (i < users.length - 1) {
//       await sleep(DELAY_BETWEEN_MESSAGES);
//     }
//   }

//   return { successCount, failCount };
// }
