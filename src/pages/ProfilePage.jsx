import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import {
  Pencil, Mail, User, Calendar, Ruler, Weight, Target, Utensils, AlertCircle
} from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

const IconInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-gray-700">
    <Icon size={20} className="text-purple-500" />
    <span><strong>{label}:</strong> {value || '--'}</span>
  </div>
);

const ProfilePage = () => {
  const { user } = useUser();
  console.log('User goal & diet:', user?._goal, '->', user?.goal_name);
  console.log('User diet_type:', user?._diet_type_id, '->', user?.diet_type);
  console.log('User data in profile:', user);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        You need to log in to view your profile.
      </div>
    );
  }
  console.log('user from context:', user);
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      {/* Avatar + Name */}
      <div className="flex items-center space-x-6">
        {user._avatar ? (
          <img
            src={user._avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-purple-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-purple-300">
            {(user._full_name || user._username || 'U')?.charAt(0).toUpperCase()}
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

      {/* Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <IconInfo icon={User} label="Username" value={user._username} />
        <IconInfo icon={Calendar} label="Date of Birth" value={user._dob?.slice(0, 10)} />
        <IconInfo icon={Weight} label="Weight" value={user._weight_kg + ' kg'} />
        <IconInfo icon={Ruler} label="Height" value={user._height_cm + ' cm'} />
        <IconInfo icon={Target} label="Goal" value={user.goal_name} />
        <IconInfo icon={Utensils} label="Diet Type" value={user.diet_type} />
      </div>

      {/* Allergens */}
      <div className="mt-6 text-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} className="text-purple-500" />
          <span className="font-semibold">Allergens:</span>
        </div>
        {user.allergens?.length > 0 ? (
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

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
