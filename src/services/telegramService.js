import axios from "axios";

const CHANNEL_USERNAME = "DataBaseForAvtoTek";

export const fetchCarsFromTelegram = async () => {
  try {
    // Telegram Widget URL orqali kanaldagi so'nggi postlarni va rasmlarni olish
    const response = await axios.get(`https://s2t.re/rss/${CHANNEL_USERNAME}`);

    // Agar RSS xizmati ishlamasa yoki muammo bo'lsa, Telegram Embed Widget'dan pars qilamiz
    // Buning uchun oson va ishonchli parser:
    const res = await axios.get(
      `https://api.rss2json.com/v1/api.json?rss_url=https://s2t.re/rss/${CHANNEL_USERNAME}`
    );

    if (res.data && res.data.items) {
      const cars = res.data.items.map((item, index) => {
        const text = item.description || item.content || "";

        // Matn ichidan ma'lumotlarni ajratib olish (Regex parsing)
        const nameMatch = text.match(/Nomi:\s*(.+)/i);
        const priceMatch = text.match(/Narxi:\s*(\d+)/i);
        const yearMatch = text.match(/Yili:\s*(\d+)/i);
        const mileageMatch = text.match(/Probeg:\s*(\d+)/i);
        const locationMatch = text.match(/Joy:\s*(.+)/i);
        const dateMatch = text.match(/Sana:\s*(.+)/i);

        // Rasmni ajratib olish (HTML img tagidan src topish)
        const imgMatch = text.match(/<img[^>]+src="([^">]+)"/i);

        return {
          id: item.guid || index,
          name: nameMatch ? nameMatch[1].trim() : "Avtomobil",
          price: priceMatch ? parseInt(priceMatch[1]) : 0,
          year: yearMatch ? parseInt(yearMatch[1]) : 2024,
          mileage: mileageMatch ? parseInt(mileageMatch[1]) : 0,
          location: locationMatch ? locationMatch[1].trim() : "O'zbekiston",
          date: dateMatch ? dateMatch[1].trim() : "Bugun",
          image: imgMatch
            ? imgMatch[1]
            : "https://via.placeholder.com/400x300?text=No+Image",
        };
      });

      return cars;
    }

    return [];
  } catch (error) {
    console.error("Telegramdan ma'lumot olishda xatolik:", error);
    return [];
  }
};
