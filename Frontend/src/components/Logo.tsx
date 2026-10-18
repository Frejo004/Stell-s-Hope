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
    <div className={`font-serif select-none inline-flex items-center tracking-tight transition-transform duration-300 hover:scale-[1.02] ${sizeClasses[size]} ${className}`}>
      <span className="font-bold text-stone-950">
        Stell's
      </span>
      <span className="font-normal italic ml-1.5 text-stone-700">
        Hope
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-1 inline-block" />
    </div>
  );
}