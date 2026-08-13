import axios from "axios";

const CHANNEL_USERNAME = "DataBaseForAvtoTek";

// Kelajakda qo'shiladigan (hozircha Telegram postida bo'lmaydigan) maydonlar
// uchun standart "bo'sh" qiymat. UI shuni ko'rib "Kiritilmagan" deb chiqarishi
// mumkin.
const NOT_PROVIDED = "";

/**
 * Telegram kanalidan avtomobil e'lonlarini olish
 *
 * Telegram post misoli:
 *
 * Nomi: Spark 1.5 turbo
 * Narxi: 8500
 * Yili: 2022
 * Probeg: 30000
 * Korobka: avtomat
 * Rangi: oq
 * Motor: 1.5
 * Yoqilgi: benzin
 * Joy: xorazm
 * Sana: 14.08.2026
 * Instagram: https://instagram.com/p/...
 * Youtube: https://youtube.com/watch?v=...
 * Tavsif: Mashina toza, hech qanday urilish yo'q.
 * Rasm1: https://i.ibb.co/.../car1.webp
 * Rasm2: https://i.ibb.co/.../car2.webp
 * Rasm3: https://i.ibb.co/.../car3.webp
 * Rasm4: https://i.ibb.co/.../car4.webp
 */
export const fetchCarsFromTelegram = async () => {
  try {
    // =========================================================
    // TELEGRAM KANAL URL
    // =========================================================

    const targetUrl = `https://t.me/s/${CHANNEL_USERNAME}`;

    // =========================================================
    // CORS PROXYLAR
    // =========================================================

    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,

      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,

      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
        targetUrl
      )}`,
    ];

    let htmlText = "";

    // =========================================================
    // TELEGRAM HTML OLISH
    // =========================================================

    for (const proxyUrl of proxies) {
      try {
        console.log("Telegram proxy tekshirilmoqda:", proxyUrl);

        const response = await axios.get(proxyUrl, {
          timeout: 8000,
        });

        let data = response.data;

        // allorigins javobida:
        //
        // {
        //   contents: "TELEGRAM HTML"
        // }
        //
        // bo'ladi.

        if (data && typeof data === "object" && data.contents) {
          data = data.contents;
        }

        if (typeof data === "string" && data.includes("tgme_widget_message")) {
          htmlText = data;

          console.log("Telegram HTML muvaffaqiyatli olindi.");

          break;
        }
      } catch (error) {
        console.warn("Bu proxy ishlamadi:", proxyUrl);
      }
    }

    // =========================================================
    // HTML OLINMAGAN BO'LSA
    // =========================================================

    if (!htmlText) {
      console.error("Telegram kanalidan HTML olinmadi.");

      return [];
    }

    // =========================================================
    // HTML PARSER
    // =========================================================

    const parser = new DOMParser();

    const doc = parser.parseFromString(htmlText, "text/html");

    // Telegram postlari
    const messages = doc.querySelectorAll(".tgme_widget_message");

    console.log("Telegram postlari soni:", messages.length);

    const parsedCars = [];

    // =========================================================
    // HAR BIR POSTNI TEKSHIRISH
    // =========================================================

    messages.forEach((msg, index) => {
      // -------------------------------------------------------
      // POST TEXT
      // -------------------------------------------------------

      const textNode = msg.querySelector(".tgme_widget_message_text");

      // Text bo'lmasa postni o'tkazib yuboramiz
      if (!textNode) {
        return;
      }

      // -------------------------------------------------------
      // DEFAULT QIYMATLAR
      // -------------------------------------------------------

      let name = "";
      let price = 0;
      let year = 2024;
      let mileage = 0;
      let location = "Toshkent sh.";
      let date = "Bugun";

      // Texnik xususiyatlar
      let gearbox = NOT_PROVIDED; // Korobka: avtomat / mexanika
      let color = NOT_PROVIDED; // Rangi
      let engine = NOT_PROVIDED; // Motor hajmi
      let fuel = NOT_PROVIDED; // Yoqilg'i turi

      // Video / ijtimoiy tarmoq
      let instagram = NOT_PROVIDED;
      let youtube = NOT_PROVIDED;

      // Tavsif
      let description = NOT_PROVIDED;

      // Rasmlar — bir nechta bo'lishi mumkin
      // images[0] = Rasm1 = cardda ko'rinadigan asosiy rasm
      const images = [];

      // =======================================================
      // 1. POST ICHIDAGI LINKLARDAN RASM QIDIRISH (zaxira usul)
      //
      // Matn ichidagi "Rasm1: ..." qatorlari asosiy manba, lekin
      // agar Telegram avtomatik linkka aylantirgan bo'lsa, shu yerdan
      // ham topib olamiz.
      // =======================================================

      const anchors = textNode.querySelectorAll("a");

      const anchorImageUrls = [];

      for (const anchor of anchors) {
        const href = anchor.getAttribute("href") || "";

        const isImage =
          href.includes("ibb.co") ||
          /\.(webp|jpg|jpeg|png)(\?.*)?$/i.test(href);

        if (isImage) {
          anchorImageUrls.push(href);
        }
      }

      // =======================================================
      // 2. TELEGRAM TEXTNI TOZALASH
      // =======================================================

      let formattedHtml = textNode.innerHTML
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<div>/gi, "");

      const tempDiv = document.createElement("div");

      tempDiv.innerHTML = formattedHtml;

      const text = tempDiv.innerText || tempDiv.textContent || "";

      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      // =======================================================
      // 3. MATNDAN MA'LUMOTLARNI OLISH
      // =======================================================

      lines.forEach((line) => {
        const cleanLine = line.trim();

        if (!cleanLine) {
          return;
        }

        const lowerLine = cleanLine.toLowerCase();

        // -----------------------------------------------------
        // NOMI
        // -----------------------------------------------------
        if (lowerLine.startsWith("nomi:")) {
          name = cleanLine.replace(/^nomi:/i, "").trim();
        }

        // -----------------------------------------------------
        // NARXI
        // -----------------------------------------------------
        else if (lowerLine.startsWith("narxi:")) {
          const value = cleanLine.replace(/^narxi:/i, "").replace(/[^\d]/g, "");

          price = value ? parseInt(value, 10) : 0;
        }

        // -----------------------------------------------------
        // YILI
        // -----------------------------------------------------
        else if (lowerLine.startsWith("yili:")) {
          const value = cleanLine.replace(/^yili:/i, "").replace(/[^\d]/g, "");

          year = value ? parseInt(value, 10) : 2024;
        }

        // -----------------------------------------------------
        // PROBEG
        // -----------------------------------------------------
        else if (lowerLine.startsWith("probeg:")) {
          const value = cleanLine
            .replace(/^probeg:/i, "")
            .replace(/[^\d]/g, "");

          mileage = value ? parseInt(value, 10) : 0;
        }

        // -----------------------------------------------------
        // KOROBKA (uzatma qutisi)
        // -----------------------------------------------------
        else if (lowerLine.startsWith("korobka:")) {
          gearbox = cleanLine.replace(/^korobka:/i, "").trim();
        }

        // -----------------------------------------------------
        // RANGI
        // -----------------------------------------------------
        else if (lowerLine.startsWith("rangi:")) {
          color = cleanLine.replace(/^rangi:/i, "").trim();
        }

        // -----------------------------------------------------
        // MOTOR HAJMI
        // -----------------------------------------------------
        else if (lowerLine.startsWith("motor:")) {
          engine = cleanLine.replace(/^motor:/i, "").trim();
        }

        // -----------------------------------------------------
        // YOQILG'I TURI
        // -----------------------------------------------------
        else if (
          lowerLine.startsWith("yoqilgi:") ||
          lowerLine.startsWith("yoqilg'i:")
        ) {
          fuel = cleanLine.replace(/^yoqilg'?i:/i, "").trim();
        }

        // -----------------------------------------------------
        // JOY
        // -----------------------------------------------------
        else if (lowerLine.startsWith("joy:")) {
          location = cleanLine.replace(/^joy:/i, "").trim();
        }

        // -----------------------------------------------------
        // SANA
        // -----------------------------------------------------
        else if (lowerLine.startsWith("sana:")) {
          date = cleanLine.replace(/^sana:/i, "").trim();
        }

        // -----------------------------------------------------
        // INSTAGRAM
        // -----------------------------------------------------
        else if (lowerLine.startsWith("instagram:")) {
          instagram = cleanLine.replace(/^instagram:/i, "").trim();
        }

        // -----------------------------------------------------
        // YOUTUBE
        // -----------------------------------------------------
        else if (lowerLine.startsWith("youtube:")) {
          youtube = cleanLine.replace(/^youtube:/i, "").trim();
        }

        // -----------------------------------------------------
        // TAVSIF
        // -----------------------------------------------------
        else if (lowerLine.startsWith("tavsif:")) {
          description = cleanLine.replace(/^tavsif:/i, "").trim();
        }

        // -----------------------------------------------------
        // RASM1:, RASM2:, RASM3:, RASM4: ... (cheklanmagan son)
        // -----------------------------------------------------
        else if (/^rasm\d*:/i.test(lowerLine)) {
          let extractedUrl = cleanLine.replace(/^rasm\d*:/i, "").trim();

          // URL oxiridagi tasodifiy belgilarni olib tashlash
          extractedUrl = extractedUrl.replace(/[),.]+$/, "");

          if (
            extractedUrl.startsWith("http://") ||
            extractedUrl.startsWith("https://")
          ) {
            images.push(extractedUrl);
          }
        }
      });

      // =======================================================
      // 4. AGAR MATNDA RASM TOPILMAGAN BO'LSA — ZAXIRA MANBALAR
      // =======================================================

      if (images.length === 0 && anchorImageUrls.length > 0) {
        images.push(...anchorImageUrls);
      }

      if (images.length === 0) {
        const photoNode = msg.querySelector(".tgme_widget_message_photo_wrap");

        if (photoNode) {
          const style = photoNode.getAttribute("style") || "";

          const urlMatch = style.match(/url\(['"]?(.*?)['"]?\)/);

          if (urlMatch && urlMatch[1]) {
            images.push(urlMatch[1]);

            console.log(
              "Telegram postining o'zidan rasm topildi:",
              urlMatch[1]
            );
          }
        }
      }

      // =======================================================
      // 5. AVTOMOBIL BOR BO'LSA ARRAYGA QO'SHISH
      // =======================================================

      if (name) {
        const car = {
          id: `${index}-${name}`,

          name,
          price,
          year,
          mileage,
          location,
          date,

          gearbox,
          color,
          engine,
          fuel,

          instagram,
          youtube,
          description,

          // CarCard.jsx faqat birinchisini (images[0]) ishlatadi.
          // Detail sahifasi butun massivni ishlatadi.
          images,
          image: images[0] || "",
        };

        parsedCars.push(car);

        console.log("Avtomobil topildi:", car);
      }
    });

    // =========================================================
    // ENG YANGI POSTNI BIRINCHI CHIQARISH
    // =========================================================

    parsedCars.reverse();

    console.log("Yakuniy avtomobillar:", parsedCars);

    return parsedCars;
  } catch (error) {
    console.error("Telegramdan ma'lumot olishda xatolik:", error);

    return [];
  }
};
