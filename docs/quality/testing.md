# 测试策略

## 测试金字塔
```
        /\
       /  \      E2E 测试（少量）
      /----\     - 关键流程
     /      \    - 慢、贵、真实
    /--------\
   /          \  集成测试（适量）
  /------------\ - 组件测试
 /              \- API 测试
/________________\
                    单元测试（大量）
                    - 工具函数
                    - 快、便宜
```

AI Coding 时代，这个金字塔**更加重要**，因为：
- AI 生成的代码**默认没有测试**-AI 的"幻觉"需要测试捕获
- 业务正确性需要测试保障

## 测试执行策略：什么时候跑什么

知道写什么测试只是第一步，**在正确的时间跑正确的测试**同样关键。不同阶段的测试目标不同：

| 时机 | 测试类型 | 命令 | 目标 |
|------|---------|------|------|
| **编码中**| 相关文件的单元测试 | `vitest --watch` | 秒级反馈，边写边测 |
| **pre-commit**| 单元 + 组件测试 | `vitest run --changed` | 快速拦截，< 30s |
| **push 前**| 单元 + 组件 + 集成 | `vitest run` | 完整验证，< 2min |
| **PR / CI**| 全量测试 | `vitest run --coverage` | 覆盖率检查 |
| **合并前 CI**| 全量 + E2E | `vitest run && playwright test` | 终极防线，< 10min |

### 本地开发：只跑改动的

```bash
# 监听模式，文件改动自动跑相关测试
pnpm test:watch

# 只跑改动的文件（搭配 lint-staged）
pnpm test -- --changed
```

### pre-commit：快速拦截

通过 husky + lint-staged 在提交前自动跑测试：

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "vitest related --run"
    ]
  }
}
```

```bash
# .husky/pre-commit
pnpm lint-staged
```

> **原则**：pre-commit 只跑**改动文件的相关测试**，保证 < 30 秒。不要让提交变得痛苦。

### PR / CI 流水线

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  unit-and-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test -- --coverage

  e2e:
    needs: unit-and-integration
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
```

### 为什么用 Vitest 而不是 Jest

| | Vitest | Jest |
|---|--------|------|
| **启动速度**| 毫秒级（原生 ESM） | 秒级（需要转译） |
| **TypeScript**| 零配置开箱即用 | 需要 ts-jest 或 babel |
| **Vite 集成**| 与 Vite 共享配置 | 需要额外配置 |
| **Watch 模式**| 极快，文件变更即跑 | 较慢 |
| **API 兼容**| 与 Jest 几乎一致 | — |

> 如果你的项目用 Vite 构建，**没有理由不用 Vitest**。迁移成本极低，API 基本兼容。

## 测试层级与 AI 协作

### 1. 单元测试（Vitest）

#### 工具函数测试
```typescript
// src/utils/format.ts
export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

// src/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format'

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(100)).toBe('¥100.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })

  it('formats decimals', () => {
    expect(formatCurrency(99.9)).toBe('¥99.90')
  })

  it('handles negative', () => {
    expect(formatCurrency(-50)).toBe('¥-50.00')
  })
})
```

**AI 协作**：

```bash
> 为 src/utils/format.ts 写单元测试，覆盖：
> - 正常输入
> - 边界值
> - 错误输入
> 参考 agents.md
```

### 2. 组件测试（Testing Library）

#### 基础组件测试
```typescript
// src/components/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button loading>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
```

**AI 协作**：

```bash
> 为 Button 组件写组件测试：
> - 渲染
> - 点击
> - disabled 状态
> - loading 状态
> - 键盘交互（Enter / Space）
> 参考 agents.md
```

### 3. Hook 测试
```typescript
// src/hooks/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it('increments', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  it('decrements', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(4)
  })

  it('does not go below min', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)
  })
})
```

### 4. 集成测试
```typescript
// src/components/UserList/UserList.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserList } from './UserList'
import { userService } from '@/services/user'

vi.mock('@/services/user')

describe('UserList integration', () => {
  beforeEach(() => {
    vi.mocked(userService.list).mockResolvedValue({
      list: [
        { id: '1', name: 'Alice', email: 'alice@test.com' },
        { id: '2', name: 'Bob', email: 'bob@test.com' },
      ],
      total: 2,
    })
  })

  it('renders users from API', async () => {
    render(<UserList />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  it('handles empty state', async () => {
    vi.mocked(userService.list).mockResolvedValue({ list: [], total: 0 })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('No users')).toBeInTheDocument()
    })
  })

  it('handles error', async () => {
    vi.mocked(userService.list).mockRejectedValue(new Error('API Error'))

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument()
    })
  })

  it('deletes user with confirmation', async () => {
    const user = userEvent.setup()
    vi.mocked(userService.delete).mockResolvedValue(undefined)

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // 点击删除按钮
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // 确认弹窗
    await user.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(userService.delete).toHaveBeenCalledWith('1')
    })
  })
})
```

### 5. E2E 测试（Playwright）
```typescript
// e2e/user-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test('complete user CRUD flow', async ({ page }) => {
    // 1. 登录
    await page.goto('/login')
    await page.fill('[name="email"]', 'admin@test.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')

    // 2. 进入用户列表
    await page.goto('/users')
    await expect(page.locator('h1')).toContainText('Users')

    // 3. 创建用户
    await page.click('button:has-text("New User")')
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'test@test.com')
    await page.click('button:has-text("Submit")')

    // 4. 验证出现
    await expect(page.locator('text=Test User')).toBeVisible()

    // 5. 搜索
    await page.fill('[placeholder="Search"]', 'Test')
    await expect(page.locator('text=Test User')).toBeVisible()

    // 6. 删除
    await page.click('[data-testid="delete-Test User"]')
    await page.click('button:has-text("Confirm")')

    // 7. 验证消失
    await expect(page.locator('text=Test User')).not.toBeVisible()
  })

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API 失败
    await page.route('**/api/users', route => route.abort())

    await page.goto('/users')

    await expect(page.locator('text=Failed to load')).toBeVisible()
  })
})
```

## 测试覆盖率目标
| 类型 | 目标覆盖率 |
| --- | --- |
| **工具函数**| > 90% |
| **业务组件**| > 80% |
| **页面组件**| > 60% |
| **UI 组件**| > 70% |
| **整体项目**| > 75% |

## AI 写测试的技巧

### 1. 让 AI 写测试
```bash
> 为 src/services/user.ts 写单元测试：
> - 覆盖正常情况
> - 覆盖错误情况
> - 覆盖边界值
> 使用 Vitest
```

### 2. AI 生成测试的常见问题
| 问题 | 对策 |
| --- | --- |
| **测试过于简单**| 明确要求覆盖边界情况 |
| **过度 mock**| 限制 mock 范围 |
| **缺少断言**| 检查每个 case 都有 expect |
| **测试实现细节**| 明确"测行为不测实现" |

### 3. 测试代码本身的 Review
```bash
> 你刚才写的测试，请自查：
> - 是否覆盖了所有边界
> - 是否过度 mock
> - 是否测试了实现细节
> - 是否便于维护
```

## TDD 与 AI Coding

### 反例：先 AI 写代码再补测试
```
 AI 写代码 → 人写测试 → 发现问题 → 改代码
   （测试沦为"补作业"）
```

### 正例：测试驱动
```
 先写测试用例（人工或 AI）
   ↓
AI 写实现
   ↓
跑测试，通过则继续
   ↓
不通过则让 AI 改
```

**AI Coding + TDD**：

```bash

# 1. 写测试
> 帮我写 useCounter 的测试：
> - 初始值
> - 增减
> - min/max 边界
> - 重置

# 2. 写实现
> 跑测试，看是否通过
> 不通过则修改实现

# 3. 重构
> 测试通过后，重构实现
> 确保测试仍通过
```

## 测试命令规范
```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Mock 策略

### HTTP Mock
```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json({
      list: [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ],
      total: 2,
    })
  }),
]
```

### 局部 Mock
```typescript
// 在测试文件中
import { vi } from 'vitest'
import { userService } from '@/services/user'

vi.mock('@/services/user', () => ({
  userService: {
    list: vi.fn(),
    get: vi.fn(),
  },
}))
```

### 真实 API（推荐）
```typescript
// 使用 MSW 拦截，更真实
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

export const server = setupServer(...handlers)
```

## 测试与 agents.md
在 agents.md 中加入测试要求：

```markdown

## 测试规范

### 必须有测试
- 所有工具函数
- 所有自定义 Hook
- 所有业务组件
- 复杂页面

### 测试工具
- 单元/组件测试：Vitest + Testing Library
- E2E 测试：Playwright
- Mock：MSW（推荐）

### 覆盖率
- 工具函数 > 90%
- 业务组件 > 80%

### 禁止
- 跳过错误场景测试
- 测试实现细节
- 过度 mock（应该用 MSW）
- 注释掉的测试代码
```

## 实战：AI 协作的测试流程

### 第 1 步：AI 生成实现
```bash
> 写一个 useDebounce Hook
```

### 第 2 步：AI 生成测试
```bash
> 为上面写的 useDebounce 写单元测试：
> - 立即返回初始值
> - 延迟后更新
> - 取消（cleanup）
> - 多次调用只触发一次
```

### 第 3 步：跑测试
```bash
$ pnpm test
```

### 第 4 步：AI 自审
```bash
> 你写的测试，是否：
> - 覆盖了所有边界
> - 有清晰的断言
> - 没有过度 mock
> 请改进
```

### 第 5 步：人工 Review
```bash

# 检查：

# - 测试是否真的在测行为

# - 是否有遗漏的场景

# - 命名是否清晰
```

## 总结
测试是**AI Coding 质量保障的最后一道防线**。

- AI 生成代码 → AI 生成测试 → 人工审查
- 测试金字塔：单元 > 集成 > E2E
- TDD + AI Coding 是最强组合
- 不要"AI 写完就算了"

下一节：[静态检查体系](/quality/lint-typecheck)