import React, { useState, useRef, useEffect } from 'react';
import { useVisualSettings } from './VisualSettingsProvider';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  isDarkMode: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  isDarkMode
}) => {
  const { settings } = useVisualSettings();
  const isMobile = settings.screenOptimization === 'smartphone';
  
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) return;
    
    const threshold = 100;
    
    if (currentX > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (currentX < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setCurrentX(0);
    setIsDragging(false);
  };

  const transform = isDragging ? `translateX(${currentX}px)` : 'translateX(0px)';

  return (
    <div
      ref={cardRef}
      className={`
        transition-transform duration-200 select-none
        ${isMobile ? 'touch-pan-y' : ''}
        ${className}
      `}
      style={{ transform }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {/* Swipe indicators */}
      {isMobile && isDragging && (
        <>
          {currentX > 50 && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 text-2xl">
              →
            </div>
          )}
          {currentX < -50 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 text-2xl">
              ←
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SwipeableCard;