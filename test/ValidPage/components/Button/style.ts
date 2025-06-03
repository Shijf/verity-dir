import { css } from 'styled-components';

// 按钮样式
export const buttonStyles = {
  primary: css`
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #40a9ff;
    }
  `,
  
  secondary: css`
    background-color: white;
    color: #1890ff;
    border: 1px solid #1890ff;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      color: #40a9ff;
      border-color: #40a9ff;
    }
  `
};

export default buttonStyles;
