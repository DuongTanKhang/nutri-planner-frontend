import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EditProfileModal = ({ isOpen, onClose, user, onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    _full_name: '',
    _dob: '',
    _weight_kg: '',
    _height_cm: ''
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        _full_name: user._full_name || '',
        _dob: user._dob || '',
        _weight_kg: user._weight_kg || '',
        _height_cm: user._height_cm || ''
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
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
                  className={`px-4 py-2 rounded text-white ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
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
