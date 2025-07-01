import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const GOALS = [
  'Lose weight',
  'Maintain weight',
  'Gain weight',
  'Modify my diet',
];

export default function CreateAccountGoals() {
  const { user, updateUser, token } = useUser();
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Map goal text to backend value if needed
  const goalMap = {
    'Lose weight': 'lose_weight',
    'Maintain weight': 'maintain_weight',
    'Gain weight': 'gain_weight',
    'Modify my diet': 'modify_diet',
  };

  const handleNext = async () => {
    if (selected === null) {
      setError('Please select a goal.');
      return;
    }
    setError('');
    setLoading(true);
    const selectedGoal = goalMap[GOALS[selected]];
    try {
      // Save to backend if logged in
      if (user && token) {
        const res = await fetch('http://127.0.0.1:8000/api/users/update-step2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ _goal: selectedGoal }),
        });
        const data = await res.json();
        if (res.ok) {
          updateUser(data.user);
        } else {
          setError(data.error || 'Failed to save goal.');
          setLoading(false);
          return;
        }
      } else {
        // Save to local user context if not logged in
        updateUser({ _goal: selectedGoal });
      }
      navigate('/complete-profile/step2');
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded mb-6 relative">
          <div className="h-2 bg-blue-600 rounded" style={{ width: '12.5%' }}></div>
        </div>
        {/* Step text */}
        <div className="w-full text-left text-xs text-gray-500 mb-2">Step 1/8</div>
        {/* Greeting */}
        <div className="text-2xl font-bold text-center mb-2">
          Thanks{user && user._name ? ` ${user._name}` : ''}! Now for your goals.
        </div>
        <div className="text-center text-gray-600 mb-6">
          Select what important to you:
        </div>
        {/* Goal buttons */}
        <div className="w-full flex flex-col gap-4 items-center mb-4">
          {GOALS.map((goal, idx) => {
            const isSelected = selected === idx;
            return (
              <button
                key={goal}
                onClick={() => setSelected(idx)}
                className={`w-full py-3 rounded-lg border transition-all text-lg text-center
                  ${isSelected ? 'border-blue-600 text-blue-600 font-bold' : 'border-gray-400 text-black font-normal'}
                  hover:border-black hover:font-bold
                `}
                style={{ background: 'white' }}
              >
                {goal}
              </button>
            );
          })}
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          onClick={handleNext}
          disabled={loading}
          className="mt-2 w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
} 