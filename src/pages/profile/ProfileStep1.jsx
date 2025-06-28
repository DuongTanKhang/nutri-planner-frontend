import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';


const ProfileStep1 = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useUser();

  const [form, setForm] = useState({
    _dob: '',
    _height_cm: '',
    _weight_kg: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        _dob: user._dob || '',
        _height_cm: user._height_cm || '',
        _weight_kg: user._weight_kg || ''
      });
    }
  }, [location.key, user]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form._dob) newErrors._dob = 'Please enter your birth date.';
    if (!form._height_cm) newErrors._height_cm = 'Please enter your height.';
    if (!form._weight_kg) newErrors._weight_kg = 'Please enter your weight.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/update-step1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        navigate('/complete-profile/step2', { state: { manualNavigation: true } });
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

  return (
    <div className="max-w-xl mx-auto mt-16 p-10 rounded-3xl bg-white shadow-md border border-gray-200 text-gray-900">
      <h2 className="text-2xl font-semibold text-center mb-8">Step 1 of 3: Basic Info</h2>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* DOB */}
        <div>
          <label htmlFor="_dob" className="block mb-1 text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="_dob"
            id="_dob"
            value={form._dob}
            onChange={handleChange}
            className={`w-full px-4 py-2 border text-sm rounded-md bg-white ${errors._dob ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors._dob && <p className="text-red-500 text-sm mt-1">{errors._dob}</p>}
        </div>

        {/* Height */}
        <div>
          <label htmlFor="_height_cm" className="block mb-1 text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            name="_height_cm"
            id="_height_cm"
            value={form._height_cm}
            onChange={handleChange}
            className={`w-full px-4 py-2 border text-sm rounded-md bg-white ${errors._height_cm ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors._height_cm && <p className="text-red-500 text-sm mt-1">{errors._height_cm}</p>}
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="_weight_kg" className="block mb-1 text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            name="_weight_kg"
            id="_weight_kg"
            value={form._weight_kg}
            onChange={handleChange}
            className={`w-full px-4 py-2 border text-sm rounded-md bg-white ${errors._weight_kg ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors._weight_kg && <p className="text-red-500 text-sm mt-1">{errors._weight_kg}</p>}
        </div>

        <div className="flex justify-end pt-4">
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

export default ProfileStep1;
