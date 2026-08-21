import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuX,
  LuMapPin,
  LuCalendar,
  LuGauge,
  LuFuel,
  LuPalette,
  LuSettings2,
  LuChevronLeft,
  LuChevronRight,
  LuExpand,
} from "react-icons/lu";
import { FaInstagram, FaYoutube } from "react-icons/fa";

const FUTURE_FIELDS = [
  { key: "bodyType", label: "Kuzov turi" },
  { key: "certificateNo", label: "Sertifikat raqami" },
  { key: "ownersCount", label: "Egasi soni" },
];

const StatChip = ({ icon: Icon, label, value }) => {
  const hasValue = value && value !== "" && value !== "-";
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 text-slate-400">
        {Icon && <Icon size={14} />}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-bold truncate ${
          hasValue ? "text-slate-900" : "text-slate-300 font-medium"
        }`}
      >
        {hasValue ? value : "Kiritilmagan"}
      </span>
    </div>
  );
};

const FullscreenGallery = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const goNext = () => setIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleDragEnd = (event, info) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goNext();
    else if (info.offset.x > threshold) goPrev();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        key={index}
        className="w-full h-full flex items-center justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
      >
        <img
          src={images[index]}
          alt=""
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </motion.div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
      >
        <LuX size={20} />
      </button>

      {images.length > 1 && (
        <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold">
          {index + 1} / {images.length}
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <LuChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <LuChevronRight size={20} />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const CarDetailModal = ({ car, onClose }) => {
  const images =
    car?.images && car.images.length > 0
      ? car.images
      : car?.image
      ? [car.image]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!car) return null;

  // Instagram va YouTube havolalarini xavfsiz shaklda olish
  const instagramUrl = car.instagram || car.Instagram || "";
  const youtubeUrl = car.youtube || car.Youtube || car.YouTube || "";

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) goNext();
    else if (info.offset.x > threshold) goPrev();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-[#f8fafc]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full h-full overflow-y-auto"
          initial={{ y: "6%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "6%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
        >
          {/* RASMLAR SLAYDERI */}
          <div className="relative w-full h-[46vh] bg-slate-100 overflow-hidden">
            {images.length > 0 ? (
              <motion.div
                className="w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                onClick={() => setShowGallery(true)}
              >
                <img
                  src={images[activeIndex]}
                  alt={car.name}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Rasm mavjud emas
              </div>
            )}

            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm active:scale-90 transition-transform"
            >
              <LuX size={20} />
            </button>

            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setShowGallery(true)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm active:scale-90 transition-transform"
              >
                <LuExpand size={17} />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold">
                {activeIndex + 1} / {images.length}
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-1.5">
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

          {/* ASOSIY MA'LUMOT */}
          <div className="px-4 mb-[50px] pt-5 pb-10 -mt-4 bg-[#f8fafc] rounded-t-3xl relative">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {car.name || "Avtomobil"}
              </h2>
            </div>
            {car.listingId && (
              <div className="text-[11px] text-slate-400 font-mono mb-1">
                {car.listingId}
              </div>
            )}
            <div className="text-blue-600 font-extrabold text-[26px] mb-4">
              ${Number(car.price || 0).toLocaleString()}
            </div>

            {/* INSTAGRAM VA YOUTUBE TUGMALARI */}
            {(instagramUrl || youtubeUrl) && (
              <div className="flex gap-2 mb-5">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white text-xs font-semibold active:scale-95 transition-transform shadow-md cursor-pointer"
                  >
                    <FaInstagram size={18} /> Tekshiruv (Instagram)
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-red-600 text-white text-xs font-semibold active:scale-95 transition-transform shadow-md cursor-pointer"
                  >
                    <FaYoutube size={18} /> Tekshiruv (Youtube)
                  </a>
                )}
              </div>
            )}

            {/* TEXNIK XUSUSIYATLAR */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
              Xususiyatlari
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <StatChip icon={LuCalendar} label="Yili" value={car.year} />
              <StatChip
                icon={LuGauge}
                label="Probeg"
                value={
                  car.mileage
                    ? `${Number(car.mileage).toLocaleString()} km`
                    : ""
                }
              />
              <StatChip
                icon={LuSettings2}
                label="Korobka"
                value={car.gearbox}
              />
              <StatChip icon={LuPalette} label="Rangi" value={car.color} />
              <StatChip icon={LuSettings2} label="Motor" value={car.engine} />
              <StatChip icon={LuFuel} label="Yoqilg'i" value={car.fuel} />
              <StatChip icon={LuSettings2} label="VIN raqami" value={car.vin} />
            </div>

            {/* JOY VA SANA */}
            <div className="flex items-center justify-between text-sm text-slate-500 mb-5 px-1">
              <div className="flex items-center gap-1.5">
                <LuMapPin size={16} className="text-slate-400" />
                <span>{car.location || "O'zbekiston"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LuCalendar size={16} className="text-slate-400" />
                <span>{car.date || "Bugun"}</span>
              </div>
            </div>

            {/* TAVSIF */}
            {car.description && (
              <div className="mb-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Tavsif
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            {/* KELAJAKDA QO'SHILADIGAN MAYDONLAR */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
              Qo'shimcha
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {FUTURE_FIELDS.map((field) => (
                <StatChip
                  key={field.key}
                  label={field.label}
                  value={car[field.key]}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* TO'LIQ EKRAN GALEREYA */}
      {showGallery && (
        <FullscreenGallery
          images={images}
          startIndex={activeIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </AnimatePresence>
  );
};

export default CarDetailModal;
