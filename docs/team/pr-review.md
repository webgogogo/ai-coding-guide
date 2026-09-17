# PR 与 Code Review 规范

## PR 在 AI Coding 中的特殊价值
PR 是**团队 AI Coding 的最后一道质量关卡**：

```
AI 生成代码
   ↓
作者自查 + AI 自审
   ↓
自动化检查（CI）
   ↓
人工 PR Review  ← 关键
   ↓
合并
```

## PR 模板

### .github/pull_request_template.md
```markdown

## 变更说明
<!-- 描述这个 PR 做了什么 -->

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 性能优化
- [ ] 文档

## AI Coding 信息
<!-- 重要：明确 AI 参与程度 -->
- [ ] 完全人工编写
- [ ] AI 辅助生成（人类主导）
- [ ] AI 主要生成（人工审查）
- [ ] AI 完全生成（人工严格审查）

使用的工具：
- [ ] Cursor
- [ ] Claude Code
- [ ] Trae Solo
- [ ] 其他：____

## 测试
- [ ] 单元测试
- [ ] 组件测试
- [ ] 手动测试
- [ ] E2E 测试（如适用）

## 检查清单
- [ ] 遵循 agents.md
- [ ] 跑过 pnpm check
- [ ] 自我 Review 过
- [ ] AI 自审过
- [ ] 更新了相关文档

## 截图（如有 UI 变更）
<!-- 截图 -->

## 关联 Issue
<!-- 关联 #xxx -->
```

## PR 的大小

### 推荐的 PR 大小
```
理想：< 200 行变更
可接受：200-500 行
过大：> 500 行（应拆分）
```

### AI 时代的 PR 拆分
```bash

# 反例：AI 一次生成 1000 行代码，1 个 PR
git commit -m "feat: add user module"

# 1000+ 行变更

# 正例：拆分成多个小 PR

# PR #1: 类型定义（50 行）

# PR #2: API 服务（150 行）

# PR #3: 列表组件（200 行）

# PR #4: 表单组件（200 行）

# PR #5: 测试（150 行）
```

### 拆分技巧
```bash

# 让 AI 按阶段生成
> 第一步：只生成类型定义
（提交 PR #1）

> 第二步：只生成 API 服务
（提交 PR #2）

# 避免：
> 一次性生成整个模块
```

## Reviewer 分配

### CODEOWNERS
```bash

# .github/CODEOWNERS

# 默认 owner
*                          @team-leads

# 特定模块
/src/components/           @frontend-team
/src/api/                  @backend-team
/.claude/                  @ai-tooling-team
/docs/                     @docs-team
```

### Reviewer 数量
| PR 大小 | 推荐 Reviewer |
| --- | --- |
| 小型 (< 100 行) | 1 人 |
| 中型 (100-500 行) | 1-2 人 |
| 大型 (> 500 行) | 至少 2 人 |
| 关键模块 | 2+ 人 + Lead |

### Reviewer SLA
```markdown

## Review SLA
- 普通 PR：1 个工作日内
- 紧急 PR：2 小时内
- 大型 PR：2 个工作日内
- 关键模块 PR：1 个工作日内 + Lead Review
```

## AI 辅助 Review

### 1. AI 初审
```bash

# 让 AI 先审一遍
> /review 当前的 diff

# AI 输出 Review 报告

# - 优点

# - 问题

# - 改进建议
```

### 2. AI 检查清单
```markdown
请审查以下 PR：

## 自动检查
- [ ] 是否遵循 agents.md
- [ ] 是否有类型错误风险
- [ ] 是否有明显 bug
- [ ] 是否影响性能
- [ ] 是否需要测试
- [ ] 是否有安全问题

## 输出格式

### 必须修改

### 建议改进

### 做得不错

### 讨论
```

### 3. AI 解释变更
```bash

# 当 PR 很复杂时
> 这个 PR 改了什么？请用通俗的话总结：
> - 业务上的变化
> - 技术上的变化
> - 风险点
```

## Review 重点（AI 时代）

### 1. 业务正确性
```typescript
// AI 写的代码
function calculateDiscount(price: number, userType: string) {
  if (userType === 'vip') return price * 0.8
  // ...
}

// Review 重点：
// - 业务规则对吗？
// - VIP 真的打 8 折？
// - 是否有遗漏的用户类型？
```

### 2. 一致性
```typescript
// AI 写的代码可能不一致
// 文件 A 用 userService
// 文件 B 用 fetchUserData

// Review 重点：统一性
```

### 3. 边界处理
```typescript
// AI 经常遗漏的：
// - null/undefined
// - 空数组
// - 极值
// - 错误状态
```

### 4. 安全性
```typescript
// XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// SQL 注入
const query = `SELECT * FROM users WHERE id = ${userId}`

// 密钥泄露
const apiKey = 'sk-xxx'  // 硬编码
```

### 5. 性能
```typescript
// 不必要的 re-render
// 缺失的 memo
// 大列表没虚拟滚动
```

### 6. 可维护性
```typescript
// "AI 味"代码
// 命名不清晰
// 过度抽象
// 重复造轮子
```

## Review 反馈规范

### 反馈类型
```markdown
 [Blocker] 必须修改
- 安全问题
- 明显 bug
- 阻塞性问题

 [Should] 强烈建议修改
- 不符合规范
- 性能问题
- 可读性差

 [Nit] 小建议（可选）
- 命名微调
- 注释完善
- 代码风格

 [Idea] 想法（讨论）
- 架构建议
- 替代方案

 [Question] 提问
- 业务逻辑确认
- 设计意图
```

### 反馈语气
```markdown
 好的反馈
"这里建议用 useReducer，因为状态较复杂，可以更清晰地管理"
（解释 + 建议）

"这个命名 userData 不够具体，建议改成 currentUser 突出这是当前用户"
（具体 + 理由）

 不好的反馈
"这里不对"
（无解释）

"重写"
（无方向）

"你怎么这么写"
（质问语气）
```

### 反馈模板
```markdown

### [文件名:行号] 反馈类型
**问题**：描述问题

**建议**：具体改进方案

**理由**：为什么这样改

**示例**（可选）：
\`\`\`typescript
// 修改后
\`\`\`
```

## Review 流程

### 作者视角
```
1. 写代码
   ↓
2. 自我 Review
   ↓
3. AI 自审
   ↓
4. 跑 CI（lint + typecheck + test）
   ↓
5. 提交 PR（带详细描述）
   ↓
6. 等待 Review
   ↓
7. 处理反馈
   ↓
8. 重新提交（CI 自动跑）
   ↓
9. 通过后合并
```

### Reviewer 视角
```
1. 收到 PR 通知
   ↓
2. 看 PR 描述 + 关联 Issue
   ↓
3. 检查 CI 是否通过
   ↓
4. 审查代码
   ↓
5. 给反馈 / Approve
   ↓
6. 处理作者的回复
   ↓
7. 最终 Approve
```

## Review 的常见问题

### 1. Review 太慢
```markdown

## 解决方案
- 设定 SLA（如 1 个工作日）
- 排期时考虑 Review 时间
- 小批量 Review，避免积压
- 用 AI 辅助 Review 提速
```

### 2. Review 太浅
```markdown

## 解决方案
- 团队 Review 培训
- 制定 Review 清单
- 关注"业务正确性"
- 不只看"代码风格"
```

### 3. Review 过于严苛
```markdown

## 解决方案
- 区分 Blocker / Should / Nit
- Nit 不要阻塞 PR
- 鼓励"差不多就行"
- 关注重要问题
```

### 4. 作者不响应反馈
```markdown

## 解决方案
- PR 模板要求及时响应
- 超时自动 ping
- Reviewer 之间互相 @ 提醒
```

## 实战案例

### 场景：AI 生成的用户管理模块 PR
```
PR 标题：feat(user): add user management module

变更：800 行
├── src/types/user.ts（新增 50 行）
├── src/services/user.ts（新增 100 行）
├── src/components/UserList/（新增 300 行）
├── src/components/UserForm/（新增 200 行）
└── src/pages/UserPage.tsx（新增 150 行）

CI： 通过

Reviewer 1：@senior-dev
- UserForm 缺少 email 格式校验
- UserList 的 loading 态可以更友好
- API 服务封装得不错

Reviewer 2：@frontend-lead
- 建议拆分 PR，这个太大
- 考虑用 React Hook Form 而不是 Formik
- 整体架构 OK
```

### 作者处理
```
1. 拆分 PR（按模块）
2. 修复 Blocker（加 email 校验）
3. 改进 Should（loading 态）
4. 回应 Lead（说明为什么用 Formik）
5. 重新提交
```

## Review 礼仪与文化

### 鼓励
- **对事不对人**：评论代码，不评论人
- **教学相长**：分享知识，不是挑刺
- **感谢贡献**：认可他人的工作
- **友善沟通**：假设对方是好意

### 避免
- **人身攻击**："你怎么这么菜"
- **完美主义**："这代码我看不下去"
- **强制风格**："必须用我喜欢的写法"
- **延迟 Review**："我没时间看"

### 团队公约
```markdown

## Review 公约
1. PR 24 小时内首次响应
2. 反馈要具体、可执行
3. Blocker 必须解决，Nit 可选
4. 尊重作者意图，技术讨论对事不对人
5. Approve 前确保理解所有变更
```

## Review 与 AI 协作的未来

### AI Review 的趋势
- **AI 自动初评**：拦截明显问题
- **人工专注**：业务正确性、架构决策
- **Review 数据**：跟踪 Review 质量、速度

### 工具演进
```
现在：
AI 写代码 → 人工 Review

未来：
AI 写代码 → AI Review → 人工重点 Review → AI 修复 → 合并
```

## 总结
PR 与 Review 是**团队 AI Coding 的核心制度**：

- 小 PR、好描述
- AI 辅助 + 人工把关
- 关注业务正确性
- 友善沟通

下一节：[团队上手路径](/team/onboarding)