import { Telegraf } from "telegraf";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const BOT_TOKEN = "8911264991:AAFCfdZdZmZPsLx_oNpfsxC4bKqoeX2IdDA";
const bot = new Telegraf(BOT_TOKEN);

// Telegram kanalingiz ID si yoki username-i (masalan: "@kanal_username" yoki "-100123456789")
const CHANNEL_ID = "@DataBaseForAvtoTek"; // <-- Shu yerga kanalingiz nomini yoki ID sini yozing

async function cleanupTestData() {
  console.log("🧹 Test ma'lumotlarini o'chirish boshlandi...\n");

  try {
    // 1. Firestore'dan barcha 'cars' hujjatlarini olish
    const snapshot = await db.collection("cars").get();

    if (snapshot.empty) {
      console.log("ℹ️ Firestore'da hech qanday ma'lumot topilmadi.");
      return;
    }

    console.log(`📦 Jami topilgan e'lonlar soni: ${snapshot.size} ta\n`);

    for (const doc of snapshot.docs) {
      const carData = doc.data();
      const messageId = carData.messageId;

      // 2. Telegram kanaldan postni o'chirish
      if (messageId && CHANNEL_ID !== "@KANALINGIZ_USERNAME") {
        try {
          await bot.telegram.deleteMessage(CHANNEL_ID, messageId);
          console.log(`🗑️ Telegram post o'chirildi (Message ID: ${messageId})`);
        } catch (tgErr) {
          console.log(
            `⚠️ Telegram post ${messageId} o'chirilmadi (balki u allaqachon o'chirilgan):`,
            tgErr.message
          );
        }
      }

      // 3. Firestore'dan hujjatni o'chirish
      await db.collection("cars").doc(doc.id).delete();
      console.log(`✅ Firestore'dan o'chirildi: ${doc.id}`);
    }

    console.log("\n🎉 Barcha test ma'lumotlari muvaffaqiyatli o'chirildi!");
  } catch (error) {
    console.error("❌ O'chirishda xatolik yuz berdi:", error);
  } finally {
    process.exit();
  }
}

cleanupTestData();
