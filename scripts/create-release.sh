#!/bin/bash

# PinkSync Release Creation Script
# Interactive script to create a new release

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_header() { echo -e "${PURPLE}$1${NC}"; }

# Banner
echo -e "${PURPLE}"
echo "╔════════════════════════════════════════╗"
echo "║      PinkSync Release Creator         ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check if on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're not on the main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes"
    echo "Please commit or stash them before creating a release"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: ${GREEN}$CURRENT_VERSION${NC}"

# Parse version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Calculate next versions
NEXT_MAJOR="$((MAJOR + 1)).0.0"
NEXT_MINOR="$MAJOR.$((MINOR + 1)).0"
NEXT_PATCH="$MAJOR.$MINOR.$((PATCH + 1))"

echo ""
print_header "Select release type:"
echo "  1) ${GREEN}Patch${NC}   - $NEXT_PATCH (bug fixes)"
echo "  2) ${YELLOW}Minor${NC}   - $NEXT_MINOR (new features)"
echo "  3) ${RED}Major${NC}   - $NEXT_MAJOR (breaking changes)"
echo "  4) ${BLUE}Custom${NC}  - specify version"
echo "  5) ${PURPLE}Cancel${NC}"
echo ""

read -p "Choice [1-5]: " choice

case $choice in
    1)
        NEW_VERSION=$NEXT_PATCH
        RELEASE_TYPE="patch"
        ;;
    2)
        NEW_VERSION=$NEXT_MINOR
        RELEASE_TYPE="minor"
        ;;
    3)
        NEW_VERSION=$NEXT_MAJOR
        RELEASE_TYPE="major"
        ;;
    4)
        read -p "Enter version (e.g., 1.2.3 or 1.2.0-beta.1): " NEW_VERSION
        RELEASE_TYPE="custom"
        ;;
    5)
        print_info "Release cancelled"
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_info "New version will be: ${GREEN}$NEW_VERSION${NC}"
echo ""

# Confirm
read -p "Continue with release v$NEW_VERSION? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Release cancelled"
    exit 0
fi

echo ""
print_header "Step 1: Updating version in package.json"

# Update package.json
npm version $NEW_VERSION --no-git-tag-version
print_success "Version updated to $NEW_VERSION"

echo ""
print_header "Step 2: Updating CHANGELOG.md"

# Get date
RELEASE_DATE=$(date +%Y-%m-%d)

# Check if CHANGELOG.md exists
if [ ! -f "CHANGELOG.md" ]; then
    print_error "CHANGELOG.md not found"
    exit 1
fi

# Extract unreleased section
UNRELEASED_CONTENT=$(sed -n '/## \[Unreleased\]/,/## \[/p' CHANGELOG.md | sed '$d' | tail -n +2)

if [ -z "$UNRELEASED_CONTENT" ]; then
    print_warning "No unreleased changes found in CHANGELOG.md"
    UNRELEASED_CONTENT="### Changed
- Version bump to $NEW_VERSION"
fi

# Create new changelog entry
cat > changelog.tmp << EOF
# Changelog

All notable changes to PinkSync will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [$NEW_VERSION] - $RELEASE_DATE
$UNRELEASED_CONTENT

EOF

# Append rest of changelog
tail -n +9 CHANGELOG.md >> changelog.tmp
mv changelog.tmp CHANGELOG.md

# Update version links at bottom of changelog
echo "" >> CHANGELOG.md
echo "[Unreleased]: https://github.com/pinkycollie/PinkSync/compare/v$NEW_VERSION...HEAD" >> CHANGELOG.md
echo "[$NEW_VERSION]: https://github.com/pinkycollie/PinkSync/releases/tag/v$NEW_VERSION" >> CHANGELOG.md

print_success "CHANGELOG.md updated"

echo ""
print_header "Step 3: Committing changes"

git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release v$NEW_VERSION"
print_success "Changes committed"

echo ""
print_header "Step 4: Creating Git tag"

# Create release notes
cat > release-notes.tmp << EOF
## PinkSync v$NEW_VERSION

Release Date: $RELEASE_DATE
Release Type: $RELEASE_TYPE

### Changes
$UNRELEASED_CONTENT

### Installation

\`\`\`bash
npm install pinksync@$NEW_VERSION
\`\`\`

### Deployment URL

Main: https://pinkycollie.github.io/PinkSync/

### Documentation

- [Changelog](https://github.com/pinkycollie/PinkSync/blob/main/CHANGELOG.md)
- [Release Guide](https://github.com/pinkycollie/PinkSync/blob/main/docs/RELEASE_GUIDE.md)
EOF

git tag -a "v$NEW_VERSION" -F release-notes.tmp
print_success "Tag v$NEW_VERSION created"

echo ""
print_header "Step 5: Pushing to GitHub"

read -p "Push changes and tag to GitHub? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    git push origin $CURRENT_BRANCH
    git push origin "v$NEW_VERSION"
    print_success "Pushed to GitHub"
else
    print_warning "Skipped push. Run manually: git push origin $CURRENT_BRANCH --tags"
fi

echo ""
print_header "Step 6: Creating GitHub Release"

if command -v gh &> /dev/null; then
    read -p "Create GitHub release? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        gh release create "v$NEW_VERSION" \
            --title "PinkSync v$NEW_VERSION" \
            --notes-file release-notes.tmp \
            --latest
        print_success "GitHub release created"
    else
        print_info "Skipped GitHub release creation"
        print_info "Create manually at: https://github.com/pinkycollie/PinkSync/releases/new?tag=v$NEW_VERSION"
    fi
else
    print_warning "GitHub CLI (gh) not found"
    print_info "Create release manually at: https://github.com/pinkycollie/PinkSync/releases/new?tag=v$NEW_VERSION"
fi

# Cleanup
rm -f release-notes.tmp

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║     Release v$NEW_VERSION Created! 🎉       ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
print_info "Next steps:"
echo "  1. Verify the release at: https://github.com/pinkycollie/PinkSync/releases/tag/v$NEW_VERSION"
echo "  2. Test the deployment"
echo "  3. Announce the release to the team"
echo "  4. Update documentation if needed"
echo ""
print_success "Done!"
