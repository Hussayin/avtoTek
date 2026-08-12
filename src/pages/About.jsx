import React from "react";
import { NavLink } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const About = () => {
  return (
    <div>
      {/* navbar */}
      <div>
        <div className="flex justify-between items-center bg-white border-b border-slate-200 sticky top-0 z-40">
          <NavLink
            to="/"
            className="flex justify-center font-bold py-3 items-center w-25"
          >
            <IoIosArrowBack size={30} />
            Orqaga
          </NavLink>
        </div>
      </div>
      {/* menu text */}
      <div>
        {/* funder */}
        <div></div>
        {/* investor */}
        <div></div>
        {/* about us */}
        <div></div>
      </div>
    </div>
  );
};

export default About;
