import React, { useState, useEffect } from 'react';
import MealByCategory from '../components/MealByCategory';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import FeedbackSidebar from '../components/FeedbackSidebar';

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
    <div className="min-h-screen font-sans text-gray-800 bg-[linear-gradient(90deg,_#c288fc_0%,_#0060e0_100%)]">
      <HeroSection />
      <div id="meal-by-category">
        <MealByCategory />
      </div>

      <FeedbackSidebar />
      <div id="footer">
        <Footer />
      </div>

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
