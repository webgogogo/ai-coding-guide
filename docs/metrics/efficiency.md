# 效率度量指标

## 度量框架
AI Coding 效率度量分 4 个维度：

```
效率
├── 速度（多快）
├── 质量（多好）
├── 成本（多省）
└── 体验（多爽）
```

## 1. 速度指标

### 任务完成时间
```markdown

## 关键指标

### 平均任务完成时间
- 任务类型 A：X 小时（使用 AI 前） → Y 小时（使用 AI 后）
- 任务类型 B：X 小时 → Y 小时

### 度量方法
- 记录每个任务从开始到合并的时间
- 区分 AI 辅助程度
```

### 度量工具
```typescript
// 简单的工时记录
interface TaskMetric {
  taskId: string
  startTime: Date
  endTime: Date
  aiAssisted: boolean
  tools: string[]
  mode: 'vibe' | 'plan' | 'spec'
}

const task: TaskMetric = {
  taskId: 'task-123',
  startTime: new Date('2025-02-01T09:00:00Z'),
  endTime: new Date('2025-02-01T11:30:00Z'),  // 2.5 小时
  aiAssisted: true,
  tools: ['Cursor', 'Claude Code'],
  mode: 'plan',
}

// 计算时长
const duration = (task.endTime - task.startTime) / 1000 / 60 / 60  // 2.5h
```

### PR 周期时间
```markdown

## PR Cycle Time

### 定义
从创建 PR 到合并的时间

### 健康指标
- 小型 PR（< 200 行）：< 4 小时
- 中型 PR（200-500 行）：< 1 天
- 大型 PR（> 500 行）：< 3 天
```

## 2. 质量指标

### 代码一次通过率
>  **以下阈值为经验估算**，实际应根据项目类型、模型能力、上下文质量调整。

```markdown

## AI 生成代码的"一次通过率"

### 定义
AI 生成的代码无需修改就能通过所有 CI 检查的比例

### 健康指标
- 优秀：> 70%
- 良好：50-70%
- 一般：30-50%
- 差：< 30%

### 度量方法
- 记录每个 PR 的"修改次数"
- 修改次数少 = 一次通过率高
```

### Bug 率
```markdown

## 生产 Bug 率

### 定义
AI 生成的代码在生产环境出现的 Bug 数量

### 度量方法
- 标记哪些代码是 AI 生成的
- 跟踪每个文件的 Bug 修复次数
- 对比 AI 生成 vs 手写代码的 Bug 率
```

### 测试覆盖率
```markdown

## 测试覆盖率

### 目标
- 工具函数：> 90%
- 业务组件：> 80%
- 整体：> 75%

### 度量
pnpm test:coverage

### 趋势
跟踪覆盖率变化
```

### Lint / TypeCheck 通过率
```markdown

## 静态检查通过率

### 目标
- Lint：通过率 > 95%
- TypeCheck：通过率 100%

### 趋势
- 上升：AI Coding 越用越好
- 下降：可能规范过时或 AI 不遵守
```

## 3. 成本指标

### Token 消耗
```markdown

## Token 消耗

### 度量内容
- 每日 Token 消耗（每人/每团队）
- 每任务平均消耗
- 模型分布（哪些模型用了多少）

### 健康指标
- 单人日均：< 1M tokens
- 单任务平均：< 50K tokens
- 月度预算：不超过设定阈值
```

### 工具成本
```markdown

## 工具成本

### 度量内容
- 工具订阅费
- API 调用费
- 培训成本

### 度量
- 月度总成本
- 人均成本
- 占开发预算比例（目标 < 5%）
```

### ROI 计算
```typescript
// ROI 计算示例
const metrics = {
  // 收益
  timeSavedHours: 100,          // 每月节省时间
  hourlyRate: 200,              // 人均小时成本
  bugReductionPercent: 30,      // Bug 减少百分比
  bugCostSaved: 5000,           // Bug 减少节省的成本

  // 成本
  aiToolsCost: 2000,            // AI 工具月成本
  trainingCost: 500,            // 培训月摊销
  reworkCost: 1000,             // 返工月成本

  // 计算
}

const totalBenefit = timeSavedHours * hourlyRate + bugCostSaved
const totalCost = aiToolsCost + trainingCost + reworkCost
const roi = ((totalBenefit - totalCost) / totalCost) * 100

console.log(`ROI: ${roi}%`)
// ROI: 320%
```

## 4. 体验指标

### 团队满意度
```markdown

## 团队满意度

### 度量方法
- 季度问卷
- 1-on-1 反馈
- 周会讨论

### 调查问题
- AI Coding 工具使用体验（1-10）
- 是否提升了工作效率
- 是否增加了工作负担
- 是否愿意继续使用
- 推荐给他人的意愿（NPS）
```

### 工具使用率
```markdown

## 工具使用率

### 度量
- 多少人配置了 AI 工具
- 多少人每天使用
- 多少人深度使用（每天 > 10 次）

### 健康指标
- 配置率：> 95%
- 日活率：> 70%
- 深度使用：> 30%
```

### 知识沉淀指标
```markdown

## 知识沉淀

### 度量
- 团队 Wiki 条目数
- Prompt 模板数量
- 分享会次数
- 案例库条目数
```

## 5. 度量看板

### 个人看板
```markdown

## 个人 AI Coding 周报

### 速度
- 完成 PR 数：X
- 平均 PR 大小：Y 行
- 平均 PR 周期：Z 小时

### 质量
- CI 通过率：X%
- 一次通过率：Y%
- 代码覆盖率：Z%

### 成本
- Token 消耗：X K
- 估算成本：$Y

### 改进点
- ...
```

### 团队看板
```markdown

## 团队 AI Coding 月报

### 整体效率
- 任务完成数：+X%（vs 上月）
- PR 周期时间：-Y%（缩短）
- Bug 率：-Z%（下降）

### 质量
- 测试覆盖率：X%
- Lint 通过率：Y%
- 生产事故：Z 起

### 成本
- 总成本：¥X
- 人均：¥Y
- ROI：Z%

### 团队满意度
- NPS：X
- 推荐率：Y%
```

## 6. 度量工具

### 现成工具
```markdown

## 推荐工具

### 工程效能
- Linear（项目管理）
- GitHub Insights（PR 数据）
- GitLab Value Stream Analytics

### AI 使用
- Cursor Usage Dashboard
- Claude Code /usage
- OpenAI Usage Dashboard

### 自建
- 简单的 SQL 查询 + 仪表盘
- Grafana + 自定义数据源
```

### 自建简单度量
```typescript
// 简单的 PR 数据采集
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

async function getPRMetrics(repo: string) {
  const prs = await octokit.pulls.list({
    owner: 'your-org',
    repo,
    state: 'closed',
    per_page: 100,
  })

  return prs.data.map(pr => ({
    number: pr.number,
    title: pr.title,
    additions: pr.additions,
    deletions: pr.deletions,
    changedFiles: pr.changed_files,
    createdAt: pr.created_at,
    mergedAt: pr.merged_at,
    cycleTimeHours: pr.merged_at
      ? (new Date(pr.merged_at) - new Date(pr.created_at)) / 1000 / 60 / 60
      : null,
    aiGenerated: pr.title.includes('feat') && pr.body?.includes('AI'),  // 简化示例
  }))
}
```

## 7. 度量误区

### 误区 1：只看速度
```
 速度快但 Bug 多 = 不好
 速度稍慢但质量好 = 好
```

### 误区 2：用绝对值评估
```
 "Cursor 让我们快 50%"
 "使用 Cursor 后，本类型任务平均时间从 4h 降到 2.5h"
```

### 误区 3：短期数据下结论
```
 "用了 1 周，感觉没用"
 "用了 1 个月，对比数据，提升 25%"
```

### 误区 4：忽视个体差异
```
 "团队平均效率提升 30%"
 "资深开发者 +50%，新手 +10%"
（不同人群效果不同）
```

## 8. 度量后的行动

### 数据驱动改进
```markdown

## 数据 → 行动

### 如果一次通过率低
→ 完善 agents.md
→ 培训团队 Prompt 技巧
→ 引入 Prompt 模板

### 如果 Bug 率高
→ 加强 Code Review
→ 强制测试覆盖
→ 引入 AI 自审

### 如果成本超预算
→ 模型分层
→ 上下文优化
→ 考虑本地模型

### 如果满意度低
→ 调研痛点
→ 工具切换 / 培训
→ 简化流程
```

## 总结
> 度量是改进的前提。

- 多维度（速度、质量、成本、体验）
- 持续度量
- 数据驱动决策
- 不要"凭感觉"

下一节：[常见反模式](/metrics/anti-patterns)