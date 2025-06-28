import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';


const ProfileStep3 = ({ token }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [allergens, setAllergens] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/allergens')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data || [];
        setAllergens(list);
      });
  }, []);

  useEffect(() => {
    if (user?.allergens?.length > 0) {
      setSelectedIds(user.allergens.map(a => a._id));
    }
  }, [user]);

  const allergenOptions = allergens.map(a => ({
    value: a._id,
    label: a._name,
  }));

  const selectedOptions = allergenOptions.filter(opt => selectedIds.includes(opt.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitAllergens();
  };

  const submitAllergens = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/update-step3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ _allergen_ids: selectedIds })
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert(res.status === 401
          ? ' Token expired or invalid. Please log in again.'
          : ' Server returned an invalid response.');
        return;
      }

      if (res.ok) {
        const selectedAllergens = allergens.filter(a => selectedIds.includes(a._id));
        updateUser({ allergens: selectedAllergens });
        navigate('/');
      } else {
        alert(data.error || 'Update failed.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-10 rounded-3xl bg-white shadow-md border border-gray-200 text-gray-900">
      <h2 className="text-2xl font-semibold text-center mb-8">Step 3 of 3: Allergens</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Select Allergens</label>
          <Select
            isMulti
            options={allergenOptions}
            value={selectedOptions}
            onChange={(selected) => setSelectedIds(selected.map(opt => opt.value))}
            placeholder="e.g. Milk, Peanuts..."
          />
        </div>
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate('/complete-profile/step2')}
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
            {loading ? 'Saving...' : 'Finish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileStep3;
