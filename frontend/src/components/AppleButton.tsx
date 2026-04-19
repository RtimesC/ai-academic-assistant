import React, { useState } from 'react';

interface AppleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
}

export default function AppleButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  style = {},
}: AppleButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      hoverShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      boxShadow: '0 2px 10px rgba(255, 255, 255, 0.1)',
      hoverShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
    },
    danger: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
      hoverShadow: '0 8px 25px rgba(245, 87, 108, 0.6)',
    },
    ghost: {
      background: 'transparent',
      color: '#667eea',
      boxShadow: 'none',
      hoverShadow: 'none',
    },
  };

  const sizeStyles = {
    sm: {
      padding: '8px 16px',
      fontSize: '13px',
      borderRadius: '8px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '15px',
      borderRadius: '10px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '17px',
      borderRadius: '12px',
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const baseStyle: React.CSSProperties = {
    ...currentSize,
    background: currentVariant.background,
    color: currentVariant.color,
    border: variant === 'ghost' ? '1.5px solid #667eea' : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: isHovered && !disabled ? currentVariant.hoverShadow : currentVariant.boxShadow,
    opacity: disabled ? 0.6 : 1,
    transform:
      isPressed && !disabled
        ? 'scale(0.98) translateY(2px)'
        : isHovered && !disabled
          ? 'translateY(-2px) scale(1.02)'
          : 'translateY(0) scale(1)',
    outline: 'none',
    backdropFilter: variant === 'secondary' ? 'blur(10px)' : 'none',
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={baseStyle}
    >
      {children}
    </button>
  );
}
