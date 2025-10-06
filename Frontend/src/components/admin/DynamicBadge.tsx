import React from 'react';

interface DynamicBadgeProps {
  count: number;
  maxDisplay?: number;
  className?: string;
}

export const DynamicBadge: React.FC<DynamicBadgeProps> = ({ 
  count, 
  maxDisplay = 99, 
  className = "bg-red-500 text-white" 
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxDisplay ? `${maxDisplay}+` : count.toString();

  return (
    <span className={`text-xs rounded-full px-2 py-1 min-w-[20px] text-center ${className}`}>
      {displayCount}
    </span>
  );
};