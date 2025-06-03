import React from 'react';

/**
 * 按钮组件
 * 符合规范的组件：
 * 1. 在components目录下
 * 2. 是一个目录
 * 3. 包含index.tsx文件
 * 4. 文件行数小于200行
 */

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`button ${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
