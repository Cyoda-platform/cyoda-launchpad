import React from 'react';

export const heroGradient =
  'linear-gradient(135deg, hsl(175,45%,92%) 0%, hsl(175,32%,95%) 35%, hsl(175,18%,97%) 65%, hsl(0,0%,99%) 100%)';

export const ArchitectureField: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 580"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    fill="none"
    aria-hidden="true"
  >
    <g stroke="hsl(175,60%,32%)" strokeWidth="0.35" opacity="0.07">
      {[72, 144, 216, 288, 360, 432, 504].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} />
      ))}
      {[96, 192, 288, 384, 480, 576, 672, 768, 864, 960, 1056, 1152].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="580" />
      ))}
    </g>

    <path d="M -80 580 A 780 780 0 0 1 840 -80" stroke="hsl(175,55%,35%)" strokeWidth="1" opacity="0.16" />
    <path d="M 1280 -40 A 700 700 0 0 1 360 580" stroke="hsl(175,50%,38%)" strokeWidth="0.9" opacity="0.11" />

    <g opacity="0.20" stroke="hsl(175,55%,36%)">
      <circle cx="870" cy="150" r="110" strokeWidth="0.7" strokeDasharray="8 10" />
      <circle cx="870" cy="150" r="30" strokeWidth="0.9" />
      <circle cx="870" cy="150" r="13" strokeWidth="1.2" />
      <circle cx="870" cy="150" r="5" fill="hsl(175,55%,40%)" stroke="none" />
    </g>

    <g opacity="0.15" stroke="hsl(175,52%,36%)">
      <circle cx="230" cy="470" r="17" strokeWidth="0.7" />
      <circle cx="230" cy="470" r="7.5" strokeWidth="1" />
      <circle cx="230" cy="470" r="2.8" fill="hsl(175,52%,40%)" stroke="none" />

      <circle cx="1090" cy="390" r="14" strokeWidth="0.7" />
      <circle cx="1090" cy="390" r="6" strokeWidth="1" />
      <circle cx="1090" cy="390" r="2.2" fill="hsl(175,52%,40%)" stroke="none" />

      <circle cx="130" cy="165" r="11" strokeWidth="0.7" />
      <circle cx="130" cy="165" r="4.5" strokeWidth="1" />
      <circle cx="130" cy="165" r="1.8" fill="hsl(175,52%,40%)" stroke="none" />
    </g>

    <g stroke="hsl(175,50%,38%)" strokeWidth="0.75" opacity="0.11">
      <line x1="130" y1="165" x2="870" y2="150" />
      <line x1="870" y1="150" x2="1090" y2="390" />
      <line x1="230" y1="470" x2="870" y2="150" />
    </g>
  </svg>
);
