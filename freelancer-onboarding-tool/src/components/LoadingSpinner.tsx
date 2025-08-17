'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  variant = 'primary',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-blue-200 border-t-blue-600',
    secondary: 'border-slate-200 border-t-slate-600',
    accent: 'border-violet-200 border-t-violet-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div 
        className={`
          animate-spin rounded-full border-4 
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
        `}
      ></div>
      {text && (
        <div className="text-center">
          <p className={`font-medium text-slate-600 animate-pulse ${textSizeClasses[size]}`}>
            {text}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              <span className="text-gradient">Client</span>
              <span className="text-slate-800">Handle</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export function SkeletonLoader({ lines = 3, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-4 last:mb-0">
          <div className={`h-4 loading-skeleton rounded-md ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}></div>
        </div>
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 loading-skeleton rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 loading-skeleton rounded-md w-3/4 mb-2"></div>
              <div className="h-3 loading-skeleton rounded-md w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 loading-skeleton rounded-md"></div>
            <div className="h-3 loading-skeleton rounded-md w-5/6"></div>
            <div className="h-3 loading-skeleton rounded-md w-4/6"></div>
          </div>
        </div>
      ))}
    </>
  );
}