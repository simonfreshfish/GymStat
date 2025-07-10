import React from 'react';
import { useVisualSettings } from './VisualSettingsProvider';

interface TouchOptimizedInputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isDarkMode: boolean;
  step?: string;
  min?: string;
  max?: string;
}

const TouchOptimizedInput: React.FC<TouchOptimizedInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  isDarkMode,
  step,
  min,
  max
}) => {
  const { settings } = useVisualSettings();
  const isMobile = settings.screenOptimization === 'smartphone';

  const baseClasses = `
    w-full border rounded-lg transition-all duration-200
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${isMobile ? 'min-h-[44px] px-4 py-3 text-base' : 'min-h-[36px] px-3 py-2 text-sm'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }
  `;

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      step={step}
      min={min}
      max={max}
      className={`${baseClasses} ${className}`}
      style={{ fontSize: isMobile ? '16px' : '14px' }} // Prevents zoom on iOS
    />
  );
};

export default TouchOptimizedInput;