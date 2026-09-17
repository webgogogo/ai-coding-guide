# 接口契约先行：类型即文档
> 本文是 [架构设计总览](/architecture/overview) 中 ④ 接口契约先行的独立详解。 最大杠杆之一。

## 核心思想
**先把"接口"定义清楚**，让代码变成"填空题"。AI 看到契约就知道怎么写，比看 100 行注释更准。

## 三层契约
```
1. 数据契约（TypeScript 类型 / Zod Schema / OpenAPI）
        ↓
2. API 契约（REST / GraphQL Schema / tRPC / JSON Schema）
        ↓
3. UI 契约（Props interface / Storybook / Form Schema）
```

## AI Coding 收益（最大杠杆之一）
| 场景 | 没有契约 | 有契约 |
| --- | --- | --- |
| **AI 生成 service**| 自己猜返回类型 → 与后端不一致 | 直接引用类型 → 100% 一致 |
| **AI 生成 mock**| 手写假数据 → 经常漏字段 | 用 Schema 自动生成 → 全字段 |
| **AI 生成表单**| 字段一个一个问 → 反复迭代 | 一次性给 schema → 自动生成 |
| **AI 生成测试**| 自己造断言 → 覆盖不全 | 用类型推导 → 自动覆盖 |
| **AI 重构**| 改动影响不可见 | 类型报错即影响范围 |

## 推荐工具栈
| 场景 | 工具 |
| --- | --- |
| **API 类型生成**| `openapi-typescript` / `tRPC` / `GraphQL Code Generator` |
| **运行时校验**| `Zod`（同时给类型 + 校验） |
| **表单类型**| `@hookform/resolvers/zod`（schema 复用） |
| **Mock 数据**| `@faker-js/faker` + Zod 推导 |
| **API 文档**| OpenAPI / tRPC 自动生成 |

## 实战示例

### 1. API 契约：OpenAPI → TypeScript
```bash

# 后端提供 OpenAPI 文档
npx openapi-typescript https://api.example.com/openapi.json -o src/types/api.d.ts

# 自动生成的类型
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
}
```

### 2. 表单契约：Zod Schema（类型 + 校验共用）
```typescript
// schemas/user.ts
export const userSchema = z.object({
  name: z.string().min(2, '姓名至少 2 个字'),
  email: z.string().email('邮箱格式不正确'),
  age: z.number().min(18, '必须年满 18 岁').max(150),
  role: z.enum(['admin', 'user', 'guest'])
})

// 自动推导类型
export type UserForm = z.infer<typeof userSchema>

// 表单直接用
const { register, handleSubmit } = useForm<UserForm>({
  resolver: zodResolver(userSchema)
})

// 运行时校验（API 入参）
export const userService = {
  create: (data: unknown) => {
    const valid = userSchema.parse(data)  // 不合法直接抛
    return http.post<User>('/users', valid)
  }
}
```

### 3. UI 契约：Props interface（强制导出）
```typescript
//  导出 interface
export interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  variant?: 'compact' | 'detailed'
}

export const UserCard: FC<UserCardProps> = ({ user, onEdit, variant = 'compact' }) => {
  // ...
}

//  反例：AI 经常写成 inline
export const UserCard: FC<{ user: any; onEdit?: Function }> = ({ user, onEdit }) => {
  // 失去类型保障
}
```

## 在 agents.md 中固化
```markdown

## 接口契约约定
- 所有 API 必须有 TypeScript 类型定义（types/）
- 所有表单必须有 Zod schema（schemas/）
- 复杂 Props 必须导出 interface 类型（不用 inline type）
- API 返回类型与后端 schema 必须一致（用 OpenAPI 生成）
- 禁止使用 any（必要时用 unknown + 类型守卫）
- 表单提交前必须用 Zod schema 校验
```

## 反模式：契约缺失或不一致
```typescript
//  反例 1：API 返回类型手写，与后端不一致
interface User {
  id: string
  name: string
  // 漏了 email、role、createdAt
}

//  反例 2：表单字段一个一个定义
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [age, setAge] = useState(0)
// ... 100 个字段

//  反例 3：组件 Props inline + any
const Card = ({ user, onEdit }: { user: any; onEdit: Function }) => {
```

## 检查清单
- [ ] 所有 API 都有 TypeScript 类型（或 OpenAPI 自动生成）？
- [ ] 所有表单都有 Zod schema？
- [ ] 复杂组件 Props 都导出 interface？
- [ ] 没有 `any`（必要时用 `unknown` + 类型守卫）？
- [ ] schema 同时用于类型推导 + 运行时校验？

## 相关章节
- [状态管理分层](/architecture/state-management) — 服务端类型决定 Query 类型
- [模块化设计](/architecture/modular-design) — types/ 目录属于哪个模块
- [错误处理架构](/architecture/error-handling) — schema 校验失败 → AppError(VALIDATION)