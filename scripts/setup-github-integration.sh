#!/bin/bash

# GitHub Integration Setup for PinkSync
set -e

echo "🚀 Setting up GitHub integration for PinkSync ecosystem..."

# Configuration
REPO_NAME="pinksync-platform"
ORG_NAME="pinksync"
DESCRIPTION="PinkSync Ecosystem - Deaf-first AI-powered platform for vocational, entrepreneurial, and rehabilitation workflows"
TOPICS="deaf-first,accessibility,ai-powered,vocational-rehabilitation,nextjs,fastapi,pinksync,gcp,kubernetes"
MAIN_BRANCH="main"
DEV_BRANCH="develop"
STAGING_BRANCH="staging"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first."
    echo "   https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ You are not authenticated with GitHub CLI."
    echo "   Please run './scripts/setup-github-auth.sh' first."
    exit 1
fi

# Check if repository exists
if [ -n "$ORG_NAME" ]; then
    if gh repo view "$ORG_NAME/$REPO_NAME" &> /dev/null; then
        echo "⚠️ Repository $ORG_NAME/$REPO_NAME already exists."
        read -p "Do you want to continue with the existing repository? (y/n): " continue_existing
        if [ "$continue_existing" != "y" ]; then
            exit 1
        fi
    else
        # Create repository
        echo "📦 Creating repository..."
        gh repo create "$ORG_NAME/$REPO_NAME" --description "$DESCRIPTION" --private --confirm
    fi
else
    if gh repo view "$REPO_NAME" &> /dev/null; then
        echo "⚠️ Repository $REPO_NAME already exists."
        read -p "Do you want to continue with the existing repository? (y/n): " continue_existing
        if [ "$continue_existing" != "y" ]; then
            exit 1
        fi
    else
        # Create repository
        echo "📦 Creating repository..."
        gh repo create "$REPO_NAME" --description "$DESCRIPTION" --private --confirm
    fi
fi

# Add topics
echo "🏷️ Adding topics..."
if [ -n "$ORG_NAME" ]; then
    gh repo edit "$ORG_NAME/$REPO_NAME" --add-topic $TOPICS
else
    gh repo edit "$REPO_NAME" --add-topic $TOPICS
fi

# Create branches if they don't exist
echo "🌿 Creating branches..."
git fetch origin || git fetch

# Check if main branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/$MAIN_BRANCH; then
    echo "Creating $MAIN_BRANCH branch..."
    git checkout -b $MAIN_BRANCH
    git push -u origin $MAIN_BRANCH
else
    git checkout $MAIN_BRANCH
    git pull origin $MAIN_BRANCH
fi

# Check if develop branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/$DEV_BRANCH; then
    echo "Creating $DEV_BRANCH branch..."
    git checkout -b $DEV_BRANCH
    git push -u origin $DEV_BRANCH
else
    git checkout $DEV_BRANCH
    git pull origin $DEV_BRANCH
fi

# Check if staging branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/$STAGING_BRANCH; then
    echo "Creating $STAGING_BRANCH branch..."
    git checkout -b $STAGING_BRANCH
    git push -u origin $STAGING_BRANCH
else
    git checkout $STAGING_BRANCH
    git pull origin $STAGING_BRANCH
fi

# Return to main branch
git checkout $MAIN_BRANCH

# Create environments
echo "🌍 Creating environments..."
if [ -n "$ORG_NAME" ]; then
    gh api repos/$ORG_NAME/$REPO_NAME/environments/development --silent || gh api repos/$ORG_NAME/$REPO_NAME/environments -f environment_name=development
    gh api repos/$ORG_NAME/$REPO_NAME/environments/staging --silent || gh api repos/$ORG_NAME/$REPO_NAME/environments -f environment_name=staging
    gh api repos/$ORG_NAME/$REPO_NAME/environments/production --silent || gh api repos/$ORG_NAME/$REPO_NAME/environments -f environment_name=production
else
    gh api repos/$GITHUB_USER/$REPO_NAME/environments/development --silent || gh api repos/$GITHUB_USER/$REPO_NAME/environments -f environment_name=development
    gh api repos/$GITHUB_USER/$REPO_NAME/environments/staging --silent || gh api repos/$GITHUB_USER/$REPO_NAME/environments -f environment_name=staging
    gh api repos/$GITHUB_USER/$REPO_NAME/environments/production --silent || gh api repos/$
