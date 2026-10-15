import React from 'react';

/**
 * Premium StudentOS Brand Logo & Mark
 * Combines modern geometric architecture, an elevated graduation cap apex, 
 * an operating system command diamond / orbital core, and glowing gradients.
 */
export const StudentOSMark = ({ className = 'h-9 w-9', size = 36 }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-800 shadow-lg shadow-violet-500/25 border border-white/20 p-1.5 transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="capGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#E0E7FF" />
            <stop offset="1" stopColor="#C7D2FE" />
          </linearGradient>
          <linearGradient id="pulseGrad" x1="10" y1="18" x2="22" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
        </defs>

        {/* Outer Orbit / Academic Halo ring */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="url(#capGrad)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          strokeOpacity="0.4"
        />

        {/* Architectural Cap Top / OS Diamond */}
        <path
          d="M16 5.5L27 11.5L16 17.5L5 11.5L16 5.5Z"
          fill="url(#capGrad)"
          fillOpacity="0.95"
        />

        {/* OS Core Processor / Inner Diamond */}
        <path
          d="M16 10L20.5 12.5L16 15L11.5 12.5L16 10Z"
          fill="#4F46E5"
        />

        {/* Lower Cap Pedestal & Arc Wings */}
        <path
          d="M8.5 14.5V19C8.5 22 11.8 24.5 16 24.5C20.2 24.5 23.5 22 23.5 19V14.5L16 18.5L8.5 14.5Z"
          fill="url(#pulseGrad)"
          fillOpacity="0.9"
        />

        {/* Right Tassel Streamline */}
        <path
          d="M26.5 12V21.5C26.5 22.3 25.8 23 25 23"
          stroke="#FCD34D"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="25" cy="23" r="1.2" fill="#F59E0B" />
      </svg>
    </div>
  );
};

export const StudentOSLogo = ({ className = '', textClassName = '', size = 36, showText = true, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
    >
      <StudentOSMark size={size} />
      {showText && (
        <span className={`text-lg font-black tracking-tight font-sans text-slate-900 dark:text-white flex items-center ${textClassName}`}>
          Student
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent font-black ml-0.5">
            OS
          </span>
        </span>
      )}
    </div>
  );
};

export default StudentOSLogo;
