import React from "react";
import { Routes, Route } from "react-router-dom";

// Komponent va Sahifalarni import qilish
import Home from "./pages/Home";
import BottomNav from "./pages/BottomNav";
import About from "./pages/About";

const App = () => {
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      {/* Sahifalar almashadigan joy */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/market"
          element={<div className="p-4">Bozor sahifasi</div>}
        />
        <Route
          path="/sell"
          element={<div className="p-4">E'lon berish sahifasi</div>}
        />
        <Route
          path="/favorites"
          element={<div className="p-4">Saqlangan e'lonlar</div>}
        />
      </Routes>
      {/* Pastda qotib turuvchi menyu */}
      <BottomNav />
    </div>
  );
};

export default App;
