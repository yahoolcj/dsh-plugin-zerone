# AGENTS.md

@group: dsh-plugin-zerone
@version: 1.0.0

本仓库是 **`@vigalai/dsh-plugin-zerone`** —— oh-my-zerone（OMZ）为 DeepSeek Harness（DSH）提供的内置插件。本文件供 Agent 读取：它说明这个插件是什么，以及如何在 DSH 里安装与使用。

## 这个插件是什么

一个 DSH 插件，交付 **ZERONE 模式**（agent preset）+ **16 个内嵌技能**：

- **ZERONE 模式**：DSH 标准模式的完整副本，叠加 OMZ 人格（自主进化、SDD 工作流、进化授权、用户确认、review 规范），是可选的 agent preset，不改默认模式。
- **16 个技能**：15 个 SDD 工作流技能（grill-with-docs、grill-me、grill-from-draft、grill-me-ui、to-plan、to-prd、to-issues、to-coding、to-locate、to-explain、to-test、to-quality-review、to-review、to-commit、setup-omz）+ `omz-governance` 机制技能（工作流步骤表 / review 模板 / 进化申请格式 / 编码规则）。
- 技能经 `ctx.skills.register()` 全局注册（运行时 rank 250），模型与用户命令双入口；技能资源内嵌于包内，**零落盘**（不写入用户 skills 目录）。

## 安装（复制到 DSH 终端）

```sh
# 1) 安装插件包
dsh plugin --profile web add @vigalai/dsh-plugin-zerone
```

```yaml
# 2) 若 ZERONE 模式未自动出现，在 profile 的 cordis.patch.yml 追加
#    （<profilePkgPath> 替换为绝对路径到 node_modules/@vigalai/dsh-plugin-zerone/config/agent-presets）
- id: agent-presets
  config:
    default: standard
    roots:
      - path: <profilePkgPath>/node_modules/@vigalai/dsh-plugin-zerone/config/agent-presets
        trust: system
```

3) 重启 DSH。模式列表出现 **ZERONE**；空白会话切换到 ZERONE 获得 OMZ 人格与全部技能。

> dsh-desktop 捆绑版已预置插件与 preset 配置，安装桌面应用后开箱即用，无需上述配置。

## 使用说明

- 切换到 ZERONE 模式后，Agent 获得 OMZ persona：SDD 工作流、进化三档边界、[用户确认] 流程、权限红线、仓库数据资产引导。
- 完整流程细节（fe-dev / fe-locate / fe-explain 步骤表、review 模板、进化申请格式、编码规则）见 `skills/omz-governance/SKILL.md` 技能，进入对应阶段时按需加载。
- 仓库级数据资产（`docs/agent/memory.md`、`docs/knowledge/`、`.PRD/`、`.ISSUES/`）留在项目仓库，首次进入 ZERONE 模式自动创建。

## 机制边界

- **进化授权**：记忆可自主落盘；知识库 / skill / 规则改动须按 `omz-governance` 格式发起 `[进化申请-*]` 并经用户对话确认。
- **[用户确认]**：出现确认环节暂停并提供上下文；收到"自动执行"授权可推进，step 完成后告知细节并消除授权。
- **review**：按 `omz-governance` review 模板输出（通过 / 未通过 / 待确认）与结论规则。

## 资源

- npm：<https://www.npmjs.com/package/@vigalai/dsh-plugin-zerone>
- 仓库：<https://github.com/yahoolcj/dsh-plugin-zerone>
- 市场：<https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/4037>
- 屏幕截图：`assets/screenshots/`（`screenshots.json`）
