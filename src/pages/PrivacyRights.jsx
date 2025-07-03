import React, { useEffect } from 'react';

export default function PrivacyRights() {
  useEffect(() => { document.title = 'Privacy Rights | Nutri Planner'; }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4 flex flex-col items-center">
      <h1 className="text-[30px] font-extrabold text-purple-700 text-center mb-6" style={{ fontWeight: 1000 }}>
        Privacy Rights
      </h1>
      <h2 className="text-[22px] font-bold text-black text-center mb-4" style={{ fontWeight: 800 }}>
        Your rights regarding your personal data
      </h2>
      <div className="max-w-3xl text-black text-[20px] text-left">
        <p>
          You have important rights regarding your personal information on NutriPlanner:
        </p>
        <ul className="list-disc pl-6 mt-4">
          <li>Right to access your data</li>
          <li>Right to correct or update your data</li>
          <li>Right to request deletion of your data</li>
          <li>Right to object to or restrict certain processing</li>
        </ul>
        <p className="mt-4">Contact us to exercise any of these rights.</p>
      </div>
    </div>
  );
} 