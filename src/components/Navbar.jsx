import React, { useEffect, useState, useRef, useContext } from 'react';
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "~/contexts/AuthContext";
import { logout } from '~/services/authService';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickLogout = async () => {
    try {
      await logout()
      toast.success("Logout Successful!")
      navigate('/login')

    } catch (error) {
      console.error('Logout failed:', error); // xử lý lỗi cụ thể
      throw error;
    }
  }

  return (
    <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between bg-white backdrop-blur-md shadow-xl sticky top-0 z-50 rounded-[10px]">
      {/* LOGO */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-700"
      >
        FitLink<span className="text-gray-900">.</span>
      </Link>

      {/* NAVIGATION */}
      <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-800">
        <Link
          to="/home"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          Home
        </Link>
        <Link
          to="/services"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          Programs
        </Link>
        <Link
          to="/pricing"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          Pricing
        </Link>
        <Link
          to="/about"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          Contact
        </Link>
      </nav>

      {/* USER / LOGIN */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <FaUser
            className="cursor-pointer text-gray-800 hover:text-orange-500 transition"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-xl text-gray-700 overflow-hidden">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/customer/orders');
                    setShowDropdown(false);
                  }}
                >
                  My Packages
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Support</li>
                <li
                  onClick={handleClickLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-medium"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="ml-4 px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-md"
        >
          Join Now
        </button>
      )}
    </header>

  );
}
