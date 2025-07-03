import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section
      className="w-full flex justify-center items-center py-24 px-4"
      style={{
        background: 'linear-gradient(90deg, #c288fc 0%, #0060e0 100%)',
        minHeight: '500px',
      }}
    >
      <div
        className="flex w-full max-w-[1100px] justify-between items-center"
      >
        {/* Content */}
        <div style={{ width: 700 }} className="flex flex-col justify-center">
          <div
            style={{
              fontSize: 16,
              color: '#D8D8DC',
              fontWeight: 600,
              marginBottom: 8,
              lineHeight: '24px',
            }}
          >
            Your Personal nutrition tracking web
          </div>
          <div
            style={{
              fontSize: 68,
              lineHeight: '80px',
              color: '#D8D8DC',
              fontWeight: 700,
            }}
          >
            Nutrition tracking
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 68,
                lineHeight: '80px',
                color: '#D8D8DC',
                fontWeight: 700,
              }}
            >
              for
            </span>
            <span
              style={{
                marginLeft: 12,
                background: '#D8D8DC',
                padding: '0 16px',
                borderRadius: 8,
                height: 80,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 68,
                  lineHeight: '80px',
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #c288fc 0%, #0060e0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                real life
              </span>
            </span>
          </div>
          <div
            style={{
              marginTop: 20,
              marginBottom: 28,
              color: '#D8D8DC',
              fontSize: 20,
            }}
          >
            Make progress with the all-in-one food, exercise, and calorie tracker.
          </div>
          <button
            style={{
              border: '2px solid #fff',
              borderRadius: 30,
              width: 210,
              padding: '12px 18px',
              backgroundColor: 'white',
              color: 'transparent',
              fontWeight: 1000,
              fontSize: 25,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => {
              const el = document.getElementById('meal-by-category');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span style={{ background: 'linear-gradient(90deg, #c288fc 0%, #0060e0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start Today &gt;</span>
          </button>
        </div>
        {/* Image */}
        <div className="flex-1 flex justify-center items-center">
          <a href="/" className="flex items-center">
            <img
              src="src\picture\about-1.PNG"
              alt="web picture"
              className="h-300 w-400 "
            />
          </a>
        </div>
      </div>
    </section>
  );
} 