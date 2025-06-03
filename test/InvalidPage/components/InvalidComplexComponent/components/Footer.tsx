import React from 'react';

/**
 * 这个子组件不符合规范
 * 因为它是一个文件而不是一个目录
 */

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <p>这是一个不符合子组件规范的组件</p>
      <p>它应该是一个目录，而不是一个单独的文件</p>
    </div>
  );
};

export default Footer;
