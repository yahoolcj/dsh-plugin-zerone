---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---


@author: laicaijin
@email:lcj970630@gmail.com
@group:oh-my-zerone

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Evolution awareness

Only enable evolution awareness when the repository `AGENTS.md` or an equivalent project-level constraint explicitly says the Agent has autonomous evolution capability and defines an authorization mechanism. If that statement is missing, skip this section: do not raise evolution applications, do not write memory, and do not write evolution logs.

When enabled, keep watching for project evolution opportunities under the project evolution authorization mechanism.

- If the discussion produces long-lived, reusable project facts that affect future development decisions, raise `[进化申请-知识库]`. Do not update `docs/knowledge/` before user confirmation.
- If the user repeatedly corrects this skill's output, the flow requires repeated manual correction, or this skill conflicts with the project SDD workflow, raise `[进化申请-技能]`. Do not update skill files before user confirmation.
- If the discussion establishes long-term user preference, collaboration rule, project convention, or workflow rule, record it in `docs/agent/memory.md` only when allowed by `docs/agent/evolution.md`, then write a short evolution log.
- Do not treat one-off task details, unverified guesses, sensitive information, or temporary exploration as evolution material.
