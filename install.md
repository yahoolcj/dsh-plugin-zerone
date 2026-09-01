# 安装 dsh-plugin-zerone

`dsh-plugin-zerone` 是 oh-my-zerone（OMZ）给 DeepSeek Harness 做的插件：装上去之后，你会多一个 **ZERONE 模式**，还带一整套 16 个技能。

## 怎么装

### 方式一：让 Agent 帮你装（最省事）

把下面这句直接发给你的 DSH Agent，它会自己来读这个仓库、然后把插件装好：

> 请你仔细阅读 https://github.com/yahoolcj/dsh-plugin-zerone，并且安装这个插件。

### 方式二：在 dsh-market 里搜

打开 DSH 的 **Plugin Market**，搜 **yahoolcj/dsh-plugin-zerone**，点一键安装就行。

### 方式三：手动命令（可选）

不想走上面两招，也可以自己在终端跑：

```sh
dsh plugin --profile web add @vigalai/dsh-plugin-zerone
```

如果装完 ZERONE 模式没冒出来，去 profile 的 `cordis.patch.yml` 里给 `agent-presets` 配一下 preset 根目录（具体写法看仓库里的 README，或直接问 Agent）。

## 装完做什么

重启 DSH，新建一个会话、切到 **ZERONE** 模式。

你会得到一个带着 OMZ 人格的 Agent：它自主进化、严格走 SDD 工作流、会主动找你确认、也会做 review。同时 `/to-prd`、`/to-coding`、`/to-review` 这些命令就都能用了。

## 你拿到了什么

- **16 个技能**：15 个 SDD 工作流技能 + `omz-governance` 机制技能
- **ZERONE 模式**：DSH 标准能力 + OMZ 人格（可选模式，不动你的默认设置）
- **仓库级能力**：进新仓库自动建记忆、知识库、进化日志，越用越懂你的项目

## 备注

- npm：<https://www.npmjs.com/package/@vigalai/dsh-plugin-zerone>
- 仓库：<https://github.com/yahoolcj/dsh-plugin-zerone>
- 市场收录：<https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/4037>
