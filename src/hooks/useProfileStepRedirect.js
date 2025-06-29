import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useProfileStepRedirect = (user) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !user._id) return;

    const currentPath = location.pathname;

    if (currentPath.startsWith('/complete-profile/')) return;

    const missingStep1 = !user._dob || !user._height_cm || !user._weight_kg;
    const missingStep2 = !user._goal || !user._diet_type_id || !user._activity_level;
    const missingStep3 = !user.allergens || user.allergens.length === 0;

    if (missingStep1) {
      navigate('/complete-profile/step1');
    } else if (missingStep2) {
      navigate('/complete-profile/step2');
    } else if (missingStep3 && !user._completed_profile) {
      navigate('/complete-profile/step3');
    }
  }, [user, navigate, location]);
};
