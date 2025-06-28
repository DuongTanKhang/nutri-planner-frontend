import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import {
  Pencil, Mail, User, Calendar, Ruler, Weight, Target, Utensils, AlertCircle
} from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

const ProfilePage = () => {
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        You need to log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center space-x-6">
        {user._avatar ? (
          <img
            src={user._avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-purple-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-purple-300">
            {user._full_name?.charAt(0).toUpperCase() || user._username?.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-purple-700">
            {user._full_name || user._username}
          </h2>
          <p className="text-gray-500 flex items-center gap-2">
            <Mail size={16} /> {user._email}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3 text-gray-700">
          <User size={20} className="text-purple-500" />
          <span><strong>Username:</strong> {user._username}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar size={20} className="text-purple-500" />
          <span><strong>Date of Birth:</strong> {user._dob || 'Not provided'}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Weight size={20} className="text-purple-500" />
          <span><strong>Weight:</strong> {user._weight_kg || '--'} kg</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Ruler size={20} className="text-purple-500" />
          <span><strong>Height:</strong> {user._height_cm || '--'} cm</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Target size={20} className="text-purple-500" />
          <span><strong>Goal:</strong> {user.goal || '--'}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Utensils size={20} className="text-purple-500" />
          <span><strong>Diet Type:</strong> {user.diet_type || '--'}</span>
        </div>
      </div>

      {/* Allergen list */}
      <div className="mt-6 text-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} className="text-purple-500" />
          <span className="font-semibold">Allergens:</span>
        </div>
        {user.allergens && user.allergens.length > 0 ? (
          <ul className="list-disc list-inside ml-6 space-y-1">
            {user.allergens.map((a) => (
              <li key={a._id}>{a._name}</li>
            ))}
          </ul>
        ) : (
          <p className="ml-6 text-sm text-gray-500">No allergens specified.</p>
        )}
      </div>

      {/* Edit Button */}
      <div className="mt-8 text-right">
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
        >
          <Pencil size={18} /> Edit Profile
        </button>
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={(formData) => {
          console.log('Updated data:', formData);
          setShowEditModal(false);
        }}
      />
    </div>
  );
};

export default ProfilePage;
