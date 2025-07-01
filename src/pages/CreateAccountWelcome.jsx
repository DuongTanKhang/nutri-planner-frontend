import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../components/RegisterModal';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';

export default function CreateAccountWelcome() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>
          welcome to
        </div>
        <div style={{ fontSize: 25, color: '#0060e0', fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Nutri_planner
        </div>
        <div className="w-full bg-gray-100 rounded-xl flex flex-row justify-between items-center p-6 mb-8" style={{ minHeight: 100 }}>
          <div style={{ fontSize: 20, fontWeight: 500, textAlign: 'left', color: '#222' }}>
            Ready for some wins? <br />Start tracking, it's easy!
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, textAlign: 'right', color: '#222' }}>
            And make mindful eating <br />a habit for life
          </div>
        </div>
        <button
          onClick={() => {
            if (user) {
              navigate('/account/create/goals');
            } else {
              setShowRegister(true);
            }
          }}
          style={{
            fontWeight: 1000,
            fontSize: 20,
            background: 'linear-gradient(90deg, #c288fc 0%, #0060e0 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 30,
            padding: '12px 48px',
            cursor: 'pointer',
            marginTop: 16,
            marginBottom: 8,
            display: 'block',
            textAlign: 'center',
          }}
        >
          Continue
        </button>
        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      </div>
    </div>
  );
} 