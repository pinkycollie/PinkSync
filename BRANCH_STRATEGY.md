# Branch Strategy for PinkSync

## Overview

PinkSync uses a structured branching strategy to manage its microservices platform and features. This document outlines the purpose and usage of each branch type.

## Core Branches

### `main` (Primary Branch)
- **Purpose**: The main development branch following modern Git conventions
- **Status**: Production-ready code
- **Protected**: Yes
- **Base for**: All new feature branches and pull requests
- **Deployment**: Automatically deploys to staging environment

### `master` (Legacy Compatibility)
- **Purpose**: Mirror of `main` branch for backward compatibility
- **Status**: Always synchronized with `main`
- **Protected**: Yes
- **Note**: Maintained for tools and integrations expecting a `master` branch

### `features` (Feature Integration)
- **Purpose**: Integration branch for testing multiple features together
- **Status**: Pre-production testing
- **Base**: Created from `main`
- **Usage**: Merge feature branches here for integration testing before merging to `main`

## Feature Branches

### Naming Conventions
PinkSync supports multiple branch patterns for different types of development:

#### Service Branches (`service-*`)
- Microservice development
- Example: `service-deafauth`, `service-video-processor`

#### API Branches (`api-*`)
- API endpoint development
- Example: `api-interpreters`, `api-booking`

#### Feature Branches (`feat-*` or `feature-*`)
- New feature development
- Example: `feat-video-captions`, `feature-qr-scanner`

#### Tool Branches (`tool-*`)
- Utility and tool development
- Example: `tool-qr-scanner`, `tool-analytics`

#### Specialized Branches
- `video-*` - Video processing features
- `data-*` - Data processing features
- `integrated-*` - Integration features
- `QR-Code-*` - QR code system features
- `admin-*` - Admin interface features

## Branch Workflow

### Creating a New Feature

```bash
# Start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat-my-feature

# Develop and commit
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feat-my-feature
```

### Integration Testing

```bash
# Switch to features branch
git checkout features
git pull origin features

# Merge your feature
git merge feat-my-feature

# Test integration
npm run test

# If successful, push
git push origin features
```

### Merging to Main

```bash
# Create pull request from feat-my-feature to main
# After review and approval, merge via GitHub

# Update local main
git checkout main
git pull origin main

# Update master to match
git checkout master
git merge main
git push origin master
```

## Deployment Strategy

### Automatic Deployments
- **`main`**: Deploys to staging at https://pinkycollie.github.io/PinkSync/
- **Feature branches**: Deploy to branch-specific URLs (e.g., `/PinkSync/feat-my-feature/`)

### Manual Deployments
```bash
# Deploy current branch
npm run deploy:branch
```

## Branch Protection Rules

### `main` Branch
- ✅ Require pull request reviews (1+ approvals)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ❌ Allow force pushes
- ❌ Allow deletions

### `master` Branch
- ✅ Same as `main` branch
- ❌ Direct commits (synced from `main` only)

### `features` Branch
- ✅ Require status checks to pass
- ✅ Allow force pushes (for integration testing)
- ❌ Allow deletions

## Microservices Branch Mapping

PinkSync's microservices architecture maps to branches:

| Service | Branch | Deployment URL |
|---------|--------|----------------|
| DeafAUTH | `service-deafauth` or `deaflifeos` | `/PinkSync/service-deafauth/` |
| ASL Glosser | `PinkSync-ASL-GLOSSER` | `/PinkSync/PinkSync-ASL-GLOSSER/` |
| Video Processor | `video-processor` | `/PinkSync/video-processor/` |
| Data Processor | `data-processor-worker` | `/PinkSync/data-processor-worker/` |
| Admin Console | `admin-console` | `/PinkSync/admin-console/` |
| QR Holograms | `QR-Code-Holograms` | `/PinkSync/QR-Code-Holograms/` |
| Registration | `REGISTRATION` | `/PinkSync/REGISTRATION/` |

## Best Practices

### Branch Naming
- ✅ Use lowercase with hyphens: `feat-video-captions`
- ✅ Be descriptive: `service-video-transcription` not `service-vt`
- ✅ Use prefixes consistently: `feat-`, `service-`, `api-`
- ❌ Avoid special characters except hyphens
- ❌ Avoid spaces or underscores

### Branch Lifecycle
1. **Create**: Branch from `main` with descriptive name
2. **Develop**: Regular commits with clear messages
3. **Test**: Deploy to branch-specific URL for testing
4. **Review**: Create PR to `main` with description
5. **Merge**: Squash or merge based on commit history
6. **Clean**: Delete branch after successful merge

### Keeping Branches Updated
```bash
# Regularly sync with main
git checkout feat-my-feature
git fetch origin
git rebase origin/main

# Or merge if you prefer
git merge origin/main
```

## Troubleshooting

### Branch Out of Sync
```bash
# Fetch latest changes
git fetch origin

# Reset to match origin
git reset --hard origin/main
```

### Merge Conflicts
```bash
# During rebase or merge
git status
# Edit conflicting files
git add .
git rebase --continue
# or
git merge --continue
```

### Branch Not Deploying
1. Check branch name matches supported patterns
2. Verify GitHub Actions workflow completed
3. Check workflow logs for errors
4. Ensure branch was pushed to origin

## Migration Notes

### Historical Context
- **Original default**: `feat-Pinksync-AI`
- **New default**: `main`
- **Date**: December 2025
- **Reason**: Align with modern Git conventions and improve developer experience

### Branch Restoration
This repository underwent a branch restoration to establish standard Git practices:
- Created `main` from `feat-Pinksync-AI` as the new default branch
- Created `master` for backward compatibility
- Created `features` for integration testing
- All future development should branch from `main`

## References

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Branch Deployment Documentation](./docs/BRANCH_DEPLOYMENTS.md)
- [Contributing Guidelines](./CONTRIBUTING.md) _(to be created)_

## Support

For questions about branching strategy:
1. Check this document first
2. Review [BRANCH_DEPLOYMENTS.md](./docs/BRANCH_DEPLOYMENTS.md)
3. Open an issue with the `question` label
4. Contact the maintainers

---

**Last Updated**: December 2025
**Version**: 1.0.0
