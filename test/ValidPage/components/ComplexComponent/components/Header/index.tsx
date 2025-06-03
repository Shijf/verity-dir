import React from 'react';

/**
 * 子组件示例 - 头部组件
 * 位于父组件的components目录下
 */
interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="header">
      <h2>{title}</h2>
    </div>
  );
};

export default Header;
