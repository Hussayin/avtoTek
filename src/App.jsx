import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Komponent va Sahifalarni import qilish
import Home from "./pages/Home";
import BottomNav from "./pages/BottomNav";
import About from "./pages/About";
import SellCar from "./pages/SellCar";
import LikedProduct from "./pages/LikedProduct";
import Bozor from "./pages/Bozor";
import Admin from "./pages/Admin";

import { trackTelegramUser } from "./trackUser";

const App = () => {
  // =========================================================
  // TELEGRAM MINI APP FOYDALANUVCHISINI QAYD QILISH
  //
  // Ilova ochilganda bir marta ishlaydi. Agar brauzerda
  // (Telegram tashqarisida) ochilsa, hech narsa qilmaydi.
  // =========================================================
  useEffect(() => {
    trackTelegramUser();
  }, []);

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      {/* Sahifalar almashadigan joy */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sell" element={<SellCar />} />
        <Route path="/bozor" element={<Bozor />} />
        <Route path="/favorites" element={<LikedProduct />} />

        {/* Yashirin admin sahifasi — pastki menyuda ko'rinmaydi */}
        <Route path="/admin-avtotek-2026" element={<Admin />} />
      </Routes>
      {/* Pastda qotib turuvchi menyu */}
      <BottomNav />
    </div>
  );
};

export default App;
