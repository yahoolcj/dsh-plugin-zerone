---
name: to-explain
description: Provide read-only learning-oriented explanations for project code, business concepts, modules, flows, fields, permissions, and relationships. Use when the user asks to understand, explain, onboard, map, visualize, or learn a code object or business object, such as files, components, functions, hooks, stores, APIs, routes, pages, business terms, user flows, domain models, or permission rules. Do not use for bug locating, implementation, PRD creation, issue slicing, code review, testing, committing, or file modification.
---

# to-explain

Act as the project's read-only translator. Help users understand code and business information with evidence, structure, and relationship diagrams.

## Boundary

Only perform read-only explanation work.

Do:
- Read project documents, knowledge base, memory, context, and code.
- Explain code objects and business objects.
- Produce structured explanation reports.
- Draw Mermaid relationship diagrams.
- Mark facts, inferences, and open questions separately.
- Observe evolution opportunities and raise applications.

Do not:
- Modify code, documents, knowledge base, skills, rules, workflow, or memory.
- Create PRD, issues, commits, or implementation tasks.
- Run project scripts, builds, tests, or dev servers by default.
- Treat guesses as facts.
- Continue into `to-locate` or `to-coding` unless the user explicitly asks.

## Workflow

### step1. Explain Object Clarification

Identify the explanation object type:
- Code object: file, component, function, hook, store, API, route, style, config.
- Business object: term, page feature, user flow, domain model, permission rule, data meaning.

If the input is ambiguous, ask one key question at a time and provide "我的推荐理解".

If the user says "先按你的理解解释", continue with assumptions and mark them in the report.

### step2. Read-Only Information Collection

Use this priority order:

1. `AGENTS.md`, `docs/agent/workflow.md`, `docs/agent/permission.md`
2. `docs/agent/introduction.md`
3. `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/knowledge/`, `docs/agent/memory.md`
4. Code: routes, menus, pages, components, hooks, stores, APIs, types, styles
5. Tests, mocks, and config files when relevant

If documents conflict with code, treat current code as evidence for current behavior, mark the document as possibly stale, and raise an evolution application if appropriate.

### step3. Explanation Report

Default language: Chinese. Keep code identifiers, paths, function names, variables, and API fields in source form.

Depth:
- 快速解释: one-line conclusion, key entry points, minimal diagram.
- 标准解释: default. Include core entry points, relationship graph, key concepts, misunderstandings.
- 深度解释: include call chain, data flow, field table, cross-module relations, background, and evolution observations.

For broad questions, output a layered explanation map:
- 入口层
- 业务层
- 状态层
- 接口层
- 展示层

## Report Template

Use and trim this template based on the object:

1. 解释对象
2. 一句话结论
3. 背景与用途
4. 证据来源
5. 关键入口
6. 关系图
7. 执行/交互流程
8. 关键概念表
9. 事实 / 推断 / 待确认
10. 容易误解点
11. 建议阅读顺序
12. 可继续追问的问题
13. 进化观察

## Mermaid Rules

Choose diagram type by object:

- Code call relation: `flowchart TD`
- User or business flow: `flowchart LR` or `sequenceDiagram`
- Data flow: `flowchart TD`
- Module dependency: `graph TD`
- State change: `stateDiagram-v2`
- Domain/entity relation: `erDiagram`

Only draw confirmed relationships and clearly marked inferences. Do not put unresolved assumptions into diagrams as facts.

## Evidence Rules

Classify claims:

- 事实: directly supported by code, documents, knowledge, context, or memory.
- 推断: synthesized from multiple evidence points; mark explicitly.
- 待确认: insufficient evidence, conflicting sources, unclear naming, or missing business rule.

Every core conclusion should cite paths, symbols, documents, or search evidence.

## Evolution Observation

At the end of the report, raise applications only when useful:

- `[进化申请-知识库]`: explanation contains long-lived reusable project facts.
- `[进化申请-技能]`: this skill needs template or workflow improvement.
- `[进化申请-文档]`: project documents are missing, stale, or inconsistent.

Do not write files before user confirmation.
