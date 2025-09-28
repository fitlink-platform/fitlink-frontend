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
    <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link to="/" className="text-xl md:text-2xl font-semibold tracking-wide text-white/80">
        F & Flower
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
        <Link to="/shop" className="hover:text-white">Shop</Link>
        <Link to="/about" className="hover:text-white">About</Link>
        <Link to="/contact" className="hover:text-white">Contact</Link>
        <Link to="/faq" className="hover:text-white">FAQ</Link>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <span
              className="font-semibold cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {/* {user.name == null ? 'Guest' : user.name} */}
              <FaUser className="cursor-pointer hover:text-[#22C55E]" />
            </span>

            {showDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg text-gray-700">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate('/customer/profile');
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
                    Orders
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Support</li>
                  <li onClick={handleClickLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <span className="cursor-pointer" onClick={() => { navigate('/login') }}>
            Login
          </span>

        )}
      </nav>
    </header>
  );
}
