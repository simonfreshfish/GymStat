import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useVisualSettings } from './VisualSettingsProvider';
import TouchOptimizedButton from './TouchOptimizedButton';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode,
  size = 'medium'
}) => {
  const { settings } = useVisualSettings();
  const isMobile = settings.screenOptimization === 'smartphone';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: isMobile ? 'max-w-sm' : 'max-w-md',
    medium: isMobile ? 'max-w-md' : 'max-w-lg',
    large: isMobile ? 'max-w-lg' : 'max-w-2xl',
    fullscreen: isMobile ? 'w-full h-full max-w-none max-h-none m-0 rounded-none' : 'max-w-4xl'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`
        w-full rounded-lg shadow-xl transition-colors duration-300 
        ${sizeClasses[size]}
        ${isMobile ? 'max-h-[90vh]' : 'max-h-[80vh]'}
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between border-b transition-colors duration-300
          ${isMobile ? 'p-4' : 'p-6'}
          ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <h3 className={`
            font-semibold transition-colors duration-300
            ${isMobile ? 'text-lg' : 'text-xl'}
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            {title}
          </h3>
          <TouchOptimizedButton
            onClick={onClose}
            variant="secondary"
            size="small"
            isDarkMode={isDarkMode}
            className="!p-2"
          >
            <X size={20} />
          </TouchOptimizedButton>
        </div>

        {/* Content */}
        <div className={`
          overflow-y-auto
          ${isMobile ? 'p-4' : 'p-6'}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileModal;