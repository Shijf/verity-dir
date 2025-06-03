# 前端组件开发规范

## 目录

1. [简介](#简介)
2. [目录结构规范](#目录结构规范)
3. [组件规范](#组件规范)
4. [子组件规范](#子组件规范)
5. [样式规范](#样式规范)
6. [验证工具使用](#验证工具使用)
7. [Git集成](#git集成)
8. [命名规范（建议）](#命名规范建议)
9. [文档规范（建议）](#文档规范建议)
10. [Props规范（建议）](#props规范建议)
11. [错误处理规范（建议）](#错误处理规范建议)

## 简介

本文档定义了前端项目的组件开发规范，旨在统一团队的代码组织方式，提高代码质量和可维护性。规范涵盖了页面结构、组件结构、子组件拆分等方面。

## 目录结构规范

### 页面目录结构

每个页面目录下只能包含以下指定目录：

- `hooks/`: 存放页面相关的自定义钩子
- `components/`: 存放页面相关的组件

```
PageName/
├── hooks/
│   └── usePageHook.ts
└── components/
    ├── ComponentA/
    └── ComponentB/
```

## 组件规范

### 组件目录结构

1. **组件必须是目录结构**，不允许单文件组件
   ```
   ✅ components/Button/index.tsx
   ❌ components/Button.tsx
   ```

2. **组件目录必须包含以下文件**：
   - `index.tsx`: 组件入口文件
   - `style.ts`: 组件样式文件

3. **组件文件行数限制**：
   - 组件入口文件不得超过200行
   - 当组件代码接近或超过限制时，应考虑拆分为子组件

### 推荐的组件目录结构

```
ComponentName/
├── index.tsx         # 组件入口文件
├── style.ts          # 组件样式
└── components/       # 子组件目录（如果需要）
    ├── SubComponentA/
    └── SubComponentB/
```

## 子组件规范

当组件变得复杂时，应将其拆分为多个子组件。子组件应放置在主组件的`components`目录下。

### 子组件目录结构

1. **子组件也必须是目录结构**，不允许单文件子组件
   ```
   ✅ ComponentName/components/SubComponent/index.tsx
   ❌ ComponentName/components/SubComponent.tsx
   ```

2. **子组件目录必须包含以下文件**：
   - `index.tsx`: 子组件入口文件
   - `style.ts`: 子组件样式文件

3. **子组件文件行数限制**：
   - 子组件入口文件不得超过150行
   - 子组件应保持更小的粒度和更专注的功能

### 子组件示例

```tsx
// ComplexComponent/index.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const ComplexComponent = () => {
  return (
    <div>
      <Header />
      <div>主要内容</div>
      <Footer />
    </div>
  );
};

export default ComplexComponent;
```

## 样式规范

1. 每个组件和子组件都必须有独立的`style.ts`文件
2. 样式应使用CSS-in-JS方案（如styled-components）
3. 样式应当模块化，避免全局样式污染

```ts
// style.ts示例
import { css } from 'styled-components';

export const buttonStyles = css`
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
`;

export default buttonStyles;
```

## 验证工具使用

项目中提供了自动验证工具`verifyPageStructure.js`，用于检查代码是否符合规范。

### 基本使用

验证特定目录：
```bash
node verifyPageStructure.js path/to/page
```

验证Git新增文件：
```bash
node verifyPageStructure.js --git
```

### 自定义配置

可以通过修改项目根目录下的`verity.config.js`文件来自定义验证规则：

```js
module.exports = {
  // 页面目录下允许的目录名称
  allowedDirs: ['hooks', 'components'],
  
  // 组件验证规则
  components: {
    // 组件文件必须是目录结构
    requireDirectory: true,
    // 组件目录中必须有的入口文件
    entryFile: 'index.tsx',
    // 组件文件最大行数限制
    maxLines: 200,
    // 组件必须有的其他文件
    requiredFiles: ['style.ts'],
    
    // 子组件规范
    subComponents: {
      // 子组件目录名
      dirName: 'components',
      // 子组件目录下的组件是否也必须是目录结构
      requireDirectory: true,
      // 子组件目录下的组件必须有的入口文件
      entryFile: 'index.tsx',
      // 子组件目录下的组件最大行数限制
      maxLines: 150,
      // 子组件必须有的其他文件
      requiredFiles: ['style.ts']
    }
  }
};
```

## Git集成

项目提供了Git pre-commit钩子脚本，可以在提交代码前自动验证新增文件是否符合规范。

### 安装Git钩子

```bash
cp pre-commit .git/hooks/
chmod +x .git/hooks/pre-commit
```

安装后，每次执行`git commit`命令时，系统将自动验证新增文件是否符合规范。如果发现问题，提交将被终止，并显示错误信息。

### 错误处理

当验证失败时，系统将输出详细的错误信息，例如：

```
错误: 组件 'Button' 缺少必需的 style.ts 文件
错误: 子组件 'Header' 必须是目录类型，而不是文件
错误: 组件 'Form/index.tsx' 有 220 行，超过了 200 行的限制
```

根据错误信息修复问题后，再次提交即可。

## 命名规范（建议）

以下命名规范作为建议，不作为强制验证项，但建议团队遵循以保持代码一致性。

### 组件命名

1. **组件名使用 PascalCase**
   ```tsx
   // ✅ 推荐
   const ButtonGroup = () => { ... };
   export default ButtonGroup;
   
   // ❌ 避免
   const buttonGroup = () => { ... };
   export default buttonGroup;
   ```

2. **文件夹名与组件名一致**
   ```
   ✅ components/ButtonGroup/index.tsx 导出 ButtonGroup 组件
   ❌ components/button-group/index.tsx 导出 ButtonGroup 组件
   ```

3. **子组件命名体现层级关系**
   - 可在代码内部使用点表示法表达组件关系：
   ```tsx
   // Card/index.tsx
   const Card = () => { ... };
   Card.Header = CardHeader;
   Card.Body = CardBody;
   Card.Footer = CardFooter;
   
   export default Card;
   ```
   - 子组件目录命名应保持语义清晰：
   ```
   ✅ Card/components/Header/
   ✅ Card/components/CardHeader/
   ```

4. **自定义Hook使用`use`前缀**
   ```tsx
   // ✅ 推荐
   const useCardState = () => { ... };
   
   // ❌ 避免
   const cardState = () => { ... };
   ```

## 文档规范（建议）

良好的文档可以帮助团队成员快速理解组件的用途和使用方法。以下文档规范作为建议实践。

### 组件文档

1. **使用JSDoc风格注释**
   ```tsx
   /**
    * 按钮组件 - 提供基础的点击交互功能
    * 
    * @example
    * <Button type="primary" onClick={handleClick}>
    *   点击我
    * </Button>
    * 
    * @param {ButtonProps} props - 组件属性
    * @returns {JSX.Element} 按钮组件
    */
   const Button = ({ type, onClick, children }: ButtonProps) => {
     // 组件实现
   };
   ```

2. **Props 类型说明**
   ```tsx
   /**
    * 按钮属性定义
    */
   interface ButtonProps {
     /** 按钮类型: 'primary' | 'secondary' | 'text' */
     type?: 'primary' | 'secondary' | 'text';
     /** 点击事件处理函数 */
     onClick?: () => void;
     /** 按钮内容 */
     children: React.ReactNode;
   }
   ```

3. **可选：组件README文件**
   
   对于复杂组件，可以考虑在组件目录下添加README.md文件，详细说明：
   - 组件功能描述
   - 使用场景
   - 示例代码
   - 注意事项
   
   ```
   ComponentName/
   ├── index.tsx
   ├── style.ts
   ├── README.md     # 组件文档，不作强制要求
   └── components/
   ```

## Props规范（建议）

良好的Props设计可以提高组件的可用性和可维护性。以下Props规范作为建议实践。

### Props设计原则

1. **使用TypeScript接口定义Props**
   ```tsx
   // ✅ 推荐
   interface ButtonProps {
     type?: 'primary' | 'secondary';
     size?: 'small' | 'medium' | 'large';
     onClick?: () => void;
     children: React.ReactNode;
   }
   
   const Button = ({ type, size, onClick, children }: ButtonProps) => {
     // ...
   };
   
   // ❌ 避免
   const Button = (props) => {
     const { type, size, onClick, children } = props;
     // ...
   };
   ```

2. **为可选Props提供默认值**
   ```tsx
   // 方法1: 使用默认参数
   const Button = ({ 
     type = 'primary', 
     size = 'medium', 
     onClick, 
     children 
   }: ButtonProps) => {
     // ...
   };
   
   // 方法2: 使用defaultProps (React类组件)
   Button.defaultProps = {
     type: 'primary',
     size: 'medium'
   };
   ```

3. **Props解构并指定类型**
   ```tsx
   // ✅ 推荐
   const Button = ({ 
     type, 
     size, 
     ...rest 
   }: ButtonProps) => {
     // ...
   };
   
   // ❌ 避免
   const Button = (props: ButtonProps) => {
     const type = props.type;
     const size = props.size;
     // ...
   };
   ```

4. **避免过多Props**
   - 当Props超过5-7个时，考虑将相关Props分组
   ```tsx
   // ✅ 推荐
   interface ButtonProps {
     // 外观属性分组
     appearance?: {
       type?: 'primary' | 'secondary';
       size?: 'small' | 'medium' | 'large';
       shape?: 'circle' | 'round' | 'square';
     };
     // 行为属性
     onClick?: () => void;
     disabled?: boolean;
     // 内容
     children: React.ReactNode;
   }
   ```

## 错误处理规范（建议）

健壮的错误处理可以提高应用的稳定性和用户体验。以下错误处理规范作为建议实践。

### 组件错误处理

1. **使用错误边界捕获渲染错误**
   ```tsx
   // ErrorBoundary.tsx
   class ErrorBoundary extends React.Component {
     state = { hasError: false, error: null };
     
     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }
     
     componentDidCatch(error, errorInfo) {
       // 可以将错误日志上报到服务器
       console.error('组件错误:', error, errorInfo);
     }
     
     render() {
       if (this.state.hasError) {
         return <div>组件发生错误，请稍后再试</div>;
       }
       
       return this.props.children;
     }
   }
   
   // 使用方式
   <ErrorBoundary>
     <ComplexComponent />
   </ErrorBoundary>
   ```

2. **异步操作错误处理**
   ```tsx
   // ✅ 推荐
   const DataComponent = () => {
     const [data, setData] = useState(null);
     const [error, setError] = useState(null);
     const [loading, setLoading] = useState(false);
     
     useEffect(() => {
       const fetchData = async () => {
         setLoading(true);
         try {
           const response = await fetch('/api/data');
           if (!response.ok) throw new Error('请求失败');
           const result = await response.json();
           setData(result);
         } catch (err) {
           setError(err.message);
           // 可以记录错误日志
         } finally {
           setLoading(false);
         }
       };
       
       fetchData();
     }, []);
     
     if (loading) return <div>加载中...</div>;
     if (error) return <div>错误: {error}</div>;
     if (!data) return <div>无数据</div>;
     
     return <div>{/* 渲染数据 */}</div>;
   };
   ```

3. **表单验证错误处理**
   ```tsx
   const FormComponent = () => {
     const [values, setValues] = useState({ name: '', email: '' });
     const [errors, setErrors] = useState({});
     
     const validate = () => {
       const newErrors = {};
       
       if (!values.name) newErrors.name = '姓名不能为空';
       if (!values.email) newErrors.email = '邮箱不能为空';
       else if (!/\S+@\S+\.\S+/.test(values.email)) {
         newErrors.email = '邮箱格式不正确';
       }
       
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
     };
     
     const handleSubmit = (e) => {
       e.preventDefault();
       if (validate()) {
         // 提交表单
       }
     };
     
     return (
       <form onSubmit={handleSubmit}>
         <div>
           <input
             value={values.name}
             onChange={(e) => setValues({...values, name: e.target.value})}
           />
           {errors.name && <div className="error">{errors.name}</div>}
         </div>
         {/* 其他表单项 */}
       </form>
     );
   };
   ```

4. **优雅降级和功能检测**
   ```tsx
   const FeatureComponent = () => {
     const isFeatureSupported = typeof window !== 'undefined' && 'someAPI' in window;
     
     if (!isFeatureSupported) {
       return <div>您的浏览器不支持此功能，请升级浏览器</div>;
     }
     
     return <div>{/* 使用特性的组件内容 */}</div>;
   };
   ```
