# 调试与排错

## AI 时代的调试挑战
AI 生成的代码出 Bug 时，调试**更难**：

- **不熟悉代码**：AI 写的，你不一定完全懂
- **隐性假设**：AI 有未明说的假设
- **缺乏上下文**：你不知道 AI 当时在想什么
- **复杂逻辑**：AI 容易写出"看起来对"的复杂代码

## 系统化的调试流程
```
报告 Bug
   ↓
[1] 复现 Bug
   ↓
[2] 定位根因（最重要）
   ↓
[3] 设计修复方案
   ↓
[4] 实施修复
   ↓
[5] 验证修复
   ↓
[6] 加回归测试
```

## 第 1 步：复现 Bug

### 收集信息
```markdown

## Bug 报告模板

### 现象
[详细描述看到的问题]

### 复现步骤
1. ...
2. ...
3. ...

### 期望行为
[应该是什么样]

### 实际行为
[实际是什么样]

### 环境
- 浏览器：Chrome 120
- 操作系统：macOS 14
- 代码版本：v1.2.3
- 用户：普通用户 / 管理员

### 截图 / 录屏
[附上]

### 错误信息
[控制台报错]
```

### 用 AI 帮助复现
```bash
> 这个 Bug 报告，你能想到哪些可能的原因？
> [粘贴 Bug 报告]
```

## 第 2 步：定位根因

### 调试工具

#### Chrome DevTools
```javascript
// 1. Console
console.log('User data:', user)
console.table(users)

// 2. Breakpoint
// 在 Sources 面板设置断点

// 3. Network
// 看请求是否发出、参数是否正确、响应是什么

// 4. React DevTools
// 检查 Props、State、Hooks

// 5. Performance
// 性能问题排查
```

#### AI 辅助定位
```bash

# 让 AI 帮你分析
> 这段代码为什么返回 undefined？
> [粘贴代码 + 错误信息]

# 让 AI 帮你读 stack trace
> 这个错误堆栈是什么意思？哪个文件、哪一行可能出问题？
> [粘贴 stack trace]

# 让 AI 帮你搜索
> 在项目里搜索所有调用 getUserData 的地方
```

### 定位技巧

#### 1. 二分法
```bash
> 代码 A → 代码 B → 代码 C → 出错
>
> 我们已经知道 A 没问题，C 出错了
> 请帮我重点看 B
```

#### 2. 对照法
```bash
> 这段代码（出错）和那段代码（正常）有什么差异？
> [两个代码片段]
```

#### 3. 假设验证
```bash
> 我的假设是：fetch 没发出请求
> 怎么验证这个假设？
>
> AI 建议：
> 1. 在 Network 面板看
> 2. 加 console.log
> 3. 用 debugger
```

#### 4. 最小复现
```bash
> 帮我写一个最小复现 demo：
> - 一个简单的页面
> - 触发 Bug 的代码
> - 不要业务逻辑干扰
```

## 第 3 步：设计修复方案

### 用 AI 分析多个方案
```bash
> Bug：用户登录后 token 偶尔丢失
>
> 我的方案 A：把 token 存到 localStorage
> 我的方案 B：把 token 存到 cookie（httpOnly）
> 我的方案 C：用 sessionStorage
>
> 哪个方案最好？为什么？
> 有没有我没想到的方案？
```

### 评估方案
```markdown

## 方案对比

### 方案 A：localStorage
- 简单
- XSS 风险
- 容量限制

### 方案 B：httpOnly cookie
- 防 XSS
- 自动随请求发送
- 需要后端配合

### 方案 C：sessionStorage
- 简单
- 关闭标签页就丢失

### 推荐
方案 B（httpOnly cookie）
理由：安全性最高，长期方案
```

## 第 4 步：实施修复

### AI 协作的修复
```bash
> Bug：用户表单提交后白屏
>
> 报错：Cannot read property 'map' of undefined
>
> 相关代码：
> [粘贴代码]
>
> 请修复这个 Bug，并解释为什么之前会出错
```

### 修复时的注意
```typescript
//  不好：只修表面
function renderUsers(users) {
  return users.map(u => <UserCard user={u} />)
  // 改成：
  // return (users || []).map(u => <UserCard user={u} />)
}

//  好：找到根本原因
// 1. 为什么 users 是 undefined？
// 2. API 返回的数据结构是什么？
// 3. 加默认值 + 错误处理
function renderUsers(users: User[] = []) {
  return users.map(u => <UserCard user={u} />)
}

// 4. 加防御性编程
// 5. 加类型保护
function isValidUsers(data: unknown): data is User[] {
  return Array.isArray(data) && data.every(isUser)
}
```

## 第 5 步：验证修复
```bash

# 1. 手动验证
> 在本地重现 Bug 场景，验证修复

# 2. 自动化验证
$ pnpm test

# 3. 回归测试
> 跑一遍相关的所有测试

# 4. AI 审查
> 这次修复，会影响其他地方吗？请检查
```

## 第 6 步：加回归测试
```typescript
// 为修复加测试
describe('UserList - bug fix', () => {
  it('handles empty users array', () => {
    render(<UserList users={[]} />)
    expect(screen.getByText('No users')).toBeInTheDocument()
  })

  it('handles undefined users', () => {
    // 之前会白屏的 Bug
    render(<UserList users={undefined as any} />)
    expect(screen.getByText('No users')).toBeInTheDocument()
  })

  it('handles malformed data', () => {
    render(<UserList users={null as any} />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
```

## 常见 Bug 类型与排查

### 1. 渲染问题
```bash

# 症状：白屏 / 错误显示
> 排查步骤：
> 1. 看 Console 报错
> 2. 检查 React DevTools
> 3. 简化组件到最小复现
> 4. 检查 Props 类型

# AI 协助：
> 我的组件白屏了，控制台报：
> "Cannot read property 'name' of undefined"
> 请帮我分析可能的原因
```

### 2. 状态管理问题
```bash

# 症状：状态不更新 / 更新不及时
> 排查步骤：
> 1. 检查 setState 是否调用
> 2. 检查引用是否变化
> 3. 检查依赖数组

# 常见错误：
useEffect(() => {
  fetch(`/api/users/${userId}`)
}, [])  // ← 缺少依赖
```

### 3. 性能问题
```bash

# 症状：卡顿 / 加载慢
> 排查步骤：
> 1. Chrome DevTools Performance
> 2. 看哪些函数耗时
> 3. 检查是否有不必要的 re-render
> 4. 用 React.memo / useMemo / useCallback

# AI 协助：
> 这个组件每次父组件更新都重新渲染，怎么优化？
```

### 4. 网络问题
```bash

# 症状：请求失败 / 数据错误
> 排查步骤：
> 1. Network 面板看请求
> 2. 检查 URL、参数、headers
> 3. 检查响应、status code
> 4. CORS 问题？
```

### 5. 异步问题
```bash

# 症状：数据时序错乱
> 排查步骤：
> 1. 检查 Promise 链
> 2. 检查 race condition
> 3. 用 AbortController 取消过期请求

# AI 协助：
> 这段异步代码有时返回旧数据，请分析
```

## AI 调试的高级技巧

### 1. 让 AI 当"Debugger"
```bash
> 你是一个前端调试专家。
>
> 我遇到一个问题：
> [描述]
>
> 请帮我：
> 1. 分析可能的原因（列出 5 个）
> 2. 给出排查步骤
> 3. 推荐最可能的根因
```

### 2. 让 AI 解释代码
```bash
> 这段代码做了什么？为什么要这样写？
> [粘贴代码]

# AI 输出解释后，你能更快理解，进而定位问题
```

### 3. 让 AI 生成测试
```bash
> 帮我写一个测试，专门测试这个 Bug 的场景
> Bug：[描述]

# 写完测试，测试不通过就说明 Bug 还在

# 测试通过就说明 Bug 修了
```

### 4. 用 Cursor 的 @Debug
```bash

# 在 Cursor 中

# Cmd+L 打开 Chat

# @Debug 或引用报错信息
```

### 5. 用 Claude Code 调试
```bash
$ claude
> 我遇到 Bug：[描述]
> [粘贴错误信息、相关代码]

# Claude Code 可以：

# - 读相关文件

# - 执行命令（如查看日志）

# - 跑测试

# - 自动定位和修复
```

## 调试工具箱

### Chrome DevTools 快捷键
| 快捷键 | 功能 |
| --- | --- |
| `F12` | 打开 DevTools |
| `Ctrl+Shift+C` | 检查元素 |
| `Ctrl+Shift+J` | 打开 Console |
| `F8` | 暂停/继续 |
| `F10` | 单步跳过 |
| `F11` | 单步进入 |

### React DevTools
```bash

# 安装

# Chrome 扩展：React Developer Tools

# 用法：

# 1. 选择组件

# 2. 看 Props / State / Hooks

# 3. 看组件树

# 4. Profiler 看性能
```

### Redux DevTools（如使用 Redux）
```bash

# 安装
pnpm add @redux-devtools/extension

# 用法：

# - 看 action 历史

# - 时间旅行调试

# - state diff
```

### Vue DevTools（如使用 Vue）
类似 React DevTools。

## 调试反模式

### 反模式 1：乱改试试
```bash
> 我不知道为什么，先改改看
```

**后果**：可能掩盖问题，可能引入新问题。

**正确**：先定位根因，再改。

### 反模式 2：忽略错误
```bash

# 看到 console.error 没当回事
```

**正确**：所有 console.error 都应该调查。

### 反模式 3：不写复现
```bash
> 我本地修好了（其实没复现）
```

**正确**：必须先复现，再修。

### 反模式 4：暴力重构
```bash
> 既然出 Bug，整个组件重写吧
```

**正确**：小步修复，加回归测试。

## 调试的"心法"

### 1. 先复现，再修
没有 100% 复现的 Bug，不要动手修。

### 2. 先怀疑最简单的
80% 的 Bug 是简单原因：
- 拼写错误
- 缺少依赖
- 类型不匹配
- 时序问题

### 3. 二分定位
代码 A → B → C → 出错。问题在 B 之前 or 之后？二分。

### 4. 看证据，不要猜
不要凭直觉改。看 console、网络、stack trace，让数据说话。

### 5. 加测试
修完 Bug 加测试，避免回归。

## 实战：完整调试流程

### 场景：用户列表点删除后没反应
```bash

# 1. 复现
> 用户：点删除按钮没反应

# 2. AI 协助分析
> AI：可能的原因：
> 1. onClick 没绑定
> 2. confirm 弹窗没弹出
> 3. API 调用失败
> 4. API 成功但 UI 没刷新

# 3. 排查

# - 看 Network：API 调用了吗？

# - 看 Console：有报错吗？

# - 看 React DevTools：state 更新了吗？

# 4. 发现：API 调用了，状态没刷新

# 原因：TanStack Query 的 cache 没失效

# 5. 修复
const queryClient = useQueryClient()
const deleteMutation = useMutation({
  mutationFn: userService.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})

# 6. 加测试
it('invalidates cache after delete', async () => {
  // ...
})

# 7. 验证

# - 手动测试：删除后列表刷新

# - 自动化测试通过
```

## 总结
> 调试能力是 AI Coding 时代**最重要的能力之一**。

- 系统化流程：复现 → 定位 → 修复 → 验证
- 用 AI 加速，但要自己判断
- 加回归测试，避免重复
- 不要乱改、不要跳过验证

下一章：[团队协作与流程](/team/overview)