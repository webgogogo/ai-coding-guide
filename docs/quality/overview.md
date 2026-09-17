# 代码质量保障：总览
> "AI 写的代码也是代码，必须经过质量关。"

## 核心观点
AI Coding **不等于**跳过质量保障。相反，因为 AI 代码的"平均水平高但方差大"，**质量保障比以往更重要**。

```
AI 生成的代码
       ↓
质量关卡 1：自动检查（lint / typecheck / test）
       ↓
质量关卡 2：人工审查（Code Review）
       ↓
质量关卡 3：运行时验证（E2E / 手动测试）
       ↓
才能进生产
```

## 质量保障的 4 大支柱
| 支柱 | 作用 | 工具 |
| --- | --- | --- |
| **[Code Review](/quality/code-review)**| 人工审查 AI 代码 | GitHub / GitLab / Cursor |
| **[测试策略](/quality/testing)**| 自动化验证 | Vitest / Testing Library / Playwright |
| **[静态检查](/quality/lint-typecheck)**| 自动化质量门 | ESLint / TypeScript / Prettier |
| **[调试排错](/quality/debugging)**| 运行时问题定位 | Chrome DevTools / AI 辅助 |

## AI 时代质量保障的特殊挑战

### 1. "看起来对"的代码
```typescript
// AI 生成的代码
function calculateDiscount(price: number, userType: string) {
  if (userType === 'vip') return price * 0.8
  if (userType === 'svip') return price * 0.6
  if (userType === 'employee') return price * 0.5
  // ... 看着没问题，但：
  // - 没处理 userType 为 null 的情况
  // - 'employee' 应该在 'vip' 之前吗？
  // - 没有常量，魔法数字 0.8、0.6、0.5
}
```

**人工审查**才能发现这类问题。

### 2. "AI 味"的代码
AI 倾向于生成"教科书式"代码，缺乏业务"行话"：

```typescript
// AI 风格
function handleUserAction(action: UserAction) {
  // ...一堆 handle、process、manage
}

// 业务风格
function 升级VIP(userId: string) {
  // 业务逻辑一眼能看懂
}
```

### 3. "幻觉"导致的 Bug
```typescript
// AI 可能写出"幻觉 API"
import { something } from 'some-nonexistent-package'
```

### 4. 测试覆盖不足
AI 可能**跳过边界情况**：

```typescript
// AI 写的测试
test('renders', () => {
  render(<UserCard user={mockUser} />)
  expect(screen.getByText('Alice')).toBeInTheDocument()
})

// 缺少：
// - 空数据
// - 加载态
// - 错误态
// - 边界值
```

## 质量保障的 ROI
>  **以下数据为经验估算**，具体效果因项目而异。

| 投入 | 产出 |
| --- | --- |
| 配置 ESLint + Prettier | 风格统一，问题减少 30% |
| 配置 TypeScript 严格模式 | 类型错误减少 80% |
| 编写单元测试 | Bug 减少 50%+ |
| 建立 Review 流程 | 知识共享，问题早发现 |
| AI 辅助调试 | 排错时间减少 50% |

## 本章导览
| 章节 | 核心内容 |
| --- | --- |
| [Code Review 工作流](/quality/code-review) | 如何审查 AI 生成的代码 |
| [测试策略](/quality/testing) | 单元测试、组件测试、E2E 测试 |
| [静态检查体系](/quality/lint-typecheck) | Lint、TypeCheck、Prettier |
| [调试与排错](/quality/debugging) | AI 辅助的系统化排查 |

## 质量保障的"零信任"原则
对 AI 生成的代码要**默认不信，逐步建立信任**：

```
第一次：完全人工审查
   ↓
通过 3 次后：相信基础逻辑
   ↓
通过 10 次后：相信常见模式
   ↓
始终审查：架构决策、安全敏感、复杂业务
```

## 质量门禁的 CI 流程
```yaml

# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install

# 关卡 1：类型检查
      - run: pnpm typecheck

# 关卡 2：Lint
      - run: pnpm lint

# 关卡 3：单元测试
      - run: pnpm test --coverage

# 关卡 4：构建
      - run: pnpm build

# 关卡 5：E2E（可选）
      - run: pnpm test:e2e
```

任何关卡失败，**PR 不能合并**。

## AI Coding 的质量红线
以下情况**必须**人工审查，无论 AI 多么自信：

- **认证 / 权限相关代码**
- **支付 / 财务相关代码**
- **数据删除 / 不可逆操作**
- **修改 package.json / 依赖**
- **修改 CI / 部署配置**
- **修改 .env / 密钥相关**

## 总结
质量保障不是**额外负担**，而是**AI Coding 的护栏**。

> 越是依赖 AI，越要严格把关。

下一节：[Code Review 工作流](/quality/code-review)