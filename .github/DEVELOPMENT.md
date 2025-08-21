# Development Workflow (Cost-Efficient)

## 🚀 Local Development (No CI Costs)

Run these commands locally before pushing to avoid triggering expensive CI:

```bash
# Quick pre-push check (30 seconds)
pnpm lint && pnpm typecheck && pnpm test:ci

# Fix issues locally
pnpm lint --fix
```

## 💰 Cost-Saving Git Strategies

### 1. Use Draft PRs During Development
```bash
# Create draft PR (no CI runs)
gh pr create --draft --title "WIP: feature name"

# Push multiple commits without CI
git push  # CI skipped on drafts

# Mark ready when done (triggers CI once)
gh pr ready
```

### 2. Batch Commits Locally
```bash
# Work locally, commit frequently
git add -A && git commit -m "wip: progress"
git add -A && git commit -m "wip: more progress"

# Squash before pushing (1 CI run instead of many)
git rebase -i HEAD~3  # squash commits
git push  # single CI run
```

### 3. Force Push to Same Branch
```bash
# Instead of multiple pushes, amend and force push
git add -A && git commit --amend --no-edit
git push --force-with-lease  # overwrites, triggers CI once
```

## 🎯 CI Behavior

- **Draft PRs**: No CI runs (save $$)
- **Ready PRs**: Full CI on relevant file changes only
- **Duplicate pushes**: Automatically cancelled if newer push exists
- **Path filtering**: CI only runs when code actually changes

## 📊 Monthly Savings

- **Before**: 400+ minutes (every push = CI run)
- **After**: ~80 minutes (draft PRs + duplicate skipping)
- **Savings**: 80% reduction in Actions costs