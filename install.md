# 安装 dsh-plugin-zerone

`dsh-plugin-zerone` 是 oh-my-zerone（OMZ）给 DeepSeek Harness 做的插件：装上去之后，你会多一个 **ZERONE 模式**，还带一整套 16 个技能。

## 怎么装

### 方式一：dsh-market 安装（最省事）

打开 DSH 的 **Plugin Market**，搜索 **yahoolcj/dsh-plugin-zerone**，点一键安装。

### 方式二：手动命令

也可以自己在终端跑：

```sh
dsh plugin --profile web add @vigalai/dsh-plugin-zerone
```

如果装完 ZERONE 模式没冒出来，去 profile 的 `cordis.patch.yml` 里给 `agent-presets` 配一下 preset 根目录：

```yaml
- id: agent-presets
  config:
    default: standard
    roots:
      - path: <绝对路径>/node_modules/@vigalai/dsh-plugin-zerone/config/agent-presets
        trust: system
```

### dsh-desktop 捆绑

dsh-desktop 已预置插件与配置，安装桌面应用后开箱即用。

## 装完做什么

重启 DSH，新建一个会话、切到 **ZERONE** 模式。

你会得到一个带着 OMZ 人格的 Agent：它自主进化、严格走 SDD 工作流、会主动找你确认、也会做 review。同时 `/to-prd`、`/to-coding`、`/to-review` 这些命令就都能用了。

## 你拿到了什么

- **16 个技能**：15 个 SDD 工作流技能 + `omz-governance` 机制技能
- **ZERONE 模式**：DSH 标准能力 + OMZ 人格（可选模式，不动你的默认设置）
- **项目级能力**：进新仓库自动建记忆、知识库、进化日志，越用越懂你的项目

## 备注

- npm：<https://www.npmjs.com/package/@vigalai/dsh-plugin-zerone>
- 仓库：<https://github.com/yahoolcj/dsh-plugin-zerone>
- 市场收录：<https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/4037>
