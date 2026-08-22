import React, { useEffect, useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import CarCard from "./CarCard";

const FilterModal = ({ isOpen, onClose, cars }) => {
  const [carName, setCarName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minKm, setMinKm] = useState("");
  const [maxKm, setMaxKm] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtrlash mantiqi (Nomi + Narx + Yil + Probeg)
  const filteredCars = cars.filter((car) => {
    // 1. Nomi bo'yicha (masalan "Spark")
    if (carName.trim()) {
      const name = (car.name || "").toLowerCase();
      if (!name.includes(carName.toLowerCase().trim())) return false;
    }

    // 2. Narx bo'yicha
    const carPrice = Number(car.price || 0);
    if (minPrice && carPrice < Number(minPrice)) return false;
    if (maxPrice && carPrice > Number(maxPrice)) return false;

    // 3. Yil bo'yicha
    const carYear = parseInt(
      (car.year || car.yearNum || "0").toString().replace(/\D/g, ""),
      10
    );
    if (minYear && carYear < Number(minYear)) return false;
    if (maxYear && carYear > Number(maxYear)) return false;

    // 4. Probeg (km) bo'yicha
    const carKm = parseInt(
      (car.mileage || car.km || "0").toString().replace(/\D/g, ""),
      10
    );
    if (minKm && carKm < Number(minKm)) return false;
    if (maxKm && carKm > Number(maxKm)) return false;

    return true;
  });

  const handleReset = () => {
    setCarName("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setMinKm("");
    setMaxKm("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-200 h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Filtr va Natijalar</h3>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Kontent qismi */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Inputlar paneli */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3.5 shadow-sm">
          {/* Mashina Nomi */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Mashina Rusumi / Nomi
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Masalan: Spark, Cobalt, Malibu..."
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Narxi */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Narxi ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Dan"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              <input
                type="number"
                placeholder="Gacha"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Yili */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Ishlab chiqarilgan yili
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Dan"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              <input
                type="number"
                placeholder="Gacha"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Probeg */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Yurgan masofasi (km)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Dan"
                value={minKm}
                onChange={(e) => setMinKm(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              <input
                type="number"
                placeholder="Gacha"
                value={maxKm}
                onChange={(e) => setMaxKm(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Barcha filtr bo'limlarini tozalash
            </button>
          </div>
        </div>

        {/* Natijalar ko'rinishi */}
        <div>
          <p className="text-xs text-slate-400 mb-2">
            Topilgan natijalar:{" "}
            <span className="font-semibold text-slate-700">
              {filteredCars.length} ta
            </span>
          </p>

          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-10">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Kiritilgan mezonlarga mos mashina topilmadi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
