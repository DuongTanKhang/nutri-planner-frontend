import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Star } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to scroll to section by id
  const scrollToSection = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Delay to ensure DOM is ready
  };

  const handleNavFoods = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection('meal-by-category');
    } else {
      navigate('/', { replace: false });
      setTimeout(() => scrollToSection('meal-by-category'), 300);
    }
  };

  const handleNavContact = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection('footer');
    } else {
      navigate('/', { replace: false });
      setTimeout(() => scrollToSection('footer'), 300);
    }
  };

  const openLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    logout();
    setShowConfirmLogout(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="bg-[linear-gradient(90deg,_#c288fc_0%,_#0060e0_100%)] shadow-md py-4 px-6 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
            Nutri-Planner
          </div>

          <ul className="flex space-x-6 text-white font-medium">
            <li><a href="/">Home</a></li>
            {/* <li><a href="/meals">Meals</a></li> */}
            <li><a href="/foods" onClick={handleNavFoods}>Foods</a></li>
            <li><a href="/nutrition">Nutrition</a></li>
            <li><a href="/contact" onClick={handleNavContact}>Contact</a></li>
          </ul>

          {user ? (
            <div className="relative">
              <div
                onClick={toggleDropdown}
                className="cursor-pointer flex items-center gap-2"
              >
                {user._avatar ? (
                  <img
                    src={
                      user._avatar.startsWith('http')
                        ? user._avatar
                        : `${import.meta.env.VITE_API_BASE_URL}/${user._avatar.replace(/^\/+/, '')}`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold ring-2 ring-purple-400">
                    {user._full_name?.charAt(0).toUpperCase() || user._username?.charAt(0).toUpperCase()}
                  </div>
                )}

              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
                  >
                    <div className="p-3 border-b text-gray-700 font-semibold">
                      {user._full_name || user._username}
                    </div>
                    <ul className="text-gray-600">
                      <li
                        className="flex items-center px-4 py-2 hover:bg-purple-100 cursor-pointer"
                        onClick={() => {
                          navigate('/profile');
                          setDropdownOpen(false);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" /> Profile
                      </li>
                      <li
                        className="flex items-center px-4 py-2 hover:bg-yellow-100 cursor-pointer text-yellow-600"
                        onClick={() => {
                          navigate('/favorites');
                          setDropdownOpen(false);
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" /> Favorites
                      </li>
                      <li
                        className="flex items-center px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600"
                        onClick={handleLogoutClick}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="text-purple-600 hover:text-purple-900 transition duration-200"
            >
              <User className="w-6 h-6" />
            </button>
          )}
        </div>
      </nav>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={openLogin}
      />
      <ConfirmLogoutModal
        isOpen={showConfirmLogout}
        onCancel={() => setShowConfirmLogout(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default Navbar;
