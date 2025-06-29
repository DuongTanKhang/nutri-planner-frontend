import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EditProfileModal = ({ isOpen, onClose, user, onSave, loading = false }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    _full_name: '',
    _dob: '',
    _weight_kg: '',
    _height_cm: '',
  });
  const [preview, setPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        _full_name: user._full_name || '',
        _dob: user._dob || '',
        _weight_kg: user._weight_kg || '',
        _height_cm: user._height_cm || ''
      });

      // Xử lý avatar url có base nếu cần
      const avatarUrl = user._avatar
        ? (user._avatar.startsWith('http')
            ? user._avatar
            : `${import.meta.env.VITE_API_BASE_URL}/${user._avatar.replace(/^\/+/, '')}`)
        : '/images/default-avatar.png';

      setPreview(avatarUrl);
      setAvatarFile(null); // reset file khi mở modal mới
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (avatarFile) {
      data.append('_avatar', avatarFile);
    }
    await onSave(data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-purple-700 mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-400 shadow cursor-pointer"
                  onClick={handleImageClick}
                />
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="mt-2 text-sm text-purple-600 hover:underline"
                >
                  Change avatar
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <input
                type="text"
                name="_full_name"
                placeholder="Full Name"
                value={formData._full_name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                name="_dob"
                value={formData._dob}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                name="_weight_kg"
                placeholder="Weight (kg)"
                value={formData._weight_kg}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min="10"
                max="300"
                required
              />
              <input
                type="number"
                name="_height_cm"
                placeholder="Height (cm)"
                value={formData._height_cm}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min="50"
                max="300"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
