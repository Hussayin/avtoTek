import axios from "axios";

const CHANNEL_USERNAME = "DataBaseForAvtoTek";

/**
 * Telegram kanalidan avtomobil e'lonlarini olish
 *
 * Hozircha faqat BIRINCHI rasm olinadi.
 *
 * Telegram post misoli:
 *
 * Nomi: husan
 * Narxi: 2000
 * Yili: 2022
 * Probeg: 30000
 * Joy: xorazm
 * Sana: 13.08.2026
 * Rasm1: https://i.ibb.co/43X4zFN/car.webp
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

      // ENG MUHIM QISM
      let imageUrl = "";

      // =======================================================
      // 1. POST ICHIDAGI LINKLARDAN RASM QIDIRISH
      // =======================================================

      const anchors = textNode.querySelectorAll("a");

      for (const anchor of anchors) {
        const href = anchor.getAttribute("href") || "";

        const isImage =
          href.includes("ibb.co") ||
          /\.(webp|jpg|jpeg|png)(\?.*)?$/i.test(href);

        if (isImage) {
          imageUrl = href;

          // FAQAT BIRINCHI RASM
          break;
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
        // RASM1:
        //
        // yoki
        //
        // RASM:
        //
        // FAQAT BIRINCHI RASM
        // -----------------------------------------------------
        else if (
          !imageUrl &&
          (lowerLine.startsWith("rasm1:") || lowerLine.startsWith("rasm:"))
        ) {
          let extractedUrl = cleanLine.replace(/^rasm1?:/i, "").trim();

          // URL oxiridagi tasodifiy belgilarni olib tashlash
          extractedUrl = extractedUrl.replace(/[),.]+$/, "");

          if (
            extractedUrl.startsWith("http://") ||
            extractedUrl.startsWith("https://")
          ) {
            imageUrl = extractedUrl;

            console.log("Telegram textdan birinchi rasm topildi:", imageUrl);
          }
        }
      });

      // =======================================================
      // 4. TELEGRAM POSTINING O'ZIDAGI RASM
      //
      // Agar Rasm1: topilmagan bo'lsa.
      // =======================================================

      if (!imageUrl) {
        const photoNode = msg.querySelector(".tgme_widget_message_photo_wrap");

        if (photoNode) {
          const style = photoNode.getAttribute("style") || "";

          const urlMatch = style.match(/url\(['"]?(.*?)['"]?\)/);

          if (urlMatch && urlMatch[1]) {
            imageUrl = urlMatch[1];

            console.log("Telegram postining o'zidan rasm topildi:", imageUrl);
          }
        }
      }

      // =======================================================
      // 5. AVTOMOBIL BOR BO'LSA ARRAYGA QO'SHISH
      // =======================================================

      if (name) {
        const car = {
          id: `${index}-${name}`,

          name: name,

          price: price,

          year: year,

          mileage: mileage,

          location: location,

          date: date,

          // MUHIM
          // CarCard.jsx aynan shu image qiymatini ishlatadi.
          image: imageUrl,
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
