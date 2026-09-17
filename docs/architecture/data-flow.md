# 单向数据流：让 AI 容易追踪
> 本文是 [架构设计总览](/architecture/overview) 中 ③ 单向数据流的独立详解。

## 核心思想
数据**只在一个方向上流动**，状态变更走明确的"通道"。状态像"水流"，AI 可以沿着数据流追踪。

```
       ┌──────────────────┐
       │   Server State   │  (TanStack Query)
       └────────┬─────────┘
                │ 订阅
       ┌────────▼─────────┐
       │  Global Store    │  (Zustand)
       └────────┬─────────┘
                │ selector
       ┌────────▼─────────┐
       │  Component       │  (只读 state)
       └────────┬─────────┘
                │ dispatch / mutate
       ┌────────▼─────────┐
       │  Action / Hook   │  (业务逻辑)
       └────────┬─────────┘
                │ 触发
       ┌────────▼─────────┐
       │   Server State   │  (invalidate / refetch)
       └──────────────────┘
```

## AI Coding 收益
- **可预测**：AI 看 state 就知道"下一步会怎样"
- **易调试**：单向流 = 数据像"水流"，AI 可以加日志断点追踪
- **易测试**：每个环节可独立 mock
- **易推理**：避免"双向绑定"导致的循环依赖心智负担

## 反例 vs 正例

### 反例：双向数据流 + 状态散落
```typescript
function UserPage() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchUsers(filter).then(setUsers)  // 双向：组件 → API → state → 组件
  }, [filter])

  // 状态散落 3 处：useState、URL、localStorage
  const sortBy = localStorage.getItem('sortBy')

  return <UserList users={users} onChange={setUsers} />  // 双向绑定
}
```

**问题**：
- AI 改 `setUsers` 时不知道会触发什么
- 状态散落 3 处 → AI 不知道哪个是"真值来源"
- `onChange={setUsers}` 双向绑定 → AI 容易写出"循环更新"

### 正例：单向数据流
```typescript
function UserPage() {
  const [filter] = useSearchParams()                      // URL 状态
  const { data: users } = useUsers(filter)                 // 服务端状态
  const sortBy = useUserStore(s => s.sortBy)              // 全局状态
  return <UserList users={users ?? []} sortBy={sortBy} />  // 只读
}
```

**优点**：
- 状态来源明确 → AI 一眼能看出"数据从哪来"
- 组件只"读" → AI 不会误改 state
- 状态变更走 Action / Hook → AI 知道在哪里触发 refetch

## 单向数据流的 4 条铁律

### 1. State 只读
```typescript
//  只读
const users = useUsers()

//  直接改 store
const setUsers = useUserStore.setState  // 禁止在组件中直接调用
```

### 2. Action 通过明确入口
```typescript
//  通过 action
const updateName = useUserStore(s => s.updateName)
updateName('Alice')

//  直接 mutate
useUserStore.setState({ name: 'Alice' })  // 失去可追溯性
```

### 3. 副作用走明确通道
```typescript
//  mutation 成功后 invalidate Query
const mutation = useMutation({
  mutationFn: userService.update,
  onSuccess: () => queryClient.invalidateQueries(['users'])
})

//  mutation 后手动 refetch，逻辑分散
```

### 4. URL 状态只通过 setSearchParams 修改
```typescript
// 
setSearchParams({ page: '2' })

//  直接改 window.location（破坏 React 渲染）
window.location.search = '?page=2'
```

## 在 agents.md 中固化
```markdown

## 数据流约定
- 组件禁止直接 mutate store（必须通过 action）
- 状态来源单一：服务端 → Query、URL → SearchParams、全局 → Zustand
- mutation 成功后必须 invalidate 相关 Query
- 禁止在组件中直接修改 localStorage / sessionStorage
- 禁止双向绑定（onChange={setX} 中 X 是 state 时）
```

## 检查清单
- [ ] 所有组件都"只读" state？
- [ ] 状态修改都通过明确的 action / hook？
- [ ] mutation 后都 invalidate 相关 query？
- [ ] 没有"双向绑定"导致的循环更新？
- [ ] 状态来源单一（不存在 3 处存同一个值）？

## 相关章节
- [状态管理分层](/architecture/state-management) — 决定数据"属于哪类状态"
- [分层架构](/architecture/layered-architecture) — 决定数据"在哪一层流动"
- [接口契约先行](/architecture/contract-first) — 让 mutation 入参、出参都有类型保障