# Plan Coding 实战：核心功能开发

## 场景
我们用 Vibe Coding 验证了 `@dnd-kit/core`。现在用 **Plan Coding**实现完整的任务列表功能。

## 任务
实现一个支持增删改查、分页、筛选、排序的任务列表组件。

## 第 1 步：写 Plan
```markdown

## 任务：TaskList 组件

### 目标
实现完整的任务列表组件（CRUD）

### 范围
 包括：
- 列表展示（分页、排序、筛选）
- 任务创建
- 任务编辑
- 任务删除（带确认）
- 状态切换

 不包括：
- 拖拽（看板模式单独任务）
- 批量操作
- 导出

### 技术方案
- 列表：Ant Design Table
- 数据：TanStack Query
- 表单：React Hook Form + Zod
- 状态：URL 同步分页/筛选
- 删除：Modal 确认

### 文件
新建：
- src/types/task.ts
- src/services/task.ts
- src/components/TaskList/TaskList.tsx
- src/components/TaskList/TaskListItem.tsx
- src/components/TaskList/TaskFilter.tsx
- src/components/TaskList/index.ts
- src/components/TaskForm/TaskForm.tsx
- src/components/TaskForm/TaskForm.test.tsx
- src/hooks/useTaskList.ts
- src/hooks/useTaskMutation.ts
- src/pages/TaskListPage.tsx

修改：
- src/router/index.tsx（添加路由）

### 风险
1. URL 同步分页：注意 history.replaceState 用法
2. 删除确认：防止误删
3. 表单校验：Zod schema 复杂

### 验收
- [ ] 列表能正确展示
- [ ] 分页/筛选/排序功能完整
- [ ] 创建/编辑/删除正常
- [ ] 单元测试覆盖 > 80%
- [ ] 通过 lint + typecheck
```

## 第 2 步：让 AI 出详细方案
```bash
> 我要做 TaskList 组件，按这个 Plan：
> [粘贴上面的 Plan]
>
> 先不要写代码，告诉我：
> 1. 每个文件的具体内容
> 2. 关键技术决策及理由
> 3. 实施顺序
> 4. 风险点及对策
```

**AI 输出**：

```markdown

## 详细方案

### 实施顺序
1. 类型定义（TaskList 用到的所有类型）
2. API 服务（task service）
3. 自定义 Hook（useTaskList, useTaskMutation）
4. 子组件（TaskListItem, TaskFilter）
5. 主组件（TaskList）
6. 表单组件（TaskForm）
7. 页面（TaskListPage）
8. 路由集成
9. 单元测试

### 关键技术决策
1. **URL 同步分页**-用 useSearchParams（React Router）
   - 不存 Zustand（避免重复状态）
   - 分享链接可重现状态

2. **删除确认**-Modal.confirm API
   - loading 态防止重复点击
   - 成功后 invalidate cache

3. **表单校验**-Zod schema 复用 type
   - 实时 + 提交双校验
   - 错误信息贴近字段

### 风险对策
1. URL 同步：注意 searchParams 更新时机
2. 删除误操作：必须二次确认
3. 表单复杂度：分字段校验、错误聚合
```

**人工审查**： 方案 OK，调整分页大小为 20 条。

## 第 3 步：分步实施

### 步骤 1：类型定义
```bash
> 按方案写 src/types/task.ts
```

**AI 输出**：

```typescript
// src/types/task.ts
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface TaskListParams {
  page?: number
  pageSize?: number
  status?: TaskStatus
  priority?: TaskPriority
  keyword?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate'
  sortOrder?: 'asc' | 'desc'
}

export interface TaskListResponse {
  list: Task[]
  total: number
  page: number
  pageSize: number
}

export interface CreateTaskInput {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
}
```

**验证**：
```bash
$ pnpm typecheck
 通过
```

### 步骤 2：API 服务
```bash
> 按方案写 src/services/task.ts
```

```typescript
// src/services/task.ts
import { http } from '@/utils/http'
import type {
  Task,
  TaskListParams,
  TaskListResponse,
  CreateTaskInput,
} from '@/types/task'

export const taskService = {
  list: (params: TaskListParams = {}) =>
    http.get<TaskListResponse>('/tasks', { params }),

  get: (id: string) =>
    http.get<Task>(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    http.post<Task>('/tasks', data),

  update: (id: string, data: Partial<CreateTaskInput>) =>
    http.put<Task>(`/tasks/${id}`, data),

  delete: (id: string) =>
    http.delete(`/tasks/${id}`),
}
```

### 步骤 3：自定义 Hook
```bash
> 写 useTaskList 和 useTaskMutation
```

```typescript
// src/hooks/useTaskList.ts
import { useQuery } from '@tanstack/react-query'
import { taskService } from '@/services/task'
import type { TaskListParams } from '@/types/task'

export function useTaskList(params: TaskListParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.list(params),
    staleTime: 5 * 60 * 1000,  // 5 分钟
  })
}

// src/hooks/useTaskMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/task'
import type { CreateTaskInput } from '@/types/task'

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskInput> }) =>
      taskService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
```

### 步骤 4：组件
```bash
> 按方案写 TaskList 组件
```

```tsx
// src/components/TaskList/TaskList.tsx
import { useSearchParams } from 'react-router-dom'
import { Table, Button, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTaskList } from '@/hooks/useTaskList'
import { useDeleteTask } from '@/hooks/useTaskMutation'
import { TaskFilter } from './TaskFilter'
import type { Task, TaskListParams } from '@/types/task'

export function TaskList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params: TaskListParams = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: 20,
    status: searchParams.get('status') as any,
    priority: searchParams.get('priority') as any,
    keyword: searchParams.get('keyword') || undefined,
  }

  const { data, isLoading, error } = useTaskList(params)
  const deleteMutation = useDeleteTask()

  const columns: ColumnsType<Task> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { todo: 'default', in_progress: 'blue', done: 'green' }
        return <Tag color={colors[status]}>{status}</Tag>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const colors = { low: 'default', medium: 'orange', high: 'red' }
        return <Tag color={colors[priority]}>{priority}</Tag>
      },
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => editTask(record)}>
            编辑
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  function editTask(task: Task) {
    // 跳转到编辑页面
    window.location.href = `/tasks/${task.id}/edit`
  }

  function handleDelete(id: string) {
    if (window.confirm('确认删除？')) {
      deleteMutation.mutate(id)
    }
  }

  if (error) {
    return <div className="text-red-500">加载失败：{error.message}</div>
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">任务列表</h1>
        <Button type="primary" href="/tasks/new">
          新建任务
        </Button>
      </div>

      <TaskFilter params={params} setParams={setSearchParams} />

      <Table
        columns={columns}
        dataSource={data?.list || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: params.page,
          pageSize: params.pageSize,
          total: data?.total || 0,
          onChange: (page) => {
            setSearchParams({ ...params, page: String(page) })
          },
        }}
      />
    </div>
  )
}
```

### 步骤 5：测试
```bash
> 写 TaskList 的单元测试
```

```tsx
// src/components/TaskList/TaskList.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { TaskList } from './TaskList'
import { taskService } from '@/services/task'

vi.mock('@/services/task')

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('TaskList', () => {
  it('renders loading state', () => {
    vi.mocked(taskService.list).mockImplementation(
      () => new Promise(() => {})  // 永不 resolve
    )

    renderWithProviders(<TaskList />)

    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders tasks from API', async () => {
    vi.mocked(taskService.list).mockResolvedValue({
      list: [
        { id: '1', title: 'Task 1', status: 'todo', priority: 'high', createdAt: '', updatedAt: '' },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    })

    renderWithProviders(<TaskList />)

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })
  })

  it('shows error state', async () => {
    vi.mocked(taskService.list).mockRejectedValue(new Error('API Error'))

    renderWithProviders(<TaskList />)

    await waitFor(() => {
      expect(screen.getByText(/加载失败/)).toBeInTheDocument()
    })
  })
})
```

## 第 4 步：验证
```bash

# 1. 类型检查
$ pnpm typecheck
 通过

# 2. Lint
$ pnpm lint
 通过

# 3. 测试
$ pnpm test src/components/TaskList
 3 passed

# 4. 手动测试
$ pnpm dev
 页面正常，CRUD 工作
```

## 第 5 步：提交
```bash

# 分阶段提交
git add src/types/task.ts
git commit -m "feat(task): add task type definitions"

git add src/services/task.ts
git commit -m "feat(task): add task API service"

git add src/hooks/useTaskList.ts src/hooks/useTaskMutation.ts
git commit -m "feat(task): add task custom hooks"

git add src/components/TaskList/
git commit -m "feat(task): add TaskList component"

git add src/components/TaskForm/
git commit -m "feat(task): add TaskForm component"

git add src/pages/TaskListPage.tsx src/router/
git commit -m "feat(task): add task list page and route"

git push origin feature/task-list
```

## 第 6 步：PR + Review
```markdown

## PR：feat(task): add task management

### 变更
- 新增 TaskList 组件，支持 CRUD
- 新增 TaskForm 组件
- 新增任务相关 hooks、services、types
- 测试覆盖：85%

### Plan 参考
- 详见 .claude/plans/task-list.md

### 验证
- [x] typecheck 通过
- [x] lint 通过
- [x] 测试通过（3 passed）
- [x] 手动测试通过
- [x] AI 自审通过
```

**Reviewer 检查**：
- 业务逻辑正确
- 删除确认可以更友好（用 Modal 而不是 window.confirm）
- 测试覆盖充分
- 可以把 TaskListItem 提取为独立组件

**作者修改**：
```tsx
// 把 window.confirm 改为 Modal.confirm
import { Modal } from 'antd'

function handleDelete(id: string) {
  Modal.confirm({
    title: '确认删除？',
    content: '删除后无法恢复',
    onOk: () => deleteMutation.mutate(id),
  })
}
```

## Plan Coding 的关键经验

### 做得好的
1. **先 Plan 后实施**— 避免做歪
2. **分阶段提交**— 每个 commit 独立可回滚
3. **AI 自审**— 让 AI 检查自己的代码
4. **测试覆盖**— 关键场景都有测试

### 避免的
1. **不要一次写完所有**— 拆成小步
2. **不要省略验证**— 每步都要跑测试
3. **不要跳过 Review**— 即使"AI 写的"

## 与 Vibe Coding 的对比
| 维度 | Vibe Coding | Plan Coding |
| --- | --- | --- |
| **目标**| 验证 | 实现 |
| **时间**| 30 分钟 | 1-2 天 |
| **质量**| 能跑 | 可维护 |
| **测试**| 无 | 充分 |
| **提交**| 不提交 | 多个 commit |
| **Review**| 无 | 必须 |

下一节：[Spec Coding 实战](/case-study/spec) — 实现关键的看板模块。