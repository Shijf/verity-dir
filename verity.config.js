/**
 * Verity 配置文件
 * 这个文件允许用户自定义文件结构验证规则
 */
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
