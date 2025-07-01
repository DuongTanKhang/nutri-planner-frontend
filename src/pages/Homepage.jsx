import React, { useState, useEffect } from 'react';
import MealByCategory from '../components/MealByCategory';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

export default function Homepage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-purple-50 font-sans text-gray-800">
      <HeroSection />
      <MealByCategory />

      

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact</h3>
              <div className="space-y-3">
                <p><strong>Health Coach/Support Email:</strong> support@nutriplanner.com</p>
                <p><strong>Phone:</strong> (+84) 0836622500</p>
                <p><strong>Physical Center Address:</strong> 123 LÊ THỊ RIÊNG, 12 District, HCMC</p>
              </div>
              {/* <div className="flex space-x-4 mt-6">
                <img src="/logo/fb.PNG" alt="Facebook" className="h-8 w-8" />
                <img src="/logo/zalo.PNG" alt="Zalo" className="h-8 w-8" />
              </div> */}
            </div>

            {/* Google Map Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Location</h3>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890123!2d106.6297!3d10.8231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzIzLjEiTiAxMDbCsDM3JzQ2LjkiRQ!5e0!3m2!1sen!2s!4v1234567890123"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NutriPlanner Physical Center Location"
                ></iframe>
              </div>
            </div>

            {/* Privacy Policy Section */}
            <div className="text-right">
              <h3 className="text-2xl font-bold mb-6">Privacy Policy</h3>
              <div className="space-y-3 text-right">
                <Link to="/terms-of-use" className="block hover:underline">Terms of Use</Link>
                <Link to="/privacy-policy" className="block hover:underline">Privacy Policy</Link>
                <Link to="/cookie-policy" className="block hover:underline">Cookie Policy</Link>
                <Link to="/privacy-rights" className="block hover:underline">Privacy Rights</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-purple-700 mt-8 pt-8 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} NutriPlanner. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-purple-500 via-pink-400 to-purple-700 text-white p-5 rounded-full shadow-2xl hover:scale-110 hover:shadow-purple-400 transition-all duration-300 z-50 animate-bounce group"
          aria-label="Back to top"
          tabIndex={0}
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 text-xs text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none select-none whitespace-nowrap">
            Back to top
          </span>
          <svg
            className="w-8 h-8 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
