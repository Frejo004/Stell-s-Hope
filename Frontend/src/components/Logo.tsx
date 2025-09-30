import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className="text-rose-400">Stell's</span>
      <span className="text-gray-800 ml-1">Hope</span>
    </div>
  );
}