import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-200/60 ${className}`}>
      {children}
    </div>
  );
};

export default Card;