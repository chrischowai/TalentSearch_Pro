# CLAUDE.md - Essential Guidelines

## 🧠 CORE PRINCIPLE: Store Everything Important
**Before ANY decision/finding/error:**
```
store_daddy: Store what you learned/decided/failed (max 500 chars)
```
This prevents repeating mistakes and forgetting context.

## 📦 PACKAGE-FIRST PHILOSOPHY

**BEFORE writing custom code, research existing packages:**

### Core Rule
- **Research first**: Use **sherlock** agent to find ecosystem packages
- **Never assume**: Always check what already exists before building custom
- **Quality over custom**: Maintained, lightweight, documented packages preferred

### Explicit Requirements
- **Icons**: Use icon packages/libraries - NEVER emojis in code
- **Common utilities**: Research standard ecosystem solutions first
- **When unsure**: Spawn sherlock to research, don't guess

### Decision Flow
```
Need functionality → sherlock research → Good package exists? → Use it
                                     ↓
                              No good package → Custom implementation
```

**Enforcement**: If you're about to implement common functionality, STOP and research first.

## 📊 VISUAL-FIRST RESPONSES

**When responding to the user:**

**Show, don't just tell:**
- Complex processes → ASCII diagrams
- Multiple options → Visual trees
- Status/progress → Progress indicators
- Comparisons → Before/after layouts

**Keep text concise and accessible for non-coders.**

## 🔄 AGENT-FIRST WORKFLOW

### 🤖 SPECIALIZED AGENTS (USE THESE!)

**ALWAYS use the right agent for the task:**

| Agent | When to Use |
|-------|-------------|
| **bugsy** | Errors, crashes, test failures |
| **fronty** | React/Next.js frontend work |
| **gitty** | Git operations, commits |
| **murphy** | Config validation, dependencies |
| **opinion** | Feedback, assessments |
| **scribe** | Documentation, guides |
| **sherlock** | Research, find docs/APIs |
| **validation** | Check against requirements |
| **gopher** | Go development, new Go features |
| **jsmaster** | JS/Node.js development, new JS features |
| **nextking** | Next.js apps, new Next.js features |
| **thesnake** | Python development, new Python features |
| **reactlord** | React components, new React features |
| **typegod** | TypeScript development, new TS features |
| **vuelord** | Vue.js development, new Vue features |

### 🚀 SINGLE vs PARALLEL AGENT STRATEGY

**Use ONE agent when:**
- Task fits clearly into one specialist's domain
- Simple, straightforward problem
- Need focused expertise

**Spawn MULTIPLE agents in parallel when:**
- Multiple file types need changes (code + config + docs)
- Errors span different domains (frontend + backend + database)  
- Research + implementation needed simultaneously
- Commands like `/check`, `/api`, `/migrate` require it

**Example parallel spawning:**
```
"I'll spawn multiple agents to handle this complex task:
- jsmaster: Write the API endpoints in files A, B, C
- murphy: Validate the database config
- sherlock: Research the latest framework patterns
Let me tackle all of these in parallel..."
```

### 1. Basic Workflow
```
1. recall_daddy: Check what we already know
2. Simple tasks: Direct implementation with appropriate agent
3. store_daddy: Store decisions and solutions
```

### 2. For Complex Tasks
```
1. recall_daddy: Check what we already know
2. add_task: Store requirements and expected results
3. Research: Read actual files (never assume)  
4. Plan: TodoWrite the steps
5. Implement: Edit/Write with verification
6. Test: Actually run the code
7. validation agent: Check against task requirements
8. store_daddy: Store what worked/failed
```

### 3. Agent Coordination
**When agent fails or gives partial results:**
- Store findings with store_daddy
- Report failure to user with specific error
- Ask user for direction (different agent, escalate, or debug)
- Share context through daddy memory system (max 5 memories)

### 4. 5-Status Task Workflow
**Status Flow:** `todo` → `coding_done` → `validated` → `complete` (with `needs_fixes` loop)

**Agent Responsibilities:**
- **Language agents** (jsmaster/gopher/thesnake/etc): `todo`/`needs_fixes` → `coding_done` (never marks complete)
- **validation agent**: `coding_done` → `validated`/`needs_fixes` (never marks complete)
- **bugsy**: `needs_fixes` → `coding_done` (fixes issues, never marks complete)
- **human/claude**: `validated` → `complete` (final approval only)

**Status Transitions:**
```
┌─────────┐    ┌──────────────┐    ┌───────────┐    ┌──────────┐
│  todo   │───▶│ coding_done  │───▶│ validated │───▶│ complete │
└─────────┘    └──────────────┘    └───────────┘    └──────────┘
                      │                   │               ▲
                      │                   ▼               │
                      │              ┌─────────────┐      │
                      └─────────────▶│ needs_fixes │──────┘
                                     └─────────────┘
```

**Critical Rules:**
- Agents ONLY update to their designated next status
- NO agent marks tasks as `complete` except final approval
- Fix loops continue until validation passes

## 🚫 CRITICAL RULES - FAIL FAST, NO SILENT FALLBACKS

**CRITICAL: Never create silent fallbacks that mask real failures**

### Forbidden Patterns:
- ❌ "If X fails, I'll try Y instead" (without explicit user consent)
- ❌ "This might not work, but here's a workaround" 
- ❌ Creating backup solutions when primary approach should be fixed
- ❌ Assuming alternative approaches without validating the original failure

### Required Behavior:
- ✅ **Fail loudly**: Report exact error and stop
- ✅ **Fail fast**: Don't continue with broken foundations  
- ✅ **Fail explicitly**: Ask user how to proceed with failures
- ✅ **Fix root cause**: Don't work around problems

### Exception Handling:
```
if (primaryApproach.fails()) {
    store_daddy("Primary approach failed: [exact error]")
    throw Error("Cannot proceed - primary approach failed")
    // NO automatic fallbacks without explicit user choice
}
```

### User Communication:
"The primary approach failed with: [error]. Would you like me to:
1. Debug and fix the root cause
2. Try a different approach (specify which)
3. Research alternative solutions"

### Security (NEVER SKIP)
- **SQL**: Use parameters `cursor.execute("SELECT * WHERE id=%s", (id,))`
- **Passwords**: bcrypt/argon2 only, min 12 rounds
- **Input**: Validate type, length, format before using
- **Secrets**: Never log passwords, tokens, API keys

### Before Changing Code
1. **Read** the file first (no assumptions)
2. **Verify** imports/APIs exist
3. **Test** changes actually work
4. **Remember** solutions for next time

### Memory Checkpoints
Every 10-15 messages or before context reset:
```
store_daddy: Current state, decisions, next steps (concise, <500 chars)
```

## 🛠️ TOOLS PRIORITY

1. **store_daddy/recall_daddy**: Store everything important (max 5 retrieval)
2. **add_task/get_task**: Track requirements and validation
3. **Read/Grep/Glob**: Verify before claiming
4. **TodoWrite**: Track multi-step work
5. **validation agent**: Check work against requirements
6. **Test execution**: Validate fixes work

## ⚠️ COMMON FAILURES

**LLMs often:**
- Assume file contents → Always Read first
- Invent APIs → Verify with Grep
- Forget earlier decisions → Check recall_daddy
- Skip validation → Use validation agent with task ID
- Skip testing → Run code to confirm

**When stuck:**
1. Store current state
2. Simplify the approach
3. Ask user for direction

## 🎯 SUCCESS CRITERIA

Before marking complete:
- [ ] Code runs without errors
- [ ] Tests pass
- [ ] No security issues
- [ ] Solution stored in memory
- [ ] Old code cleaned up

**Quality gates:**
- If agent output seems incomplete → escalate to thorough mode
- If multiple agents conflict → use opinion agent for decision
- If solution feels complex → verify with appropriate language agent review

**Success metrics (validate before marking complete):**
- Code: Actually runs without errors when executed
- Research: Answers the specific question asked with actionable info
- Fixes: Problem no longer occurs after implementation
- Documentation: User can follow instructions successfully

---
*Remember: Simple + Verified > Complex + Assumed*