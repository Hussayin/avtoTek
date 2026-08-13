import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../comps/Navbar";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";
import CarCard from "./CarCard";

const CHANNEL_USERNAME = "DataBaseForAvtoTek";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelegramCars = async () => {
      try {
        setLoading(true);

        const targetUrl = `https://t.me/s/${CHANNEL_USERNAME}`;

        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
          `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
            targetUrl
          )}`,
        ];

        let htmlText = "";

        for (const proxyUrl of proxies) {
          try {
            const res = await axios.get(proxyUrl, { timeout: 6000 });
            if (res.data) {
              htmlText = res.data.contents || res.data;
              if (
                typeof htmlText === "string" &&
                htmlText.includes("tgme_widget_message")
              ) {
                break;
              }
            }
          } catch (e) {
            console.warn("Proksi javob bermadi...", proxyUrl);
          }
        }

        if (htmlText) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");

          const messages = doc.querySelectorAll(".tgme_widget_message");
          const parsedCars = [];

          messages.forEach((msg, index) => {
            const textNode = msg.querySelector(".tgme_widget_message_text");
            if (!textNode) return;

            let name = "";
            let price = 0;
            let year = 2024;
            let mileage = 0;
            let location = "Toshkent sh.";
            let date = "Bugun";
            let customImgUrl = "";

            // 1. Post ichidagi <a> teglaridan to'liq va asl linkni (href) ajratib olish
            const anchors = textNode.querySelectorAll("a");
            anchors.forEach((a) => {
              const href = a.getAttribute("href") || "";
              if (
                href.includes("ibb.co") ||
                href.match(/\.(webp|jpg|jpeg|png)/i)
              ) {
                customImgUrl = href;
              }
            });

            // 2. Telegram HTML matnidagi yangi qatorlarni to'g'rilash
            let formattedHtml = textNode.innerHTML
              .replace(/<br\s*[\/]?>/gi, "\n")
              .replace(/<\/div>/gi, "\n")
              .replace(/<div>/gi, "");

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = formattedHtml;
            const lines = tempDiv.innerText.split("\n");

            // Matndan e'lon parametrlarini o'qish
            lines.forEach((line) => {
              const cleanLine = line.trim();
              const lowerLine = cleanLine.toLowerCase();

              if (lowerLine.startsWith("nomi:")) {
                name = cleanLine.replace(/nomi:/i, "").trim();
              } else if (lowerLine.startsWith("narxi:")) {
                const p = cleanLine.replace(/narxi:/i, "").replace(/\D/g, "");
                price = p ? parseInt(p) : 0;
              } else if (lowerLine.startsWith("yili:")) {
                const y = cleanLine.replace(/yili:/i, "").replace(/\D/g, "");
                year = y ? parseInt(y) : 2024;
              } else if (lowerLine.startsWith("probeg:")) {
                const m = cleanLine.replace(/probeg:/i, "").replace(/\D/g, "");
                mileage = m ? parseInt(m) : 0;
              } else if (lowerLine.startsWith("joy:")) {
                location = cleanLine.replace(/joy:/i, "").trim();
              } else if (lowerLine.startsWith("sana:")) {
                date = cleanLine.replace(/sana:/i, "").trim();
              } else if (
                !customImgUrl &&
                (lowerLine.startsWith("rasm1:") ||
                  lowerLine.startsWith("rasm:"))
              ) {
                const extractedUrl = cleanLine
                  .replace(/rasm1:|rasm:/i, "")
                  .trim();
                if (extractedUrl.startsWith("http")) {
                  customImgUrl = extractedUrl;
                }
              }
            });

            // 3. Yakuniy rasm manzilini belgilash
            let imgUrl = customImgUrl;

            // Matnda rasm topilmasa, Telegram postining o'zidagi rasmni olish
            if (!imgUrl) {
              const photoNode = msg.querySelector(
                ".tgme_widget_message_photo_wrap"
              );
              if (photoNode) {
                const style = photoNode.getAttribute("style");
                const urlMatch = style?.match(/url\(['"]?(.*?)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                  imgUrl = urlMatch[1];
                }
              }
            }

            // Zaxira rasmi
            if (!imgUrl) {
              imgUrl = "https://via.placeholder.com/400x300?text=AvtoTek";
            }

            if (name) {
              parsedCars.push({
                id: index,
                name,
                price,
                year,
                mileage,
                location,
                date,
                image: imgUrl,
              });
            }
          });

          setCars(parsedCars.reverse());
        }
      } catch (error) {
        console.error("Telegramdan ma'lumot olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelegramCars();
  }, []);

  return (
    <div>
      <Navbar />
      <MenuBar />
      <SearchBar />

      <div className="px-3 mt-2 pb-20">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Kun takliflari
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-64 bg-slate-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            Hozircha e'lonlar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
