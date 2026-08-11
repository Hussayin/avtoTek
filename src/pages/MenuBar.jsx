import React from "react";
import { Link } from "react-router-dom";
import { LuCar, LuPlus, LuGavel, LuCalculator } from "react-icons/lu";
import { LiaCalculatorSolid } from "react-icons/lia";

const MenuBar = () => {
  // Menyu elementlari ro'yxati
  const menuItems = [
    {
      id: 1,
      title: "Sotib olish",
      icon: LuCar,
      path: "/buy",
      bgColor: "bg-slate-100",
      iconColor: "text-slate-800",
    },
    {
      id: 2,
      title: "Tez sotish",
      icon: LuPlus,
      path: "/sell",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Auksion",
      icon: LuGavel,
      path: "/auction",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      id: 4,
      title: "Muddatliy to'lov",
      images:
        "https://media.istockphoto.com/id/1364094307/vector/halal-vector-symbol-package-sticker-for-food-or-product-isolated-on-white.jpg?s=612x612&w=0&k=20&c=rnnHkTgNFJjcx2oKrM3XjWPRf-alil0D6Ev59BLAARA=",
      icon: LuCalculator,
      path: "/valuation",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      highte: "h-[30px]",
      display: "display-hide",
    },
  ];

  return (
    <div className="w-full px-4 py-3">
      {/* 
        grid-cols-2  -> Mobil qurilmalarda 2 tadan 2 qator
        md:grid-cols-4 -> Planshet va kompyuterda 1 qator
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {menuItems.map((item) => {
          // const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex  flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 group"
            >
              {/* Ikonka orqa foni va o'zi */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2.5 ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}
              >
                <img src={item.images} alt="" />
                <item.icon
                  className={`text-2xl ${item.iconColor} ${item.display}`}
                />
              </div>

              {/* Sarlavha */}
              <span className="text-sm font-semibold leading-3 text-slate-800 text-center">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBar;
