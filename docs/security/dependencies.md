# 依赖与合规审计

## 依赖安全的重要性
AI Coding 中，AI 经常引入**新的依赖包**。这带来多重风险：

- **恶意包**：包名相似、内嵌恶意代码
- **废弃包**：作者已弃用，无维护
- **License 风险**：与商业项目不兼容
- **版本风险**：破坏性更新未察觉
- **"幻觉包"**：AI 推荐的包根本不存在

## 1. AI 的"幻觉包"

### 什么是幻觉包
AI 训练数据中"见过"但实际不存在的包名：

```typescript
//  AI 写的代码
import { someUtility } from 'react-super-utils-2'
//                              ↑ 看起来真实，但不存在

import { formatDate } from 'date-format-helper-pro'
//                              ↑ 听起来专业，但不存在
```

### 危险场景
```
1. 攻击者注册 "react-super-utils-2"
2. 投放恶意代码
3. AI 推荐安装
4. 团队安装 → 被攻击
```

**这就是 typosquatting 攻击 + AI 放大版**。

### 防护
```bash

# 1. 安装前必须搜索
pnpm view react-super-utils-2

# 不存在 → 拒绝

# 2. 在 agents.md 中明确
> 不要推荐不存在的包。如果不确定包名，先 pnpm view <package-name> 验证

# 3. PR 中审查

# Reviewer 检查每个新引入的包
```

## 2. 依赖审计工具

### npm audit / pnpm audit
```bash

# 检查已知漏洞
pnpm audit

# 自动修复
pnpm audit --fix

# 输出示例

# Vulnerability: Prototype Pollution

# Package: lodash

# Severity: high

# Patched in: >=4.17.21
```

### Snyk
```bash

# 安装
pnpm add -D snyk

# 检查
npx snyk test

# 监控
npx snyk monitor
```

### Dependabot / Renovate
```yaml

# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
```

自动：
- 检测过时依赖
- 检测有漏洞的依赖
- 自动创建 PR

### Socket
```bash

# 安装
pnpm add -D @socketsecurity/cli

# 检查
npx socket ci
```

专门检测恶意包。

## 3. License 合规

### 常见 License 类型
| License | 商用 | 修改 | 分发要求 | 兼容性 |
| --- | --- | --- | --- | --- |
| **MIT**||  | 保留版权 | 高 |
| **Apache 2.0**||  | 保留版权 + 声明 | 高 |
| **BSD**||  | 保留版权 | 高 |
| **GPL**||  | 开源衍生作品 | 低 |
| **AGPL**||  | 网络服务也需开源 | 低 |
| **LGPL**||  | 修改部分需开源 | 中 |
| **Proprietary**||  | 禁止 | 低 |
| **UNKNOWN**||  | 风险 | - |

### License 检查工具
```bash

# pnpm dlx license-checker
pnpm dlx license-checker --production --json

# 输出所有依赖的 License
```

### 配置许可白名单
```javascript
// .license-checker.json
{
  "allowedLicenses": [
    "MIT",
    "Apache-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "ISC"
  ],
  "ignore": [
    "private-package@1.0.0"
  ]
}
```

### CI 集成
```yaml

# .github/workflows/license.yml
- name: License check
  run: |
    pnpm dlx license-checker --production --failOn "GPL;AGPL"
```

## 4. 包质量评估

### 引入新包前的检查
```markdown

## 新包引入清单

### 基础信息
- [ ] 包名是否真实存在
- [ ] 最近发布日期
- [ ] 周下载量（> 10k 更可信）
- [ ] GitHub Stars

### 维护情况
- [ ] 最近 6 个月有 commit
- [ ] 至少有 1 个维护者
- [ ] 有 Issues 处理
- [ ] 有版本发布

### 安全
- [ ] 无已知漏洞
- [ ] License 合规
- [ ] 依赖数量合理
- [ ] 无可疑脚本

### 必要
- [ ] 项目确实需要
- [ ] 没有更轻量的替代
- [ ] 团队有能力维护（如不再维护）
```

### 在 agents.md 中加规则
```markdown

## 依赖管理规则

### 引入新包前
- 必须 pnpm view 验证包存在
- 检查下载量、维护情况、License
- 团队讨论通过
- 禁止引入不存在的包
- 禁止引入 6 个月未更新的包
- 禁止引入 GPL/AGPL License（除非明确允许）

### 删除包时
- 标记 deprecated
- 通知团队
- 给替代方案
```

## 5. 依赖更新策略

### SemVer 严格遵守
```jsonc
// package.json
{
  "dependencies": {
    "react": "^18.2.0",         // 主版本锁定
    "lodash": "~4.17.21",       // 次版本锁定
    "typescript": "5.3.3"       // 完全锁定（关键依赖）
  }
}
```

### 依赖更新策略
```markdown

## 更新策略

### Patch 版本（5.3.3 → 5.3.4）
- 自动更新
- 通过 Dependabot

### Minor 版本（5.3.3 → 5.4.0）
- Review 后更新
- 检查 CHANGELOG

### Major 版本（5.3.3 → 6.0.0）
- 需要专门项目升级
- 评估 breaking change
- 测试覆盖
```

## 6. 供应链攻击防护

### 常见供应链攻击
```markdown

## 攻击类型

### 1. Typosquatting
恶意包名模仿知名包
- react vs raect
- lodash vs lodahs

### 2. Dependency Confusion
私有包名被公共包占用

### 3. 恶意维护者
合法包被卖给恶意作者

### 4. 注入恶意代码
通过 PR 注入恶意代码到合法包
```

### 防护措施
```markdown

## 防护
- 使用 lockfile（pnpm-lock.yaml）
- 验证包签名
- 限制自动安装未知包
- 使用私有 registry
- 监控异常行为
- 定期 pnpm audit
```

### 私有 Registry
```bash

# .npmrc
registry=https://registry.npmjs.org/

# 私有包
@my-company:registry=https://npm.my-company.com/

# 防止混淆攻击
```

## 7. 实战：完整的依赖安全流程

### 第 1 步：项目初始化
```bash

# 安装审计工具
pnpm add -D snyk @socketsecurity/cli license-checker

# 配置 CI

# .github/workflows/security.yml
```

### 第 2 步：CI 配置
```yaml
name: Security

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

# 漏洞扫描
      - run: pnpm audit --audit-level=moderate

# Snyk
      - run: npx snyk test

# Socket
      - run: npx socket ci

# License 检查
      - run: pnpm dlx license-checker --failOn "GPL;AGPL"
```

### 第 3 步：依赖更新
```bash

# 每周一次
pnpm update --interactive --latest

# 升级后
pnpm audit
pnpm test
```

### 第 4 步：移除废弃包
```bash

# 检查废弃包
pnpm ls --depth=0 | grep deprecated

# 替换或移除
pnpm remove <deprecated-package>
pnpm add <modern-alternative>
```

## 8. AI 与依赖的协作

### 让 AI 帮你评估依赖
```bash
> 我想引入 date-fns，请评估：
> 1. 包是否存在
> 2. 最近更新
> 3. License
> 4. 与现有依赖的兼容性
> 5. 包大小
> 6. 是否有更好的替代
```

### 让 AI 帮你升级
```bash
> 把 lodash 从 4.x 升级到最新版本：
> 1. 检查 CHANGELOG
> 2. 评估 breaking change
> 3. 在项目里搜索 lodash 用法
> 4. 列出需要修改的地方
> 5. 实施修改
> 6. 跑测试验证
```

### 让 AI 帮你去依赖
```bash
> 这个项目现在用了 lodash，但只需要 debounce 一个函数。
> 移除 lodash 依赖，自己实现 debounce。
```

## 9. 应急响应

### 发现恶意包怎么办
```markdown

## 应急流程

### 第 1 步：立即移除
pnpm remove <malicious-package>

### 第 2 步：评估影响
- 哪些文件被引入
- 是否已经执行
- 数据是否泄露

### 第 3 步：报告
- 提交 npm 安全报告
- 通知 Snyk / Socket
- 团队内通知

### 第 4 步：替代方案
- 找到安全的替代包
- 或自己实现

### 第 5 步：复盘
- 怎么进入项目的？
- 怎么避免再次发生？
- 完善检查流程
```

## 总结
> 依赖安全 = 工具 + 流程 + 意识

- 自动审计 + License 检查
- CI 强制 + Dependabot
- agents.md 规则
- 不要"AI 推荐就装"

下一节：[Prompt Injection 防护](/security/prompt-injection)