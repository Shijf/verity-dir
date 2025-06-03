import { css } from 'styled-components';

// 卡片样式
export const cardStyles = css`
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .card-header {
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .card-body {
    padding: 16px;
    
    p {
      margin: 0;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  
  .card-footer {
    padding: 16px;
    border-top: 1px solid #e8e8e8;
    background-color: #f7f7f7;
  }
`;

export default cardStyles;
