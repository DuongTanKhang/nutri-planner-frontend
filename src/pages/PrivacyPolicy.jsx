import React, { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => { document.title = 'Privacy Policy | Nutri Planner'; }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4 flex flex-col items-center">
      <h1 className="text-[30px] font-extrabold text-purple-700 text-center mb-6" style={{ fontWeight: 1000 }}>
        Privacy Policy
      </h1>
      <h2 className="text-[22px] font-bold text-black text-center mb-4" style={{ fontWeight: 800 }}>
        Your privacy is important to us
      </h2>
      <div className="max-w-3xl text-black text-[20px] text-left">
        <p>
          We are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use NutriPlanner.
        </p>
        <ul className="list-disc pl-6 mt-4">
          <li>We only collect necessary information for providing our services.</li>
          <li>Your data is stored securely and not shared with third parties without consent.</li>
          <li>You have the right to access, update, or delete your information.</li>
          <li>Contact us for any privacy-related concerns.</li>
        </ul>
      </div>
    </div>
  );
} 