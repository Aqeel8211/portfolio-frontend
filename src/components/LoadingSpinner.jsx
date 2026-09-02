import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    purple: 'border-purple-600',
    gradient: 'border-t-transparent border-b-transparent'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 ${
          color === 'gradient' 
            ? 'border-blue-600 border-purple-600' 
            : colorClasses[color]
        } border-t-transparent rounded-full animate-spin`}
        style={color === 'gradient' ? {
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: '#3b82f6',
          borderRightColor: '#9333ea'
        } : {}}
      ></div>
    </div>
  );
};

export default LoadingSpinner;