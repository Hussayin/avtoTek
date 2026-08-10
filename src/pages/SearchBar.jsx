import React from "react";
import { LuSearch, LuSlidersHorizontal } from "react-icons/lu";

const SearchBar = () => {
  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center bg-white rounded-full border border-slate-200/80 shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        {/* Qidiruv input qismi */}
        <div className="flex items-center flex-1 pl-4 pr-2 py-2.5">
          <LuSearch className="text-xl text-slate-700 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Avtomobil topish"
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Vertikal ajratgich chizig'i va Filter tugmasi */}
        <button
          type="button"
          className="flex items-center justify-center px-4 py-2.5 border-l border-slate-200 text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <LuSlidersHorizontal className="text-xl text-slate-800" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
