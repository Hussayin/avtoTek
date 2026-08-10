import React, { useState } from "react";
import { LuHeart, LuMapPin, LuCalendar } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";

const CarCard = ({ car }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* 1. Rasm va Yurakcha (Like) qismi */}
      <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
        <img
          src="https://scontent.ftas3-1.fna.fbcdn.net/v/t39.30808-6/480612618_122206936952242809_6314057784638481459_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s960x960&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=0Voye02nszAQ7kNvwHYci0H&_nc_oc=AdoQQYRVJHeP9jYRpVMHeTKMxoJeLNLZ1txOB7yYlyGY6Ij6QUdmao2WDnqYQx26cEo&_nc_zt=23&_nc_ht=scontent.ftas3-1.fna&_nc_gid=JJw13HZ9OTKUpjrt0Ls8MQ&_nc_ss=7b289&oh=00_AQFImER7xxwjWa7JHSHnnT5ck1GoKXyWvsKK0CQIHMejDg&oe=6A800C46"
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Yurakcha tugmasi */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white active:scale-90 transition-all shadow-sm"
        >
          {isLiked ? (
            <FaHeart className="text-rose-550 text-base" />
          ) : (
            <LuHeart className="text-base text-slate-700" />
          )}
        </button>
      </div>

      {/* 2. Ma'lumotlar qismi */}
      <div className="p-2 leading-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Moshina Nomi */}
          <h3 className="font-bold text-[14px] text-slate-900 text-base leading-snug line-clamp-1 mb-0.5">
            {car.name}
          </h3>

          {/* Narxi */}
          <div className="text-blue-600 font-extrabold text-lg text-[17px] mb-0.5">
            ${car.price.toLocaleString()}
          </div>

          {/* Yili va Probegi */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
            <span>{car.year}-yil</span>
            <span>•</span>
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
        </div>

        {/* 3. Viloyat va E'lon qo'yilgan sana (Pastki qism) */}
        <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1 truncate max-w-[55%]">
            <LuMapPin className="text-slate-400 shrink-0" />
            <span className="truncate">{car.location}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <LuCalendar className="text-slate-400" />
            <span>{car.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
