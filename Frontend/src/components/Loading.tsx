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
  xl: 'w-10 h-10'
};

const SpinnerLoader = ({ size = 'md', className = '' }: { size: string; className?: string }) => (
  <Loader2 className={`animate-spin text-stone-900 ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`} />
);

const DotsLoader = ({ size = 'md' }: { size: string }) => {
  const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2.5 h-2.5' : size === 'xl' ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <div className="flex items-center space-x-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize} bg-stone-900 rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '0.9s'
          }}
        />
      ))}
    </div>
  );
};

const PulseLoader = ({ size = 'md' }: { size: string }) => (
  <div className={`${sizeClasses[size as keyof typeof sizeClasses]} bg-stone-900 rounded-full animate-ping opacity-75`} />
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
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoader()}
      {text && (
        <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FAF9F6]/85 backdrop-blur-sm flex items-center justify-center z-50">
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
    text="Préparation de l'Atelier..."
    fullScreen
    className="min-h-screen"
  />
);

export const ButtonLoader = ({ className = '' }: { className?: string }) => (
  <SpinnerLoader size="sm" className={`mr-2 ${className}`} />
);

export const CardLoader = () => (
  <div className="animate-pulse space-y-3 p-4 rounded-3xl border border-stone-200/60 bg-white">
    <div className="bg-stone-100 rounded-2xl h-48 mb-3"></div>
    <div className="space-y-2">
      <div className="bg-stone-100 rounded-full h-3 w-3/4"></div>
      <div className="bg-stone-100 rounded-full h-3 w-1/2"></div>
    </div>
  </div>
);

export const TableLoader = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="animate-pulse space-y-3 p-4">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="bg-stone-100 rounded-xl h-4 flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

export default Loading;