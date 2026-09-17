# 状态管理分层：让 AI 自动选对工具
> 本文是 [架构设计总览](/architecture/overview) 中 ② 状态管理分层的独立详解。

## 核心思想
不同类型的状态用**不同工具**，**不要一个 store 打天下**。

| 状态类型 | 推荐工具 | AI 判断信号 |
| --- | --- | --- |
| **服务端状态**（来自 API） | TanStack Query / SWR | 关键词："列表"、"详情"、"增删改查" |
| **客户端全局状态**| Zustand / Jotai | 关键词："全局主题"、"侧边栏状态"、"购物车" |
| **表单状态**| React Hook Form + Zod | 关键词："表单"、"校验"、"提交" |
| **URL 状态**| URL Search Params | 关键词："分页"、"搜索词"、"筛选" |
| **UI 临时状态**| useState / useReducer | 关键词："展开收起"、"hover"、"弹窗显示" |

## AI Coding 收益
- **不用 AI 猜**：状态归属明确 → AI 自动选对工具
- **避免错误方案**：AI 不会把"服务端数据"塞进 Zustand → 没有"刷新就丢"的 bug
- **类型自动生成**：服务端类型 + Zod schema → 表单类型自动推导

## 实战示例

### 服务端状态 → TanStack Query
```typescript
//  正确
const { data: users, isLoading } = useQuery({
  queryKey: ['users', params],
  queryFn: () => userService.list(params)
})

//  反例：AI 经常这样写
const [users, setUsers] = useState([])
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setUsers)
}, [])
```

### 表单状态 → React Hook Form + Zod
```typescript
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18)
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
})
```

### URL 状态 → URL Search Params
```typescript
//  正确：分页状态在 URL
const [searchParams, setSearchParams] = useSearchParams()
const page = Number(searchParams.get('page') ?? 1)
const setPage = (p: number) => setSearchParams({ page: String(p) })

//  反例：分页在 useState（刷新就丢、链接无法分享）
const [page, setPage] = useState(1)
```

### 全局 UI 状态 → Zustand
```typescript
export const useUIStore = create<{
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
}>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen }))
}))
```

## 在 agents.md 中固化
```markdown

## 状态管理约定
- 服务端数据（来自 API）：必须用 TanStack Query，禁止 useEffect + fetch
- 表单数据：必须用 React Hook Form + Zod
- URL 状态（分页/搜索/筛选）：必须用 URL Search Params，不用 useState
- 全局 UI 状态（主题/侧边栏）：用 Zustand
- 临时 UI 状态（hover/弹窗）：用 useState
```

## 反模式：把所有状态塞进 Zustand/Redux
```typescript
//  反例：AI 经常这样写"省事"
const useStore = create((set) => ({
  users: [],              // 服务端数据 → 错！刷新就丢
  loading: false,         // 服务端 loading → 错！应该用 Query
  filter: '',             // URL 状态 → 错！刷新就丢
  modalOpen: false,       // UI 状态 → 这个 OK
  formValues: {},         // 表单状态 → 错！应该用 RHF
}))
```

**问题**：所有状态混在一起 → 失去缓存、失去 URL 同步、失去表单校验。

## 检查清单
- [ ] 服务端数据都用 TanStack Query？
- [ ] 表单都用 React Hook Form + Zod？
- [ ] 分页/搜索/筛选都在 URL？
- [ ] 全局 UI 状态才用 Zustand？
- [ ] 没有把所有状态塞进一个 store？

## 相关章节
- [分层架构](/architecture/layered-architecture) — 状态归属决定它在"哪一层"
- [接口契约先行](/architecture/contract-first) — 服务端类型用 OpenAPI 生成 → 表单 schema 复用
- [单向数据流](/architecture/data-flow) — 状态变更走"单向通道"