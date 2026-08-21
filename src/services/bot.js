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

function parseCarPost(text, messageId) {
  if (!text) return null;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const carData = {
    messageId: messageId,
    createdAt: new Date(),
    name: "",
    listingId: "",
    price: 0,
    year: 2024,
    mileage: 0,
    gearbox: "-",
    color: "-",
    engine: "-",
    fuel: "-",
    location: "Toshkent sh.",
    date: new Date().toLocaleDateString("ru-RU"),
    description: "",
    vin: "-",
    instagram: "",
    youtube: "",
    images: [],
    status: "active", // Sukut bo'yicha e'lon faol bo'ladi
  };

  lines.forEach((line) => {
    const lower = line.toLowerCase();

    // 1. HOLAT / STATUS TEKSHIRUVI
    if (lower.startsWith("holat:") || lower.startsWith("status:")) {
      const statusValue = line
        .substring(line.indexOf(":") + 1)
        .trim()
        .toLowerCase();

      if (
        statusValue === "no-active" ||
        statusValue === "noactive" ||
        statusValue === "sotildi" ||
        statusValue === "inactive" ||
        statusValue === "no active"
      ) {
        carData.status = "no-active";
      } else {
        carData.status = "active";
      }
    }

    // 2. STANDART MAYDONLARNI O'QISH
    else if (lower.startsWith("id:")) {
      carData.listingId = line.replace(/^id:/i, "").trim();
    } else if (lower.startsWith("nomi:")) {
      carData.name = line.replace(/^nomi:/i, "").trim();
    } else if (lower.startsWith("vin:")) {
      carData.vin = line.replace(/^vin:/i, "").trim();
    } else if (lower.startsWith("narxi:")) {
      carData.price = parseInt(line.replace(/[^\d]/g, ""), 10) || 0;
    } else if (lower.startsWith("yili:")) {
      carData.year = parseInt(line.replace(/[^\d]/g, ""), 10) || 2024;
    } else if (lower.startsWith("probeg:")) {
      carData.mileage = parseInt(line.replace(/[^\d]/g, ""), 10) || 0;
    } else if (lower.startsWith("korobka:")) {
      carData.gearbox = line.replace(/^korobka:/i, "").trim();
    } else if (lower.startsWith("rangi:")) {
      carData.color = line.replace(/^rangi:/i, "").trim();
    } else if (lower.startsWith("motor:")) {
      carData.engine = line.replace(/^motor:/i, "").trim();
    } else if (lower.startsWith("yoqilgi:") || lower.startsWith("yoqilg'i:")) {
      carData.fuel = line.replace(/^yoqilg'?i:/i, "").trim();
    } else if (lower.startsWith("joy:")) {
      carData.location = line.replace(/^joy:/i, "").trim();
    } else if (lower.startsWith("sana:")) {
      carData.date = line.replace(/^sana:/i, "").trim();
    } else if (lower.startsWith("tavsif:")) {
      carData.description = line.replace(/^tavsif:/i, "").trim();
    }

    // 3. RASMLAR LINKINI OLISH
    if (/^rasm\d*:/i.test(lower)) {
      const imgUrl = line.substring(line.indexOf(":") + 1).trim();
      if (imgUrl.startsWith("http")) {
        carData.images.push(imgUrl);
      }
    }

    // 4. INSTAGRAM VA YOUTUBE HAVOLALARI
    if (lower.startsWith("instagram:")) {
      const url = line.substring(line.indexOf(":") + 1).trim();
      if (url.startsWith("http")) carData.instagram = url;
    } else if (lower.includes("instagram.com") && !carData.instagram) {
      const match = line.match(/(https?:\/\/[^\s]+)/g);
      if (match && match[0]) carData.instagram = match[0].trim();
    }

    if (lower.startsWith("youtube:")) {
      const url = line.substring(line.indexOf(":") + 1).trim();
      if (url.startsWith("http")) carData.youtube = url;
    } else if (
      (lower.includes("youtube.com") || lower.includes("youtu.be")) &&
      !carData.youtube
    ) {
      const match = line.match(/(https?:\/\/[^\s]+)/g);
      if (match && match[0]) carData.youtube = match[0].trim();
    }
  });

  carData.image = carData.images[0] || "";

  return carData.name ? carData : null;
}

bot.on(["message", "channel_post", "edited_channel_post"], async (ctx) => {
  try {
    const post = ctx.channelPost || ctx.editedChannelPost || ctx.message;
    const text = post.text || post.caption || "";

    console.log(`📩 Yangi/Tahrirlangan xabar keldi (ID: ${post.message_id})`);

    const carData = parseCarPost(text, post.message_id);

    if (!carData) {
      console.log("⚠️ Xabar formatga mos kelmadi ('Nomi:' topilmadi).");
      return;
    }

    await db
      .collection("cars")
      .doc(`post_${post.message_id}`)
      .set(carData, { merge: true });

    console.log(`✅ Firestore'ga saqlandi: post_${post.message_id}`);
    console.log(`📌 E'lon Holati: [ ${carData.status.toUpperCase()} ]`);
    console.log("📸 Instagram link:", carData.instagram || "Mavjud emas");
    console.log("🎥 Youtube link:", carData.youtube || "Mavjud emas");
  } catch (error) {
    console.error("❌ Firestore-ga yozishda xato:", error);
  }
});

bot
  .launch()
  .then(() =>
    console.log(
      "🚀 AvtoTek Bot muvaffaqiyatli ishga tushdi va loyihangizga ulandi!"
    )
  );

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
