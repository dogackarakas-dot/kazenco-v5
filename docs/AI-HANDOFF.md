# KAZENCO AI Handoff

## Objective
Establish safe continuity between Claude Code and OpenAI Codex working on this repository. Website source code is not changed by this handoff document itself.

## Repository
- Repository: dogackarakas-dot/kazenco-v5
- Branch: kazenco-v5
- Upstream: origin/kazenco-v5
- Starting commit: 687f7fe (fix: add certificates link to footer navigation)

## Integration State
- Claude Code projects and recent chats were imported into the ChatGPT/Codex desktop app.
- Automatic import synchronization is enabled.
- Claude Code reads AGENTS.md through CLAUDE.md → `@AGENTS.md`.
- Codex reads AGENTS.md directly.
- Both tools must explicitly read `docs/AI-HANDOFF.md` when it exists, per the plain-text instruction in AGENTS.md — no `@file` import is used for this file.

## Starting Conditions
- The temporary `.git/index.lock` issue was checked and resolved by the user.
- Pre-existing `skills-lock.json` changes and untracked skill files under `.agents/skills` and `.claude/skills` were preserved as the user's own local state — neither tool introduced or removed them.
- No website source file was changed.
- No build, lint, typecheck, stage, commit, or push was performed before this documentation task.

## Work Completed
- The KAZENCO-specific AGENTS.md configuration is complete.
- docs/AI-HANDOFF.md was created.
- scripts/sync-agent-rules.sh was run after the direct file edits were reviewed. Four tracked derived instruction files were regenerated: `.github/copilot-instructions.md`, `.clinerules`, `.continue/rules/project.md`, `.amazonq/rules/project.md`.
- Local skill directories (`.agents/skills`, `.claude/skills`) were kept on disk and narrowly excluded from Git via `.git/info/exclude` (specific per-skill paths, not the parent folders).
- The local `skills-lock.json` diff was backed up outside the repository, then `skills-lock.json` was restored to the HEAD version.
- Site source files and skill files themselves remained untouched.
- This configuration work is contained in the current local commit. The commit has not been pushed.

## Next Safe Step
- Review of the final diff and commit by the user before any push.

## Git and Delivery
- Commit: Yes — local commit only.
- Push: No.
- User permission required before push.
