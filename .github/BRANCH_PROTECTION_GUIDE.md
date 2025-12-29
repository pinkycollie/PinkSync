# Branch Protection Configuration Guide

This document outlines the recommended branch protection rules for the PinkSync repository.

## Important Note

Branch protection rules **cannot be automatically configured via workflows** - they must be set manually in GitHub repository settings by an administrator.

## How to Configure

1. Go to: `https://github.com/pinkycollie/PinkSync/settings/branches`
2. Add a branch protection rule for each branch
3. Apply the settings listed below

## Recommended Settings

### Protection for `main` Branch

Navigate to: Repository Settings → Branches → Add rule

**Branch name pattern**: `main`

**Protect matching branches:**
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if CODEOWNERS file exists)
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Status checks to require (add as they become available):
    - `build`
    - `test`
    - `lint`
- ✅ Require conversation resolution before merging
- ✅ Require signed commits (recommended but optional)
- ✅ Require linear history (optional, prevents merge commits)
- ✅ Include administrators (apply rules to admins too)
- ❌ Allow force pushes (disabled for safety)
- ❌ Allow deletions (disabled for safety)

### Protection for `master` Branch

**Branch name pattern**: `master`

Apply the **same settings as `main`** with one addition:
- ✅ Restrict who can push to matching branches
  - Only allow GitHub Actions workflows to push (for syncing from main)
  - Or: Only allow specific administrators

**Note**: The `master` branch should primarily be updated via automated sync from `main` or by administrators only.

### Protection for `features` Branch

**Branch name pattern**: `features`

**Protect matching branches:**
- ✅ Require status checks to pass before merging
  - Status checks to require:
    - `build`
    - `test`
- ✅ Require conversation resolution before merging
- ✅ Allow force pushes (enabled for integration testing)
  - Specify who can force push: Repository administrators
- ❌ Allow deletions (disabled for safety)

**Note**: The `features` branch allows force pushes for integration testing purposes.

### Protection for Feature Branch Patterns

Consider adding protection for feature branches:

**Branch name patterns** (create separate rules):
- `service-*`
- `api-*`
- `feat-*`
- `feature-*`
- `copilot/*`

**Minimal protection:**
- ✅ Require status checks to pass before merging (when available)
- ❌ Other restrictions (developers need flexibility)

## Default Branch Setting

**IMPORTANT**: Change the default branch from `feat-Pinksync-AI` to `main`

1. Go to: `https://github.com/pinkycollie/PinkSync/settings`
2. Under "Default branch", click the switch icon
3. Select `main` from the dropdown
4. Click "Update"
5. Confirm the change

## Automated Branch Synchronization

Consider setting up a GitHub Action to keep `master` in sync with `main`:

```yaml
name: Sync Master with Main

on:
  push:
    branches:
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Sync master branch
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git checkout master
          git merge --ff-only main
          git push origin master
```

Save this as `.github/workflows/sync-master.yml` (not included by default to avoid conflicts).

## Verification

After setting up branch protection:

1. **Test pull request workflow**:
   ```bash
   git checkout -b test-branch main
   # Make a small change
   git push origin test-branch
   # Create PR via GitHub UI
   # Verify protection rules are enforced
   ```

2. **Test force push protection**:
   ```bash
   git checkout main
   git commit --amend --no-edit
   git push --force origin main
   # Should fail with protection error
   ```

3. **Test status checks**:
   - Create a PR that would fail tests
   - Verify it cannot be merged until tests pass

## CODEOWNERS File

Consider creating a `.github/CODEOWNERS` file to automatically request reviews:

```
# Default owners for everything
*       @pinkycollie

# Microservices
services/       @pinkycollie
/app/           @pinkycollie

# Documentation
*.md            @pinkycollie
docs/           @pinkycollie

# GitHub Actions
.github/        @pinkycollie
```

## Troubleshooting

### Can't push to protected branch
- Create a pull request instead
- Don't try to push directly to `main` or `master`

### Status checks not showing up
- Ensure workflows are configured correctly
- Check that workflow names match the required checks
- May need to create an initial PR to register checks

### Administrator bypass
- Protection rules apply to everyone if "Include administrators" is checked
- Uncheck this option if admins need emergency access
- Re-enable after emergency is resolved

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Branch Protection Rules Best Practices](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [CODEOWNERS File](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Support

For questions about branch protection:
1. Check GitHub's documentation (links above)
2. Review [BRANCH_STRATEGY.md](../BRANCH_STRATEGY.md)
3. Open a GitHub issue with the `question` label

---

**Last Updated**: December 2025
