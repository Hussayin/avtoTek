import React, { useEffect, useRef, useState } from "react";

import Navbar from "../comps/Navbar";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";
import CarCard from "./CarCard";
import { LuRefreshCw } from "react-icons/lu";

// =========================================================
// TELEGRAM SERVICE
// =========================================================

import { fetchCarsFromTelegram } from "../services/telegramService";

// Har necha millisekundda fon rejimida yangilanishi
const AUTO_REFRESH_INTERVAL = 50000; // 30 soniya

const Home = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [cars, setCars] = useState([]);

  // Faqat BIRINCHI yuklanishda skeleton ko'rsatish uchun
  const [loading, setLoading] = useState(true);

  // Fon rejimida yangilanayotganini bildiruvchi kichik indikator
  const [refreshing, setRefreshing] = useState(false);

  // Birinchi muvaffaqiyatli yuklanish sodir bo'lganini bilish uchun
  const hasLoadedOnce = useRef(false);

  // =========================================================
  // MA'LUMOTNI OLISH FUNKSIYASI
  //
  // silent = true bo'lsa, loading skeleton chiqmaydi — foydalanuvchi
  // sezmasdan fon rejimida yangilanadi.
  // =========================================================

  const loadTelegramCars = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log(
        silent
          ? "Fon rejimida yangilanmoqda..."
          : "Telegramdan avtomobillar olinmoqda..."
      );

      const telegramCars = await fetchCarsFromTelegram();

      console.log("Home.jsx ga kelgan mashinalar:", telegramCars);

      // Agar bo'sh massiv qaytsa-yu, avval ma'lumot bo'lgan bo'lsa,
      // ehtimol proksilar vaqtincha ishlamay qoldi — eski ma'lumotni
      // ekranda saqlab qolamiz, bo'sh ekran ko'rsatmaymiz.
      if (telegramCars.length === 0 && hasLoadedOnce.current) {
        console.warn(
          "Yangi ma'lumot 0 ta qaytdi — eski ma'lumot ekranda saqlanadi."
        );
      } else {
        setCars(telegramCars);
        hasLoadedOnce.current = true;
      }
    } catch (error) {
      console.error("Telegram avtomobillarini yuklashda xatolik:", error);
      // Xatolik bo'lsa ham eski ma'lumotni ekranda qoldiramiz
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // BIRINCHI YUKLANISH + FON REJIMIDA AVTOMATIK YANGILANISH
  // =========================================================

  useEffect(() => {
    // 1. Birinchi marta — loading skeleton bilan
    loadTelegramCars(false);

    // 2. Muntazam fon rejimida yangilanish
    const intervalId = setInterval(() => {
      loadTelegramCars(true);
    }, AUTO_REFRESH_INTERVAL);

    // 3. Foydalanuvchi ilovaga qaytganda (masalan boshqa tabdan
    //    yoki Telegram Mini App fonidan qaytganda) ham darrov
    //    yangilab qo'yamiz
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadTelegramCars(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // =========================================================
  // QO'LDA YANGILASH TUGMASI
  // =========================================================

  const handleManualRefresh = () => {
    if (refreshing) return;
    loadTelegramCars(true);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>
      <Navbar />
      <MenuBar />
      <SearchBar />

      <div className="px-3 mt-2 pb-20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-slate-900">Kun takliflari</h2>

          {/* =================================================
              QO'LDA YANGILASH TUGMASI
          ================================================== */}
          <button
            type="button"
            onClick={handleManualRefresh}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform"
          >
            <LuRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* ===================================================
            LOADING — FAQAT BIRINCHI YUKLANISHDA
        ==================================================== */}

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
          /* =================================================
             CARDLAR
          ================================================== */

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          /* =================================================
             MA'LUMOT YO'Q
          ================================================== */

          <div className="text-center py-10 text-slate-400 text-sm">
            Hozircha e'lonlar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
