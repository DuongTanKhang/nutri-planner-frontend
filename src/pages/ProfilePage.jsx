import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import EditProfileModal from '../components/EditProfileModal';
import { AnimatePresence } from 'framer-motion';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully');
      setUser((prev) => ({
        ...prev,
        ...res.data.data,
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, unit = '') => (value ? `${value} ${unit}` : '--');

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN'); // dd/mm/yyyy
  };

  const formatActivityLevel = (level) => {
    switch (level) {
      case 'sedentary': return 'Sedentary (little or no exercise)';
      case 'light': return 'Lightly active (1-3 days/week)';
      case 'moderate': return 'Moderately active (3-5 days/week)';
      case 'active': return 'Very active (6-7 days/week)';
      case 'super': return 'Super active (twice/day or physical job)';
      default: return level || '--';
    }
  };

  const avatarUrl = user?._avatar
    ? user._avatar.startsWith('http')
      ? user._avatar
      : `${import.meta.env.VITE_API_BASE_URL}/${user._avatar.replace(/^\/+/, '')}`
    : '/images/default-avatar.png';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl shadow-lg space-y-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-6">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover shadow-md cursor-pointer"
            onClick={() => setShowImage(true)}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?._full_name || '--'}</h2>
            <p className="text-sm text-gray-500">{user?._email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {[
            ['Username', user?._username],
            ['Date of Birth', formatDate(user?._dob)],
            ['Weight', formatValue(user?._weight_kg, 'kg')],
            ['Height', formatValue(user?._height_cm, 'cm')],
            ['Goal', user?.goal_name],
            ['Diet Type', user?.diet_type],
            ['Activity Level', formatActivityLevel(user?._activity_level)],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-base font-medium text-gray-800">{value || '--'}</p>
            </div>
          ))}
        </div>

        {/* Allergens */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Allergens</p>
          {user?.allergens?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.allergens.map((a) => (
                <span
                  key={a._id ?? a.id}
                  className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full"
                >
                  {a._name || a.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No allergens</p>
          )}
        </div>

        {/* Edit Button */}
        <div className="text-right">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={user}
            onSave={handleSave}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Avatar Zoom Modal */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowImage(false)}
        >
          <img
            src={avatarUrl}
            alt="Zoomed Avatar"
            className="max-w-[90%] max-h-[90%] rounded-xl border-4 border-white shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
