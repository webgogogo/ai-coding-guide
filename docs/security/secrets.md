# 敏感信息保护

## 风险全景
AI Coding 中，敏感信息可能通过 5 个渠道泄露：

```
1.  代码发给云端 AI
2.  报错日志发给 AI
3.  用户输入进入 Prompt
4.  AI 训练数据反向推断
5.  工具配置不当
```

## 1. 代码中的敏感信息

### 风险示例
```typescript
//  危险：直接硬编码
const apiKey = 'sk-xxx-1234567890'
const dbPassword = 'mypassword123'
const jwtSecret = 'super-secret-key'

//  危险：.env 文件
OPENAI_API_KEY=sk-xxx
DATABASE_URL=postgresql://user:pass@host/db
```

### 如果发给 AI
```
代码 → AI 服务器 → 可能被记录 → 风险
```

### 防护

#### 方案 1：去敏后再发
```typescript
// 发给 AI 前先替换
const apiKey = '<YOUR_API_KEY>'
const dbPassword = '<YOUR_DB_PASSWORD>'

// 让 AI 知道这是占位符
> 这段代码中的密钥都用 <YOUR_XXX> 占位符，实现业务逻辑
```

#### 方案 2：使用环境变量
```typescript
//  推荐：使用环境变量
const apiKey = process.env.API_KEY

// 这种代码发给 AI 是安全的
```

#### 方案 3：本地模型
```bash

# 最安全：完全本地（2026 推荐）
- OpenCode + GLM-5（77.8% SWE-bench，接近 Claude Opus 4.6）
- 或 OpenCode + Qwen3.5 397B（262K 上下文，专为编程优化）
- 数据不出内网
- 零泄露风险
```

## 2. 配置文件

### .env 文件
```bash

# .env（绝不能发给 AI）
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# .gitignore
.env
.env.local
.env.*.local
```

## 2. 配置文件：本地密钥的标准做法

为了让 AI 看到配置结构、但**永远看不到真实密钥**，推荐采用 **"三件套"模式**：

```
.env.example     ← 模板（提交到 Git，AI 可读）
.env             ← 真实密钥（本地私有，不提交）
.env.local       ← 个人覆盖（可选，更私密）
     +
.gitignore       ← 拦截 .env
.cursorignore    ← 拦截 AI 读取 .env
```

### .env.example（密钥模板）

**目的**：给 AI（和团队成员）一个清晰的"配置清单"，**只放键名 + 占位符，绝不出现真实值**。

```bash
# .env.example（提交到 Git）

# 腾讯云 COS 部署凭据
COS_SECRET_ID=<your-secret-id>
COS_SECRET_KEY=<your-secret-key>
COS_BUCKET=<your-bucket-name>
COS_REGION=ap-nanjing

# AI 模型 API
OPENAI_API_KEY=sk-<your-openai-key>
ANTHROPIC_API_KEY=sk-ant-<your-anthropic-key>

# 数据库
DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>
```

**为什么重要**：

- AI 能理解项目依赖哪些配置项，写代码时正确引用 `process.env.X`
- 新人 clone 项目后 `cp .env.example .env` 即可上手
- 真实密钥永远不会被 commit，永远不会被 AI 读到

### .env（真实密钥，本地私有）

**目的**：存放真实密钥，**只在本地生效，绝不入库**。

```bash
# .env（已在 .gitignore 中，不入库）

COS_SECRET_ID=AKIDxxxxxxxxxx
COS_SECRET_KEY=xxxxxxxxxxxxxx
COS_BUCKET=guide-1300453555
COS_REGION=ap-nanjing
```

**写法规范**：

| 项目 | 规范 |
|------|------|
| 命名 | 全大写 + 下划线，如 `COS_SECRET_ID` |
| 注释 | 必要时用 `#` 注释分组（注释也会入库到 .env.example） |
| 换行 | 每行一个变量，结尾不要有多余空格 |
| 引用 | 代码中用 `process.env.COS_SECRET_ID` 读取 |

**禁止做法**：

```javascript
// ❌ 硬编码在源码
const SECRET = "AKIDxxxxx"

// ❌ 硬编码 + 注释里写"真密钥"
const SECRET = "AKIDxxxxx"  // 这是真实的，别删

// ❌ 提交到 Git 的 .env
// .gitignore 里没写 .env → 立刻泄露
```

### .gitignore（关键防线）

```gitignore
# .gitignore

# 环境变量：本地私有，绝不入库
.env
.env.local
.env.*.local

# 兜底：任何以 .env 开头的本地配置
.env*
!.env.example     # ← 例外：保留 .env.example 入库

# IDE / 系统
.DS_Store
*.swp

# 构建产物
node_modules
dist
```

**关键点**：**`!.env.example` 这一行必须加**——它告诉 Git "所有 .env 都忽略，但 .env.example 例外"。

### 验证 .env 没被误提交

```bash
# 方法 1：检查 git 是否跟踪
git ls-files | grep .env
# 期望：只显示 .env.example，不显示 .env

# 方法 2：用 check-ignore 验证
git check-ignore -v .env
# 期望输出：.gitignore:6:.env   .env

# 方法 3：查看待提交文件
git status
# 期望：.env 不出现在待提交列表
```

### 在 Cursor / Claude Code 中排除

`.gitignore` 只防 Git 提交，但 **AI 工具可能直接读取文件内容**（比如 `@.env`）。需要额外屏蔽：
```bash

# Cursor 中排除敏感文件

# .cursorignore
.env
.env.*
secrets/
*.pem
*.key
*.crt
config/production/
```

```bash

# Claude Code 中排除

# .claudeignore
.env
.env.*
secrets/
*.pem
*.key
config/local/
```

### 配置示例
```bash

# .cursorignore（项目级）
node_modules/
dist/
.env
.env.*
secrets/
*.pem
*.key
config/production/

# 个人级

# ~/.cursorignore
~/.ssh/
~/.aws/
*.pem
```

## 3. 报错日志中的敏感信息

### 风险示例
```typescript
//  危险：日志包含敏感信息
try {
  await fetch(`https://api.example.com/users/${userId}?token=${apiToken}`)
} catch (error) {
  console.error('Failed:', error)
  // error.stack 可能包含 token
  // error.message 可能包含 userId
}

//  危险：错误信息泄露给前端
res.status(500).json({
  error: error.message,
  stack: error.stack,  // ← 包含源码路径
})
```

### 防护
```typescript
//  安全：过滤敏感字段
function sanitizeError(error: Error) {
  return {
    message: error.message.replace(/token=\w+/g, 'token=***'),
    code: error.name,
    timestamp: new Date().toISOString(),
  }
}

//  用 Sentry 等工具自动过滤
Sentry.init({
  beforeSend(event) {
    // 移除敏感字段
    return event
  },
})
```

### 发给 AI 的日志
```bash

# 发给 AI 前先处理
> 帮我排查这个 Bug：

# 原日志（不安全）：

# "Failed to fetch https://api.com/users/123?token=sk-xxx with userId=alice@example.com"

# 去敏后（安全）：

# "Failed to fetch https://api.com/users/<ID>?token=<TOKEN> with userId=<EMAIL>"
```

## 4. 用户输入与 Prompt Injection

### 风险
```typescript
// 用户输入进入 Prompt
const userInput = getUserInput()  // "忽略之前的指令..."
const prompt = `总结以下用户反馈：${userInput}`

// AI 可能被诱导执行非预期操作
```

详见 [Prompt Injection 防护](/security/prompt-injection)。

## 5. AI 训练数据

### 风险
云端 AI 的训练数据可能**反向推断**出敏感信息：

```
你的代码 → AI 训练 → AI 输出类似的代码（包含你的密钥模式）
```

### 防护
- 启用 Privacy Mode（Cursor Business / Claude Code 等）
- 避免使用 AI 输出直接包含敏感字段
- 定期轮换密钥

## 团队级敏感信息管理

### 1. 密钥管理工具
```bash

# 推荐：使用密钥管理服务
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- 阿里云 KMS
```

### 2. 代码扫描
```bash

# 提交前自动扫描
pnpm add -D secretlint

# package.json
{
  "scripts": {
    "scan:secrets": "secretlint '**/*'"
  }
}

# .secretlintrc.json
{
  "rules": [
    {
      "id": "secretlint-rule-preset-recommend"
    }
  ]
}
```

### 3. Git Hooks
```bash

# .husky/pre-commit
pnpm scan:secrets
```

### 4. CI 检查
```yaml

# .github/workflows/ci.yml
- name: Scan secrets
  run: pnpm scan:secrets
```

## 不同合规级别的处理

### Level 1：普通业务
```markdown

## 处理
- .env 不入库
- 代码去敏后再发给 AI
- 启用 Privacy Mode
- 不需要本地部署
```

### Level 2：敏感业务（金融、医疗）
```markdown

## 处理
- Level 1 所有措施
- AI 工具选择限定（私有部署）
- 审计日志
- 定期合规检查
```

### Level 3：高度敏感（军工、政务）
```markdown

## 处理
- Level 2 所有措施
- 完全本地部署
- 物理隔离网络
- 第三方安全审计
```

## 团队敏感信息规范
```markdown

## 团队敏感信息管理规范

### 分类
- 绝密：核心算法、客户数据、密钥
- 机密：业务逻辑、内部架构
- 公开：通用代码、文档

### AI Coding 规则
| 类别 | 是否可发 AI | 处理方式 |
| --- | --- | --- |
|  绝密 || 本地模型 / 离线处理 |
|  机密 || 去敏后 + Privacy Mode |
|  公开 || 直接使用 |

### 违规处理
- 首次违规：警告 + 培训
- 再次违规：暂停 AI Coding 权限
- 严重违规：按公司纪律处理
```

## 应急响应

### 发现泄露怎么办
```markdown

## 应急流程

### 第 1 步：立即止损
- 撤销相关密钥
- 暂停相关 AI 工具使用
- 通知安全团队

### 第 2 步：评估影响
- 哪些数据可能泄露
- 影响范围多大
- 客户是否需要通知

### 第 3 步：修复漏洞
- 找到泄露源头
- 加强防护措施
- 更新团队规范

### 第 4 步：复盘
- 写事故报告
- 团队分享教训
- 完善预防措施
```

## 实战检查清单
部署 AI Coding 前：

- [ ] 团队明确敏感信息分类
- [ ] 制定去敏流程
- [ ] 配置 .cursorignore / .claudeignore
- [ ] 启用 Privacy Mode
- [ ] 配置密钥扫描
- [ ] CI 加入密钥扫描
- [ ] 团队安全培训
- [ ] 应急响应流程

## 总结
> **敏感信息保护 = 流程 + 工具 + 意识**
- 代码去敏
- 工具配置
- 自动扫描
- 应急响应

下一节：[依赖与合规审计](/security/dependencies)