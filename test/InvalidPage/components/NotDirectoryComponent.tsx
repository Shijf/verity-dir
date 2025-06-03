import React from 'react';

/**
 * 这个组件不符合规范，因为它是一个文件而不是目录
 * 验证脚本应该检测到这个问题
 */

const NotDirectoryComponent: React.FC = () => {
  return (
    <div>
      <h1>这个组件不符合规范</h1>
      <p>因为它不是一个目录，而是直接的文件</p>
    </div>
  );
};

export default NotDirectoryComponent;
