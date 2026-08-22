import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const SearchBar = ({ onOpenSearch, onOpenFilter }) => {
  return (
    <div className="flex items-center gap-2 px-3 my-2">
      <div
        onClick={onOpenSearch}
        className="relative flex-1 bg-slate-100 rounded-xl pl-10 pr-4 py-2.5 flex items-center cursor-pointer hover:bg-slate-200/70 transition-all"
      >
        <FiSearch className="absolute left-3 text-slate-400 text-lg" />
        <span className="text-sm text-slate-400 select-none">
          Avtomobil, ID yoki VIN topish...
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenFilter}
        className="p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
      >
        <FiSliders className="text-lg" />
      </button>
    </div>
  );
};

export default SearchBar;
