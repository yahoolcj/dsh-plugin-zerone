---
name: grill-from-draft
description: 基于已有需求草稿或设计文档进行深度追问，先补全文档完整性（模糊术语、缺失决策、内部矛盾），再遍历设计树发现新分支，最终产出 `*_grilled.md` 共识文件。当用户已有初步文档需要打磨澄清时使用。 / Start from an existing draft requirements or design document and relentlessly interview the user. First fill in completeness gaps (vague terms, missing decisions, internal contradictions), then walk the design tree for new branches. Produces a `*_grilled.md` consensus file. Use when the user already has a preliminary document that needs refining.
---

@author: laicaijin
@email:lcj970630@gmail.com
@group:oh-my-zerone

<what-to-do>

This skill operates in two phases.

## Phase 1: Document Completeness

Read and understand the provided document (file path or pasted content). Identify:

- **Vague terms** — terms mentioned but not precisely defined
- **Missing decisions** — gaps where a decision is needed but absent
- **Internal contradictions** — two statements that conflict with each other

For each finding, ask one question at a time with a recommended answer. Do not move on until the user resolves it.

## Phase 2: Design Tree Extension

Once the document is complete, think like `grill-me`: walk down each branch of the design tree that the document did not cover. Discover new branches that should be clarified. Ask one question at a time with a recommended answer.

## Output Rules

- **File path input** (e.g. `/grill-from-draft ./需求草稿.md`): When all questions are resolved, create a new file named `{original-name}_grilled.md` in the same directory. The file structure:
  - Top: link reference to the original document
  - Body: reorganized content with all grilled conclusions embedded
- **Pasted content input**: Summarize consensus in the conversation. Do not create a file unless the user requests it after the session.

## Question Rules

- Ask one question at a time. Wait for the user's response before asking the next.
- Provide a recommended answer for each question.
- If a question can be answered by exploring the codebase, explore the codebase instead of asking.

</what-to-do>

<supporting-info>

## Relationship with other grill skills

- `grill-me`: Start from zero — for brand new ideas with no written material
- `grill-from-draft` (this skill): Start from an existing document — refine and extend what's already written
- `grill-with-docs`: Start from project domain model — stress-test against CONTEXT.md and ADRs

## `*_grilled.md` File Format

```markdown
> 原文: [原始文件名](./原始文件名.md)

# Grilled: [原标题]

## [章节1]

[reorganized content with grilled conclusions]

## [章节2]

[reorganized content with grilled conclusions]
```

The grilled file is a consensus artifact. It can be fed directly into `to-prd` as input.

</supporting-info>

### 禁止

- 禁止直接开始进行功能实现。
- 禁止执行除本技能外的其他动作。

## Evolution awareness

Only enable evolution awareness when the repository `AGENTS.md` or an equivalent project-level constraint explicitly says the Agent has autonomous evolution capability and defines an authorization mechanism. If that statement is missing, skip this section: do not raise evolution applications, do not write memory, and do not write evolution logs.

When enabled, keep watching for project evolution opportunities under the project evolution authorization mechanism.

- If the discussion produces long-lived, reusable project facts that affect future development decisions, raise `[进化申请-知识库]`. Do not update `docs/knowledge/` before user confirmation.
- If the user repeatedly corrects this skill's output, the flow requires repeated manual correction, or this skill conflicts with the project SDD workflow, raise `[进化申请-技能]`. Do not update skill files before user confirmation.
- If the discussion establishes long-term user preference, collaboration rule, project convention, or workflow rule, record it in `docs/agent/memory.md` only when allowed by `docs/agent/evolution.md`, then write a short evolution log.
- Do not treat one-off task details, unverified guesses, sensitive information, or temporary exploration as evolution material.
