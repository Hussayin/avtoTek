import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuX,
  LuMapPin,
  LuCalendar,
  LuGauge,
  LuFuel,
  LuPalette,
  LuSettings2,
} from "react-icons/lu";
import { FaInstagram, FaYoutube } from "react-icons/fa";

// =============================================================
// Kelajakda qo'shiladigan (hozircha Telegram postida bo'lmagan)
// maydonlar. Qiymati bo'lmasa "Kiritilmagan" deb chiqadi.
// =============================================================
const FUTURE_FIELDS = [
  { key: "bodyType", label: "Kuzov turi" },
  { key: "certificateNo", label: "Sertifikat raqami" },
  { key: "ownersCount", label: "Egasi soni" },
];

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-b-0">
    {Icon && <Icon className="text-slate-400 shrink-0" size={16} />}
    <span className="text-xs text-slate-400 w-24 shrink-0">{label}</span>
    <span className="text-sm text-slate-800 font-medium truncate">
      {value && value !== "" ? value : "Kiritilmagan"}
    </span>
  </div>
);

const CarDetailModal = ({ car, onClose }) => {
  const images =
    car?.images && car.images.length > 0
      ? car.images
      : car?.image
      ? [car.image]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);

  if (!car) return null;

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe orqali rasm almashtirish
  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      goNext();
    } else if (info.offset.x > threshold) {
      goPrev();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* =====================================================
              RASMLAR SLAYDERI
          ====================================================== */}
          <div className="relative w-full h-64 bg-slate-100 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
            {images.length > 0 ? (
              <motion.div
                className="w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
              >
                <img
                  src={images[activeIndex]}
                  alt={car.name}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Rasm mavjud emas
              </div>
            )}

            {/* Yopish tugmasi */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm active:scale-90 transition-transform"
            >
              <LuX size={18} />
            </button>

            {/* Nuqtachalar */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* =====================================================
              ASOSIY MA'LUMOT
          ====================================================== */}
          <div className="p-4">
            <h2 className="text-lg font-bold text-slate-900 mb-0.5">
              {car.name || "Avtomobil"}
            </h2>
            <div className="text-blue-600 font-extrabold text-2xl mb-3">
              ${Number(car.price || 0).toLocaleString()}
            </div>

            {/* Instagram / Youtube tugmalari */}
            {(car.instagram || car.youtube) && (
              <div className="flex gap-2 mb-4">
                {car.instagram && (
                  <a
                    href={car.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white text-xs font-semibold active:scale-95 transition-transform"
                  >
                    <FaInstagram size={14} /> Instagram
                  </a>
                )}
                {car.youtube && (
                  <a
                    href={car.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold active:scale-95 transition-transform"
                  >
                    <FaYoutube size={14} /> Youtube
                  </a>
                )}
              </div>
            )}

            {/* =================================================
                TEXNIK XUSUSIYATLAR
            ================================================== */}
            <div className="bg-slate-50 rounded-2xl px-3 mb-4">
              <InfoRow icon={LuCalendar} label="Yili" value={car.year} />
              <InfoRow
                icon={LuGauge}
                label="Probeg"
                value={
                  car.mileage
                    ? `${Number(car.mileage).toLocaleString()} km`
                    : ""
                }
              />
              <InfoRow icon={LuSettings2} label="Korobka" value={car.gearbox} />
              <InfoRow icon={LuPalette} label="Rangi" value={car.color} />
              <InfoRow icon={LuSettings2} label="Motor" value={car.engine} />
              <InfoRow icon={LuFuel} label="Yoqilg'i" value={car.fuel} />
              <InfoRow icon={LuMapPin} label="Joy" value={car.location} />
              <InfoRow icon={LuCalendar} label="Sana" value={car.date} />
            </div>

            {/* =================================================
                TAVSIF
            ================================================== */}
            {car.description && (
              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-1">Tavsif</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            {/* =================================================
                KELAJAKDA QO'SHILADIGAN MAYDONLAR
            ================================================== */}
            <div className="bg-slate-50 rounded-2xl px-3 mb-2">
              {FUTURE_FIELDS.map((field) => (
                <InfoRow
                  key={field.key}
                  label={field.label}
                  value={car[field.key]}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CarDetailModal;
