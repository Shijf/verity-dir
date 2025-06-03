import React from 'react';

/**
 * 这个复杂组件不完全符合规范
 * 它缺少style.ts文件，并且子组件结构有问题
 */
interface InvalidComplexComponentProps {
  title: string;
  content: string;
}

const InvalidComplexComponent: React.FC<InvalidComplexComponentProps> = ({ 
  title, 
  content 
}) => {
  return (
    <div className="invalid-complex-component">
      <div className="header">
        <h2>{title}</h2>
      </div>
      <div className="content">
        {content}
      </div>
    </div>
  );
};

export default InvalidComplexComponent;
