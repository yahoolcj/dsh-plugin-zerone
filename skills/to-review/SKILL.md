---
name: to-review
description: Execute a read-only review or re-review against explicit review checklists. Use when the user asks to review, inspect, audit, check completion, or re-check fixes according to docs/agent/review.md, a "本次 review 清单：" block, or a previous review report. This skill reads project review rules, inspects code/docs/config evidence, reports pass/fail/pending-confirmation results, and never modifies files unless the user later asks to archive the report.
---

@author: laicaijin
@email:lcj970630@gmail.com
@group:oh-my-zerone

# To Review

Use this skill as a project-agnostic, read-only review executor. It does not define project-specific standards by itself; it reads them from the current repository and the current user request.

## Hard Boundaries

- Do not edit code, docs, PRD, issue files, changelog, generated files, or config while performing review.
- Do not mark PRD / issue checklist items as complete.
- Do not commit, stage, push, or create PRs.
- Do not run project scripts unless the user explicitly asks. If verification commands are relevant, list them as recommended commands.
- Do not invent review standards when no executable checklist exists.
- Output the report first. Archive it to `.REVIEW/` or another path only after the user explicitly asks.

## Review Inputs

Collect review requirements in this priority order:

1. **Task review checklist from the current user context**
   - Recognize only a clearly marked block:

     ```markdown
     本次 review 清单：
     - 检查项 A
     - 检查项 B
     ```

   - Also accept `本次 Review 清单：`.
   - Only the continuous `- ` list immediately after that title is the formal checklist.
   - If the user provides multiple marked blocks, merge them in order.
   - Do not treat ordinary concerns such as "顺便看看样式" or "我担心类型有问题" as checklist items. Treat them as review notes only.

2. **Global review checklist from `docs/agent/review.md`**
   - Treat this file as the repository's default review rule source.
   - Required sections. Accept either the exact English heading or the bilingual heading with Chinese notes:

     ```markdown
     ## Global Review Checklist
     ## Global Review Checklist（全局 Review 清单）
     - 检查项

     ## Blocking Rules
     ## Blocking Rules（阻塞规则）
     - 阻塞规则
     ```

   - Optional sections:

     ```markdown
     ## Evidence Requirements
     ## Manual Verification
     ## Output Notes
     ## Project Notes
     ## Domain Rules
     ## Examples
     ## Non-goals
     ```

3. **Previous review report for re-review**
   - Use a pasted previous report or a user-specified report path.
   - Re-check previous `未通过` and `待确认` items first.
   - If no previous report is provided, perform a fresh review from the available current checklist and do not claim that previous issues were closed.

## Missing Checklist Handling

- If the user provides a task checklist, proceed even when `docs/agent/review.md` is missing.
- If `docs/agent/review.md` exists but lacks `## Global Review Checklist` and `## Global Review Checklist（全局 Review 清单）`, do not use it as a global checklist; report the missing section.
- If `docs/agent/review.md` exists but lacks `## Blocking Rules` and `## Blocking Rules（阻塞规则）`, still review executable checklist items, but the final result cannot be stronger than `待确认`; report that blocking rules are missing.
- If neither a task checklist nor a usable global checklist exists, stop and ask the user to provide one. Include this template:

  ```markdown
  本次 review 清单：
  - 检查项 A
  - 检查项 B
  ```

  Or ask the user to add:

  ```markdown
  ## Global Review Checklist
  ## Global Review Checklist（全局 Review 清单）
  - 检查项 A

  ## Blocking Rules
  ## Blocking Rules（阻塞规则）
  - 哪些问题会导致 review 未通过
  ```

## Conflict Rules

- Task review checklist has priority for this review's focus.
- Global blocking rules still apply unless the user explicitly declares a one-time exemption.
- If the user exempts a global rule, record the exemption and reason in the report.
- If a task checklist says to skip an area but global blocking rules require it, mark the conflict and treat the final result as `待确认` unless the user explicitly confirms the exemption.

## Scope Detection

Determine review scope in this order:

1. Use the files, directories, components, PRD, issue folder, or feature named by the user.
2. If checklist items name an object, locate the related files from repository conventions.
3. If the user only says review or re-check, inspect current `git diff` scope.
4. If no scope can be inferred and there is no diff, ask what should be reviewed.

When reviewing this repository, prefer existing project conventions from `AGENTS.md`, `docs/agent/*`, `CONTEXT.md`, `.PRD/`, `.ISSUES/`, and nearby component implementations.

## Execution Procedure

1. Read the task checklist from the user context, if present.
2. Read `docs/agent/review.md`, if present, and validate the required sections.
3. Determine the review scope.
4. Inspect relevant source, docs, types, demos, exports, config, and diffs as needed.
5. For each checklist item, gather concrete evidence with file paths and short explanations.
6. Classify each item as:
   - `通过`: enough evidence shows the requirement is satisfied.
   - `未通过`: evidence shows the requirement is missing, incorrect, inconsistent, or risky.
   - `待确认`: the item depends on human judgement, runtime behavior not checked, missing context, or unavailable verification.
7. Produce a Markdown report without tables.

## Report Format

Use this structure:

```markdown
# Review 结果：通过 / 未通过 / 待确认

## 总览

- 通过：N 项
- 未通过：N 项
- 待确认：N 项
- 适用范围：...

## 检查项

### 1. 检查项标题

状态：通过 / 未通过 / 待确认

证据：
- `path/to/file`: 证据说明

问题：
- 未发现

建议：
- 无

结论：
该项已经完成到位 / 该项未完成 / 该项需要用户确认。

## 阻塞项

- 无

## 需要用户确认

- 无

## 建议后续

- 若需要修复，将未通过项交给 to-coding 或其他实现 skill。
- 修复完成后，可再次使用 to-review 复检。
```

Do not use tables for checklist results.

## Final Result Rules

- If any item is `未通过`, final result is `未通过`.
- If there are no `未通过` items but at least one `待确认` item, final result is `待确认`.
- If all items are `通过`, final result is `通过`.
- If `docs/agent/review.md` lacks `## Blocking Rules` and `## Blocking Rules（阻塞规则）`, final result cannot be stronger than `待确认`.

## Re-review Rules

For re-review:

1. Read the previous report from the user context or path.
2. Extract previous `未通过` and `待确认` items.
3. Re-check those items against current files.
4. State whether each item is now `已关闭`, `仍未通过`, or `仍待确认`.
5. If a current checklist is also available, run it after the previous-item re-check.

Do not mark an item closed without evidence.

## 记忆引导

审查最终结果为 `通过`（所有检查项通过，无未通过项，blocking rules 完备）时，在输出 review 报告后追加记忆引导环节。

审查结果为 `未通过` 或 `待确认` 时，**不触发**记忆引导。

### 触发条件

- 最终结果 = `通过`

### 执行流程

1. 回顾本轮对话中实现的功能、关键决策点、入口文件路径。
2. 按 `docs/agent/memory.md` 格式生成记忆草稿。
3. 展示草稿，附带三个选项：

   - `[确认落盘]`：立即写入 `docs/agent/memory.md`，同步记录 `docs/agent/evolution-log.md`。
   - `[修改后落盘]`：按用户反馈调整草稿，再次确认后落盘。
   - `[跳过]`：不记录，流程正常结束。

4. 写入前检查与已有记忆是否冲突。冲突时列出旧记忆、新说法、冲突点，交用户裁决后落盘。

### 草稿格式

```markdown
- 日期：YYYY-MM-DD
  来源文件：本轮对话涉及的 PRD / issue / 改动文件
  用户原话摘要：功能一句话描述
  分类：功能实现 / 架构决策 / 协作约定
  内容：caveman 风格，含关键决策点、入口文件、技术选型
  状态：生效
  替代：无
```

### 边界

- 仅 PRD/feature 级别功能触发，单次小修小补不触发。
- 不记录临时 bug、未验证猜测、敏感信息。
- 写入前必须执行 `node -e "console.log(new Date().toISOString().split('T')[0])"` 获取日期。

## Archiving

Only after the user asks to save or archive the report:

- Write the report to `.REVIEW/<yyyy-mm-dd>-<topic>-review.md` unless the user specifies another path.
- Keep the archived report as an execution record, not as the source of project review rules.
