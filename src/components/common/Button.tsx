import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBE0B] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[46px]'
  };

  const variantStyles = {
    primary: 'bg-[#FFBE0B] text-[#2A2312] font-semibold hover:bg-[#F3B300] active:bg-[#E5A800] shadow-sm shadow-[#FFBE0B]/20 border border-[#E5A800]/50',
    secondary: 'bg-[#FFF3CC] text-[#2A2312] hover:bg-[#FFE58A] border border-[#EADFC4]',
    outline: 'bg-white text-[#2A2312] hover:bg-[#FAF7F0] border border-[#EADFC4]',
    ghost: 'text-[#2A2312] hover:bg-[#EADFC4]/30',
    danger: 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200',
    dark: 'bg-[#2A2312] text-white hover:bg-[#3D331B] border border-[#3D331B]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
