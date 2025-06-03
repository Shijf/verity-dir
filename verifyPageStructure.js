#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 验证项目目录结构和组件规范
 * 使用配置文件定义规则，默认规则：
 * 1. pageName 目录下只能有指定目录：hooks、components
 * 2. components 下，组件必须是文件夹类型的，例如 components/Button/index.tsx
 * 3. 每个组件不允许超过200行
 * 
 * 可以通过verity.config.js文件自定义配置
 * 在Git commit时只验证新增的文件
 */

// 加载配置文件
function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'verity.config.js');
  try {
    if (fs.existsSync(configPath)) {
      return require(configPath);
    }
  } catch (error) {
    console.warn('警告: 加载配置文件失败，将使用默认配置');
    console.warn(error);
  }
  
  // 默认配置
  return {
    allowedDirs: ['hooks', 'components'],
    components: {
      requireDirectory: true,
      entryFile: 'index.tsx',
      maxLines: 200
    }
  };
}

// 获取配置
const config = loadConfig();

// 获取Git新增的文件
function getNewlyAddedFiles() {
  try {
    // 获取已暂存但未提交的文件列表
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=A').toString().trim();
    if (!stagedFiles) {
      return [];
    }
    return stagedFiles.split('\n').map(file => path.resolve(process.cwd(), file));
  } catch (error) {
    console.warn('警告: 获取Git新增文件失败，可能不在Git仓库中');
    return null; // 表示未在Git环境中
  }
}

// 解析命令行参数
const args = process.argv.slice(2);
const gitMode = args.includes('--git');
let pagePaths = [];

// 如果是Git模式，获取新增的文件路径
if (gitMode) {
  const newFiles = getNewlyAddedFiles();
  
  if (newFiles === null) {
    console.error('错误: 无法获取Git新增文件，请确保在Git仓库中执行');
    process.exit(1);
  }
  
  if (newFiles.length === 0) {
    console.log('没有新增的文件需要验证');
    process.exit(0);
  }
  
  // 过滤出目录类型的文件，以及它们的父目录
  const dirSet = new Set();
  newFiles.forEach(file => {
    let dir = path.dirname(file);
    while (dir !== process.cwd() && !dirSet.has(dir)) {
      dirSet.add(dir);
      dir = path.dirname(dir);
    }
  });
  
  pagePaths = Array.from(dirSet);
  console.log(`Git模式: 将验证 ${pagePaths.length} 个目录`);
} else {
  // 普通模式，从命令行获取路径
  if (args.length === 0) {
    console.error('请提供页面路径参数，例如：node verifyPageStructure.js src/page/Home');
    console.error('或使用 --git 参数验证新增文件: node verifyPageStructure.js --git');
    process.exit(1);
  }
  
  const pagePath = args[0];
  
  // 如果路径不是绝对路径，则转换为相对于当前工作目录的绝对路径
  const absolutePath = path.isAbsolute(pagePath) 
    ? pagePath 
    : path.resolve(process.cwd(), pagePath);
  
  // 检查路径是否存在
  if (!fs.existsSync(absolutePath)) {
    console.error(`错误: 路径 '${absolutePath}' 不存在`);
    process.exit(1);
  }
  
  // 检查是否是目录
  if (!fs.statSync(absolutePath).isDirectory()) {
    console.error(`错误: '${absolutePath}' 不是目录`);
    process.exit(1);
  }
  
  pagePaths = [absolutePath];
}

// 验证函数：检查 pageName 目录下只能有指定目录
function validatePageStructure(pagePath) {
  const allowedDirs = config.allowedDirs;
  const items = fs.readdirSync(pagePath);
  
  let hasError = false;
  
  items.forEach(item => {
    const itemPath = path.join(pagePath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      if (!allowedDirs.includes(item)) {
        console.error(`错误: 在 ${pagePath} 中发现未授权的目录: ${item}`);
        console.error(`     只允许以下目录: ${allowedDirs.join(', ')}`);
        hasError = true;
      }
    }
  });
  
  return !hasError;
}

// 验证函数：检查组件必须是文件夹类型
function validateComponentsStructure(componentsPath, isSubComponent = false) {
  if (!fs.existsSync(componentsPath)) {
    return true; // 如果组件目录不存在，则无需验证
  }
  
  // 根据是否是子组件选择相应的配置
  const componentConfig = isSubComponent ? config.components.subComponents : config.components;
  
  const items = fs.readdirSync(componentsPath);
  let hasError = false;
  
  items.forEach(item => {
    const itemPath = path.join(componentsPath, item);
    
    // 检查是否是目录
    if (componentConfig.requireDirectory && !fs.statSync(itemPath).isDirectory()) {
      console.error(`错误: ${isSubComponent ? '子' : ''}组件 '${item}' 必须是目录类型，而不是文件`);
      hasError = true;
      return;
    }
    
    // 如果是目录，继续检查
    if (fs.statSync(itemPath).isDirectory()) {
      // 检查是否有入口文件
      const entryFile = componentConfig.entryFile;
      const entryPath = path.join(itemPath, entryFile);
      if (!fs.existsSync(entryPath)) {
        console.error(`错误: ${isSubComponent ? '子' : ''}组件 '${item}' 缺少 ${entryFile} 文件`);
        hasError = true;
        return;
      }
      
      // 检查文件行数是否超过限制
      const maxLines = componentConfig.maxLines;
      const content = fs.readFileSync(entryPath, 'utf8');
      const lines = content.split('\n').length;
      
      if (lines > maxLines) {
        console.error(`错误: ${isSubComponent ? '子' : ''}组件 '${item}/${entryFile}' 有 ${lines} 行，超过了 ${maxLines} 行的限制`);
        hasError = true;
      }
      
      // 检查是否有必要的其他文件
      if (componentConfig.requiredFiles && Array.isArray(componentConfig.requiredFiles)) {
        componentConfig.requiredFiles.forEach(requiredFile => {
          const requiredFilePath = path.join(itemPath, requiredFile);
          if (!fs.existsSync(requiredFilePath)) {
            console.error(`错误: ${isSubComponent ? '子' : ''}组件 '${item}' 缺少必需的 ${requiredFile} 文件`);
            hasError = true;
          }
        });
      }
      
      // 检查是否有子组件目录，如果有则递归验证
      if (!isSubComponent && config.components.subComponents) {
        const subComponentsDirName = config.components.subComponents.dirName;
        const subComponentsPath = path.join(itemPath, subComponentsDirName);
        
        if (fs.existsSync(subComponentsPath)) {
          console.log(`  检查组件 '${item}' 的子组件目录...`);
          if (!validateComponentsStructure(subComponentsPath, true)) {
            hasError = true;
          }
        }
      }
    }
  });
  
  return !hasError;
}

// 执行验证
let allValid = true;

pagePaths.forEach(pagePath => {
  console.log(`开始验证目录: ${pagePath}`);
  let isValid = true;

  // 验证 pageName 目录结构
  if (!validatePageStructure(pagePath)) {
    isValid = false;
  }

  // 验证组件目录结构
  const componentsPath = path.join(pagePath, 'components');
  if (!validateComponentsStructure(componentsPath)) {
    isValid = false;
  }

  // 输出单个目录的结果
  if (isValid) {
    console.log(`✅ 目录 ${pagePath} 验证通过！`);
  } else {
    console.error(`❌ 目录 ${pagePath} 验证失败！`);
    allValid = false;
  }
});

// 输出最终结果
if (allValid) {
  console.log('✅ 所有验证通过！目录结构符合规范。');
} else {
  console.error('❌ 验证失败！请修复上述错误。');
  process.exit(1);
}
