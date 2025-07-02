import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4 flex flex-col items-center">
      <h1 className="text-[30px] font-extrabold text-purple-700 text-center mb-6" style={{ fontWeight: 1000 }}>
        Terms of Use
      </h1>
      <h2 className="text-[22px] font-bold text-black text-center mb-4" style={{ fontWeight: 800 }}>
        Please read these terms carefully before using NutriPlanner
      </h2>
      <div className="max-w-3xl text-black text-[20px] text-left">
        <p>
          Welcome to NutriPlanner! By accessing or using our website, you agree to be bound by these Terms of Use. If you do not agree with any part of the terms, you may not use our services.
        </p>
        <ul className="list-disc pl-6 mt-4">
          <li>Use the service for lawful purposes only.</li>
          <li>Do not misuse or interfere with the service.</li>
          <li>Respect intellectual property rights and privacy of others.</li>
          <li>We may update these terms at any time. Continued use means acceptance of changes.</li>
        </ul>
      </div>
    </div>
  );
} 