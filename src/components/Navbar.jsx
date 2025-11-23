// src/components/Navbar.jsx
import React, { useEffect, useState, useRef, useContext } from 'react'
import { FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '~/contexts/AuthContext'
import { logout } from '~/services/authService'
import { toast } from 'react-toastify'
import NotificationBell from '~/components/notifications/NotificationBell' // 👈 THÊM

export default function Navbar() {
  const { user } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef()
  const navigate = useNavigate()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  const profileRef = useRef()

  // Đóng PROFILE khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClickLogout = async () => {
    try {
      await logout()
      toast.success('Logout Successful!')
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
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
          to="/programs"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          Programs
        </Link>
        <Link
          to="/list-pt"
          className="relative hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
        >
          Trainers
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
        <div className="relative flex items-center gap-3" ref={profileRef}>
          {/* 🔔 Chuông thông báo – controlled từ Navbar */}
          <NotificationBell
            isOpen={isNotifOpen}
            onOpen={() => {
              setIsNotifOpen(true)
              setIsProfileOpen(false) // 🔒 mở chuông thì đóng profile
            }}
            onClose={() => setIsNotifOpen(false)}
            variant="light"
          />

          {/* 👤 Avatar / toggle menu Profile */}
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev) // toggle profile
              setIsNotifOpen(false) // 🔒 mở profile thì đóng chuông
            }}
            className="flex items-center justify-center"
          >
            <FaUser className="cursor-pointer text-gray-800 hover:text-orange-500 transition" />
          </button>

          {/* Dropdown Profile */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-xl text-gray-700 z-[9999]">
              <ul className="py-1">
                 <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          navigate('/student/dashboard')
          setIsProfileOpen(false)
        }}
      >
        Dashboard
      </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/profile')
                    setIsProfileOpen(false)
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/my-packages')
                    setIsProfileOpen(false)
                  }}
                >
                  My Packages
                </li>

                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    navigate('/training-calendar')
                    setShowDropdown(false)
                  }}
                >
                  My Training Schedule
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(user?.role === 'pt' ? '/pt/chat' : '/chat')
                    setIsProfileOpen(false)
                  }}
                >
                  My Messages
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Support
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-medium"
                  onClick={() => {
                    setIsProfileOpen(false)
                    setIsNotifOpen(false)
                    handleClickLogout()
                  }}
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
  )
}
