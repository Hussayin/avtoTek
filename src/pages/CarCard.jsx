import React, { useState } from "react";

import { LuHeart, LuMapPin, LuCalendar } from "react-icons/lu";

import { FaHeart } from "react-icons/fa";

const CarCard = ({ car }) => {
  // =========================================================
  // LIKE
  // =========================================================

  const [isLiked, setIsLiked] = useState(false);

  // =========================================================
  // RASM
  // =========================================================

  const imageUrl = car?.image || "";

  // =========================================================
  // CARD
  // =========================================================

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* =====================================================
          1. RASM QISMI
      ====================================================== */}

      <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
        {/* =================================================
            RASM BOR BO'LSA
        ================================================== */}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={car?.name || "Avtomobil"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            // -------------------------------------------------
            // RASM YUKLANMAGANDA
            // -------------------------------------------------

            onError={(event) => {
              console.error("❌ CARD RASMI YUKLANMADI:", imageUrl);

              // Rasm o'rniga fallback
              event.currentTarget.style.display = "none";

              const parent = event.currentTarget.parentElement;

              if (parent) {
                parent.setAttribute("data-image-error", "true");
              }
            }}
          />
        ) : (
          /* =================================================
             RASM URL YO'Q
          ================================================== */

          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            Rasm mavjud emas
          </div>
        )}

        {/* ===================================================
            YURAKCHA
        ==================================================== */}

        <button
          type="button"
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white active:scale-90 transition-all shadow-sm"
        >
          {isLiked ? (
            <FaHeart className="text-rose-500 text-base" />
          ) : (
            <LuHeart className="text-base text-slate-700" />
          )}
        </button>
      </div>

      {/* =====================================================
          2. MA'LUMOTLAR QISMI
      ====================================================== */}

      <div className="p-2 leading-3 flex flex-col flex-1 justify-between">
        <div>
          {/* =================================================
              MOSHINA NOMI
          ================================================== */}

          <h3 className="font-bold text-[14px] text-slate-900 leading-snug line-clamp-1 mb-0.5">
            {car?.name || "Avtomobil"}
          </h3>

          {/* =================================================
              NARXI
          ================================================== */}

          <div className="text-blue-600 font-extrabold text-[17px] mb-0.5">
            ${Number(car?.price || 0).toLocaleString()}
          </div>

          {/* =================================================
              YILI VA PROBEG
          ================================================== */}

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
            <span>{car?.year || "-"}-yil</span>

            <span>•</span>

            <span>{Number(car?.mileage || 0).toLocaleString()} km</span>
          </div>
        </div>

        {/* ===================================================
            PASTKI QISM
        ==================================================== */}

        <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          {/* =================================================
              JOY
          ================================================== */}

          <div className="flex items-center gap-1 truncate max-w-[55%]">
            <LuMapPin className="text-slate-400 shrink-0" />

            <span className="truncate">{car?.location || "O'zbekiston"}</span>
          </div>

          {/* =================================================
              SANA
          ================================================== */}

          <div className="flex items-center gap-1 shrink-0">
            <LuCalendar className="text-slate-400" />

            <span>{car?.date || "Bugun"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
