# Changelog

All notable changes to PinkSync will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Branch-specific GitHub Pages deployment system
  - Automatic deployment for service-*, api-*, tool-*, feat-* branches
  - Each branch gets unique URL: https://pinkycollie.github.io/PinkSync/{branch-name}/
  - Dynamic Next.js configuration per branch
  - Branch metadata in deployments
- Interactive deployment helper script (`npm run deploy:branch`)
- Comprehensive deployment documentation
  - BRANCH_DEPLOYMENTS.md - Complete guide
  - BRANCH_DEPLOYMENT_EXAMPLES.md - Real-world examples
  - DEPLOYMENT_URLS.md - Quick reference
- Automated changelog generation system
- Release management workflows
- Version control scripts

### Changed
- Updated README with branch deployment information
- Enhanced STAGING.md with multi-branch deployment details
- Expanded DOCUMENTATION_INDEX.md with new docs

### Fixed
- Banner formatting in deployment helper script
- Error checking in workflow variable replacement

## [1.0.0] - 2025-12-15

### Added
- Initial PinkSync platform release
- 23 microservices across multiple branches
- DeafAuth authentication system
- Browser extension for accessibility
- Event orchestrator for real-time processing
- RAG engine for research and learning
- Background workers for automation
- API broker for partner integrations
- PinkFlow accessibility engine
- ASL glosser for sign language processing
- Sign-speak comprehensive sign language service
- VCode video communication platform
- Interpreter booking and management
- 360 Magicians platform integration
- VR accessibility features
- Analytics and performance optimization
- QR code and AR hologram features
- Admin console
- Video and data processing services

### Security
- Visual-first authentication (DeafAuth)
- End-to-end encryption for sensitive data
- Privacy-first data collection
- User-controlled data sharing

### Documentation
- Complete architecture documentation
- API gateway documentation
- Microservices catalog
- Modern integrations guide
- Quick reference guide
- Deployment guides

---

## Versioning Scheme

PinkSync follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version (X.0.0) - Incompatible API changes
- **MINOR** version (0.X.0) - New features (backwards compatible)
- **PATCH** version (0.0.X) - Bug fixes (backwards compatible)

### Branch-Specific Versioning
Each branch deployment includes its version in the metadata:
- Main platform: Uses package.json version
- Service branches: Individual service versions
- Feature branches: Pre-release versions (e.g., 1.1.0-feat-xyz)

---

## Release Types

### Major Release (X.0.0)
Breaking changes that require migration:
- API contract changes
- Authentication system overhaul
- Database schema changes
- Service communication protocol changes

### Minor Release (0.X.0)
New features without breaking changes:
- New microservices
- New API endpoints
- Enhanced functionality
- New integrations

### Patch Release (0.0.X)
Bug fixes and minor improvements:
- Bug fixes
- Performance improvements
- Documentation updates
- Security patches

### Pre-release (0.0.0-alpha.1)
Development versions:
- Alpha: Early development
- Beta: Feature complete, testing
- RC: Release candidate

---

## How to Update This Changelog

### For Developers
When making changes, add entries under `[Unreleased]`:

```markdown
## [Unreleased]

### Added
- Your new feature description

### Changed
- What you modified

### Fixed
- Bugs you fixed

### Security
- Security updates
```

### For Release Managers
When creating a release:

1. Move `[Unreleased]` entries to new version section
2. Add release date
3. Update version links at bottom
4. Tag the release: `git tag -a v1.1.0 -m "Release v1.1.0"`

---

## Links

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [PinkSync Repository](https://github.com/pinkycollie/PinkSync)
- [Release Guide](./docs/RELEASE_GUIDE.md)

[Unreleased]: https://github.com/pinkycollie/PinkSync/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/pinkycollie/PinkSync/releases/tag/v1.0.0
