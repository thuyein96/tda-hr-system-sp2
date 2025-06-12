import React from 'react';

const TopBar = () => {
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = dayNames[today.getDay()];
  const date = today.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-2xl font-semibold">
          <span className="text-red-400">TDA</span>
          <span className="text-gray-700">: HR</span>
        </span>
      </div>
      <div className="text-sm text-gray-500 text-right">
        <div>{day}</div>
        <div>{date}</div>
      </div>
    </div>
  );
};

export default TopBar;
