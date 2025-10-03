import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const SpinnerLoader = ({ size = 'md', className = '' }: { size: string; className?: string }) => (
  <Loader2 className={`animate-spin text-rose-300 ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`} />
);

const DotsLoader = ({ size = 'md' }: { size: string }) => {
  const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : size === 'xl' ? 'w-4 h-4' : 'w-2 h-2';
  
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize} bg-rose-300 rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

const PulseLoader = ({ size = 'md' }: { size: string }) => (
  <div className={`${sizeClasses[size as keyof typeof sizeClasses]} bg-rose-300 rounded-full animate-pulse`} />
);

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = ''
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={size} />;
      case 'pulse':
        return <PulseLoader size={size} />;
      default:
        return <SpinnerLoader size={size} className={className} />;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderLoader()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Composants spécialisés pour des cas d'usage courants
export const PageLoader = () => (
  <Loading
    size="lg"
    text="Chargement..."
    fullScreen
    className="min-h-screen"
  />
);

export const ButtonLoader = ({ className = '' }: { className?: string }) => (
  <SpinnerLoader size="sm" className={`mr-2 ${className}`} />
);

export const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  </div>
);

export const TableLoader = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="bg-gray-200 rounded h-4 flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

export default Loading;