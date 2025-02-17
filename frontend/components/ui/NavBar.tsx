import React from "react";
import Image from "next/image"; 

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-light blue-600 to-dark blue-300 shadow-lg">
      {/* logo */}
      <div className="flex items-center">
        <Image
          src="/workday-logo.png" //logo is in public folder
          alt="Workday Logo"
          width={170} 
          height={50} 
          className="object-contain"
        />
      </div>

      {/* links (not doing anything yet) */}
      <ul className="flex space-x-8 text-white font-semibold text-lg">
        <li>
          <a href="/" className="hover:text-orange-400 transition-all">
            Home
          </a>
        </li>
        <li>
          <a href="#about" className="hover:text-orange-400 transition-all">
            About Us
          </a>
        </li>
        <li>
          <a href="#services" className="hover:text-orange-400 transition-all">
            Services
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

