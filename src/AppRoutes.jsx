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
import { useProfileStepRedirect } from './hooks/useProfileStepRedirect';
import CreateAccountWelcome from './pages/CreateAccountWelcome';
import CreateAccountGoals from './pages/CreateAccountGoals';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyRights from './pages/PrivacyRights';


export default function AppRoutes() {
  const { user, token } = useUser();
  useProfileStepRedirect(user);
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/favorites" element={<FavoriteFoodsPage />} />
      <Route path="/account/create/welcome" element={<CreateAccountWelcome />} />
      <Route path="/account/create/goals" element={<CreateAccountGoals />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/privacy-rights" element={<PrivacyRights />} />

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
