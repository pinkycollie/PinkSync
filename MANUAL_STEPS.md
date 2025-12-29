# Manual Steps to Complete Branch Restoration

## Overview
This document outlines the manual steps required to complete the branch restoration process for the PinkSync repository.

## Prerequisites
- Repository administrator access
- Local clone of the repository
- Git command line tools

## Steps

### 1. Merge the Pull Request
First, merge the pull request that contains the branch creation and documentation.

### 2. Fetch and Checkout Branches Locally
After merging, pull the changes locally:

```bash
# Fetch all changes from origin
git fetch origin

# Verify the branches exist in the PR branch
git checkout copilot/audit-and-cleanup-branches
git pull origin copilot/audit-and-cleanup-branches

# Verify branches are present locally
git branch -a
```

You should see:
- `main`
- `master`
- `features`
- `copilot/audit-and-cleanup-branches`
- `feat-Pinksync-AI`

### 3. Push the New Branches to Origin

**Option A: Using the provided script (Recommended)**
```bash
# Make sure you're in the repository root
cd /path/to/PinkSync

# Run the setup script
bash scripts/setup-branches.sh
```

The script will:
- Verify all branches exist
- Show current branch commits
- Ask for confirmation
- Push all three branches (main, master, features) to origin

**Option B: Manual push**
```bash
# Push main branch
git push origin main

# Push master branch
git push origin master

# Push features branch
git push origin features
```

### 4. Change Default Branch
Go to repository settings and change the default branch:

1. Navigate to: `https://github.com/pinkycollie/PinkSync/settings`
2. Under "General" → "Default branch"
3. Click the switch icon (⇄)
4. Select `main` from dropdown
5. Click "Update"
6. Read and confirm the warning
7. Click "I understand, update the default branch"

### 5. Configure Branch Protection Rules
Follow the guide in `.github/BRANCH_PROTECTION_GUIDE.md` to set up protection:

1. Go to: `https://github.com/pinkycollie/PinkSync/settings/branches`
2. Click "Add branch protection rule"
3. Configure protection for `main`:
   - Branch name pattern: `main`
   - ✅ Require pull request reviews (1 approval)
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution
   - ✅ Include administrators
   - ❌ Allow force pushes
   - ❌ Allow deletions

4. Repeat for `master`:
   - Same settings as `main`
   - Optionally restrict push access to admins/bots only

5. Configure `features`:
   - ✅ Require status checks (when available)
   - ✅ Allow force pushes (for integration testing)
   - ❌ Allow deletions

### 6. Verify Branch Structure
After pushing, verify everything is correct:

```bash
# Check remote branches
git ls-remote --heads origin

# Should show:
# refs/heads/main
# refs/heads/master
# refs/heads/features
# refs/heads/copilot/audit-and-cleanup-branches
# refs/heads/feat-Pinksync-AI
# ... other branches
```

### 7. Update Team Documentation
Notify your team about the changes:

1. Send announcement about new branch structure
2. Share link to [BRANCH_STRATEGY.md](../BRANCH_STRATEGY.md)
3. Update any CI/CD configurations that reference the default branch
4. Update any external integrations that reference the repository

### 8. Clean Up (Optional)
After confirming everything works:

```bash
# Delete the copilot PR branch (after merge)
git push origin --delete copilot/audit-and-cleanup-branches

# Clean up local branches
git branch -d copilot/audit-and-cleanup-branches
```

## Verification Checklist

- [ ] Branches pushed to origin (main, master, features)
- [ ] Default branch changed to `main`
- [ ] Branch protection rules configured
- [ ] Team notified of changes
- [ ] Documentation reviewed
- [ ] CI/CD workflows updated (if necessary)
- [ ] External integrations updated (if necessary)

## Rollback Plan

If issues occur, you can rollback:

```bash
# Revert default branch to feat-Pinksync-AI in GitHub settings

# Delete the new branches from origin (if needed)
git push origin --delete main
git push origin --delete master
git push origin --delete features

# Note: This should only be done in emergency situations
```

## Expected State After Completion

### Repository Structure
```
pinkycollie/PinkSync
├── main (default branch) ✓
├── master (legacy compatibility) ✓
├── features (integration testing) ✓
├── feat-Pinksync-AI (original, keep for now)
├── service-* branches (microservices)
├── api-* branches (API endpoints)
├── feat-* branches (features)
└── other feature branches
```

### Branch Commits
All three new branches should point to the same commit:
- Commit: `e2f3168` 
- Message: "[WIP] Convert each branch into GitHub Pages with Next.js (#15)"

### Documentation
New files added:
- `BRANCH_STRATEGY.md` - Branch management guide
- `.github/BRANCH_PROTECTION_GUIDE.md` - Protection configuration guide
- `scripts/setup-branches.sh` - Branch setup automation
- Updated: `README.md`, `DOCUMENTATION_INDEX.md`, `CHANGELOG.md`

## Support

If you encounter issues:

1. Review [BRANCH_STRATEGY.md](../BRANCH_STRATEGY.md)
2. Check [.github/BRANCH_PROTECTION_GUIDE.md](../.github/BRANCH_PROTECTION_GUIDE.md)
3. Consult GitHub's [branch protection documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
4. Open a GitHub issue with details

## Timeline

Estimated time to complete: **10-15 minutes**

1. Merge PR: 1-2 minutes
2. Push branches: 2-3 minutes
3. Change default branch: 1-2 minutes
4. Configure protection rules: 5-8 minutes
5. Verification: 2-3 minutes

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Prepared by**: GitHub Copilot
