import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  theme?: 'light' | 'dark' | 'contrast';
}

export default function Logo({
  className = '',
  size = 'md',
  showText = true,
  showTagline = false,
  theme = 'light'
}: LogoProps) {
  // Dimensions based on size
  let width = 44;
  let height = 44;
  if (size === 'sm') { width = 32; height = 32; }
  else if (size === 'lg') { width = 80; height = 80; }
  else if (size === 'xl') { width = 160; height = 160; }

  // Color variables based on theme
  const primaryColor = theme === 'dark' || theme === 'contrast' ? '#C8D9E6' : '#2F4156';
  const secondaryColor = '#567C8D';
  const textColor = theme === 'dark' || theme === 'contrast' ? '#FFFFFF' : '#2F4156';
  const subtextColor = theme === 'dark' || theme === 'contrast' ? '#C8D9E6' : '#567C8D';

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center gap-3">
        {/* SVG Icon of the Logo */}
        <svg
          width={width}
          height={height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* Speed / Motion lines on the left */}
          <path d="M15 45H32" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M10 57H28" stroke={secondaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M16 69H32" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />

          {/* Clock Dial */}
          <circle cx="60" cy="55" r="34" stroke={primaryColor} strokeWidth="6" />
          
          {/* Clock Ticks */}
          <line x1="60" y1="26" x2="60" y2="30" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="80" x2="60" y2="84" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="31" y1="55" x2="35" y2="55" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="85" y1="55" x2="89" y2="55" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />

          {/* Clock Hands */}
          <path d="M60 55V35" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M60 55L75 66" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
          
          {/* Checklist Card (Overlap lower left) */}
          <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))">
            <rect x="36" y="62" width="40" height="34" rx="6" fill="#FFFFFF" stroke={secondaryColor} strokeWidth="3" />
            
            {/* Checklist details inside the card */}
            <circle cx="44" cy="71" r="2.5" fill={primaryColor} />
            <line x1="51" y1="71" x2="68" y2="71" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
            
            <circle cx="44" cy="79" r="2.5" fill={primaryColor} />
            <line x1="51" y1="79" x2="68" y2="79" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />

            <circle cx="44" cy="87" r="2.5" fill={secondaryColor} />
            <line x1="51" y1="87" x2="68" y2="87" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Complete Tick badge (Overlap lower right) */}
          <g filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.15))">
            <circle cx="85" cy="82" r="18" fill={primaryColor} />
            <circle cx="85" cy="82" r="15" fill={secondaryColor} />
            <path d="M78 82L83 87L93 76" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>

        {showText && (
          <div className="flex flex-col items-start leading-none mt-1">
            <span 
              className="font-black tracking-tight" 
              style={{ 
                color: textColor, 
                fontSize: size === 'sm' ? '1.5rem' : size === 'lg' ? '2.5rem' : '1.75rem' 
              }}
            >
              Taskaroa
            </span>
            <span className="text-[10px] font-bold text-[#567C8D] mt-1 whitespace-nowrap">
              AI-Powered Productivity Companion
            </span>
          </div>
        )}
      </div>

      {showTagline && (
        <div className="mt-4 text-center max-w-sm">
          {/* Elegant Divider Line */}
          <div className="flex items-center gap-3 w-full justify-center mb-2">
            <div className="h-[2px] w-8 bg-[#567C8D]" />
            <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: textColor }}>
              PLAN SMART. ACT EARLY. STAY AHEAD.
            </span>
            <div className="h-[2px] w-8 bg-[#567C8D]" />
          </div>
          <span className="text-xs font-semibold tracking-wider block" style={{ color: subtextColor }}>
            AI-Powered Productivity Companion
          </span>
        </div>
      )}
    </div>
  );
}
