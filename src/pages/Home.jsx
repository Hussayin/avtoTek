import React, { useEffect, useState } from "react";

import Navbar from "../comps/Navbar";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";
import CarCard from "./CarCard";

// =========================================================
// TELEGRAM SERVICE
// =========================================================
//
// AGAR telegramService.js Home.jsx BILAN BIR PAPKADA BO'LSA:
//
// ./telegramService
//
// AGAR services PAPKASIDA BO'LSA:
//
// ../services/telegramService
//
// Pastdagi importni o'zingdagi joylashuvga qarab tekshir.
// =========================================================

import { fetchCarsFromTelegram } from "../services/telegramService";

const Home = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // TELEGRAMDAN MA'LUMOT OLISH
  // =========================================================

  useEffect(() => {
    const loadTelegramCars = async () => {
      try {
        setLoading(true);

        console.log("Telegramdan avtomobillar olinmoqda...");

        const telegramCars = await fetchCarsFromTelegram();

        console.log("Home.jsx ga kelgan mashinalar:", telegramCars);

        setCars(telegramCars);
      } catch (error) {
        console.error("Telegram avtomobillarini yuklashda xatolik:", error);

        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadTelegramCars();
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          MENU
      ====================================================== */}

      <MenuBar />

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <SearchBar />

      {/* =====================================================
          KUN TAKLIFLARI
      ====================================================== */}

      <div className="px-2 mt-2 pb-20">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Kun takliflari
        </h2>

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
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
