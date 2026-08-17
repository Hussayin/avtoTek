import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// =============================================================
// TELEGRAM MINI APP FOYDALANUVCHISINI QAYD QILISH
//
// Bu funksiya App.jsx yuklanganda bir marta chaqiriladi.
// Telegram WebApp ichida ochilgan bo'lsa, foydalanuvchi
// ma'lumotlarini Firestore'ga yozadi (agar u avval bo'lmagan bo'lsa).
// =============================================================
export async function trackTelegramUser() {
  try {
    // Faqat Telegram ichida ochilganda ishlaydi
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.log("Telegram WebApp topilmadi — brauzerda oddiy ochilgan.");
      return;
    }

    tg.ready();

    const user = tg.initDataUnsafe?.user;
    if (!user || !user.id) {
      console.log("Telegram foydalanuvchi ma'lumoti topilmadi.");
      return;
    }

    const userId = String(user.id);
    const userRef = doc(db, "users", userId);

    const existingDoc = await getDoc(userRef);

    if (existingDoc.exists()) {
      // Foydalanuvchi avval ham kelgan — faqat "oxirgi kirgan vaqti"ni
      // yangilaymiz, boshqa ma'lumotni qayta yozmaymiz.
      await setDoc(userRef, { lastSeenAt: serverTimestamp() }, { merge: true });
      console.log("Foydalanuvchi tanildi, oxirgi kirish yangilandi:", userId);
    } else {
      // Yangi foydalanuvchi — to'liq yozuv yaratamiz
      await setDoc(userRef, {
        telegramId: userId,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        username: user.username || "",
        languageCode: user.language_code || "",
        photoUrl: user.photo_url || "",
        firstSeenAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
      });
      console.log("Yangi foydalanuvchi qayd qilindi:", userId);
    }
  } catch (error) {
    console.error("Foydalanuvchini qayd qilishda xatolik:", error);
  }
}
