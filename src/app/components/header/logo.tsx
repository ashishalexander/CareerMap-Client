import Link from 'next/link';
import React from 'react';

const MapPinIcon = React.memo(() => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-8 h-8 text-blue-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
    <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    <path 
      d="M9 10.6c-1.5.7-2.5 2.3-2.5 4.4M15 10.6c1.5.7 2.5 2.3 2.5 4.4" 
      strokeDasharray="2 2"
    />
  </svg>
));

MapPinIcon.displayName = 'MapPinIcon';

export const CareerMapLogo = React.memo(() => (
  <Link href="/user/Home" className="flex-shrink-0 flex items-center space-x-2">
    <MapPinIcon />
    <div className="flex items-baseline">
      <span className="text-xl font-bold text-blue-600">Career</span>
      <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Map</span>
      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-0.5 animate-pulse"/>
    </div>
  </Link>
));

CareerMapLogo.displayName = 'CareerMapLogo';