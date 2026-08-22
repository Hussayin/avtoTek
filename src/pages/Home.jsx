import React, { useState } from "react";
import Navbar from "../comps/Navbar";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";
import CarCard from "./CarCard";
import SearchModal from "./SearchModal";
import FilterModal from "./FilterModal";
import { LuRefreshCw } from "react-icons/lu";
import { useCars } from "./UseCars";

function parseListingDate(dateStr) {
  if (!dateStr) return null;
  const lowerStr = dateStr.toString().trim().toLowerCase();

  if (lowerStr === "bugun") return new Date();
  if (lowerStr === "kecha") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }

  const parts = lowerStr.split(".");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map((p) => parseInt(p, 10));
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
}

function isTodayOrYesterday(dateStr) {
  const listingDate = parseListingDate(dateStr);
  if (!listingDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  listingDate.setHours(0, 0, 0, 0);

  return (
    listingDate.getTime() === today.getTime() ||
    listingDate.getTime() === yesterday.getTime()
  );
}

const Home = () => {
  const { cars, loading, refreshing, refresh } = useCars();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dailyCars = cars.filter((car) => isTodayOrYesterday(car.date));

  return (
    <div>
      <Navbar />
      <MenuBar />

      <SearchBar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      <div className="px-3 mt-2 pb-20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-slate-900">Kun takliflari</h2>
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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-64 bg-slate-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : dailyCars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {dailyCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            Bugun va kecha uchun e'lonlar topilmadi.
          </div>
        )}
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cars={cars}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        cars={cars}
      />
    </div>
  );
};

export default Home;
