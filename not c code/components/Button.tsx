import React from 'react';

interface ButtonProps {
  label: string;
  onClick: (val: string) => void;
  variant?: 'default' | 'operator' | 'action' | 'accent';
  className?: string;
  isActive?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'default', className = '', isActive = false }) => {
  const baseStyles = "relative overflow-hidden rounded-xl text-xl font-medium transition-all duration-100 flex items-center justify-center select-none active:scale-95";
  
  // Apply specific styles if the button is programmatically active (from keyboard)
  const activeTransform = isActive ? "scale-95 brightness-125" : "";

  const variants = {
    default: "bg-gray-800 text-gray-200 hover:bg-gray-700 shadow-lg shadow-gray-900/50",
    operator: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/30",
    action: "bg-gray-600 text-white hover:bg-gray-500 shadow-lg shadow-gray-900/50",
    accent: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/30",
  };

  return (
    <button
      onClick={() => onClick(label)}
      className={`${baseStyles} ${variants[variant]} ${activeTransform} ${className}`}
      type="button"
    >
      <span className="relative z-10">{label}</span>
      {/* Subtle shine effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-tr from-white to-transparent transition-opacity duration-300 pointer-events-none" />
      {/* Active highlight overlay */}
      {isActive && <div className="absolute inset-0 bg-white/10 pointer-events-none" />}
    </button>
  );
};