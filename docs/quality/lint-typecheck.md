# 静态检查体系

## 为什么静态检查是 AI Coding 的"第一道防线"
AI 生成的代码**平均水平高但方差大**。静态检查能在**不运行代码**的情况下捕获大量问题：

```
AI 生成代码
   ↓
[静态检查] ← 70% 的问题在这里被捕获
   ↓
[单元测试] ← 再捕获一部分
   ↓
[人工审查] ← 最后把关
   ↓
合并
```

## 三大静态检查工具

### 1. ESLint（代码质量）
```bash

# 安装
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 推荐配置
```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  rules: {
    // 严格性
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 可访问性
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',

    // 通用
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.js'],
}
```

### 2. TypeScript（类型安全）
```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // 严格模式（关键）
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,

    // 额外严格选项
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // 其他
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "resolveJsonModule": true
  }
}
```

### 3. Prettier（代码风格）
```jsonc
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 工具配合

### package.json 脚本
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\"",
    "typecheck": "tsc --noEmit",
    "check": "pnpm typecheck && pnpm lint && pnpm format:check"
  }
}
```

### 一键检查
```bash

# 检查所有
pnpm check

# 自动修复 + 格式化
pnpm lint:fix && pnpm format
```

## 编辑器集成

### VS Code / Cursor
```jsonc
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

效果：
- 保存时自动格式化
- 保存时自动修复 lint 问题
- 实时显示 TypeScript 错误

## 静态检查在 AI Coding 中的特殊作用

### 1. 捕获 AI 的"幻觉"
```typescript
// AI 可能写出
import { someFunction } from 'nonexistent-package'
//                              ↑ 不存在的包

// TypeScript 会报错：
// Cannot find module 'nonexistent-package'
```

### 2. 防止类型不一致
```typescript
// AI 写的代码
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json())
  //                       ↑ r.json() 是 Promise<any>
  //                                          ↑ 与 Promise<User> 不匹配
}

// TypeScript 严格模式会报错
```

### 3. 强制显式类型
```typescript
//  AI 写的代码（any）
function processData(data: any) { ... }

//  TypeScript 严格模式报错后改写
function processData(data: User[]) { ... }
```

### 4. 发现未使用的变量
```typescript
// AI 写的代码
function calculate() {
  const tax = price * 0.1
  const total = price + tax
  return total
  //   ↑ tax 未使用（实际有使用，但可能是变量名错）
}

// TypeScript 会标记
```

## AI 协作的静态检查策略

### 1. 让 AI 严格遵守规则
在 agents.md 中明确：

```markdown

## 静态检查规则
- TypeScript 严格模式
- 禁止使用 any（必要时用 unknown）
- 禁止 @ts-ignore
- 禁止未使用的变量
- 所有 import 必须显式
- 跳过 lint 检查（eslint-disable）
```

### 2. AI 自审
```bash
> 你刚才写的代码，请跑一遍 typecheck 和 lint：
> pnpm typecheck
> pnpm lint
>
> 如果有错误，请修复
```

### 3. CI 强制
```yaml

# .github/workflows/ci.yml
- name: Lint
  run: pnpm lint

- name: Typecheck
  run: pnpm typecheck

- name: Format check
  run: pnpm format:check
```

任何一项失败，**PR 不能合并**。

## 处理 lint 错误的最佳实践

### 1. 优先修复而非禁用
```typescript
//  错误做法：禁用规则
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function process(data: any) { ... }

//  正确做法：修复代码
function process(data: User[]) { ... }
```

### 2. 项目级豁免要谨慎
```javascript
// .eslintrc.cjs
rules: {
  // 仅在特定情况下允许
  '@typescript-eslint/no-explicit-any': 'off',

  // 全文件禁用（避免）
  // 不要这样
}
```

### 3. 行内豁免的合理使用
```typescript
// 合理的行内豁免
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  // 这里故意不依赖某些值
}, [])
```

## 与 Prettier 的配合

### 不要让 ESLint 管格式
ESLint 应该只管**代码质量**（可能出 bug 的），格式交给 Prettier。

```javascript
// .eslintrc.cjs
extends: [
  'eslint:recommended',
  // ... 其他
  'prettier',  // ← 关键：禁用 ESLint 的格式规则
]
```

### 避免冲突
```jsonc
// .prettierrc
{
  "semi": false  // 不带分号
}

// .eslintrc.cjs
rules: {
  //  不要设置这个，会和 Prettier 冲突
  // 'semi': ['error', 'never'],
}
```

## 高级配置

### 1. 路径别名
```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```javascript
// .eslintrc.cjs
settings: {
  'import/resolver': {
    typescript: {
      project: './tsconfig.json',
    },
  },
}
```

### 2. 自动排序 import
```bash
pnpm add -D eslint-plugin-import eslint-plugin-simple-import-sort
```

```javascript
// .eslintrc.cjs
plugins: ['import', 'simple-import-sort'],
rules: {
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
}
```

### 3. 复杂度检查
```javascript
// .eslintrc.cjs
rules: {
  'complexity': ['warn', 10],
  'max-lines-per-function': ['warn', { max: 100, skipComments: true }],
  'max-depth': ['warn', 4],
}
```

## 静态检查的局限
静态检查**不能发现**：

- 业务逻辑错误
- 性能问题
- UI 显示问题
- 真实环境下的 bug

所以需要：
- 单元测试（业务逻辑）
- E2E 测试（真实环境）
- 人工 Code Review

## 实战：完整的静态检查流程
```bash

# 1. AI 生成代码
> 写一个 React 组件

# 2. 保存（编辑器自动格式化 + ESLint 修复）

# (自动)

# 3. 跑全套检查
$ pnpm check

# 4. 如果有错误，让 AI 修复
> 跑 pnpm check 看错误，并修复

# 5. 手动确认
$ pnpm typecheck
$ pnpm lint
$ pnpm format:check

# 6. 提交
$ git add .
$ git commit -m "feat: add user list component"
```

## 总结
静态检查是**质量保障的地基**。

- **必须配置**：ESLint + TypeScript + Prettier
- **必须严格**：TypeScript 严格模式
- **必须自动化**：CI + 编辑器集成
- **不能替代**：测试和人工审查

下一节：[调试与排错](/quality/debugging)