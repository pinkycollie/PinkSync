#!/bin/bash

echo "🚀 Setting up Git for PINKSYNC Platform..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize Git repository
echo "📁 Initializing Git repository..."
git init

# Set up Git configuration (you can customize these)
echo "⚙️ Setting up Git configuration..."
echo "Please enter your Git username:"
read -r git_username
echo "Please enter your Git email:"
read -r git_email

git config user.name "$git_username"
git config user.email "$git_email"

# Set default branch to main
git config init.defaultBranch main

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore file..."
    node scripts/create-gitignore.js
fi

# Add all files to staging
echo "📦 Adding files to staging area..."
git add .

# Make initial commit
echo "💾 Making initial commit..."
git commit -m "Initial commit: PINKSYNC Platform setup

- Set up Next.js project structure
- Added basic configuration files
- Implemented .gitignore for proper file exclusion
- Ready for development"

echo "✅ Git repository initialized successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub/GitLab"
echo "2. Add remote origin: git remote add origin <your-repo-url>"
echo "3. Push to remote: git push -u origin main"
echo ""
echo "🔧 Basic Git commands for development:"
echo "- git status          # Check repository status"
echo "- git add .           # Stage all changes"
echo "- git commit -m 'msg' # Commit changes"
echo "- git push            # Push to remote"
echo "- git pull            # Pull latest changes"
