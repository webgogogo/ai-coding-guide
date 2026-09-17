# Vibe Coding 实战：技术选型探索

## 场景
我们要为 Task Dashboard 选择合适的**拖拽库**。有几个候选：

- `@dnd-kit/core`
- `react-beautiful-dnd`
- `react-dnd`

Vibe Coding 阶段：用 AI 快速试错，看哪个最合适。

## 时间盒
 **30 分钟**，到点就停。

## 第 1 步：让 AI 给出概览（2 分钟）
```bash
> 我要做一个任务看板，需要拖拽功能。
> 对比 @dnd-kit、react-beautiful-dnd、react-dnd 三个库：
> 1. 各自优势
> 2. 各自劣势
> 3. 适合我的场景的推荐
```

**AI 输出**：

```
@dnd-kit/core（推荐）
 现代、活跃维护
 性能好
 支持键盘、触屏
 TypeScript 友好
 相对较新，社区资源少

react-beautiful-dnd（不推荐）
 API 简单
 已停止维护（2024）
 不支持 React 18 严格模式

react-dnd
 灵活
 API 复杂
 学习曲线陡
```

**结论**：`@dnd-kit/core` 最合适。

## 第 2 步：让 AI 写 demo（10 分钟）
```bash
> 用 @dnd-kit/core 写一个最简单的拖拽 demo：
> - 3 个可拖拽的卡片
> - 2 个容器（todo、done）
> - 能从 todo 拖到 done
> 30 分钟能跑通的最简版
```

**AI 输出代码**（核心部分）：

```tsx
// src/demo/DndDemo.tsx
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'

function DraggableCard({ id, title }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
         className="p-4 bg-white rounded shadow cursor-move">
      {title}
    </div>
  )
}

function DroppableContainer({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div ref={setNodeRef}
         className={`p-4 ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
      {children}
    </div>
  )
}

export function DndDemo() {
  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        <DroppableContainer id="todo">
          <DraggableCard id="1" title="Task 1" />
          <DraggableCard id="2" title="Task 2" />
        </DroppableContainer>
        <DroppableContainer id="done">
          <DraggableCard id="3" title="Task 3" />
        </DroppableContainer>
      </div>
    </DndContext>
  )
}
```

**本地跑通**：

## 第 3 步：尝试优化（10 分钟）
```bash
> 这个 demo 加点优化：
> 1. 拖拽时卡片有视觉反馈（半透明、旋转）
> 2. 放下时平滑过渡
> 3. 支持键盘拖拽（Space + 方向键）
```

**AI 输出增强版**：

```tsx
function DraggableCard({ id, title }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    transition: isDragging ? 'none' : 'transform 200ms ease',
    rotate: isDragging ? '2deg' : '0deg',
  }

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
         style={style}
         className="p-4 bg-white rounded shadow cursor-move">
      {title}
    </div>
  )
}
```

**效果**： 拖拽流畅，有视觉反馈

## 第 4 步：探索已知问题（5 分钟）
```bash
> 这个 demo 在哪些场景会出问题？
> 比如：
> - 跨多个容器？
> - 嵌套拖拽？
> - 性能（100+ 卡片）？
```

**AI 输出**：

```
潜在问题：
1. 跨多个容器需要更多 useDroppable
2. 嵌套拖拽需要自定义 collision detection
3. 100+ 卡片需要虚拟化（react-window）
```

**学到**：
- 需要看 [官方示例](https://docs.dndkit.com/) 处理多容器
- 大量卡片场景需要性能优化

## 第 5 步：时间到，停止
**30 分钟到，Vibe Coding 阶段结束。**

## Vibe Coding 阶段的产出
```markdown

## 收获

### 技术决策
- 选定 @dnd-kit/core
- 理解了基础 API（useDraggable, useDroppable）
- 知道高级场景（多容器、性能）的注意事项

### 风险识别
- 多容器拖拽需要深入研究
- 大量卡片需要虚拟化

### 决策
- 继续使用 @dnd-kit/core
- 进入 Plan Coding 阶段深入实现
```

## 后续动作
```markdown

## 进入 Plan Coding

### 任务
1. 在真实组件中集成 @dnd-kit
2. 实现任务状态切换
3. 添加拖拽视觉反馈

### 模式
- Plan Coding（先规划后实施）

### 工具
- Cursor（IDE 内开发）
```

## Vibe Coding 的关键经验

### 做得好的
- 严格时间盒（30 分钟）
- 不陷入细节
- 关注"够用即可"

### 避免的
- 不要花 3 小时调一个动画
- 不要追求 demo 完美
- 不要在 vibe 阶段做架构决策

## 完整对话示例
```bash

# 整个 Vibe 阶段的对话

# 1. 概览
> 对比三个拖拽库

# 2. 第一个 demo
> 用 @dnd-kit 写最简 demo

# 3. 跑通后调整
> 加视觉反馈、键盘支持

# 4. 探索边界
> 哪些场景会出问题？

# 5. 总结
> 综合评估，推荐哪个？理由？
```

## 与其他模式的对比
| 维度 | Vibe Coding | Plan Coding |
| --- | --- | --- |
| **目标**| 验证技术选型 | 实现完整功能 |
| **时间**| 30 分钟 | 数小时-数天 |
| **产出**| 简单 demo | 生产代码 |
| **质量要求**| 能跑就行 | 需可维护 |

下一节：[Plan Coding 实战](/case-study/plan) — 用 Vibe 验证的方案做实际开发。