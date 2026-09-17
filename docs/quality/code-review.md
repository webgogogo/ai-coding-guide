# Code Review 工作流

## 为什么 AI 时代更要 Review
**反直觉的事实**：AI 生成的代码比人类手写**更需要**审查。

原因：
- **风格不一致**：AI 不了解团队历史代码
- **"看起来对"陷阱**：代码语法正确，逻辑可能错
- **模板化倾向**：缺乏业务深度理解
- **盲区**：AI 不知道项目里已有的工具函数

## Review 的两个层面

### 1. 流程层面：什么时候 Review
```
代码生成
   ↓
自动检查（lint/typecheck/test）<-- 必过
   ↓
作者自查
   ↓
AI 自审（让 AI 审查自己的代码）
   ↓
人工 Review
   ↓
合并
```

### 2. 内容层面：Review 什么
| 维度 | 检查项 |
| --- | --- |
| **正确性**| 逻辑是否正确？边界处理？ |
| **可读性**| 命名？注释？结构？ |
| **一致性**| 是否符合项目约定？ |
| **性能**| 是否有明显性能问题？ |
| **安全**| 是否有注入、XSS、CSRF？ |
| **可测试**| 是否便于测试？ |
| **可维护**| 未来能否读懂？ |

## AI 辅助 Review

### 用 AI 审 AI 写的代码
```bash

# Cursor 中选中代码，Cmd+K

# 输入：检查这段代码的潜在问题

# 或在 Composer 中
> 审查以下 PR 的变更，给出 Review 意见：
>
> [粘贴 diff]
```

### 让 AI 自审
```bash
> 你刚才生成的代码，请自己 Review 一遍：
> 1. 有没有遗漏的边界情况？
> 2. 有没有可以简化的地方？
> 3. 有没有更好的实现？
> 4. 是否符合 agents.md？
```

### 审查模板
```markdown
<!-- .claude/templates/review.md -->

请审查以下代码变更：

## 审查要点

### 正确性
- [ ] 逻辑是否正确
- [ ] 边界情况是否处理
- [ ] 错误处理是否完善

### 一致性
- [ ] 命名是否符合 agents.md
- [ ] 代码风格是否一致
- [ ] 是否复用了已有工具

### 性能
- [ ] 是否有明显的性能问题
- [ ] 是否需要 memo / 缓存
- [ ] 是否有内存泄漏

### 安全
- [ ] 输入是否校验
- [ ] 是否有 XSS 风险
- [ ] 是否有敏感信息泄露

### 可测试
- [ ] 是否便于单元测试
- [ ] 副作用是否可控

### 可维护
- [ ] 命名是否清晰
- [ ] 注释是否到位
- [ ] 结构是否合理

## 输出格式

### 优点
- ...

### 建议改进（非阻塞）
- ...

### 必须修改（阻塞）
- ...

### 详细评论
文件:行号 - 评论内容
```

## 人工 Review 重点

### 1. 业务正确性
```typescript
// AI 写的代码看起来对
function calculateOrderTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// 但业务上：
// - 优惠券怎么算？
// - 税费怎么算？
// - 折扣怎么算？
// 这些 AI 不知道
```

**人工审查要点**：AI 是否理解业务规则？

### 2. 边界处理
```typescript
// AI 写的代码
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 缺失：
// - 网络错误处理
// - 用户不存在（404）
// - 未授权（401）
// - 超时
```

**人工审查要点**：边界情况都处理了吗？

### 3. 一致性
```typescript
// AI 写的代码可能是这样
const userData = await getUserInfo(userId)

// 但项目其他地方都这样
const user = await userService.get(userId)
```

**人工审查要点**：是否遵循了项目约定？

### 4. 安全敏感
```typescript
// AI 可能写出
function renderContent(content: string) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

// XSS 风险！
```

**人工审查要点**：是否有安全风险？

### 5. 性能陷阱
```typescript
// AI 写的代码
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// 大列表性能问题
// 应该有 memo 或虚拟滚动
```

**人工审查要点**：性能影响如何？

## Review 的常见发现

### AI 生成的常见问题

#### 1. 过度设计
```typescript
// AI 过度抽象
interface UserProvider {
  getUser(): Promise<User>
}

interface UserService extends UserProvider {
  validateUser(user: User): boolean
}

class DefaultUserService implements UserService {
  // 100 行实现
}

// 实际上直接写个函数就够了
async function getUser(id: string) {
  return fetch(`/api/users/${id}`).then(r => r.json())
}
```

#### 2. 不必要的依赖
```typescript
// AI 引入 lodash，但项目已有类似工具
import _ from 'lodash'
const unique = _.uniq(arr)

// 项目已有
import { unique } from '@/utils/array'
```

#### 3. 错别字 / 命名不一致
```typescript
// AI 写的
function getUserInofo(id: string) { ... }
//                                ↑ 拼写错误
```

#### 4. 缺少错误处理
```typescript
// AI 写的
const data = await fetchData()
return data.list

// 应该
try {
  const data = await fetchData()
  return data?.list ?? []
} catch (error) {
  console.error('Failed to fetch data:', error)
  return []
}
```

#### 5. 测试覆盖不足
```typescript
// AI 写的测试
test('renders correctly', () => {
  render(<Component />)
})

// 缺少：
// - 不同 props 的渲染
// - 用户交互
// - 边界情况
// - 错误处理
```

## Review 清单

### 提交前（作者自查）
- [ ] 代码已格式化（Prettier）
- [ ] Lint 通过
- [ ] TypeCheck 通过
- [ ] 单元测试通过
- [ ] 手动测试页面正常
- [ ] AI 自审过一轮
- [ ] 更新了相关文档

### Reviewer 检查
- [ ] 业务逻辑正确
- [ ] 边界情况完整
- [ ] 错误处理充分
- [ ] 命名符合约定
- [ ] 没有重复代码
- [ ] 性能可接受
- [ ] 安全无问题
- [ ] 测试覆盖充分
- [ ] 文档同步更新

## Review 礼仪

### 反馈方式
```markdown
 "建议把 user 改成更具描述性的名字，比如 currentUser，因为这里可能有多个用户"
（解释 + 建议）

 "这个名字不好"
（无解释）

 "这里可能有空指针，建议加 optional chaining 或默认值"
（解释 + 建议）

 "这里有 bug"
（无解释）

 "可以参考 src/components/UserCard 的实现，保持一致"
（具体参考）

 "看看其他地方怎么写的"
（不具体）
```

### 优先级标记
```
 [Blocker] 必须修改
 [Nit] 建议改进，可不改
 [Idea] 提供思路，可讨论
 [Question] 提问，需要作者解释
```

## AI 时代的 Review 文化

### 鼓励"挑刺"
AI 代码最容易"看起来完美"，但实际有问题。**要刻意去找问题**。

### 关注"为什么"而不是"是什么"
```markdown
 "这里用了 useState"
（这是什么）

 "为什么这里用 useState 而不是 useReducer？数据复杂吗？"
（为什么）
```

### 知识共享
Code Review 不只是找 Bug，也是**教学相长**的过程。

```
资深 ↔ 新手：
├── 资深教新手：业务理解、规范、技巧
└── 新手教资深：新工具、新思路、盲区
```

## 工具集成

### Cursor
```bash

# 在 Composer 中：
> 这个 PR 的代码，请给我一个 Review 报告

# 在 Chat 中：
> 审查 src/components/UserList/ 下的最近变更
```

### Claude Code
```bash

# 自动 Review
$ claude review --pr 123

# 或
$ claude
> /review 当前的 diff
```

### GitHub PR 模板
```markdown
<!-- .github/pull_request_template.md -->

## 变更说明
<!-- 描述这个 PR 做了什么 -->

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档

## AI Coding 说明
- [ ] 此 PR 由 AI 协助生成
- [ ] AI 工具：[填写]
- [ ] 已通过 AI 自审
- [ ] 已手动测试

## 测试
- [ ] 单元测试
- [ ] 手动测试
- [ ] E2E 测试（如适用）

## Reviewer 检查清单
- [ ] 业务逻辑
- [ ] 边界处理
- [ ] 错误处理
- [ ] 代码风格
- [ ] 测试覆盖

## 截图（如有 UI 变更）
```

## 总结
> **Code Review 是 AI Coding 时代最关键的人工环节。**
- AI 生成 ≠ 跳过 Review
- 用 AI 辅助 Review（但不能替代）
- 关注业务正确性和边界处理
- 严格把关，但不吹毛求疵

下一节：[测试策略](/quality/testing)