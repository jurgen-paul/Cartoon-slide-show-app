import React from 'react';

// Character outfit colors
interface OutfitColors {
  primary: string;
  secondary: string;
}

const outfitColorMap: Record<string, OutfitColors> = {
  explorer: { primary: '#22c55e', secondary: '#16a34a' },
  wizard: { primary: '#6366f1', secondary: '#4f46e5' },
  knight: { primary: '#94a3b8', secondary: '#64748b' },
  astronaut: { primary: '#f8fafc', secondary: '#cbd5e1' },
  ninja: { primary: '#1e293b', secondary: '#0f172a' },
  casual: { primary: '#ec4899', secondary: '#db2777' },
};

// 1. RENDER PRESET BACKGROUNDS
export const RenderBackground: React.FC<{ presetId: string; width?: string; height?: string }> = ({
  presetId,
  width = "100%",
  height = "100%",
}) => {
  switch (presetId) {
    case 'forest':
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          {/* Sky */}
          <rect width="800" height="500" fill="#bae6fd" />
          {/* Sun */}
          <circle cx="700" cy="80" r="40" fill="#fef08a" opacity="0.9" />
          <circle cx="700" cy="80" r="48" fill="#fef08a" opacity="0.3" />
          {/* Clouds */}
          <path d="M120 100 A20 20 0 0 1 160 100 A30 30 0 0 1 220 100 A20 20 0 0 1 260 100 Z" fill="#ffffff" opacity="0.9" />
          <path d="M500 130 A25 25 0 0 1 550 130 A35 35 0 0 1 610 130 A25 25 0 0 1 650 130 Z" fill="#ffffff" opacity="0.8" />
          {/* Mountains/Hills far */}
          <path d="M0 500 L150 250 L350 500 Z" fill="#bbf7d0" opacity="0.5" />
          <path d="M200 500 L450 200 L700 500 Z" fill="#bbf7d0" opacity="0.6" />
          <path d="M500 500 L700 280 L850 500 Z" fill="#bbf7d0" opacity="0.5" />
          {/* Midground Hills */}
          <path d="M-100 500 Q200 350 500 500 Z" fill="#86efac" />
          <path d="M300 500 Q600 380 900 500 Z" fill="#4ade80" />
          {/* Pine Trees */}
          {/* Tree 1 */}
          <g transform="translate(180, 280)">
            <rect x="-8" y="50" width="16" height="30" fill="#78350f" />
            <polygon points="0,0 -40,50 40,50" fill="#15803d" />
            <polygon points="0,-20 -30,25 30,25" fill="#166534" />
          </g>
          {/* Tree 2 */}
          <g transform="translate(620, 310) scale(0.8)">
            <rect x="-8" y="50" width="16" height="30" fill="#78350f" />
            <polygon points="0,0 -40,50 40,50" fill="#15803d" />
            <polygon points="0,-20 -30,25 30,25" fill="#166534" />
          </g>
          {/* Cute Flowers on ground */}
          <circle cx="280" cy="450" r="5" fill="#ef4444" />
          <path d="M280 445 A5 5 0 0 1 285 450 A5 5 0 0 1 280 455 A5 5 0 0 1 275 450 Z" fill="#ffffff" opacity="0.8"/>
          
          <circle cx="490" cy="420" r="5" fill="#f59e0b" />
          <path d="M490 415 A5 5 0 0 1 495 420 A5 5 0 0 1 490 425 A5 5 0 0 1 485 420 Z" fill="#ffffff" opacity="0.8"/>

          <circle cx="340" cy="430" r="6" fill="#ec4899" />
        </svg>
      );
    case 'cozy-room':
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          {/* Wallpaper Wall */}
          <rect width="800" height="500" fill="#fef3c7" />
          {/* Stripes */}
          <path d="m 0,0 800,0" stroke="#fde68a" strokeWidth="8" strokeDasharray="15,15" />
          <path d="M 50,0 V 500 M 150,0 V 500 M 250,0 V 500 M 350,0 V 500 M 450,0 V 500 M 550,0 V 500 M 650,0 V 500 M 750,0 V 500" stroke="#fde68a" strokeWidth="2" opacity="0.4" />
          {/* Wood floor */}
          <rect y="360" width="800" height="140" fill="#78350f" />
          {/* Planks */}
          <line x1="0" y1="410" x2="800" y2="410" stroke="#451a03" strokeWidth="2" />
          <line x1="0" y1="460" x2="800" y2="460" stroke="#451a03" strokeWidth="2" />
          {/* Fireplace */}
          <g transform="translate(60, 200)">
            <rect x="0" y="0" width="160" height="160" fill="#991b1b" rx="4" />
            <rect x="25" y="30" width="110" height="130" fill="#1e293b" />
            <rect x="-10" y="-10" width="180" height="20" fill="#1e293b" rx="2" />
            {/* Fire and logs */}
            <rect x="50" y="140" width="60" height="10" fill="#78350f" rx="2" />
            <path d="M60 140 Q80 80 100 140 Q90 110 80 140 Q70 110 60 140 Z" fill="#f97316" />
            <path d="M70 140 Q80 100 90 140 Z" fill="#eab308" />
          </g>
          {/* Window showing stars */}
          <g transform="translate(420, 60)">
            <rect x="0" y="0" width="180" height="200" fill="#1e3a8a" stroke="#d97706" strokeWidth="8" rx="4" />
            {/* Stars outside */}
            <circle cx="30" cy="40" r="2" fill="#ffffff" />
            <circle cx="150" cy="60" r="1.5" fill="#ffffff" />
            <circle cx="80" cy="120" r="2.5" fill="#ffffff" />
            <circle cx="120" cy="30" r="2" fill="#fef08a" />
            {/* Window frame division */}
            <line x1="90" y1="0" x2="90" y2="200" stroke="#d97706" strokeWidth="4" />
            <line x1="0" y1="100" x2="180" y2="100" stroke="#d97706" strokeWidth="4" />
            {/* Cute Curtains */}
            <path d="M 0,0 Q 40,100 0,200 L 0,0 Z" fill="#f43f5e" />
            <path d="M 180,0 Q 140,100 180,200 L 180,0 Z" fill="#f43f5e" />
          </g>
          {/* Small Cozy Plant */}
          <g transform="translate(700, 270)">
            <ellipse cx="0" cy="90" rx="30" ry="12" fill="#15803d" />
            <path d="M -15,90 Q -25,50 -20,20 Q -10,30 -5,95" fill="#22c55e" />
            <path d="M 15,90 Q 25,50 20,20 Q 10,30 5,95" fill="#16a34a" />
            <path d="M 0,90 Q 0,40 -10,10 Q 0,20 5,95" fill="#15803d" />
            <rect x="-16" y="70" width="32" height="30" fill="#b45309" rx="2" />
          </g>
        </svg>
      );
    case 'outer-space':
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          <defs>
            <linearGradient id="spaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="60%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#311042" />
            </linearGradient>
            <radialGradient id="planetGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#9d174d" />
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#spaceGrad)" />
          {/* Stars */}
          <g fill="#ffffff">
            <circle cx="50" cy="80" r="1.5" opacity="0.8" />
            <circle cx="200" cy="50" r="2.5" opacity="0.9" />
            <circle cx="120" cy="220" r="1" opacity="0.6" />
            <circle cx="340" cy="180" r="2" opacity="0.8" />
            <circle cx="480" cy="90" r="1.5" opacity="0.7" />
            <circle cx="680" cy="140" r="2" opacity="0.9" />
            <circle cx="750" cy="80" r="1" opacity="0.5" />
            <circle cx="620" cy="280" r="2" opacity="0.8" />
            <circle cx="700" cy="400" r="1.5" opacity="0.9" />
            <circle cx="300" cy="380" r="2.5" opacity="0.7" />
            <circle cx="100" cy="420" r="1" opacity="0.9" />
          </g>
          {/* Planets */}
          {/* Ring Planet */}
          <g transform="translate(600, 120)">
            {/* Back Ring */}
            <ellipse cx="0" cy="0" rx="90" ry="20" fill="#a21caf" opacity="0.6" transform="rotate(-15)" />
            {/* Body */}
            <circle cx="0" cy="0" r="50" fill="url(#planetGrad)" />
            {/* Front Ring */}
            <path d="M -85,-10 A 90 20 0 0 0 85,10" stroke="#f472b6" strokeWidth="8" fill="none" rx="2" transform="rotate(-15)" />
          </g>
          {/* Yellow planet far */}
          <circle cx="150" cy="300" r="30" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="140" cy="290" r="6" fill="#f59e0b" opacity="0.6" />
          <circle cx="160" cy="315" r="4" fill="#f59e0b" opacity="0.6" />
          {/* Distant swirling Star/Constellation */}
          <path d="M 380,260 Q 420,220 450,260 T 500,260" stroke="#a5b4fc" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="4,4" />
          {/* Moon at bottom left */}
          <g transform="translate(-50, 520)">
            <circle cx="0" cy="0" r="200" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="4" />
            {/* Craters */}
            <circle cx="40" cy="-80" r="15" fill="#94a3b8" opacity="0.4" />
            <circle cx="100" cy="-140" r="25" fill="#94a3b8" opacity="0.4" />
            <circle cx="120" cy="-60" r="10" fill="#94a3b8" opacity="0.3" />
          </g>
        </svg>
      );
    case 'city-street':
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          {/* Sky gradient */}
          <rect width="800" height="500" fill="#1e1b4b" />
          <rect width="800" height="500" fill="#311042" opacity="0.5" />
          {/* Stars */}
          <circle cx="100" cy="40" r="1" fill="#fff" opacity="0.8" />
          <circle cx="340" cy="80" r="1.5" fill="#fff" opacity="0.9" />
          <circle cx="680" cy="50" r="1" fill="#fff" opacity="0.6" />
          {/* Skyline Silhouette */}
          <path d="M 0,340 L 70,340 L 70,160 L 150,160 L 150,340 L 180,340 L 180,120 L 280,120 L 280,340 L 310,340 L 310,220 L 390,220 L 390,340 L 440,340 L 440,80 L 530,80 L 530,340 L 590,340 L 590,200 L 680,200 L 680,340 L 800,340 L 800,500 L 0,500 Z" fill="#0f172a" />
          {/* Glowing Windows */}
          <g fill="#fef08a" opacity="0.7">
            {/* Building 1 */}
            <rect x="90" y="180" width="15" height="20" />
            <rect x="120" y="180" width="15" height="20" />
            <rect x="90" y="220" width="15" height="20" />
            <rect x="120" y="270" width="15" height="20" />
            {/* Building 2 */}
            <rect x="200" y="140" width="20" height="30" />
            <rect x="240" y="140" width="20" height="30" />
            <rect x="200" y="200" width="20" height="30" />
            <rect x="240" y="260" width="20" height="30" />
            {/* Bulding 3 / Tower */}
            <rect x="460" y="100" width="15" height="25" />
            <rect x="490" y="100" width="15" height="25" />
            <rect x="460" y="140" width="15" height="25" />
            <rect x="490" y="180" width="15" height="25" />
            <rect x="460" y="220" width="15" height="25" />
            <rect x="490" y="260" width="15" height="25" />
          </g>
          {/* Ground / Road */}
          <rect y="340" width="800" height="160" fill="#334155" />
          {/* Sidewalk */}
          <rect y="340" width="800" height="15" fill="#64748b" />
          {/* Crosswalk Lines */}
          <g fill="#94a3b8">
            <rect x="150" y="380" width="100" height="20" rx="2" />
            <rect x="150" y="415" width="100" height="20" rx="2" />
            <rect x="150" y="450" width="100" height="20" rx="2" />
          </g>
          {/* Cute Streetlamp */}
          <g transform="translate(700, 160)">
            <rect x="-4" y="0" width="8" height="185" fill="#475569" />
            <path d="M -4,0 Q 15,-20 30,0 L 35,5 Q 15,-10 -4,0" fill="#475569" />
            {/* Lamp Bulb head */}
            <path d="M 20,5 Q 30,5 30,15 L 15,15 Q 15,5 20,5" fill="#fef08a" />
            {/* Glow effect */}
            <polygon points="12,15 40,15 100,185 -50,185" fill="#fef08a" opacity="0.15" />
          </g>
        </svg>
      );
    case 'sunset-beach':
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#431407" />
              <stop offset="35%" stopColor="#7c2d12" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#025a87" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#skyGrad)" />
          {/* Giant Sun */}
          <circle cx="400" cy="280" r="90" fill="#fef08a" />
          <circle cx="400" cy="280" r="120" fill="#f97316" opacity="0.3" />
          {/* Sea */}
          <rect y="280" width="800" height="220" fill="url(#seaGrad)" />
          {/* Wave shadows */}
          <ellipse cx="400" cy="300" rx="300" ry="10" fill="#10b981" opacity="0.1" />
          <ellipse cx="250" cy="350" rx="150" ry="6" fill="#f8fafc" opacity="0.2" />
          <ellipse cx="550" cy="390" rx="180" ry="8" fill="#f8fafc" opacity="0.15" />
          {/* Sun path reflection on sea */}
          <polygon points="380,280 420,280 460,500 340,500" fill="#fef08a" opacity="0.25" />
          {/* Cute sandy hill / palm tree on bottom right */}
          <g transform="translate(680, 500)">
            <ellipse cx="0" cy="0" rx="180" ry="60" fill="#fef08a" />
            {/* Trunk */}
            <path d="M -10,0 Q -40,-130 -100,-220 Q -90,-230 -80,-220 Q -20,-130 10,0" fill="#854d0e" />
            {/* Leaves */}
            <g transform="translate(-90, -220)">
              <path d="M 0,0 Q -60,-30 -120,0 Q -60,10 0,0" fill="#15803d" />
              <path d="M 0,0 Q -40,-70 -80,-90 Q -30,-50 0,0" fill="#166534" />
              <path d="M 0,0 Q 40,-80 90,-100 Q 30,-50 0,0" fill="#167534" />
              <path d="M 0,0 Q 70,-30 130,-20 Q 50,10 0,0" fill="#15803d" />
              <path d="M 0,0 Q 30,40 50,80 Q 15,30 0,0" fill="#166534" />
              <path d="M 0,0 Q -30,40 -50,90 Q -15,30 0,0" fill="#14532d" />
            </g>
          </g>
        </svg>
      );
    case 'school':
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          {/* Wooden panel backdrop */}
          <rect width="800" height="500" fill="#f3f4f6" />
          {/* Wall Bottom Baseboard */}
          <rect y="380" width="800" height="120" fill="#e5e7eb" />
          <rect y="380" width="800" height="10" fill="#9ca3af" />
          {/* Giant Blackboard */}
          <g transform="translate(80, 50)">
            {/* Chalkboard frame */}
            <rect width="640" height="280" fill="#1e3a1e" stroke="#78350f" strokeWidth="12" rx="6" />
            {/* Chalk script / drawings */}
            <text x="50" y="60" fill="#ffffff" fontFamily="sans-serif" fontSize="24" opacity="0.8">ABC Cartoon Show!</text>
            <text x="50" y="110" fill="#ffffff" fontFamily="monospace" fontSize="16" opacity="0.6">&gt; timeline_frame_rate: 12fps</text>
            {/* Math fun */}
            <text x="480" y="80" fill="#fef08a" fontFamily="sans-serif" fontSize="20" opacity="0.9">1 + 1 = 🎨</text>
            {/* Drawing of a sun on board */}
            <circle cx="520" cy="180" r="16" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4,4" opacity="0.7" />
            <line x1="520" y1="150" x2="520" y2="160" stroke="#fff" strokeWidth="2" opacity="0.7" />
            <line x1="520" y1="200" x2="520" y2="210" stroke="#fff" strokeWidth="2" opacity="0.7" />
            <line x1="490" y1="180" x2="500" y2="180" stroke="#fff" strokeWidth="2" opacity="0.7" />
            <line x1="540" y1="180" x2="550" y2="180" stroke="#fff" strokeWidth="2" opacity="0.7" />
            {/* Chalk and eraser at bottom frame */}
            <rect x="180" y="260" width="30" height="10" fill="#ffffff" rx="1" />
            <rect x="220" y="262" width="20" height="6" fill="#fef08a" rx="1" />
            <rect x="250" y="258" width="45" height="12" fill="#374151" rx="2" />
            <rect x="250" y="254" width="45" height="4" fill="#a1a1aa" rx="1" />
          </g>
          {/* Wall School Clock */}
          <g transform="translate(730, 80)">
            <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#9ca3af" strokeWidth="4" />
            {/* Clock ticks */}
            <line x1="0" y1="-28" x2="0" y2="-24" stroke="#111827" strokeWidth="2" />
            <line x1="0" y1="28" x2="0" y2="24" stroke="#111827" strokeWidth="2" />
            <line x1="-28" y1="0" x2="-24" y2="0" stroke="#111827" strokeWidth="2" />
            <line x1="28" y1="0" x2="24" y2="0" stroke="#111827" strokeWidth="2" />
            {/* Hands at 9:00 */}
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-14" y2="0" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4" fill="#ef4444" />
          </g>
        </svg>
      );
    case 'minimal-grid':
    default:
      return (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none">
          <rect width="800" height="500" fill="#f8fafc" />
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="none" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="500" fill="url(#grid)" />
          {/* Soft central badge */}
          <circle cx="400" cy="250" r="8" fill="#cbd5e1" opacity="0.6" />
        </svg>
      );
  }
};

// 2. RENDER PRESET PROPS
export const RenderProp: React.FC<{ propId: string; color?: string }> = ({ propId, color }) => {
  switch (propId) {
    case 'sword':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Blade */}
          <path d="M 45,15 L 55,15 L 53,70 L 47,70 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          {/* Blade Ridge */}
          <line x1="50" y1="16" x2="50" y2="70" stroke="#94a3b8" strokeWidth="1" />
          {/* Guard */}
          <rect x="30" y="70" width="40" height="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" rx="1.5" />
          {/* Hilt */}
          <rect x="46" y="76" width="8" height="15" fill="#78350f" stroke="#451a03" strokeWidth="1.5" rx="1" />
          {/* Pommel */}
          <circle cx="50" cy="94" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
        </svg>
      );
    case 'wand':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Shaft */}
          <line x1="30" y1="85" x2="70" y2="35" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          {/* Stars */}
          <g transform="translate(72,30) scale(1.2)">
            <path d="M 0,-15 L 4,-4 L 15,0 L 4,4 L 0,15 L -4,4 L -15,0 L -4,-4 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          </g>
          {/* Magic spark particles */}
          <circle cx="50" cy="20" r="2.5" fill="#fef08a" />
          <circle cx="85" cy="45" r="1.5" fill="#fef08a" />
          <circle cx="80" cy="15" r="2" fill="#67e8f9" />
        </svg>
      );
    case 'balloon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Balloon string */}
          <path d="M 50,60 Q 45,75 55,85 T 48,98" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Balloon body */}
          <ellipse cx="50" cy="35" rx="25" ry="30" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
          {/* Balloon knot */}
          <polygon points="46,65 54,65 50,60" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
          {/* Balloon highlight */}
          <ellipse cx="40" cy="22" rx="4" ry="7" fill="#ffffff" opacity="0.6" transform="rotate(-15 40 22)" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Stem */}
          <path d="M 50,55 Q 52,75 48,95" fill="none" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
          {/* Stem Leaf */}
          <path d="M 50,75 Q 65,68 62,80 Z" fill="#15803d" />
          {/* Petals */}
          <g fill="#ffffff" stroke="#cbd5e1" strokeWidth="1">
            <circle cx="50" cy="32" r="14" />
            <circle cx="50" cy="68" r="14" />
            <circle cx="32" cy="50" r="14" />
            <circle cx="68" cy="50" r="14" />
            <circle cx="37" cy="37" r="14" />
            <circle cx="63" cy="37" r="14" />
            <circle cx="37" cy="63" r="14" />
            <circle cx="63" cy="63" r="14" />
          </g>
          {/* Flower Center */}
          <circle cx="50" cy="50" r="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
        </svg>
      );
    case 'apple':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Stem */}
          <path d="M 50,22 Q 55,10 62,12" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 53,16 Q 66,8 60,20 Z" fill="#22c55e" />
          {/* Apple body */}
          <path d="M 50,26 C 26,22 22,58 40,74 C 47,80 53,74 50,74 C 47,74 53,80 60,74 C 78,58 74,22 50,26 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
          {/* Highlight */}
          <circle cx="38" cy="40" r="5" fill="#ffffff" opacity="0.6" />
        </svg>
      );
    case 'burger':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Bottom Bun */}
          <path d="M 20,74 C 20,85 80,85 80,74 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          {/* Meat Patty */}
          <rect x="16" y="60" width="68" height="12" fill="#78350f" stroke="#451a03" strokeWidth="2" rx="4" />
          {/* Melted Cheese */}
          <polygon points="17,60 83,60 76,68 50,65 24,68" fill="#ec4899" stroke="#db2777" strokeWidth="1" />
          <polygon points="17,60 83,60 76,68 50,65 24,68" fill="#f59e0b" />
          {/* Lettuce */}
          <path d="M 15,50 Q 20,45 25,50 Q 30,55 35,50 Q 40,45 45,50 Q 50,55 55,50 Q 60,45 65,50 Q 70,55 75,50 Q 80,45 85,50 L 85,58 L 15,58 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          {/* Top Bun */}
          <path d="M 20,46 C 20,20 80,20 80,46 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          {/* Sesame seeds */}
          <ellipse cx="40" cy="30" rx="1.5" ry="3" fill="#fef08a" transform="rotate(30 40 30)" />
          <ellipse cx="60" cy="34" rx="1.5" ry="3" fill="#fef08a" transform="rotate(-30 60 34)" />
          <ellipse cx="50" cy="26" rx="1.5" ry="3" fill="#fef08a" transform="rotate(10 50 26)" />
        </svg>
      );
    case 'donut':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Donut Dough */}
          <circle cx="50" cy="50" r="38" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
          {/* Glazing */}
          <circle cx="50" cy="50" r="32" fill="#db2777" />
          {/* Glazing wavy border */}
          <path d="M 50,18 C 30,18 20,30 20,50 C 20,70 30,82 50,82 C 70,82 80,70 80,50 C 80,30 70,18 50,18 Z" fill="#db2777" />
          {/* Inner circle hole */}
          <circle cx="50" cy="50" r="14" fill="#f8fafc" />
          {/* We must draw the inner border of donut */}
          <circle cx="50" cy="50" r="14" stroke="#b45309" strokeWidth="3" fill="none" />
          <circle cx="50" cy="50" r="17" stroke="#9d174d" strokeWidth="2.5" fill="none" />
          {/* Sprinkles */}
          <line x1="38" y1="30" x2="44" y2="30" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="32" x2="62" y2="38" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="52" x2="34" y2="48" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="58" x2="72" y2="52" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="70" x2="48" y2="68" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Crown Base */}
          <path d="M 15,75 L 85,75 L 80,40 L 65,60 L 50,30 L 35,60 L 20,40 Z" fill="#fbbf24" stroke="#ca8a04" strokeWidth="2" />
          <rect x="18" y="72" width="64" height="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" rx="1" />
          {/* Gems on peaks */}
          <circle cx="20" cy="38" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          <circle cx="50" cy="28" r="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
          <circle cx="80" cy="38" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          {/* Inlayed gems */}
          <circle cx="35" cy="75" r="2.5" fill="#10b981" />
          <circle cx="50" cy="75" r="2.5" fill="#ef4444" />
          <circle cx="65" cy="75" r="2.5" fill="#10b981" />
        </svg>
      );
    case 'wizard-hat':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Hat Cone */}
          <path d="M 15,70 Q 50,60 85,70 L 65,25 Q 56,15 48,15 L 35,35 Z" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
          {/* Brim */}
          <ellipse cx="50" cy="70" rx="42" ry="8" fill="#312e81" />
          <ellipse cx="50" cy="70" rx="38" ry="6" fill="#4338ca" stroke="#312e81" strokeWidth="1.5" />
          {/* Stars on hat */}
          <polygon points="52,38 54,43 59,43 55,46 56,51 52,48 48,51 49,46 45,43 50,43" fill="#fef08a" />
          <polygon points="34,50 35,53 38,53 36,55 37,58 34,56 31,58 32,55 30,53 33,53" fill="#fef08a" />
        </svg>
      );
    case 'ghost':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Ghost body */}
          <path d="M 25,75 Q 15,40 50,15 Q 85,40 75,75 Q 68,85 62,75 Q 56,85 50,75 Q 44,85 38,75 Q 32,85 25,75" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Spooky cute black eyes */}
          <ellipse cx="42" cy="40" rx="3.5" ry="6" fill="#1e293b" />
          <ellipse cx="58" cy="40" rx="3.5" ry="6" fill="#1e293b" />
          {/* Eye shines */}
          <circle cx="43" cy="38" r="1.5" fill="#ffffff" />
          <circle cx="59" cy="38" r="1.5" fill="#ffffff" />
          {/* Cute pink cheeks */}
          <ellipse cx="36" cy="47" rx="4" ry="2" fill="#fda4af" opacity="0.6" />
          <ellipse cx="64" cy="47" rx="4" ry="2" fill="#fda4af" opacity="0.6" />
          {/* Cute smile mouth */}
          <path d="M 47,48 Q 50,52 53,48" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'cactus':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Main trunk */}
          <rect x="42" y="25" width="16" height="65" fill="#15803d" stroke="#14532d" strokeWidth="2" rx="8" />
          {/* Left limb */}
          <path d="M 42,50 H 26 V 34" fill="none" stroke="#15803d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 42,50 H 26 V 34" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right limb */}
          <path d="M 58,60 H 74 V 44" fill="none" stroke="#15803d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 58,60 H 74 V 44" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Re-apply covers so black outlines don't look weird */}
          <rect x="43" y="26" width="14" height="63" fill="#15803d" rx="7" />
          {/* Needles details/stripes */}
          <line x1="50" y1="30" x2="50" y2="85" stroke="#166534" strokeWidth="2" strokeDasharray="5,10" />
          <line x1="30" y1="35" x2="30" y2="45" stroke="#166534" strokeWidth="2" strokeDasharray="3,6" />
          <line x1="70" y1="45" x2="70" y2="55" stroke="#166534" strokeWidth="2" strokeDasharray="3,6" />
          {/* Dirt base */}
          <ellipse cx="50" cy="90" rx="30" ry="8" fill="#78350f" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill={color || "#cbd5e1"} stroke="#64748b" strokeWidth="2" />
        </svg>
      );
  }
};

// 3. COMPLETE RIGGED CHARACTER COMPONENT
export const RenderCharacter: React.FC<{
  skinColor: string;
  outfitColor: string;
  expression: {
    eyes: 'happy' | 'sad' | 'angry' | 'surprised' | 'cute';
    mouth: 'gasp' | 'smile' | 'frown' | 'neutral' | 'smirk' | 'open';
  };
  accessory: 'none' | 'sword' | 'wand' | 'balloon' | 'flower' | 'book';
  // Angles in degrees
  headAngle: number;
  leftArmAngle: number;
  rightArmAngle: number;
  leftLegAngle: number;
  rightLegAngle: number;
  // Selected limb highlight to provide immediate visual feedback of skeleton joints
  selectedRigPart?: string | null;
  className?: string;
}> = ({
  skinColor = '#fbcfe8',
  outfitColor = 'wizard',
  expression,
  accessory = 'none',
  headAngle = 0,
  leftArmAngle = -45,
  rightArmAngle = 45,
  leftLegAngle = 10,
  rightLegAngle = -10,
  selectedRigPart = null,
  className = "",
}) => {
  // Translate outfit category to colors
  const outfit = outfitColorMap[outfitColor] || outfitColorMap.explorer;

  // Render the selected expression face vectors
  const renderEyes = () => {
    switch (expression.eyes) {
      case 'happy':
        return (
          <>
            {/* Curved happy blink eyes */}
            <path d="M -16 -6 Q -12 -12 -8 -6" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 8 -6 Q 12 -12 16 -6" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Drooping sad eyes */}
            <path d="M -16 -12 L -8 -7" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 16 -12 L 8 -7" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="-12" cy="-4" r="3.5" fill="#1e293b" />
            <circle cx="12" cy="-4" r="3.5" fill="#1e293b" />
            {/* Tears */}
            <path d="M -12 0 Q -14 12 -10 12 Q -7 12 -11 0" fill="#38bdf8" />
          </>
        );
      case 'angry':
        return (
          <>
            {/* Angled brows + circular eyes */}
            <line x1="-18" y1="-14" x2="-6" y2="-9" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="18" y1="-14" x2="6" y2="-9" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="-11" cy="-4" r="4.5" fill="#1e293b" />
            <circle cx="11" cy="-4" r="4.5" fill="#1e293b" />
            <circle cx="-10" cy="-5" r="1.5" fill="#ffffff" />
            <circle cx="10" cy="-5" r="1.5" fill="#ffffff" />
          </>
        );
      case 'surprised':
        return (
          <>
            {/* Round open eyes */}
            <circle cx="-12" cy="-6" r="6" fill="#1e293b" />
            <circle cx="12" cy="-6" r="6" fill="#1e293b" />
            <circle cx="-13" cy="-7" r="2" fill="#ffffff" />
            <circle cx="11" cy="-7" r="2" fill="#ffffff" />
          </>
        );
      case 'cute':
      default:
        return (
          <>
            {/* Sparkling adorable eyes */}
            <circle cx="-12" cy="-6" r="7.5" fill="#1e293b" />
            <circle cx="12" cy="-6" r="7.5" fill="#1e293b" />
            {/* Large & small sparkle dots */}
            <circle cx="-14" cy="-8" r="2.5" fill="#ffffff" />
            <circle cx="-10" cy="-4" r="1" fill="#ffffff" />
            <circle cx="10" cy="-8" r="2.5" fill="#ffffff" />
            <circle cx="14" cy="-4" r="1" fill="#ffffff" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression.mouth) {
      case 'gasp':
        return <circle cx="0" cy="11" r="5" fill="#1e293b" />;
      case 'frown':
        return <path d="M -6 14 Q 0 8 6 14" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
      case 'neutral':
        return <line x1="-6" y1="11" x2="6" y2="11" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
      case 'smirk':
        return <path d="M -4 10 Q 2 15 6 9" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
      case 'open':
        // Big laugh mouth
        return <path d="M -8 10 Q 0 20 8 10 Z" fill="#e11d48" stroke="#1e293b" strokeWidth="2" />;
      case 'smile':
      default:
        return <path d="M -8 10 Q 0 16 8 10" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
    }
  };

  return (
    <svg viewBox="0 0 200 240" className={`w-full h-full ${className}`}>
      {/* GLOW HIGHLIGHT FOR SELECTED SKELETON PART */}
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* JOINT ANCHOR POINTS FOR DRAWING hierarchical rigging */}
      {/* TORSO / BODY (Center at x=100, y=120) */}
      <g>
        {/* LEFT LEG (Attached at Left Hip: x=85, y=170) */}
        <g 
          transform={`translate(82, 168) rotate(${leftLegAngle})`} 
          style={selectedRigPart === 'leftLeg' ? { filter: 'url(#glow)', stroke: '#3b82f6', strokeWidth: '2px' } : {}}
        >
          {/* Leg bone and pants trouser */}
          <rect x="-10" y="0" width="20" height="50" fill={outfit.secondary} stroke="#1e293b" strokeWidth="2.5" rx="5" />
          {/* Foot / Boot */}
          <ellipse cx="-4" cy="50" rx="14" ry="10" fill="#1e293b" />
          {/* Shoe details */}
          <rect x="-18" y="52" width="24" height="4" fill="#cbd5e1" rx="1" />
        </g>

        {/* RIGHT LEG (Attached at Right Hip: x=115, y=170) */}
        <g 
          transform={`translate(118, 168) rotate(${rightLegAngle})`}
          style={selectedRigPart === 'rightLeg' ? { filter: 'url(#glow)', stroke: '#3b82f6', strokeWidth: '2px' } : {}}
        >
          <rect x="-10" y="0" width="20" height="50" fill={outfit.secondary} stroke="#1e293b" strokeWidth="2.5" rx="5" />
          {/* Foot / Boot */}
          <ellipse cx="4" cy="50" rx="14" ry="10" fill="#1e293b" />
          {/* Shoe details */}
          <rect x="-6" y="52" width="24" height="4" fill="#cbd5e1" rx="1" />
        </g>

        {/* LEFT ARM (Attached at Left Shoulder: x=75, y=100) */}
        <g 
          transform={`translate(74, 98) rotate(${leftArmAngle})`}
          style={selectedRigPart === 'leftArm' ? { filter: 'url(#glow)', stroke: '#3b82f6', strokeWidth: '2px' } : {}}
        >
          {/* Upper Arm Sleeve */}
          <rect x="-24" y="0" width="18" height="48" fill={outfit.secondary} stroke="#1e293b" strokeWidth="2.5" rx="6" />
          {/* Hand glove */}
          <circle cx="-15" cy="46" r="9" fill={skinColor} stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* RIGHT ARM (Attached at Right Shoulder: x=125, y=100) */}
        {/* If custom accessory is attached, we render it at the edge of the Hand! */}
        <g 
          transform={`translate(126, 98) rotate(${rightArmAngle})`}
          style={selectedRigPart === 'rightArm' ? { filter: 'url(#glow)', stroke: '#3b82f6', strokeWidth: '2px' } : {}}
        >
          {/* Upper Arm Sleeve */}
          <rect x="6" y="0" width="18" height="48" fill={outfit.secondary} stroke="#1e293b" strokeWidth="2.5" rx="6" />
          {/* Hand glove */}
          <circle cx="15" cy="46" r="9" fill={skinColor} stroke="#1e293b" strokeWidth="2" />

          {/* ATTACHED ACCESSORY IN RIGHT HAND */}
          {accessory !== 'none' && (
            <g transform="translate(15, 48) rotate(45) scale(0.65)" style={{ transformOrigin: 'center' }}>
              <RenderProp propId={accessory} />
            </g>
          )}
        </g>

        {/* MAIN BODY TORSO (Centered x=100, y=98 to 170) */}
        <g style={selectedRigPart === 'torso' ? { filter: 'url(#glow)' } : {}}>
          {/* Cute tunic / torso shape */}
          <path d="M 75,95 Q 100,85 125,95 L 125,160 Q 100,172 75,160 Z" fill={outfit.primary} stroke="#1e293b" strokeWidth="3" />
          {/* Shirt details (like simple belt or tie or explorer pocket) */}
          {outfitColor === 'explorer' && (
            <>
              {/* Pocket */}
              <rect x="82" y="105" width="12" height="15" fill={outfit.secondary} rx="2" />
              {/* Belt */}
              <rect x="75" y="142" width="50" height="8" fill="#78350f" />
              <rect x="95" y="140" width="10" height="12" fill="#f59e0b" rx="1" />
            </>
          )}
          {outfitColor === 'wizard' && (
            <>
              {/* Magic collar */}
              <polygon points="100,122 84,92 116,92" fill="#f59e0b" stroke="#312e81" strokeWidth="1" />
              <circle cx="100" cy="122" r="3" fill="#f43f5e" />
            </>
          )}
          {outfitColor === 'knight' && (
            <>
              {/* Armor steel plate ridges */}
              <line x1="88" y1="115" x2="112" y2="115" stroke="#475569" strokeWidth="2" />
              <line x1="85" y1="130" x2="115" y2="130" stroke="#475569" strokeWidth="2" />
              {/* Cute heart symbol for friendly knight! */}
              <path d="M 100,110 C 100,110 97,105 100,103 C 103,105 100,110 100,110" fill="#ef4444" />
            </>
          )}
          {outfitColor === 'astronaut' && (
            <>
              {/* Astronaut badge */}
              <circle cx="92" cy="115" r="5" fill="#ef4444" />
              <rect x="102" y="113" width="12" height="6" fill="#3b82f6" rx="1" />
            </>
          )}
          {outfitColor === 'ninja' && (
            <>
              {/* Red Sash Belt */}
              <rect x="75" y="140" width="50" height="10" fill="#dc2626" />
              <path d="M 115,148 Q 120,165 116,180" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* HEAD ASSEMBLY (Sits at Neck Joint: x=100, y=90) */}
        {/* Rotates relative to bottom center of head (translate pivot to bottom center: y=90) */}
        <g 
          transform={`translate(100, 90) rotate(${headAngle})`}
          style={selectedRigPart === 'head' ? { filter: 'url(#glow)' } : {}}
        >
          {/* Neck */}
          <rect x="-8" y="-12" width="16" height="15" fill={skinColor} stroke="#1e293b" strokeWidth="2" />
          
          {/* Head circle shape (radius 32, offset so center is at x=0, y=-40) */}
          <circle cx="0" cy="-40" r="32" fill={skinColor} stroke="#1e293b" strokeWidth="3" />

          {/* Blushing cheeks */}
          <circle cx="-18" cy="-34" r="5" fill="#fda4af" opacity="0.5" />
          <circle cx="18" cy="-34" r="5" fill="#fda4af" opacity="0.5" />

          {/* Left and Right Ears */}
          <circle cx="-33" cy="-40" r="6" fill={skinColor} stroke="#1e293b" strokeWidth="2" />
          <circle cx="33" cy="-40" r="6" fill={skinColor} stroke="#1e293b" strokeWidth="2" />

          {/* Face Elements */}
          <g transform="translate(0, -40)">
            {renderEyes()}
            {renderMouth()}
          </g>

          {/* Outfit Headwear / Hair / Helmets */}
          {outfitColor === 'explorer' && (
            <>
              {/* Explorer Hat */}
              <path d="M -35,-65 Q 0,-85 35,-65" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
              <path d="M -24,-65 Q 0,-100 24,-65 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
              <rect x="-24" y="-68" width="48" height="6" fill="#ef4444" />
            </>
          )}
          {outfitColor === 'wizard' && (
            <>
              {/* Wizard Hat overlapping Head */}
              <g transform="translate(-50, -112) scale(1)">
                <path d="M 33,52 L 50,8 L 67,52 Z" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
                <ellipse cx="50" cy="52" rx="28" ry="6" fill="#4338ca" stroke="#312e81" strokeWidth="1.5" />
                <polygon points="50,22 51,26 55,26 52,28 53,32 50,30 47,32 48,28 45,26 49,26" fill="#fef08a" />
              </g>
            </>
          )}
          {outfitColor === 'knight' && (
            <>
              {/* Knight Helmet */}
              <path d="M -26,-72 Q 0,-88 26,-72 L 28,-36 L -28,-36 Z" fill="#94a3b8" opacity="0.3" />
              {/* Helmet Plume */}
              <path d="M 0,-70 Q 20,-100 40,-95 Q 20,-85 0,-70" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              {/* Helmet visor/grille */}
              <line x1="-12" y1="-50" x2="12" y2="-50" stroke="#475569" strokeWidth="3" />
              <line x1="-12" y1="-45" x2="12" y2="-45" stroke="#475569" strokeWidth="3" />
              <rect x="-28" y="-70" width="56" height="34" fill="none" stroke="#64748b" strokeWidth="2" rx="4" />
            </>
          )}
          {outfitColor === 'astronaut' && (
            <>
              {/* Glass bubble helmet */}
              <circle cx="0" cy="-40" r="39" fill="#38bdf8" opacity="0.25" stroke="#cbd5e1" strokeWidth="2.5" />
              <ellipse cx="14" cy="-56" rx="14" ry="6" fill="#ffffff" opacity="0.4" transform="rotate(-15 14 -56)" />
            </>
          )}
          {outfitColor === 'ninja' && (
            <>
              {/* Ninja Mask overlay wrapping head */}
              <path d="M -32,-40 C -32,-74 32,-74 32,-40 C 32,-6 32,0 0,0 C -32,0 -32,-6 -32,-40 Z" fill="#1e293b" />
              {/* Cutout for eyes */}
              <ellipse cx="0" cy="-44" rx="22" ry="10" fill={skinColor} stroke="#0f172a" strokeWidth="1.5" />
              {/* Re-draw eyes over cutout */}
              <g transform="translate(0, -40)">
                {renderEyes()}
              </g>
              {/* Headband tie knot */}
              <path d="M -30,-50 Q -50,-55 -45,-38" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              <path d="M -30,-50 Q -45,-68 -42,-45" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
};
