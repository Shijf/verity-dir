import React from 'react';
import Header from './components/Header';

/**
 * 复杂组件示例，包含子组件目录
 * 符合规范的组件目录结构
 */
interface ComplexComponentProps {
  title: string;
  content: string;
}

const ComplexComponent: React.FC<ComplexComponentProps> = ({ 
  title, 
  content 
}) => {
  return (
    <div className="complex-component">
      <Header title={title} />
      <div className="content">
        {content}
      </div>
    </div>
  );
};

export default ComplexComponent;
