# @vigalai/dsh-plugin-zerone

`oh-my-zerone`（OMZ）为 DeepSeek Harness（DSH）提供的内置插件：**ZERONE 模式**（Agent Preset）+ **16 个内嵌技能**（15 个 SDD 工作流技能 + omz-governance 机制技能）。

技能内嵌于插件包，经 `ctx.skills.register()` 全局注册（运行时 rank 250），模型与用户命令双入口；**不向用户系统写入任何技能文件**。

## 安装

### 方式一：npm 独立分发

1. 安装插件包到 profile：

```sh
dsh plugin --profile web add @vigalai/dsh-plugin-zerone
```

2. 在 profile 的 `cordis.patch.yml` 中声明 preset 根目录，指向包内 preset 资源：

```yaml
agentPresets:
  roots:
    - path: node_modules/@vigalai/dsh-plugin-zerone/config/agent-presets
      trust: system
```

3. 重启 DSH。模式列表中即出现 **ZERONE**。

### 方式二：dsh-desktop 捆绑

dsh-desktop 发行版已内置本插件与 preset 配置，安装桌面应用后开箱即可使用。

## ZERONE 模式

- **定位**：包含 DSH 标准模式的全部能力（工具、plan mode、compaction、delegation、workflow 等），之上叠加 OMZ 人格：自主进化 + SDD 工作流 + 进化授权 + 用户确认机制 + review 规范。
- **切换**：新建空白会话后，在模式列表选择 **ZERONE**；默认模式不受影响（可在设置中自行修改默认）。
- **机制细节**：常驻 persona 内置角色、工作流指引、权限红线、进化三档边界、[用户确认] 流程；完整流程步骤表（fe-dev / fe-locate / fe-explain）、review 输出模板、进化申请格式、编码规则由 `omz-governance` 技能按需承载。

## 技能清单

| 技能 | 用途 |
|---|---|
| grill-with-docs / grill-me / grill-from-draft / grill-me-ui | 需求与方案澄清 |
| to-plan / to-prd / to-issues | 计划、PRD 沉淀与 issue 切片 |
| to-coding / to-locate / to-explain | 编码开发、问题定位、代码解释 |
| to-test / to-quality-review / to-review | 测试回收、质量质检、审查 |
| to-commit | commit / PR 收尾 |
| setup-omz | 生成 / 补全 `docs/agent/introduction.md` |
| omz-governance | 机制流程细节（工作流 / 审查 / 进化 / 编码规则） |

技能在命令面板以 `/grill-with-docs`、`/to-prd`、`/to-coding` 等命令出现（`user-invocable`），同时进入模型技能目录（`model-invocable`）。

## 仓库级机制

- **数据资产**（`docs/agent/memory.md`、`docs/knowledge/`、`docs/agent/evolution-log.md`、`.PRD/`、`.ISSUES/`）留在项目仓库，ZERONE 模式下首次进入新仓库自动创建。
- **机制规则已内置**：仓库不需要再放置 `AGENTS.md` 或机制文档，模式 persona 为唯一权威。
- **进化授权**：记忆可自主落盘；知识库 / skill / 规则需按 `omz-governance` 中的格式发起 `[进化申请-*]` 并经用户对话确认；危险操作由 DSH 沙箱与审批栈兜底。

## 开发

```
packages/dsh-plugin-zerone/
├── lib/index.js                    # cordis 插件入口：技能注册
├── skills/<name>/SKILL.md          # 技能资源（内嵌，不落盘用户系统）
└── config/agent-presets/zerone/    # ZERONE 模式（preset.yml + agent.cordis.yml）
```

- 技能内容以 `packages/omz/skills/` 为源，修改源后需同步到 `skills/` 副本。
- 架构决策见 `docs/adr/0001-omz以插件加preset接入dsh.md`；DSH 平台机制事实见 `docs/knowledge/dsh-platform.md`。
