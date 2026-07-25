import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
}) => {
  return (
    <Link
      to="/"
      className={`inline-block hover:opacity-90 transition-all duration-300 ${className}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <img
        src="/logo.png"
        alt="SkyNet Holidays"
        className="h-16 md:h-20 w-auto object-contain"
        draggable={false}
      />
    </Link>
  );
};