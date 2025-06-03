import React from 'react';

/**
 * 这个子组件目录结构符合要求
 * 但是缺少必需的style.ts文件
 */
interface SubHeaderProps {
  subtitle: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ subtitle }) => {
  return (
    <div className="sub-header">
      <h3>{subtitle}</h3>
    </div>
  );
};

export default SubHeader;
