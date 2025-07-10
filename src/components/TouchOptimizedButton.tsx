import React from 'react';
import { useVisualSettings } from './VisualSettingsProvider';

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  isDarkMode: boolean;
}

const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  isDarkMode
}) => {
  const { settings } = useVisualSettings();
  const isMobile = settings.screenOptimization === 'smartphone';

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 active:scale-95 select-none
    ${isMobile ? 'min-h-[44px] px-4 py-3 text-base' : 'min-h-[36px] px-3 py-2 text-sm'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variantClasses = {
    primary: isDarkMode 
      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
      : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: isDarkMode 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400',
    danger: isDarkMode 
      ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800' 
      : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    success: isDarkMode 
      ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800' 
      : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
  };

  const sizeClasses = {
    small: isMobile ? 'min-h-[40px] px-3 py-2 text-sm' : 'min-h-[32px] px-2 py-1 text-xs',
    medium: isMobile ? 'min-h-[44px] px-4 py-3 text-base' : 'min-h-[36px] px-3 py-2 text-sm',
    large: isMobile ? 'min-h-[52px] px-6 py-4 text-lg' : 'min-h-[44px] px-4 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default TouchOptimizedButton;