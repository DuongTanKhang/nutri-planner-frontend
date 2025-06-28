import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
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

  const isFirstLogin = user && (
    !user._weight_kg ||
    !user._height_cm ||
    !user._goal ||
    !user._diet_type_id ||
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
    setUser({ ...newUser }); 
    localStorage.setItem('user', JSON.stringify(newUser));
    if (typeof callback === 'function') callback();
  };

  const reloadUser = () => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
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

export const useUser = () => useContext(UserContext);
