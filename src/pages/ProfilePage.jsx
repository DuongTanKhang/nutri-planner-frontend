import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import EditProfileModal from '../components/EditProfileModal';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.put('/user/profile', formData);
      toast.success('Profile updated successfully');
      setUser(res.data.data);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, unit = '') => (value ? `${value} ${unit}` : '--');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-purple-100 shadow-xl rounded-xl p-6 max-w-3xl mx-auto space-y-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-5">
          <img
            src={user?._avatar || '/images/default-avatar.png'}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user?._full_name || '--'}</h2>
            <p className="text-sm text-gray-600">{user?._email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-5 text-sm">
          <div>
            <span className="text-gray-500">Username</span>
            <p className="font-medium">{user?._username || '--'}</p>
          </div>
          <div>
            <span className="text-gray-500">Date of Birth</span>
            <p className="font-medium">{user?._dob || '--'}</p>
          </div>
          <div>
            <span className="text-gray-500">Weight</span>
            <p className="font-medium">{formatValue(user?._weight_kg, 'kg')}</p>
          </div>
          <div>
            <span className="text-gray-500">Height</span>
            <p className="font-medium">{formatValue(user?._height_cm, 'cm')}</p>
          </div>
          <div>
            <span className="text-gray-500">Goal</span>
            <p className="font-medium">{user?.goal_name || '--'}</p>
          </div>
          <div>
            <span className="text-gray-500">Diet Type</span>
            <p className="font-medium">{user?.diet_type || '--'}</p>
          </div>
        </div>

        {/* Allergens */}
        <div>
          <span className="text-gray-500 text-sm">Allergens</span>
          <ul className="list-disc list-inside mt-1 text-sm text-red-600">
            {user?.allergens && user.allergens.length > 0 ? (
              user.allergens.map((a) => (
                <li key={a._id || a.id}>{a._name || a.name}</li>
              ))
            ) : (
              <li className="text-gray-400">No allergens</li>
            )}
          </ul>
        </div>

        {/* Edit Button */}
        <div className="text-right">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
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
    </div>
  );
};

export default ProfilePage;
