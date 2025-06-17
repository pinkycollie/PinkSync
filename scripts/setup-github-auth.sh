#!/bin/bash

# GitHub Authentication Setup for PinkSync
set -e

echo "🔐 Setting up GitHub authentication for PinkSync..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first."
    echo "   https://cli.github.com/manual/installation"
    exit 1
fi

# Login to GitHub
echo "🔑 Logging in to GitHub..."
gh auth login

# Check if authentication was successful
if gh auth status &> /dev/null; then
    echo "✅ Successfully authenticated with GitHub!"
else
    echo "❌ Authentication failed. Please try again."
    exit 1
fi

# Set up SSH key if needed
read -p "Do you want to set up an SSH key for GitHub? (y/n): " setup_ssh
if [ "$setup_ssh" = "y" ]; then
    # Check if SSH key exists
    if [ ! -f ~/.ssh/id_ed25519 ]; then
        echo "🔑 Generating SSH key..."
        ssh-keygen -t ed25519 -C "$(git config user.email)"
    fi
    
    # Add SSH key to GitHub
    echo "🔑 Adding SSH key to GitHub..."
    gh ssh-key add ~/.ssh/id_ed25519.pub --title "PinkSync Development Key"
    
    # Configure Git to use SSH
    git config --global url."git@github.com:".insteadOf "https://github.com/"
    
    echo "✅ SSH key added to GitHub!"
fi

echo "✅ GitHub authentication setup completed successfully!"
