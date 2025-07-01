import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const ProfileStep2 = ({ token }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [form, setForm] = useState({
    _goal: '',
    _diet_type_id: '',
    _activity_level: '',
  });
  const [dietTypes, setDietTypes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        _goal: user._goal || '',
        _diet_type_id: user._diet_type_id || '',
        _activity_level: user._activity_level || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/goal-diet-recommendations');
        const data = await res.json();
        setRecommendations(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (!recommendations.length || !form._goal) return;

    const filtered = recommendations.filter(rec => rec._goal_id === form._goal);
    const diets = filtered.map(rec => ({
      _id: rec._diet_type_id,
      name: rec.diet_type_name
    }));
    setDietTypes(diets);

    const hasCurrent = diets.some(d => d._id === form._diet_type_id);
    if (!hasCurrent && form._diet_type_id) {
      const found = recommendations.find(
        rec => rec._diet_type_id === form._diet_type_id
      );
      if (found) {
        setDietTypes(prev => [
          ...prev,
          {
            _id: found._diet_type_id,
            name: found.diet_type_name
          }
        ]);
      }
    }
  }, [form._goal, form._diet_type_id, recommendations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === '_goal' ? { _diet_type_id: '' } : {})
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form._goal) newErrors._goal = 'Please select your goal.';
    if (!form._diet_type_id) newErrors._diet_type_id = 'Please select a diet type.';
    if (!form._activity_level) newErrors._activity_level = 'Please select activity level.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/update-step2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert('Invalid server response.');
        return;
      }

      if (res.ok) {
        updateUser(data.user);
        navigate('/complete-profile/step3', { state: { manualNavigation: true } });
      } else if (data.errors) {
        const serverErrors = {};
        for (const key in data.errors) {
          serverErrors[key] = data.errors[key].join(' ');
        }
        setErrors(serverErrors);
      } else {
        alert(data.error || 'Update failed.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const uniqueGoals = Array.from(
    new Map(recommendations.map(r => [r._goal_id, r.goal_name]))
  );

  return (
    <div className="max-w-xl mx-auto mt-16 p-10 rounded-3xl bg-white shadow-md border border-gray-200 text-gray-900">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Step 2 of 3: Goal, Diet & Activity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Goal */}
        <div>
          <label htmlFor="_goal" className="block mb-1 text-sm font-medium text-gray-700">
            Your Goal
          </label>
          <select
            name="_goal"
            id="_goal"
            value={form._goal}
            onChange={handleChange}
            className={`w-full px-4 py-2 border text-sm rounded-md bg-white ${errors._goal ? 'border-red-400' : 'border-gray-300'}`}
          >
            <option value="">Select a goal</option>
            {uniqueGoals.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          {errors._goal && <p className="text-red-500 text-sm mt-1">{errors._goal}</p>}
        </div>

        {/* Diet Type */}
        <div>
          <label htmlFor="_diet_type_id" className="block mb-1 text-sm font-medium text-gray-700">
            Diet Type
          </label>
          <select
            name="_diet_type_id"
            id="_diet_type_id"
            value={form._diet_type_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border text-sm rounded-md bg-white ${errors._diet_type_id ? 'border-red-400' : 'border-gray-300'}`}
          >
            <option value="">Select diet type</option>
            {dietTypes.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          {errors._diet_type_id && <p className="text-red-500 text-sm mt-1">{errors._diet_type_id}</p>}
        </div>

        {/* Activity Level */}
        <div>
          <label htmlFor="_activity_level" className="block mb-1 text-sm font-medium text-gray-700">
            Activity Level
          </label>
          <select
            name="_activity_level"
            id="_activity_level"
            value={form._activity_level}
            onChange={handleChange}
            className={`w-full px-4 py-2 border text-sm rounded-md bg-white ${errors._activity_level ? 'border-red-400' : 'border-gray-300'}`}
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly active (1-3 days/week)</option>
            <option value="moderate">Moderately active (3-5 days/week)</option>
            <option value="active">Very active (6-7 days/week)</option>
            <option value="super">Super active (twice/day or physical job)</option>
          </select>
          {errors._activity_level && <p className="text-red-500 text-sm mt-1">{errors._activity_level}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate('/complete-profile/step1', { state: { manualNavigation: true } })}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileStep2;
