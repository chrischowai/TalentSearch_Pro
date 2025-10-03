---
allowed-tools: all
description: Create actionable execution plan with parallel agent coordination
---

# 🧠 /plan ARGUMENTS$

## Task Integration
**Planning context**: ARGUMENTS$

**BEFORE PLANNING:**
1. `add_task`: Create task with requirements and expected results
2. `store_daddy`: Store planning context and key decisions

---

## Plan Mode Execution

**WORKFLOW:**
1. **Task Creation**: `add_task` with scope (project/feature/maintenance/bug)  
2. **Agent Coordination**: Spawn multiple agents in parallel when applicable
3. **Validation**: Use `validation` agent with task ID for final checks

**CRITICAL: ALWAYS USE SPECIALIZED LANGUAGE AGENTS**

**PARALLEL AGENT STRATEGY:**
- **Multiple domains**: spawn [LANGUAGE_SPECIALIST] (code) + murphy (config) + scribe (docs) together
- **Research + implementation**: sherlock + [LANGUAGE_SPECIALIST] in parallel
- **Error handling**: bugsy + validation agents together

**MANDATORY LANGUAGE SPECIALIST SELECTION:**
**NEVER use artisan when a language specialist exists!**

- **Go projects** → **gopher** agent (all Go development, microservices, CLI tools)
- **JavaScript/Node.js** → **jsmaster** agent (all JS/Node.js backend/frontend)
- **Python projects** → **thesnake** agent (all Python development, data science, web)
- **TypeScript projects** → **typegod** agent (all TypeScript full-stack development)
- **React projects** → **reactlord** agent (all React components, hooks, patterns)
- **Vue.js projects** → **vuelord** agent (all Vue.js development, Nuxt 3)
- **Next.js projects** → **nextking** agent (all Next.js 14+ App Router applications)
- **Mixed/Unknown language** → **artisan** ONLY as absolute last resort

**Detection Priority:** Next.js > React > Vue > TypeScript > JavaScript > Python > Go > Other

Key principles:
- Simplicity over cleverness
- Actually test and validate results  
- Parallel agent execution for efficiency
- Focus on working solution over perfect solution

---

## Success Criteria

- ✅ Task created with `add_task` (includes expected_results)
- ✅ Appropriate agents identified and spawn strategy determined  
- ✅ Validation agent designated with task ID reference
- ✅ 5-status workflow planned: `todo` → `coding_done` → `validated` → `complete`
- ✅ Memory storage planned: `store_daddy` for key decisions/learnings

## Task Status Workflow Integration

**Status Management:**
- Task starts as `todo` 
- Agents update to their designated status (artisan→coding_done, validation→validated)
- No agent marks `complete` except final human approval
- `needs_fixes` loops back through appropriate agents

**Agent Status Responsibilities:**
- **Language specialists** (gopher/jsmaster/thesnake/typegod/reactlord/vuelord/nextking): `todo`/`needs_fixes` → `coding_done`
- **artisan**: `todo`/`needs_fixes` → `coding_done` (ONLY when no language specialist applies)
- **validation**: `coding_done` → `validated`/`needs_fixes`  
- **bugsy**: `needs_fixes` → `coding_done`
- **Final approval**: `validated` → `complete`

---

**Core principle: Simple plans that actually work.**