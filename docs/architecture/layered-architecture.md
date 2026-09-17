# 分层架构：UI / 业务 / 数据 三层分离
> 本文是 [架构设计总览](/architecture/overview) 中 ① 分层架构的独立详解。

## 核心思想
**UI 只负责渲染、业务逻辑放在 Hook/Service、数据访问封装在 Repository**。三层各司其职，互不越界。

```
┌─────────────────────────┐
│  Presentation Layer     │  ← 组件、页面（只读 state、调用 action）
│  components/ pages/      │
└──────────┬──────────────┘
           │ 调用
┌──────────▼──────────────┐
│  Business Logic Layer   │  ← Hook、Service、状态机
│  hooks/ services/       │
└──────────┬──────────────┘
           │ 调用
┌──────────▼──────────────┐
│  Data Access Layer      │  ← API 客户端、Repository、缓存
│  api/ repositories/     │
└─────────────────────────┘
```

## AI Coding 收益
- **职责单一**：AI 改 UI 不碰业务、改业务不碰数据 → PR 冲突减少 80%
- **可测试**：每层独立测试，AI 自动生成测试用例
- **可替换**：换 UI 框架不动业务逻辑、换 API 不动 UI

## 反例 vs 正例

### 反例：三层混在一起
```typescript
//  组件里直接 fetch + 业务逻辑 + 渲染
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')                              // 数据层
      .then(r => r.json())
      .then(data => setUsers(data.filter(u => u.active)))  // 业务层
      .then(setUsers)                                // UI 层
  }, [])

  return <div>{users.map(u => <UserCard user={u} />)}</div>  // UI 层
}
```

### 正例：三层分离
```typescript
// data: services/userService.ts
export const userService = {
  list: () => http.get<User[]>('/users')
}

// business: hooks/useActiveUsers.ts
export function useActiveUsers() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.list()
  })
  return useMemo(() => data?.filter(u => u.active) ?? [], [data])
}

// ui: components/UserList.tsx
export function UserList() {
  const users = useActiveUsers()
  return <div>{users.map(u => <UserCard user={u} />)}</div>
}
```

## 在 agents.md 中固化
```markdown

## 分层约定
- 组件禁止直接 fetch（必须走 services/）
- 业务逻辑禁止写在组件中（必须抽到 hooks/ 或 services/）
- 数据获取统一用 TanStack Query
- 业务过滤、排序、计算统一在 hook 层完成
```

## 检查清单
- [ ] 组件中没有 `fetch` / `axios` 调用？
- [ ] 业务逻辑（过滤、排序、计算）都在 hooks 或 services 中？
- [ ] UI 只负责"读 state + 触发 action"，不直接改状态？
- [ ] 数据层可以被 UI 层以外的层（如 Node 脚本）复用？

## 相关章节
- [状态管理分层](/architecture/state-management) — 决定"数据从哪一层流向哪一层"
- [接口契约先行](/architecture/contract-first) — 决定"层与层之间用什么对话"
- [模块化设计](/architecture/modular-design) — 决定"层在哪个模块内"