---
name: to-prd
description: Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.
---


@author: laicaijin
@email:lcj970630@gmail.com
@group:oh-my-zerone

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.



# PRD 驱动分步前端开发

## 核心流程

```
读取上下文需求\计划 → 整理需求 → 拆分功能步骤
```

## Phase 1：需求分析与步骤拆分

### 1. 整理上下文需求并生成 PRD 文档

根据用户提供生成的文档、材料、计划、上下文，整理上下文需求，在.PRD目录下生成本次具备**转为标准结构化格式**的版本.md PRD文件。

根据当前package.json的version，判断当前需求是属于新增需求还是优化，遵循Semantic Versioning 2.0.0规范，将对应的版本号升位。然后生成对应的版本PRD文档：

文件名示例：
.PRD/1.35.0.md

```markdown
# [主版本号] 

## [模块名称]

> 类型：[新增/优化升级/修复]

### 概述
[一段话描述本次需求的背景和目的]

### 功能清单 TODO

- [ ] 功能点1 — 简要描述
- [ ] 功能点2 — 简要描述
- [ ] ...

### 数据模型 Schema

#### [Object名称]
| 字段 | 控件 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| 字段名 | 输入框/选择框/开关等 | string/boolean/... | 是/否 | - | 补充说明 |

#### [Object名称2]
（同上表格格式）

### 页面交互 
- 交互规则1
- 交互规则2

### 扩展性要求 
- [原文中提到的扩展性注意点]

### 用户故事
1. [故事1]
2. [故事2]
```

**格式化规则：**
- 版本号提取到一级标题
- 模块名作为二级标题
- 所有功能点提炼为**功能清单**，使用 `- [ ]` checkbox 格式，便于后续完成打勾
- 每个 object 内的字段提取为**数据模型表格**，字段、控件类型、数据类型、必填、默认值、说明逐列对齐
- 页面交互规则、扩展性要求、用户故事分区归类
- 格式化完成后直接回写覆盖 `.PRD/` 下的原文件



