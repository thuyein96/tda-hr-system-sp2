// src/components/TopBar.tsx
import React from 'react';

const TopBar: React.FC = () => {
  const today = new Date();
  // Using toLocaleDateString for date and weekday formatting for simplicity.
  // This TopBar is specific to the login page and does not use the global LanguageContext.
  const day = today.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., Monday
  const date = today.toLocaleDateString('en-GB'); // e.g., 16/06/2025

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Brand Logo / Title */}
      <div className="flex items-center">
        <span className="text-2xl font-semibold font-inter">
          <span className="text-[#FF6767]">TDA</span>
          <span className="text-gray-700">: HR</span>
        </span>
      </div>

      {/* Date and Day Display (hidden on very small screens, visible on 'sm' and up) */}
      <div className="hidden sm:block text-sm text-gray-500 text-right">
        <div className="font-medium">{day}</div>
        <div className="text-blue-400 font-medium">{date}</div>
      </div>
    </header>
  );
};

export default TopBar;