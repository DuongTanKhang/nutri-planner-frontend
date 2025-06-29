import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    reloadUser();
  }, []);

  const isFirstLogin = user && (
    !user._weight_kg ||
    !user._height_cm ||
    !user._goal ||
    !user._diet_type_id ||
    !user._activity_level ||
    !Array.isArray(user.allergens) || user.allergens.length === 0
  );

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedData, callback) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    if (typeof callback === 'function') callback();
  };

  const reloadUser = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem('user'));
      const savedToken = localStorage.getItem('token');

      if (saved && savedToken) {
        const res = await axios.get(`http://localhost:8000/api/profile/${saved._id}`, {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });

        const freshUser = {
          ...res.data,
          allergens: res.data.allergens || []
        };

        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      }
    } catch (err) {
      console.error('Failed to reload user:', err);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      setUser,
      login,
      logout,
      updateUser,
      reloadUser,
      isFirstLogin
    }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
