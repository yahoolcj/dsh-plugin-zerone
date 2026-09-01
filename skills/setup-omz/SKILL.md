---
name: setup-omz
description: 首次进入新仓库时执行项目初始化扫描（ZERONE/DSH 模式下按需触发）。使用当前项目的配置文件和目录结构，自动理解技术栈与项目结构，并生成或补全 docs/agent/introduction.md；记录技术结构、定位入口与轻量业务概览，不运行项目脚本。
---

@author: laicaijin
@email:lcj970630@gmail.com
@group:oh-my-zerone

# Setup OMZ

`/setup-omz` 用于首次进入一个新仓库时，对当前项目做一次技术结构初始化扫描，并生成或补全 `docs/agent/introduction.md`。在 ZERONE（DSH 内置模式）下，机制已随模式内置，本 skill 只负责项目技术结构文档的按需生成。

本 skill 是手动触发能力，不隶属于特定开发工作流。

## 目标

- 理解当前项目的技术栈、目录结构、工程配置、关键定位入口和轻量业务概览。
- 让后续 Agent 可以快速判断"入口在哪、接口在哪、数据在哪、配置在哪、依赖有哪些、核心能力是什么"。
- 自动适配项目类型（前端应用 / 后端服务 / CLI 工具 / 库 / monorepo），不套固定模板。
- 将结果写入 `docs/agent/introduction.md`。
- 输出 setup 报告，说明写入策略、识别摘要、扫描来源和未写入内容。

## 硬边界

### 允许

- 读取 `AGENTS.md`。
- 读取 `docs/agent/permission.md`。
- 读取 `docs/agent/evolution.md`。
- 读取和更新 `docs/agent/introduction.md`。
- 只读扫描项目目录、配置文件、源码入口和 README。
- 从代码和配置文件推断产品定位、核心能力、架构拓扑和工程约束。
- 基于已有大纲补充技术结构内容。
- 在 `introduction.md` 中写入或更新 `@group:oh-my-zerone` 与 `@last-scan YYYY-MM-DD`。
- 输出 setup 报告。

### 禁止

- 不写领域术语深层解释、业务流程运转细节、角色业务含义、模块业务目标、接口业务语义。
- 不凭空编造业务信息——推断不出来就写"未从代码中识别"。
- 不更新 `CONTEXT.md`。
- 不创建或更新 `docs/knowledge/`。
- 不更新 `docs/agent/memory.md`。
- 不更新 workflow、rules、其他 skill，除非已经按进化机制获得用户确认。
- 不运行任何会改变项目状态的命令（install、build、test、lint、格式化、代码生成、迁移等）。
- 不提交 commit。
- 不覆盖已有实质内容，除非用户确认。

如果发现深层业务知识（领域术语、业务流程、角色定义等），只在 setup 报告里提示"发现深层业务信息，未写入 introduction.md"。如需沉淀，应按项目进化机制申请写入 `CONTEXT.md` 或 `docs/knowledge/`。

## 前置读取

执行时先读取：

1. `AGENTS.md`
2. `docs/agent/permission.md`
3. `docs/agent/evolution.md`
4. `docs/agent/introduction.md`

如果权限文件或进化文件不存在，仍可继续扫描，但必须在报告中说明缺失文件和影响。

ZERONE（DSH）模式下，AGENTS.md 与机制文档（permission / evolution 等）已内置到模式，仓库中缺失是正常状态：跳过读取，不视为缺失。

## 维度体系（覆盖要求）

扫描时必须覆盖以下 15 个维度。每个维度根据实际项目产出相应内容：有证据就写，没证据写"未发现"，不编造、不留空章节。

### 1. 项目概述
一句话产品定位 + 项目类型（Web 服务 / CLI 工具 / 定时任务 / 微服务 / 库 / monorepo / 前端应用 …）。

推断来源：README、package name / module name、入口文件、目录结构。

### 2. 核心能力
项目提供的主要功能或 API 领域列表。

推断来源：路由定义、proto 文件、handler/controller 目录名、OpenAPI 文件、CLI 子命令。

### 3. 架构拓扑
依赖的存储、中间件和上下游服务关系。

推断来源：配置中的连接串、`docker-compose.yml`、RPC client 目录、消息队列 consumer/producer 目录、服务发现配置。

### 4. 启动与入口
进程入口文件、启动流程、启动依赖（如先连数据库再起 HTTP）。

推断来源：`main.*`、`server.*`、`app.*`、`cmd/`、`index.*`、`bootstrap.*`。

### 5. 对外接口
HTTP / RPC / GraphQL / WebSocket / 消息队列 consumer 等对外暴露的接口位置和协议类型。

推断来源：router、controller、handler、resolver、proto、OpenAPI spec、GraphQL schema、consumer 入口。

### 6. 数据层
数据库、缓存、消息队列、文件存储、搜索引擎的连接方式、操作入口和 schema 管理。

推断来源：ORM 目录、DAO/repository 目录、migrations 目录、Redis/Kafka/ES client 封装、数据库连接初始化文件、`schema/`、`seed/`。

### 7. 内部模块
核心业务模块或领域的划分方式和目录组织。

推断来源：`services/`、`domain/`、`usecase/`、`modules/`、`core/`、`internal/` 的二级目录。

### 8. 配置与环境
配置加载方式、环境变量、多环境策略。

推断来源：`config/`、`.env*` 文件、`application*.yml`、启动时配置加载代码、环境变量示例文件。

### 9. 中间件与切面
认证、鉴权、日志、限流、trace、错误处理、参数校验等横切关注点的实现位置。

推断来源：middleware、interceptor、guard、filter、decorator、plugin 目录或文件。

### 10. 依赖注入与组装
模块如何组装、依赖如何管理。

推断来源：DI 容器文件、`wire.go`、`providers.ts`、`@Injectable` 装饰器、`container/`、`inject.go`。

### 11. 构建与脚本
包管理器、构建命令、常用开发/测试/部署脚本、Makefile。

推断来源：`package.json` scripts、`Makefile`、`Taskfile`、`go.mod`、`Cargo.toml`、`pyproject.toml`、`pom.xml`。

### 12. 测试
测试目录结构、测试框架、覆盖率配置。

推断来源：`tests/`、`__tests__`、`spec/`、`*_test.*`、`*.spec.*`、`*.test.*`、测试配置文件。

### 13. 部署与运维
容器化配置、CI/CD 流水线、健康检查端点。

推断来源：`Dockerfile`、`docker-compose*`、`.github/workflows/`、`k8s/`、`helm/`、`deploy/`、health check 代码。

### 14. 工程约束
从工程配置中能自动识别的约束：语言版本、类型严格度、lint 规则、格式化约定、禁止项。

推断来源：`tsconfig.json` strict、`.eslintrc`、`.golangci.yml`、`go.mod` go version、`Cargo.toml` edition、`pyproject.toml` mypy、`.editorconfig`、`prettier.config.*`。

### 15. Agent 相关
OMZ 套件目录。

推断来源：`AGENTS.md`、`rules/`、`skills/`、`docs/agent/`。

ZERONE（DSH）模式下机制已内置，仓库仅保留数据资产（memory.md、docs/knowledge/、evolution-log.md），按实际存在情况记录。

## 扫描原则

不使用固定目录名清单匹配。采用以下原则动态适配项目：

### 广度优先，逐层展开
先列顶层目录，再进入源码根目录（如 `src/`、`lib/`、`internal/`、`cmd/`），逐层展开。每层先看子目录名，再选代表性文件读取内容确认。

### 名实结合，确认后落笔
目录名和文件名是信号（如 `handlers` → 可能是 HTTP handler），但必须读取 1-2 个代表性文件内容确认实际职责。不靠名字猜，不靠经验套。

### 配置文件是金矿
`docker-compose.yml`、`.env.example`、`Makefile`、CI 配置、包管理文件通常暴露架构拓扑、关键依赖和运行方式。优先读取。

### 生态感知
识别包管理文件（`go.mod`、`package.json`、`Cargo.toml`、`requirements.txt`、`pyproject.toml` 等）后，用该生态的惯用目录约定辅助推断。例如 Go 项目注意 `cmd/`、`internal/`、`pkg/`；Node 项目注意 `src/`、`lib/`；Python 项目注意 `tests/`、`src/` 布局。

### 覆盖率兜底
15 个维度全部过一遍。找不到证据就写"未在代码中发现"，不跳过、不留空、不编造。

### 不写死标题
introduction.md 的章节标题由 LLM 根据项目实际情况命名，不套固定模板。例如后端服务可能出现"RPC 接口"、"数据存储"、"中间件链"；前端应用可能出现"路由与页面"、"组件体系"、"样式方案"；CLI 工具可能出现"命令结构"、"参数解析"。

## 扫描排除

读取 `.gitignore`，并避免扫描明确忽略的大目录。

默认跳过：

- `.git`
- `node_modules`
- `dist`
- `build`
- `.next`
- `.nuxt`
- `coverage`
- `.turbo`
- `.cache`
- `vendor`
- `target`
- `__pycache__`
- 临时产物、日志、压缩包和生成目录

## 内容规则

### 可写入内容

每个维度产出一段"定位说明 + 关键特征"：

- **定位说明**：明确文件路径或目录（如 `请求层入口位于 src/services/request.ts`）
- **关键特征**：附上 1-2 句关键发现（如 `基于 axios 封装，拦截器统一注入 token 和错误处理`、`使用 GORM + MySQL，migrations 由 golang-migrate 管理`）

### 不可写入内容

- 领域术语深层解释（"User 实体代表xxx角色的xxx"）
- 业务流程运转细节（"下单流程：先锁库存再创建订单再扣款"）
- 角色与权限的业务含义（"admin 角色可以做xxx"）
- 模块的业务目标（"订单模块负责xxx业务场景"）
- 接口的业务语义（"POST /api/login 用于xxx场景登录"）

以上内容如扫描时发现，在 setup 报告里提示，引导用户写入 `CONTEXT.md`。

### 不确定信息的表达

不单独创建"待确认项"章节。在对应正文里表达：

- 找到明确证据：`请求层入口位于 src/services/request.ts，基于 axios 封装。`
- 未发现：`未在代码中发现统一请求层封装。`
- 有多个候选：`请求层候选位置包括 src/api 与 src/services，需结合具体调用点继续确认。`

### 业务信息的表达（轻量概览）

允许从代码和配置推断以下三类业务概览：

- **产品一句话**：从 README、包名、模块名推断，如 `一个用户管理后端服务`。推断不出来写"未从 README 或包名中识别产品定位"。
- **核心能力清单**：从路由、handler、proto、模块目录推断，如 `提供用户管理、订单处理、消息推送能力`。用列表，每一项对应一个可定位的目录或文件。
- **架构拓扑**：从配置连接串、docker-compose、RPC client 推断，如 `依赖 MySQL（主库）+ Redis（缓存）+ Kafka（消息队列），上游调用 A 服务 RPC`。

以上均为推断，用语留余地：`推断依赖xxx`、`可能包含xxx`。

## 写入策略

按以下顺序判断：

1. **空模板**
   - 只有标题、元信息和空章节，或有效内容很少。
   - 可以自动完整写入。

2. **已有大纲但缺内容**
   - 保留用户标题和顺序。
   - 按大纲补充内容。
   - 如果大纲太粗，允许在对应章节下新增二级或三级小节。
   - 如果缺少关键维度，允许追加补充章节。

3. **已有 setup-omz 管理区块**
   - 如果存在：
     ```md
     <!-- setup-omz:start -->
     ...
     <!-- setup-omz:end -->
     ```
   - 只更新管理区块内部，保留区块外用户内容。

4. **已有实质内容且无管理区块**
   - 不自动覆盖。
   - 暂停并向用户说明覆盖风险，提供拟写入摘要，等待确认。

默认不调整已有标题名称，不重排标题顺序，不删除用户标题。空模板首次生成时，LLM 根据项目实际自由组织标题，不套固定模板。

## 文档风格

- 索引类信息优先用表格：技术栈、目录职责、关键入口、scripts、扫描来源。
- 说明类信息使用短段落或列表。
- 保持内容面向"后续快速定位文件 + 快速理解项目骨架"，不写长篇源码解读。
- 每个维度的产出控制在 3-8 行：1 行定位 + 2-7 行关键特征或列表。
- 章节标题根据项目类型自由命名，不套"路由与页面"、"样式体系"等固定标题。

## 校验

写入后检查：

- `docs/agent/introduction.md` 存在。
- 文件中有 `@group:oh-my-zerone`。
- 文件中有最新 `@last-scan YYYY-MM-DD`。
- 15 个维度全部覆盖（有内容的写了，没证据的写了"未发现"）。
- 未写入领域术语深层解释、业务流程细节、角色业务含义、模块业务目标、接口业务语义。
- 业务概览（产品定位、核心能力、架构拓扑）均从代码证据推断，未编造。
- 未修改 `CONTEXT.md`、`docs/knowledge/`、`docs/agent/memory.md`、workflow、rules、其他 skills。
- 有 `扫描来源` 章节，列出主要依据文件。
- 如果已有大纲，原有标题顺序未被重排。

不要通过运行项目脚本来校验。

## setup 报告

完成后输出：

```md
## setup-omz 报告

写入结果：
- 已更新 / 未写入 / 等待用户确认

更新策略：
- 空模板自动写入 / 已有大纲补全 / 管理区块更新 / 已有实质内容等待确认

项目类型：
- Web 服务 / CLI / 微服务 / 前端应用 / 库 / monorepo / …

技术栈摘要：
- 语言 + 框架 + 主要依赖

维度覆盖：
- 项目概述：…
- 核心能力：…
- 架构拓扑：…
- 启动入口：…
- 对外接口：…
- 数据层：…
- 内部模块：…
- 配置环境：…
- 中间件切面：…
- DI 组装：…
- 构建脚本：…
- 测试：…
- 部署运维：…
- 工程约束：…
- Agent 相关：…

扫描来源：
- `path/to/file`：用途

未写入内容：
- 发现深层业务信息时说明（建议写入 CONTEXT.md）。

边界：
- 未写深层业务知识（领域术语/业务流程/角色含义/模块目标/接口语义）。
- 未更新 CONTEXT.md / docs/knowledge / memory / workflow / rules / 其他 skills。
- 未运行 build / test / lint / install。
- 未提交 commit。
```
