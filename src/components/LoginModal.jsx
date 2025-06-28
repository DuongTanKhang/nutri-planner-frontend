import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Facebook, Twitter, Mail } from 'lucide-react';
import { useUser } from '../contexts/UserContext'; 

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useUser(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _email: email,
          _password: password,
        }),
      });

      let data;

      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        console.error('Không thể parse JSON:', jsonError);
        setError('Server sent invalid JSON response.');
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        login(data.user, data.token); 
        onClose();
      }
    } catch (err) {
      console.error('Lỗi mạng:', err);
      setError('Server error. Please try again later.');
    } finally {
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
            className="bg-white w-full max-w-md p-8 rounded-lg shadow-xl relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <div className="flex items-center border-b border-gray-300 focus-within:border-purple-500">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Type your email"
                    className="w-full px-2 py-2 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Password</label>
                <div className="flex items-center border-b border-gray-300 focus-within:border-purple-500">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type your password"
                    className="w-full px-2 py-2 outline-none"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-full ${
                  isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-cyan-400 to-pink-500'
                } text-white font-bold shadow-md hover:opacity-90 transition`}
              >
                {isSubmitting ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">Or Sign Up Using</div>
            <div className="flex justify-center mt-2 space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="bg-sky-400 hover:bg-sky-500 text-white p-2 rounded-full">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full">
                <Mail className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-700">
              Don&apos;t have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-purple-700 hover:underline font-medium"
              >
                SIGN UP
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
