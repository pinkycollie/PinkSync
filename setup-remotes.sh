#!/bin/bash
# Setup script for adding related git remotes

echo "Setting up PinkSync git remotes..."

# Add v0-deaf-creator-platform-multi-tenants remote
if git remote | grep -q "v0-deaf-creator-platform"; then
    echo "✓ Remote 'v0-deaf-creator-platform' already exists"
else
    echo "Adding remote 'v0-deaf-creator-platform'..."
    git remote add v0-deaf-creator-platform https://github.com/pinkycollie/v0-deaf-creator-platform-multi-tenants
    echo "✓ Remote 'v0-deaf-creator-platform' added"
fi

# Show configured remotes
echo ""
echo "Configured remotes:"
git remote -v

echo ""
echo "To fetch branches from v0-deaf-creator-platform, run:"
echo "  git fetch v0-deaf-creator-platform"
