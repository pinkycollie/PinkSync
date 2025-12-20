#!/bin/bash

# Script to push the main, master, and features branches to origin
# This script should be run by a repository administrator

set -e

echo "=========================================="
echo "PinkSync Branch Setup Script"
echo "=========================================="
echo ""
echo "This script will push the following branches to origin:"
echo "  - main (primary development branch)"
echo "  - master (legacy compatibility)"
echo "  - features (integration testing)"
echo ""

# Check if branches exist
if ! git show-ref --verify --quiet refs/heads/main; then
    echo "❌ Error: 'main' branch does not exist locally"
    echo "Please ensure branches are created first"
    exit 1
fi

if ! git show-ref --verify --quiet refs/heads/master; then
    echo "❌ Error: 'master' branch does not exist locally"
    echo "Please ensure branches are created first"
    exit 1
fi

if ! git show-ref --verify --quiet refs/heads/features; then
    echo "❌ Error: 'features' branch does not exist locally"
    echo "Please ensure branches are created first"
    exit 1
fi

echo "✅ All branches exist locally"
echo ""

# Show current state
echo "Current branch commits:"
echo "  main:     $(git log --oneline -1 main)"
echo "  master:   $(git log --oneline -1 master)"
echo "  features: $(git log --oneline -1 features)"
echo ""

# Confirm before pushing
read -p "Do you want to push these branches to origin? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted by user"
    exit 1
fi

echo ""
echo "Pushing branches to origin..."
echo ""

# Push main branch
echo "📤 Pushing main..."
if git push origin main; then
    echo "✅ main branch pushed successfully"
else
    echo "❌ Failed to push main branch"
    exit 1
fi

# Push master branch
echo ""
echo "📤 Pushing master..."
if git push origin master; then
    echo "✅ master branch pushed successfully"
else
    echo "❌ Failed to push master branch"
    exit 1
fi

# Push features branch
echo ""
echo "📤 Pushing features..."
if git push origin features; then
    echo "✅ features branch pushed successfully"
else
    echo "❌ Failed to push features branch"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ All branches pushed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to GitHub repository settings"
echo "2. Set 'main' as the default branch"
echo "3. Enable branch protection rules for main and master"
echo "4. Review the BRANCH_STRATEGY.md for more details"
echo ""
echo "Branch URLs:"
echo "  https://github.com/pinkycollie/PinkSync/tree/main"
echo "  https://github.com/pinkycollie/PinkSync/tree/master"
echo "  https://github.com/pinkycollie/PinkSync/tree/features"
echo ""
