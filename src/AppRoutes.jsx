import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/ProfilePage';
import ProfileStep1 from './pages/profile/ProfileStep1';
import ProfileStep2 from './pages/profile/ProfileStep2';
import ProfileStep3 from './pages/profile/ProfileStep3';
import FavoriteFoodsPage from './pages/FavoriteFoodsPage';
import RequireUser from './components/RequireUser';
import { useUser } from './contexts/UserContext'; 

export default function AppRoutes() {
  const { user, token } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/favorites" element={<FavoriteFoodsPage />} />

      <Route
        path="/complete-profile/step1"
        element={
          <RequireUser>
            <ProfileStep1
              key={`step1-${user?._dob}-${user?._height_cm}-${user?._weight_kg}`}
              userId={user?._id}
              token={token}
            />
          </RequireUser>
        }
      />
      <Route
        path="/complete-profile/step2"
        element={
          <RequireUser>
            <ProfileStep2
              key={`step2-${user?._goal}-${user?._diet_type_id}`}
              userId={user?._id}
              token={token}
            />
          </RequireUser>
        }
      />
      <Route
        path="/complete-profile/step3"
        element={
          <RequireUser>
            <ProfileStep3
              key={`step3-${user?._id}`}
              userId={user?._id}
              token={token}
            />
          </RequireUser>
        }
      />
    </Routes>
  );
}
