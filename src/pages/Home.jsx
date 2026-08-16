import React from "react";

import Navbar from "../comps/Navbar";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";
import CarCard from "./CarCard";
import { LuRefreshCw } from "react-icons/lu";
import { useCars } from "./UseCars";

const Home = () => {
  const { cars, loading, refreshing, refresh } = useCars();

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
            onClick={refresh}
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
