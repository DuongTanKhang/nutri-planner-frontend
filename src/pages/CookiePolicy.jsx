import React, { useEffect } from 'react';

export default function CookiePolicy() {
  useEffect(() => { document.title = 'Cookie Policy | Nutri Planner'; }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4 flex flex-col items-center">
      <h1 className="text-[30px] font-extrabold text-purple-700 text-center mb-6" style={{ fontWeight: 1000 }}>
        Cookie Policy
      </h1>
      <h2 className="text-[22px] font-bold text-black text-center mb-4" style={{ fontWeight: 800 }}>
        How we use cookies on NutriPlanner
      </h2>
      <div className="max-w-3xl text-black text-[20px] text-left">
        <p>
          NutriPlanner uses cookies to enhance your experience. This policy explains what cookies are and how we use them.
        </p>
        <ul className="list-disc pl-6 mt-4">
          <li>Cookies help us remember your preferences and improve site functionality.</li>
          <li>You can control cookies through your browser settings.</li>
          <li>Disabling cookies may affect your experience on our site.</li>
        </ul>
      </div>
    </div>
  );
} 