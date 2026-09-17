# Spec Coding 实战：看板模块

## 场景
我们要实现 Task Dashboard 的**核心模块 —— 看板视图**。这是产品的关键功能，需要多人协作、长期维护。

**用 Spec Coding 模式。**

## 第 1 步：写需求规格
```markdown

# 看板视图规范

## 1. 需求规格

### 业务背景
管理员和团队成员需要可视化地查看任务流转情况，提升协作效率。

### 用户故事
- 作为团队成员，我能在看板上拖动任务卡片，以便更新任务状态
- 作为管理员，我能看到每个状态的任务数量，以便评估工作负载
- 作为团队成员，我能在拖动时看到视觉反馈，以便确认操作成功
- 作为键盘用户，我能用键盘完成拖拽，以便无障碍使用

### 功能清单
- [ ] 三列布局（Todo / In Progress / Done）
- [ ] 任务卡片支持拖拽
- [ ] 跨列拖动更新状态
- [ ] 同列拖动调整顺序
- [ ] 每列显示任务数量
- [ ] 拖拽时的视觉反馈（半透明、旋转）
- [ ] 键盘支持（Tab + Space + 方向键）
- [ ] 触屏支持
- [ ] 实时同步（乐观更新）

### 非功能需求
- 性能：100+ 卡片流畅拖动
- 兼容：Chrome / Edge / Safari / Firefox 最新版本
- 可访问性：WCAG 2.1 AA
- 响应式：桌面、平板可用（手机暂不考虑）
```

## 第 2 步：技术设计
```markdown

## 2. 技术设计

### 架构
```
KanbanPage
└── KanbanBoard (核心组件)
    ├── KanbanColumn × 3
    │   ├── ColumnHeader (标题 + 计数)
    │   └── TaskCard × N
    └── DragOverlay (拖拽时的视觉层)
```

### 数据模型
\`\`\`typescript
interface KanbanTask {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  order: number  // 列内排序
  assignee?: { id: string; name: string; avatar?: string }
  dueDate?: string
}
\`\`\`

### 拖拽设计

#### 库选择
- @dnd-kit/core（Vibe Coding 阶段已验证）
- @dnd-kit/sortable（同列排序）
- @dnd-kit/utilities

#### 拖拽事件
- onDragStart：开始拖拽（视觉反馈）
- onDragOver：拖拽中（可放置提示）
- onDragEnd：拖拽结束（更新状态/顺序）

#### 状态机
\`\`\`
idle → dragging → over → dropped
                    ↓
                 cancelled
\`\`\`

#### 乐观更新策略
1. 立即更新 UI（拖拽到的位置）
2. 调用 API 更新状态
3. API 失败则回滚 UI
4. API 成功则 invalidate cache

### 关键决策
1. **为什么用 @dnd-kit？**-现代、活跃维护
   - 支持键盘、触屏
   - TypeScript 友好
   - 性能好（Vibe Coding 验证过）

2. **为什么乐观更新？**-拖拽需要即时反馈
   - 网络延迟会破坏体验
   - 失败回滚是标准模式

3. **为什么用 React.memo？**-100+ 卡片时减少 re-render
   - 拖拽期间性能关键

### 状态管理
- 服务端状态：TanStack Query（task 列表）
- 拖拽状态：@dnd-kit 内置
- 乐观更新：在 mutation 中处理
- 全局 UI 状态：Zustand（少量）
```

## 第 3 步：验收标准
```markdown

## 3. 验收标准

### 功能验收
- [ ] 三列正确展示
- [ ] 任务数量统计正确
- [ ] 拖拽跨列更新状态
- [ ] 拖拽同列改变顺序
- [ ] 拖拽有视觉反馈
- [ ] 放下时无错位
- [ ] 键盘拖拽可用
- [ ] 触屏拖拽可用
- [ ] 失败时回滚

### 质量验收
- [ ] TypeScript 严格模式无错误
- [ ] ESLint 无错误
- [ ] 单元测试覆盖率 > 80%
- [ ] E2E 测试覆盖核心流程
- [ ] 性能：100 卡片下拖动流畅（> 50fps）
- [ ] 可访问性：键盘 + 屏幕阅读器

### 文档验收
- [ ] README 更新
- [ ] 组件 API 文档
- [ ] 拖拽交互说明
```

## 第 4 步：任务拆分
```markdown

## 4. 任务拆分

### Task 1：基础看板结构（4h）
- [ ] KanbanPage 页面
- [ ] KanbanBoard 组件
- [ ] KanbanColumn × 3
- [ ] ColumnHeader
- [ ] 占位 TaskCard

### Task 2：拖拽基础（4h）
- [ ] DndContext 集成
- [ ] useDraggable 集成 TaskCard
- [ ] useDroppable 集成 Column
- [ ] 跨列拖动更新状态

### Task 3：同列排序（3h）
- [ ] SortableContext 集成
- [ ] useSortable 集成 TaskCard
- [ ] arrayMove 处理
- [ ] 排序持久化

### Task 4：视觉反馈（2h）
- [ ] 拖拽时半透明
- [ ] 拖拽时旋转
- [ ] DragOverlay
- [ ] 可放置提示

### Task 5：键盘 + 触屏（2h）
- [ ] KeyboardSensor
- [ ] TouchSensor
- [ ] 键盘操作提示

### Task 6：乐观更新（3h）
- [ ] mutation onMutate
- [ ] mutation onError 回滚
- [ ] mutation onSuccess

### Task 7：测试（4h）
- [ ] 单元测试
- [ ] E2E 测试（Playwright）
- [ ] 性能测试

### Task 8：验收（2h）
- [ ] 功能验收
- [ ] 性能验收
- [ ] 文档
```

## 第 5 步：风险与对策
```markdown

## 5. 风险与对策

### 风险 1：拖拽性能
- 影响：100+ 卡片卡顿
- 概率：中
- 对策：
  - React.memo + useCallback
  - 必要时虚拟化
  - DragOverlay 减少渲染

### 风险 2：拖拽状态不一致
- 影响：UI 与服务端状态不同步
- 概率：中
- 对策：
  - 乐观更新 + 回滚
  - 失败时清晰提示
  - 必要时强制刷新

### 风险 3：键盘拖拽不直观
- 影响：键盘用户无法使用
- 概率：低
- 对策：
  - 参考 dnd-kit 文档
  - 添加操作提示
  - 可访问性测试

### 风险 4：触屏体验差
- 影响：移动端用户无法使用
- 概率：低（手机暂不考虑）
- 对策：
  - TouchSensor 配置
  - 延迟激活避免误触
```

## 第 6 步：实施

### Task 1：基础结构
```bash
> 按规范实现 Task 1：基础看板结构
> 要求：
> - KanbanPage
> - KanbanBoard（props: tasks）
> - KanbanColumn（props: status, tasks）
> - ColumnHeader（显示状态 + 数量）
> - 静态 TaskCard 占位
> 遵循 agents.md
```

**AI 输出代码**（关键部分）：

```tsx
// src/pages/KanbanPage.tsx
import { useTaskList } from '@/hooks/useTaskList'
import { KanbanBoard } from '@/components/Kanban'

export function KanbanPage() {
  const { data, isLoading, error } = useTaskList({ pageSize: 100 })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">任务看板</h1>
      <KanbanBoard tasks={data?.list || []} />
    </div>
  )
}

// src/components/Kanban/KanbanBoard.tsx
import { useMemo } from 'react'
import { KanbanColumn } from './KanbanColumn'
import type { KanbanTask } from '@/types/task'

interface KanbanBoardProps {
  tasks: KanbanTask[]
}

const COLUMNS: Array<{ status: KanbanTask['status']; title: string }> = [
  { status: 'todo', title: '待办' },
  { status: 'in_progress', title: '进行中' },
  { status: 'done', title: '已完成' },
]

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const groupedTasks = useMemo(() => {
    const groups: Record<string, KanbanTask[]> = {
      todo: [],
      in_progress: [],
      done: [],
    }
    tasks.forEach(task => {
      groups[task.status].push(task)
    })
    return groups
  }, [tasks])

  return (
    <div className="grid grid-cols-3 gap-4">
      {COLUMNS.map(col => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          title={col.title}
          tasks={groupedTasks[col.status]}
        />
      ))}
    </div>
  )
}

// src/components/Kanban/KanbanColumn.tsx
import { memo } from 'react'
import { TaskCard } from './TaskCard'
import type { KanbanTask } from '@/types/task'

interface KanbanColumnProps {
  status: KanbanTask['status']
  title: string
  tasks: KanbanTask[]
}

export const KanbanColumn = memo(function KanbanColumn({
  status,
  title,
  tasks,
}: KanbanColumnProps) {
  return (
    <div className="bg-gray-50 rounded p-4">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      <div className="space-y-2 min-h-[200px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
})
```

### Task 2-3：拖拽 + 排序
```bash
> 按规范实现 Task 2 + 3：拖拽基础 + 同列排序
```

```tsx
// src/components/Kanban/KanbanBoard.tsx (升级版)
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useUpdateTask, useReorderTask } from '@/hooks/useTaskMutation'

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const updateMutation = useUpdateTask()
  const reorderMutation = useReorderTask()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overTask = tasks.find(t => t.id === over.id)

    if (!activeTask) return

    // 跨列拖动
    if (overTask && activeTask.status !== overTask.status) {
      updateMutation.mutate({
        id: activeTask.id,
        data: { status: overTask.status },
      })
      return
    }

    // 同列排序
    if (overTask && activeTask.status === overTask.status) {
      const columnTasks = tasks.filter(t => t.status === activeTask.status)
      const oldIndex = columnTasks.findIndex(t => t.id === active.id)
      const newIndex = columnTasks.findIndex(t => t.id === over.id)

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(columnTasks, oldIndex, newIndex)
        reorderMutation.mutate({
          status: activeTask.status,
          taskIds: newOrder.map(t => t.id),
        })
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <SortableContext
            key={col.status}
            items={groupedTasks[col.status].map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              status={col.status}
              title={col.title}
              tasks={groupedTasks[col.status]}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}
```

### Task 6：乐观更新
```typescript
// src/hooks/useTaskMutation.ts
export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskService.update(id, data),

    // 乐观更新
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })

      const previous = qc.getQueryData(['tasks'])

      qc.setQueryData(['tasks'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          list: old.list.map((task: Task) =>
            task.id === id ? { ...task, ...data } : task
          ),
        }
      })

      return { previous }
    },

    // 失败回滚
    onError: (err, variables, context) => {
      if (context?.previous) {
        qc.setQueryData(['tasks'], context.previous)
      }
    },

    // 成功后同步
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
```

### Task 7：测试
```tsx
// src/components/Kanban/KanbanBoard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanBoard } from './KanbanBoard'

const mockTasks = [
  { id: '1', title: 'Task 1', status: 'todo', priority: 'high' },
  { id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium' },
  { id: '3', title: 'Task 3', status: 'done', priority: 'low' },
]

describe('KanbanBoard', () => {
  it('renders three columns', () => {
    render(<KanbanBoard tasks={mockTasks} />)
    expect(screen.getByText('待办')).toBeInTheDocument()
    expect(screen.getByText('进行中')).toBeInTheDocument()
    expect(screen.getByText('已完成')).toBeInTheDocument()
  })

  it('shows correct task counts', () => {
    render(<KanbanBoard tasks={mockTasks} />)
    expect(screen.getByText('1')).toBeInTheDocument()  // 每列各 1 个
  })

  it('groups tasks by status', () => {
    render(<KanbanBoard tasks={mockTasks} />)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.getByText('Task 3')).toBeInTheDocument()
  })
})
```

## 第 7 步：验收
```markdown

## 验收记录

### 功能验收
- [x] 三列展示 
- [x] 任务数量统计 
- [x] 跨列拖动 
- [x] 同列排序 
- [x] 视觉反馈 
- [x] 键盘拖拽 
- [x] 触屏拖拽 
- [x] 失败回滚 

### 质量验收
- [x] TypeScript 严格模式 
- [x] ESLint 
- [x] 测试覆盖 85% 
- [x] 性能：100 卡片流畅 
- [x] 可访问性 

### 文档
- [x] README 更新 
- [x] 组件文档 
```

## Spec Coding 的关键经验

### 做得好的
1. **完整的规范**— 需求、设计、验收齐全
2. **任务拆分清晰**— 8 个 Task 独立可交付
3. **风险前置**— 4 个风险 + 对策
4. **乐观更新**— 即时反馈 + 失败回滚

### 避免的
1. **规范不写就开始**— 关键模块必须有规范
2. **任务过大**— 拆分成 4-8 小时的 Task
3. **风险后置**— 开始前识别风险
4. **跳过验收**— 严格按清单验收

## 与 Plan Coding 的对比
| 维度 | Plan Coding | Spec Coding |
| --- | --- | --- |
| **适用**| 日常功能 | 关键模块 |
| **规范**| 简单方案 | 完整文档 |
| **参与**| 个人 | 多人 |
| **时间**| 1-3 天 | 1-2 周 |
| **Review**| 1 人 | 团队 |

下一节：[模式对比总结](/case-study/comparison)