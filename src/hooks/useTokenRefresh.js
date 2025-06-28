import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export const useTokenRefresh = () => {
  const { token, user, login, logout } = useUser();

  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/refresh', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.token) {
          login(user, data.token); 
        } else {
          console.warn('Refresh failed:', data);
          logout();
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    }, 1000 * 60 * 55); 

    return () => clearInterval(refreshInterval);
  }, [token, user, login, logout]);
};
