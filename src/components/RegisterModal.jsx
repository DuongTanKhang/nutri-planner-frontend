import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Ngăn gửi nếu đang xử lý
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _name: form.fullName,
          _username: form.username,
          _email: form.email,
          _password: form.password,
          _confirm_password: form.confirmPassword,
          _gender:
            form.gender === 'male' ? 1 : form.gender === 'female' ? 2 : 3,
        }),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('JSON parse error:', err);
        setErrors({ general: 'Server sent invalid JSON response.' });
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        const newErrors = {};
        if (data.errors) {
          if (data.errors._name) newErrors.fullName = data.errors._name[0];
          if (data.errors._username) newErrors.username = data.errors._username[0];
          if (data.errors._email) newErrors.email = data.errors._email[0];
          if (data.errors._password) newErrors.password = data.errors._password[0];
          if (data.errors._confirm_password) newErrors.confirmPassword = data.errors._confirm_password[0];
          if (data.errors._gender) newErrors.gender = data.errors._gender[0];
        } else {
          newErrors.general = data.message || 'Registration failed';
        }
        setErrors(newErrors);
        setIsSubmitting(false);
      } else {
        setSuccessMessage('🎉 Registration successful! Please login.');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
          onSwitchToLogin();
        }, 1500);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrors({ general: 'Network error. Please try again later.' });
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-8 relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-2xl"
              disabled={isSubmitting} // Ngăn đóng khi đang xử lý
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Registration</h2>

            {errors.general && (
              <div className="text-red-500 mb-4 text-sm">{errors.general}</div>
            )}
            {successMessage && (
              <div className="text-green-600 mb-4 text-sm">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-gray-600 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-600 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="mt-6">
                <label className="block text-gray-700 mb-2 font-medium">Gender</label>
                <div className="flex gap-6">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="accent-purple-500"
                      />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting} // Vô hiệu hóa khi đang gửi
                className={`w-full mt-8 py-2 rounded font-semibold transition text-white ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-90'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-700">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-700 hover:underline font-medium"
              >
                LOGIN
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
