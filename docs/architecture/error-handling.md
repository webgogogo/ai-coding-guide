# 错误处理架构：Result 模式 + 统一错误模型
> 本文是 [架构设计总览](/architecture/overview) 中 ⑥ 错误处理架构的独立详解。 最大杠杆之一。

## 核心思想
把"错误"变成**一等公民**，让 AI 不再"随手 throw、随手 catch"。

## 为什么 AI Coding 特别需要错误处理架构
AI 在错误处理上有 3 个常见"坏习惯"：

| AI 的坏习惯 | 后果 |
| --- | --- |
| **到处 `try-catch` 然后吞掉**| 错误信息丢失，问题难追溯 |
| **`throw new Error('失败')` 模糊信息**| 排查时不知道是网络、权限还是业务 |
| **业务错误和系统错误混用**| UI 无法针对性提示（"重试"vs"联系管理员"） |

**正确做法**：把错误当作"值"来传递，让类型系统告诉 AI 怎么写。

- --

## 方案 A：Result 模式（推荐）
**核心理念**：函数不"抛异常"，而是返回 `{ ok: true, value }` 或 `{ ok: false, error }`。

```typescript
// types/result.ts
export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value })
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error })
```

### 服务层使用 Result
```typescript
// services/userService.ts
import { Result, Ok, Err } from '@/types/result'
import { AppError, ErrorCode } from '@/types/error'

export const userService = {
  async getUser(id: string): Promise<Result<User, AppError>> {
    try {
      const res = await http.get<User>(`/users/${id}`)
      return Ok(res)
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) {
        return Err(new AppError(ErrorCode.NOT_FOUND, `用户 ${id} 不存在`, { id }))
      }
      return Err(AppError.fromUnknown(e))
    }
  }
}
```

### Hook 层使用 Result
```typescript
// hooks/useUser.ts
export function useUser(id: string) {
  const { data, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id)
  })

  if (error) return { state: 'error', error }
  if (!data) return { state: 'loading' }
  if (!data.ok) return { state: 'error', error: data.error }
  return { state: 'success', user: data.value }
}
```

### 组件层使用 Result
```typescript
// components/UserProfile.tsx
export function UserProfile({ id }: { id: string }) {
  const { state, user, error } = useUser(id)

  if (state === 'loading') return <Skeleton />
  if (state === 'error') {
    // 类型守卫自动收窄：error 一定是 AppError
    switch (error.code) {
      case ErrorCode.NOT_FOUND:
        return <Empty message="用户不存在" />
      case ErrorCode.UNAUTHORIZED:
        return <Empty message="请先登录" />
      case ErrorCode.NETWORK:
        return <Empty message="网络异常，请重试" action={<Button onClick={retry}>重试</Button>} />
      default:
        return <Empty message="服务异常，请稍后再试" />
    }
  }
  return <UserCard user={user} />
}
```

- --

## 方案 B：统一错误模型
把所有错误归类到一个 `AppError` 类，让 AI 只产出"这一种错误"。

```typescript
// types/error.ts
export enum ErrorCode {
  // 网络层
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',

  // HTTP 层
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',

  // 业务层
  BUSINESS = 'BUSINESS',
  VALIDATION = 'VALIDATION',

  // 未知
  UNKNOWN = 'UNKNOWN'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public context?: Record<string, unknown>,
    public cause?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }

  static fromUnknown(e: unknown): AppError {
    if (e instanceof AppError) return e
    if (e instanceof HttpError) return AppError.fromHttp(e)
    if (e instanceof Error) return new AppError(ErrorCode.UNKNOWN, e.message)
    return new AppError(ErrorCode.UNKNOWN, String(e))
  }

  static fromHttp(e: HttpError): AppError {
    const map: Record<number, ErrorCode> = {
      400: ErrorCode.BAD_REQUEST,
      401: ErrorCode.UNAUTHORIZED,
      403: ErrorCode.FORBIDDEN,
      404: ErrorCode.NOT_FOUND,
      500: ErrorCode.SERVER_ERROR
    }
    const code = map[e.status] ?? ErrorCode.UNKNOWN
    return new AppError(code, e.message, { status: e.status })
  }

  toUserMessage(): string {
    const map: Partial<Record<ErrorCode, string>> = {
      [ErrorCode.NOT_FOUND]: '内容不存在',
      [ErrorCode.UNAUTHORIZED]: '请先登录',
      [ErrorCode.NETWORK]: '网络异常，请检查网络',
      [ErrorCode.TIMEOUT]: '请求超时，请重试',
      [ErrorCode.SERVER_ERROR]: '服务繁忙，请稍后再试'
    }
    return map[this.code] ?? '操作失败，请稍后再试'
  }
}
```

- --

## 错误边界（React ErrorBoundary）
```typescript
// shared/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: AppError }
> {
  state = { error: undefined as AppError | undefined }

  static getDerivedStateFromError(error: Error) {
    return { error: AppError.fromUnknown(error) }
  }

  componentDidCatch(error: AppError, info: React.ErrorInfo) {
    reportError(error, { componentStack: info.componentStack })
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

- --

## 异步操作的统一处理（mutation）
```typescript
// hooks/useAsyncAction.ts
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<Result<TResult, AppError>>
) {
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; value: TResult }
    | { status: 'error'; error: AppError }
  >({ status: 'idle' })

  const execute = useCallback(async (...args: TArgs) => {
    setState({ status: 'loading' })
    const result = await action(...args)
    if (result.ok) {
      setState({ status: 'success', value: result.value })
      return result
    }
    setState({ status: 'error', error: result.error })
    return result
  }, [action])

  return { ...state, execute }
}

// 使用
const submit = useAsyncAction(userService.createUser)
await submit.execute({ name: 'Alice' })
if (submit.status === 'error') {
  toast.error(submit.error.toUserMessage())
}
```

- --

## AI Coding 收益（最大杠杆之一）
| 场景 | 没有错误架构 | 有 Result + AppError |
| --- | --- | --- |
| **AI 写新 service**| 错误处理五花八门 | 统一返回 `Result<T, AppError>` |
| **AI 写 UI**| 错误展示不统一 | 用 `error.toUserMessage()` 一行搞定 |
| **AI 调试**| 看错误日志猜原因 | `error.code` 直接定位层 + 类型 |
| **AI 测试**| mock 异常麻烦 | mock 返回 `Err(AppError)` 即可 |
| **错误监控**| 各处 try-catch 上报不一致 | 边界统一上报，零遗漏 |

- --

## 在 agents.md 中固化
```markdown

## 错误处理约定
- 所有 service 函数必须返回 Promise<Result<T, AppError>>，禁止 throw
- 所有错误必须是 AppError 实例，禁止裸 Error
- 组件禁止直接 try-catch（用 useAsyncAction / ErrorBoundary）
- UI 提示统一用 error.toUserMessage()，禁止写硬编码字符串
- 网络层错误由 http 拦截器统一转换为 AppError
- 业务校验错误用 ErrorCode.VALIDATION + Zod issues

## 禁止事项
- 禁止 throw new Error('xxx')
- 禁止 try-catch 后只 console.log
- 禁止在 UI 层写 '网络错误' 等硬编码字符串
- 禁止 catch 后不返回（导致上游拿到 undefined）
```

- --

## Result 模式 vs try-catch 怎么选？
| 场景 | 推荐 |
| --- | --- |
| **Service / Hook（业务流）**|  Result 模式 |
| **UI 事件处理（onClick 等）**|  useAsyncAction |
| **React 组件渲染错误**|  ErrorBoundary |
| **Promise 链中的 rejection**|  Result 模式 |
| **框架底层（http、storage）**|  throw（让 Result 层捕获并转换） |
| **算法 / 工具函数**|  throw 也可（不影响业务流） |

**铁律**：**所有跨越"架构边界"的错误，必须是 AppError**。底层可以 throw，跨越 service/hook/UI 边界时必须转换为 Result。

- --

## 检查清单
- [ ] 所有 service 返回 `Promise<Result<T, AppError>>`？
- [ ] 错误都用 `AppError`，没有裸 `Error`？
- [ ] UI 用 `error.toUserMessage()`，没有硬编码中文？
- [ ] mutation 用 `useAsyncAction`？
- [ ] 顶层有 `ErrorBoundary`？
- [ ] 错误上报统一在边界处理？

## 相关章节
- [接口契约先行](/architecture/contract-first) — Zod 校验失败 → `AppError(VALIDATION)`
- [分层架构](/architecture/layered-architecture) — 错误在哪一层被转换为 Result
- [状态管理分层](/architecture/state-management) — `useAsyncAction` 是 mutation 的标准模式