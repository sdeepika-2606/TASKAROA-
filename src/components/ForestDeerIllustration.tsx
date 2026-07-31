import React from 'react';

// Reusable Sparkle/AI Spark Icon
const SparkPath = ({ x, y, scale = 1, opacity = 1, color = '#2BBF8C' }: { x: number, y: number, scale?: number, opacity?: number, color?: string }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
    <path 
      d="M 0,-15 C 2,-5 5,-2 15,0 C 5,2 2,5 0,15 C -2,5 -5,2 -15,0 C -5,-2 -2,-5 0,-15 Z" 
      fill={color} 
    />
  </g>
);

// Reusable Tech Node / Particle
const TechNode = ({ x, y, size = 4, color = '#2BBF8C', opacity = 0.8 }: { x: number, y: number, size?: number, color?: string, opacity?: number }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={size} fill={color} />
    <circle cx={x} cy={y} r={size * 2.5} stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
  </g>
);

// 1. LANDING PAGE AI FLOW ILLUSTRATION (Right panel backdrop)
export const LandingForestIllustration = () => {
  return (
    <svg 
      viewBox="0 0 800 500" 
      className="w-full h-full object-cover select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft morning ambient gradient */}
        <linearGradient id="landingBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B3E31" />
          <stop offset="60%" stopColor="#0F5D4A" />
          <stop offset="100%" stopColor="#1E3C34" />
        </linearGradient>

        {/* Waves Gradients */}
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0E8F6A" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#2BBF8C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0A5C43" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#134E3F" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2BBF8C" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="waveGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2BBF8C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#052E24" stopOpacity="0.9" />
        </linearGradient>

        {/* Tech Grid Pattern */}
        <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1" fill="#2BBF8C" fillOpacity="0.15" />
        </pattern>

        {/* Glowing radial gradient */}
        <radialGradient id="glowingSpot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>

        {/* Glassmorphism card filter */}
        <filter id="glassFilter">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
        </filter>
      </defs>

      {/* 1. Background Fill */}
      <rect width="800" height="500" fill="url(#landingBg)" />

      {/* 2. Technical Dot Pattern Grid */}
      <rect width="800" height="500" fill="url(#dotGrid)" />

      {/* 3. Glowing Ambient Spots */}
      <circle cx="650" cy="150" r="250" fill="url(#glowingSpot)" />
      <circle cx="150" cy="350" r="200" fill="url(#glowingSpot)" />

      {/* 4. Elegant Concentric AI Circles (Geometric Core) */}
      <g stroke="#2BBF8C" strokeOpacity="0.1" fill="none">
        <circle cx="400" cy="250" r="180" strokeDasharray="5,5" />
        <circle cx="400" cy="250" r="140" />
        <circle cx="400" cy="250" r="100" strokeDasharray="10,4" />
        <circle cx="400" cy="250" r="60" />
      </g>

      {/* 5. Flowing Wave Layers (Organic Curves) */}
      {/* Wave 1 */}
      <path 
        d="M -100,420 Q 150,220 400,380 T 900,280 L 900,500 L -100,500 Z" 
        fill="url(#waveGrad1)" 
      />

      {/* Wave 2 */}
      <path 
        d="M -100,320 Q 200,450 500,280 T 900,390 L 900,500 L -100,500 Z" 
        fill="url(#waveGrad2)" 
      />

      {/* Thin glowing vector lines highlighting the waves */}
      <path 
        d="M -100,320 Q 200,450 500,280 T 900,390" 
        fill="none" 
        stroke="#34D399" 
        strokeWidth="1.5" 
        strokeOpacity="0.4" 
      />
      <path 
        d="M -100,420 Q 150,220 400,380 T 900,280" 
        fill="none" 
        stroke="#2BBF8C" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />

      {/* Wave 3 */}
      <path 
        d="M -100,450 C 200,380 400,480 600,410 C 700,375 800,420 900,400 L 900,500 L -100,500 Z" 
        fill="url(#waveGrad3)" 
      />

      {/* 6. Neural Connections Graph Overlay */}
      <g stroke="#34D399" strokeOpacity="0.15" strokeWidth="1">
        <line x1="250" y1="180" x2="320" y2="120" />
        <line x1="320" y1="120" x2="420" y2="150" />
        <line x1="420" y1="150" x2="480" y2="80" />
        <line x1="420" y1="150" x2="490" y2="210" />
        <line x1="490" y1="210" x2="600" y2="180" />
        <line x1="320" y1="120" x2="280" y2="240" />
        <line x1="490" y1="210" x2="450" y2="300" />
      </g>

      {/* Tech Nodes/Circles at Vertices */}
      <TechNode x={250} y={180} size={4} />
      <TechNode x={320} y={120} size={5} />
      <TechNode x={420} y={150} size={6} />
      <TechNode x={480} y={80} size={4} />
      <TechNode x={490} y={210} size={5.5} />
      <TechNode x={600} y={180} size={5} />
      <TechNode x={280} y={240} size={4} />
      <TechNode x={450} y={300} size={4.5} />

      {/* 7. Floating Productivity AI Glassmorphic Chips */}
      {/* Chip 1: Spark/Idea */}
      <g transform="translate(180, 120)">
        <rect x="-25" y="-25" width="50" height="50" rx="16" fill="#ffffff" fillOpacity="0.08" stroke="url(#waveGrad1)" strokeWidth="1" filter="url(#glassFilter)" />
        <rect x="-25" y="-25" width="50" height="50" rx="16" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
        <SparkPath x={0} y={0} scale={0.9} color="#34D399" />
      </g>

      {/* Chip 2: Focus / Target */}
      <g transform="translate(630, 260)">
        <rect x="-30" y="-30" width="60" height="60" rx="18" fill="#ffffff" fillOpacity="0.08" stroke="url(#waveGrad2)" strokeWidth="1" filter="url(#glassFilter)" />
        <rect x="-30" y="-30" width="60" height="60" rx="18" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
        {/* Minimalist target reticle */}
        <circle cx="0" cy="0" r="12" stroke="#34D399" strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="0" r="6" stroke="#34D399" strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="0" r="2" fill="#34D399" />
      </g>

      {/* Chip 3: Completed / Checkmark */}
      <g transform="translate(580, 80)">
        <rect x="-22" y="-22" width="44" height="44" rx="14" fill="#ffffff" fillOpacity="0.08" stroke="url(#waveGrad1)" strokeWidth="1" filter="url(#glassFilter)" />
        <rect x="-22" y="-22" width="44" height="44" rx="14" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
        {/* Minimalist check */}
        <path d="M -8,-2 L -2,4 L 8,-6" fill="none" stroke="#2BBF8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating Sparkles Particles */}
      <SparkPath x={120} y={220} scale={0.4} opacity={0.6} />
      <SparkPath x={680} y={110} scale={0.5} opacity={0.7} />
      <SparkPath x={380} y={60} scale={0.3} opacity={0.5} />
      <SparkPath x={530} y={320} scale={0.4} opacity={0.5} />

    </svg>
  );
};

// 2. SIDEBAR ABSTRACT TECH ILLUSTRATION (Bleeds perfectly into sidebar bottom)
export const SidebarForestIllustration = () => {
  return (
    <svg 
      viewBox="0 0 300 160" 
      className="w-full h-full object-cover select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft morning green mist gradient */}
        <linearGradient id="sidebarBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFDFB" />
          <stop offset="60%" stopColor="#E6F5EE" />
          <stop offset="100%" stopColor="#CCEBE0" />
        </linearGradient>

        <linearGradient id="sidebarWaveFar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81D8B4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4A9C7A" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id="sidebarWaveClose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2BBF8C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0E7E5E" stopOpacity="0.7" />
        </linearGradient>

        <pattern id="microDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.75" fill="#0E8F6A" fillOpacity="0.1" />
        </pattern>
      </defs>

      {/* 1. Base Ambient Background */}
      <rect width="300" height="160" fill="url(#sidebarBg)" />
      
      {/* 2. Micro Dot Grid */}
      <rect width="300" height="160" fill="url(#microDots)" />

      {/* 3. Concentric Orbit Lines */}
      <circle cx="150" cy="180" r="120" stroke="#0E8F6A" strokeWidth="1" strokeOpacity="0.08" fill="none" strokeDasharray="4,4" />
      <circle cx="150" cy="180" r="80" stroke="#0E8F6A" strokeWidth="1" strokeOpacity="0.05" fill="none" />

      {/* 4. Abstract Wave Layers */}
      <path 
        d="M -20,110 Q 100,70 200,115 T 320,95 L 320,160 L -20,160 Z" 
        fill="url(#sidebarWaveFar)" 
      />
      
      <path 
        d="M -20,130 Q 90,100 180,135 T 320,115 L 320,160 L -20,160 Z" 
        fill="url(#sidebarWaveClose)" 
      />

      <path 
        d="M -20,130 Q 90,100 180,135 T 320,115" 
        fill="none" 
        stroke="#2BBF8C" 
        strokeWidth="1" 
        strokeOpacity="0.4" 
      />

      {/* 5. Minimal Neural Connecting Nodes */}
      <g stroke="#0E8F6A" strokeOpacity="0.15" strokeWidth="0.75">
        <line x1="50" y1="80" x2="100" y2="60" />
        <line x1="100" y1="60" x2="160" y2="75" />
        <line x1="160" y1="75" x2="220" y2="50" />
        <line x1="100" y1="60" x2="80" y2="110" />
        <line x1="160" y1="75" x2="190" y2="120" />
      </g>

      <circle cx="50" cy="80" r="2.5" fill="#2BBF8C" />
      <circle cx="100" cy="60" r="3.5" fill="#0E8F6A" />
      <circle cx="160" cy="75" r="3.5" fill="#2BBF8C" />
      <circle cx="220" cy="50" r="2.5" fill="#0E8F6A" />
      <circle cx="80" cy="110" r="3" fill="#2BBF8C" opacity="0.6" />
      <circle cx="190" cy="120" r="3" fill="#0E8F6A" opacity="0.6" />

      {/* Floating Sparkles */}
      <SparkPath x={250} y={70} scale={0.35} opacity={0.6} />
      <SparkPath x={30} y={50} scale={0.25} opacity={0.4} />
    </svg>
  );
};

// 3. DASHBOARD QUOTE BANNER BACKDROP (Beautiful right-hand side decoration)
export const BannerForestIllustration = () => {
  return (
    <svg 
      viewBox="0 0 320 180" 
      className="w-full h-full object-cover select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Premium Gold-Mint Gradient */}
        <linearGradient id="bannerBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D5F3E7" />
          <stop offset="50%" stopColor="#EAF8F2" />
          <stop offset="100%" stopColor="#FFFBEB" />
        </linearGradient>

        <linearGradient id="bannerWave1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7DE2B6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0E8F6A" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="bannerWave2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2BBF8C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1E3C34" stopOpacity="0.8" />
        </linearGradient>

        {/* Soft shadow */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#0E8F6A" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Sky Background */}
      <rect width="320" height="180" fill="url(#bannerBg)" />

      {/* Minimal grid pattern overlay */}
      <g stroke="#0E8F6A" strokeWidth="0.5" strokeOpacity="0.05">
        <line x1="40" y1="0" x2="40" y2="180" />
        <line x1="80" y1="0" x2="80" y2="180" />
        <line x1="120" y1="0" x2="120" y2="180" />
        <line x1="160" y1="0" x2="160" y2="180" />
        <line x1="200" y1="0" x2="200" y2="180" />
        <line x1="240" y1="0" x2="240" y2="180" />
        <line x1="280" y1="0" x2="280" y2="180" />
        <line x1="0" y1="40" x2="320" y2="40" />
        <line x1="0" y1="80" x2="320" y2="80" />
        <line x1="0" y1="120" x2="320" y2="120" />
        <line x1="0" y1="160" x2="320" y2="160" />
      </g>

      {/* Glow Center */}
      <circle cx="160" cy="90" r="70" fill="#2BBF8C" fillOpacity="0.1" filter="blur(8px)" />

      {/* Floating abstract geometrical layers */}
      <circle cx="260" cy="60" r="30" stroke="#0E8F6A" strokeWidth="1" strokeOpacity="0.1" fill="none" />
      <circle cx="260" cy="60" r="15" stroke="#0E8F6A" strokeWidth="1" strokeOpacity="0.15" fill="none" strokeDasharray="3,3" />

      {/* Abstract Waves */}
      <path 
        d="M -20,130 Q 80,95 180,140 T 340,110 L 340,180 L -20,180 Z" 
        fill="url(#bannerWave1)" 
      />

      <path 
        d="M -20,150 Q 110,120 210,160 T 340,135 L 340,180 L -20,180 Z" 
        fill="url(#bannerWave2)" 
      />

      <path 
        d="M -20,150 Q 110,120 210,160 T 340,135" 
        fill="none" 
        stroke="#34D399" 
        strokeWidth="1.5" 
        strokeOpacity="0.4" 
      />

      {/* Glowing Central AI Spark Card (Glassmorphic) */}
      <g transform="translate(160, 75)" filter="url(#softShadow)">
        <rect x="-24" y="-24" width="48" height="48" rx="14" fill="#ffffff" fillOpacity="0.7" stroke="#2BBF8C" strokeWidth="1" />
        <SparkPath x={0} y={0} scale={0.85} color="#0E8F6A" />
      </g>

      {/* Floating Sparkles */}
      <SparkPath x={50} y={50} scale={0.35} opacity={0.5} />
      <SparkPath x={250} y={130} scale={0.4} opacity={0.6} />
      <SparkPath x={280} y={40} scale={0.25} opacity={0.4} />
    </svg>
  );
};

// 4. DARK SCENIC FLOW BACKGROUND (First Image, Dark Green scenario)
export const DarkScenicForestBackground = () => {
  return (
    <svg
      viewBox="0 0 1440 900"
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Dark cyber-neutral space gradient */}
        <linearGradient id="darkScenicBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020C0A" />
          <stop offset="50%" stopColor="#061B16" />
          <stop offset="100%" stopColor="#0B2B23" />
        </linearGradient>

        <linearGradient id="darkWaveFar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05201A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0E4E3E" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id="darkWaveClose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0C3B30" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#031612" stopOpacity="0.95" />
        </linearGradient>

        <radialGradient id="darkGlowCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2BBF8C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2BBF8C" stopOpacity="0" />
        </radialGradient>

        <pattern id="darkDotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1" fill="#2BBF8C" fillOpacity="0.08" />
        </pattern>
      </defs>

      {/* 1. Dark background */}
      <rect width="1440" height="900" fill="url(#darkScenicBg)" />

      {/* 2. Abstract Technical Grid Overlay */}
      <rect width="1440" height="900" fill="url(#darkDotGrid)" />

      {/* 3. Deep space background glows */}
      <circle cx="720" cy="450" r="500" fill="url(#darkGlowCore)" />
      <circle cx="1200" cy="200" r="300" fill="url(#darkGlowCore)" opacity="0.6" />
      <circle cx="200" cy="700" r="350" fill="url(#darkGlowCore)" opacity="0.8" />

      {/* 4. Giant abstract tech orbital paths */}
      <g stroke="#2BBF8C" strokeOpacity="0.04" strokeWidth="1" fill="none">
        <ellipse cx="720" cy="450" rx="600" ry="250" />
        <ellipse cx="720" cy="450" rx="400" ry="160" strokeDasharray="6,4" />
        <circle cx="720" cy="450" r="500" />
      </g>

      {/* 5. Minimal Geometric Lines & Network graph */}
      <g stroke="#34D399" strokeOpacity="0.1" strokeWidth="1">
        <line x1="200" y1="250" x2="350" y2="180" />
        <line x1="350" y1="180" x2="480" y2="280" />
        <line x1="480" y1="280" x2="620" y2="220" />
        <line x1="620" y1="220" x2="750" y2="350" />
        <line x1="750" y1="350" x2="900" y2="260" />
        <line x1="900" y1="260" x2="1100" y2="380" />
        <line x1="1100" y1="380" x2="1250" y2="290" />
        
        <line x1="350" y1="180" x2="280" y2="400" />
        <line x1="620" y1="220" x2="580" y2="450" />
        <line x1="900" y1="260" x2="980" y2="480" />
      </g>

      <circle cx="200" cy="250" r="3" fill="#2BBF8C" opacity="0.5" />
      <circle cx="350" cy="180" r="4.5" fill="#34D399" opacity="0.6" />
      <circle cx="480" cy="280" r="3.5" fill="#2BBF8C" opacity="0.5" />
      <circle cx="620" cy="220" r="5" fill="#34D399" opacity="0.7" />
      <circle cx="750" cy="350" r="4" fill="#2BBF8C" opacity="0.6" />
      <circle cx="900" cy="260" r="4.5" fill="#34D399" opacity="0.6" />
      <circle cx="1100" cy="380" r="3.5" fill="#2BBF8C" opacity="0.5" />
      <circle cx="1250" cy="290" r="3" fill="#34D399" opacity="0.5" />
      <circle cx="280" cy="400" r="3.5" fill="#2BBF8C" opacity="0.4" />
      <circle cx="580" cy="450" r="4" fill="#34D399" opacity="0.4" />
      <circle cx="980" cy="480" r="3.5" fill="#2BBF8C" opacity="0.4" />

      {/* 6. Soft abstract curved layers */}
      <path 
        d="M 0,650 Q 400,480 800,620 T 1440,560 L 1440,900 L 0,900 Z" 
        fill="url(#darkWaveFar)" 
      />

      <path 
        d="M 0,760 Q 350,620 750,740 T 1440,680 L 1440,900 L 0,900 Z" 
        fill="url(#darkWaveClose)" 
      />

      {/* Glowing trace lines outlining wave contours */}
      <path 
        d="M 0,650 Q 400,480 800,620 T 1440,560" 
        fill="none" 
        stroke="#2BBF8C" 
        strokeWidth="1.5" 
        strokeOpacity="0.25" 
      />

      <path 
        d="M 0,760 Q 350,620 750,740 T 1440,680" 
        fill="none" 
        stroke="#34D399" 
        strokeWidth="2.5" 
        strokeOpacity="0.35" 
      />

      {/* 7. Floating particles/glowing dust sparkles */}
      <g fill="#2BBF8C">
        <circle cx="180" cy="480" r="1.5" opacity="0.4" />
        <circle cx="340" cy="520" r="2.5" opacity="0.6" />
        <circle cx="530" cy="420" r="2" opacity="0.5" />
        <circle cx="680" cy="580" r="1" opacity="0.3" />
        <circle cx="890" cy="410" r="2" opacity="0.5" />
        <circle cx="1020" cy="540" r="1.5" opacity="0.4" />
        <circle cx="1200" cy="480" r="3" opacity="0.6" />
        <circle cx="1320" cy="380" r="1.5" opacity="0.3" />
        <circle cx="700" cy="180" r="2" opacity="0.4" />
      </g>

      {/* Big neon ambient sparkles */}
      <SparkPath x={150} y={130} scale={0.5} opacity={0.4} />
      <SparkPath x={1250} y={150} scale={0.6} opacity={0.5} />
      <SparkPath x={820} y={550} scale={0.4} opacity={0.3} />
      <SparkPath x={410} y={720} scale={0.5} opacity={0.4} />

    </svg>
  );
};

// 5. LIGHT SCENIC FLOW BACKGROUND (Second Image, Light Day Forest scenario)
export const LightScenicForestBackground = () => {
  return (
    <svg
      viewBox="0 0 800 1200"
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lightScenicBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FAFDFB" />
          <stop offset="80%" stopColor="#E2F3EB" />
          <stop offset="100%" stopColor="#CCEBE0" />
        </linearGradient>

        <linearGradient id="lightWaveFar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AEE2CD" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8FCBB2" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="lightWaveMid" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#83C5BE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5B9D96" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="lightWaveClose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5C9E8E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2E6F60" stopOpacity="0.6" />
        </linearGradient>

        <pattern id="lightDotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="0.75" fill="#2BBF8C" fillOpacity="0.15" />
        </pattern>
      </defs>

      {/* 1. Base Gradient Sky */}
      <rect width="800" height="1200" fill="url(#lightScenicBg)" />

      {/* 2. Dots pattern overlay */}
      <rect width="800" height="1200" fill="url(#lightDotGrid)" />

      {/* 3. Aesthetic Watermark (Innovate instead of Welcome) */}
      <text 
        x="400" 
        y="420" 
        textAnchor="middle" 
        fill="#0E8F6A" 
        fontWeight="900" 
        fontSize="54" 
        letterSpacing="28" 
        opacity="0.1"
        fontFamily="sans-serif"
      >
        FOCUS
      </text>

      {/* 4. Circular Abstract orbits */}
      <circle cx="400" cy="400" r="220" stroke="#0E8F6A" strokeWidth="1" strokeOpacity="0.07" fill="none" strokeDasharray="6,4" />
      <circle cx="400" cy="400" r="150" stroke="#0E8F6A" strokeWidth="1" strokeOpacity="0.05" fill="none" />

      {/* 5. Fluid Curved Layers */}
      <path d="M -100,750 Q 250,600 600,700 T 1100,630 L 1100,1200 L -100,1200 Z" fill="url(#lightWaveFar)" />

      <path d="M -100,900 Q 300,750 700,870 T 1100,800 L 1100,1200 L -100,1200 Z" fill="url(#lightWaveMid)" />

      <path d="M -100,1050 Q 350,910 750,1040 T 1100,960 L 1100,1200 L -100,1200 Z" fill="url(#lightWaveClose)" />

      {/* Contours lines */}
      <path d="M -100,900 Q 300,750 700,870 T 1100,800" fill="none" stroke="#2BBF8C" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M -100,1050 Q 350,910 750,1040 T 1100,960" fill="none" stroke="#0E8F6A" strokeWidth="2.5" strokeOpacity="0.3" />

      {/* 6. Abstract Flow Ribbon Wave on the Right side */}
      <path 
        d="M 800,0 
           C 710,180 630,350 720,540 
           C 780,680 750,880 650,1020 
           C 600,1080 580,1140 600,1200 
           L 800,1200 Z" 
         fill="#0E8F6A" 
         opacity="0.1"
       />

      {/* 7. Neural constellation vertices in light theme */}
      <g stroke="#0E8F6A" strokeOpacity="0.1" strokeWidth="1">
        <line x1="200" y1="600" x2="300" y2="550" />
        <line x1="300" y1="550" x2="420" y2="580" />
        <line x1="420" y1="580" x2="550" y2="520" />
      </g>
      <circle cx="200" cy="600" r="3" fill="#2BBF8C" />
      <circle cx="300" cy="550" r="4" fill="#0E8F6A" />
      <circle cx="420" cy="580" r="3.5" fill="#2BBF8C" />
      <circle cx="550" cy="520" r="4" fill="#0E8F6A" />

      {/* Floating Sparkles */}
      <SparkPath x={150} y={280} scale={0.5} opacity={0.5} color="#2BBF8C" />
      <SparkPath x={620} y={350} scale={0.6} opacity={0.4} color="#0E8F6A" />
      <SparkPath x={320} y={150} scale={0.4} opacity={0.3} color="#2BBF8C" />

    </svg>
  );
};

// 6. WIDESCREEN LIGHT SCENIC AI FLOW BACKGROUND (Desktop-first template background)
export const WidescreenLightScenicForest = () => {
  return (
    <svg
      viewBox="0 0 1440 900"
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Soft magical light green-blue sky gradient */}
        <linearGradient id="wideLightBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E6F5F0" />
          <stop offset="35%" stopColor="#F4FBF8" />
          <stop offset="70%" stopColor="#FAFCFA" />
          <stop offset="100%" stopColor="#FFFDF7" />
        </linearGradient>

        <linearGradient id="wideWaveFar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9ADAB4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7FC79C" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="wideWaveMid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6BC291" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4FA775" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="wideWaveClose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#358C60" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#226E45" stopOpacity="0.45" />
        </linearGradient>

        <linearGradient id="wideForegroundWave" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C5E3D" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B3C22" stopOpacity="0.6" />
        </linearGradient>

        <pattern id="wideDotGrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="18" cy="18" r="0.75" fill="#0E8F6A" fillOpacity="0.1" />
        </pattern>
      </defs>

      {/* 1. Base Gradient Canvas */}
      <rect width="1440" height="900" fill="url(#wideLightBg)" />

      {/* 2. Technical Dot Grid Overlay */}
      <rect width="1440" height="900" fill="url(#wideDotGrid)" />

      {/* 3. Ambient soft blurred green lights in the background */}
      <circle cx="820" cy="420" r="180" fill="#2BBF8C" fillOpacity="0.06" filter="blur(16px)" />
      <circle cx="200" cy="200" r="220" fill="#7DE2B6" fillOpacity="0.04" filter="blur(20px)" />

      {/* 4. Technical Concentric Orbits */}
      <g stroke="#0E8F6A" strokeOpacity="0.04" strokeWidth="1.25" fill="none">
        <ellipse cx="720" cy="450" rx="640" ry="280" />
        <ellipse cx="720" cy="450" rx="440" ry="180" strokeDasharray="8,6" />
        <circle cx="720" cy="450" r="540" />
      </g>

      {/* 5. Minimal Connected Connections Network Graph */}
      <g stroke="#2BBF8C" strokeOpacity="0.12" strokeWidth="1">
        <line x1="300" y1="350" x2="450" y2="280" />
        <line x1="450" y1="280" x2="580" y2="380" />
        <line x1="580" y1="380" x2="720" y2="300" />
        <line x1="720" y1="300" x2="850" y2="420" />
        <line x1="850" y1="420" x2="1000" y2="330" />
        
        <line x1="450" y1="280" x2="400" y2="480" />
        <line x1="720" y1="300" x2="680" y2="520" />
        <line x1="1000" y1="330" x2="1080" y2="550" />
      </g>

      <circle cx="300" cy="350" r="3" fill="#2BBF8C" opacity="0.6" />
      <circle cx="450" cy="280" r="4.5" fill="#0E8F6A" opacity="0.7" />
      <circle cx="580" cy="380" r="3.5" fill="#2BBF8C" opacity="0.6" />
      <circle cx="720" cy="300" r="5.5" fill="#0E8F6A" opacity="0.8" />
      <circle cx="850" cy="420" r="4" fill="#2BBF8C" opacity="0.7" />
      <circle cx="1000" cy="330" r="5" fill="#0E8F6A" opacity="0.7" />
      
      <circle cx="400" cy="480" r="4" fill="#2BBF8C" opacity="0.5" />
      <circle cx="680" cy="520" r="4.5" fill="#0E8F6A" opacity="0.5" />
      <circle cx="1080" cy="550" r="4" fill="#2BBF8C" opacity="0.5" />

      {/* 6. Abstract Curved Waves at the bottom */}
      <path d="M -100,580 Q 300,420 750,550 T 1600,490 L 1600,900 L -100,900 Z" fill="url(#wideWaveFar)" />

      <path d="M -100,700 Q 350,540 800,670 T 1600,610 L 1600,900 L -100,900 Z" fill="url(#wideWaveMid)" />

      <path d="M -100,820 Q 400,660 900,800 T 1600,720 L 1600,900 L -100,900 Z" fill="url(#wideWaveClose)" />

      <path d="M -100,890 Q 300,800 680,890 T 1600,850 L 1600,900 L -100,900 Z" fill="url(#wideForegroundWave)" />

      {/* Contour lines */}
      <path d="M -100,580 Q 300,420 750,550 T 1600,490" fill="none" stroke="#2BBF8C" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M -100,700 Q 350,540 800,670 T 1600,610" fill="none" stroke="#0E8F6A" strokeWidth="1.5" strokeOpacity="0.2" />
      <path d="M -100,820 Q 400,660 900,800 T 1600,720" fill="none" stroke="#2BBF8C" strokeWidth="2.5" strokeOpacity="0.3" />

      {/* Floating Sparkles Particles */}
      <SparkPath x={180} y={220} scale={0.4} opacity={0.4} />
      <SparkPath x={1280} y={260} scale={0.5} opacity={0.5} />
      <SparkPath x={620} y={180} scale={0.3} opacity={0.3} />
      <SparkPath x={910} y={540} scale={0.4} opacity={0.4} />
      <SparkPath x={480} y={640} scale={0.45} opacity={0.4} />

    </svg>
  );
};

const DummyWave = () => { 
  return (
    <svg>
      <path 
        d="M 800,0 
           C 710,180 630,350 720,540 
           C 780,680 750,880 650,1020 
           C 600,1080 580,1140 600,1200 
           L 800,1200 Z" 
        fill="#0E3D30" 
      />
    </svg>
  );
};
