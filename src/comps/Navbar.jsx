import React from "react";
import { NavLink } from "react-router-dom";
// logo
import brendLogo from "../assets/brendLogo.png";
// icons
import { MdMenuOpen } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-3.5 py-2.5 bg-white border-b  border-slate-200">
      {/* Logo */}
      <div className=" flex justify-center items-center gap-1.25 ">
        <div>
          <img className=" h-14.5" src={brendLogo} alt="" />
        </div>
      </div>
      {/* text */}
      <div className="">
        <p className=" text-center leading-3.5 text-[15px] font-bold ">
          Tekshirilgani, To'g'ri Tanlov <br />
          <span className=" text-[9px]">Ishinchliy Bozor</span>
        </p>
      </div>
      {/* links */}
      <div>
        <div>
          <MdMenuOpen size={25} color="" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
