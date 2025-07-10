import React from 'react';
import { useVisualSettings } from './VisualSettingsProvider';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ children, isDarkMode }) => {
  const { settings } = useVisualSettings();
  const isMobile = settings.screenOptimization === 'smartphone';

  return (
    <div className={`
      min-h-screen w-full overflow-x-hidden
      ${isMobile ? 'mobile-layout safe-area-top safe-area-bottom' : 'desktop-layout'}
    `}>
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MobileOptimizedLayout;