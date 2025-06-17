import { writeFileSync } from "fs"

// GitHub Actions secrets setup for PinkSync ecosystem
interface GitHubSecret {
  name: string
  description: string
  value?: string
  required: boolean
  environment?: string
}

// Define required secrets for GitHub Actions
const githubSecrets: GitHubSecret[] = [
  {
    name: "GCP_PROJECT_ID",
    description: "Google Cloud Platform project ID",
    required: true,
  },
  {
    name: "GCP_SA_KEY",
    description: "Google Cloud Platform service account key (JSON)",
    required: true,
  },
  {
    name: "GCP_REGION",
    description: "Google Cloud Platform region",
    value: "us-central1",
    required: true,
  },
  {
    name: "REDIS_URL",
    description: "Redis connection URL",
    value:
      "redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379",
    required: true,
  },
  {
    name: "REDIS_HOST",
    description: "Redis host",
    value: "bright-shiner-48489.upstash.io",
    required: true,
  },
  {
    name: "REDIS_PORT",
    description: "Redis port",
    value: "6379",
    required: true,
  },
  {
    name: "REDIS_PASSWORD",
    description: "Redis password",
    value: "Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA",
    required: true,
  },
  {
    name: "REDIS_TOKEN",
    description: "Redis token for Upstash REST API",
    required: true,
  },
  {
    name: "DB_PASSWORD",
    description: "Database password",
    required: true,
  },
  {
    name: "JWT_SECRET",
    description: "JWT secret for authentication",
    required: true,
  },
  {
    name: "OPENAI_API_KEY",
    description: "OpenAI API key",
    required: true,
  },
  {
    name: "SLACK_WEBHOOK",
    description: "Slack webhook URL for notifications",
    required: false,
  },
  {
    name: "DEAF_AUTH_API_KEY",
    description: "DeafAuth API key",
    value: "df_t7zxjxgnnan1ytuvhyoj4e",
    required: true,
  },
]

// Generate script to set up GitHub secrets
function generateGitHubSecretsScript(): void {
  const script = `#!/bin/bash

# GitHub Secrets Setup Script for PinkSync
set -e

echo "🔐 Setting up GitHub secrets for PinkSync..."

# Configuration
REPO_NAME="pinksync-platform"
ORG_NAME="pinksync"
GITHUB_USER="your-github-username" // Declare GITHUB_USER variable

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first."
    echo "   https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ You are not authenticated with GitHub CLI."
    echo "   Please run 'gh auth login' first."
    exit 1
fi

# Function to set a secret
set_secret() {
    local name=$1
    local value=$2
    local env=$3
    
    if [ -z "$value" ]; then
        read -p "Enter value for $name: " value
    fi
    
    if [ -n "$env" ]; then
        if [ -n "$ORG_NAME" ]; then
            echo "$value" | gh secret set "$name" --env "$env" --org "$ORG_NAME" --repo "$REPO_NAME"
        else
            echo "$value" | gh secret set "$name" --env "$env" --repo "$REPO_NAME"
        fi
    else
        if [ -n "$ORG_NAME" ]; then
            echo "$value" | gh secret set "$name" --org "$ORG_NAME" --repo "$REPO_NAME"
        else
            echo "$value" | gh secret set "$name" --repo "$REPO_NAME"
        fi
    fi
}

# Create environments if they don't exist
echo "🌍 Creating environments..."\
gh api repos/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME/environments/development --silent || gh api repos/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME/environments -f environment_name=development\
gh api repos/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME/environments/staging --silent || gh api repos/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME/environments -f environment_name=staging\
gh api repos/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME/environments/production --silent || gh api repos/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME/environments -f environment_name=production

# Set up secrets
echo "🔑 Setting up repository secrets..."

# GCP Project ID
set_secret "GCP_PROJECT_ID" "" 

# GCP Service Account Key
echo "📄 Please provide the GCP service account key JSON file path:"
read -p "File path: " sa_key_file
if [ -f "$sa_key_file" ]; then
    set_secret "GCP_SA_KEY" "$(cat $sa_key_file)"
else
    echo "❌ File not found: $sa_key_file"
    exit 1
fi

# GCP Region
set_secret "GCP_REGION" "us-central1"

# Redis URL
set_secret "REDIS_URL" "redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379"

# Redis Host
set_secret "REDIS_HOST" "bright-shiner-48489.upstash.io"

# Redis Port
set_secret "REDIS_PORT" "6379"

# Redis Password
set_secret "REDIS_PASSWORD" "Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA"

# Redis Token
set_secret "REDIS_TOKEN" ""

# Database Password
set_secret "DB_PASSWORD" ""

# JWT Secret
set_secret "JWT_SECRET" ""

# OpenAI API Key
set_secret "OPENAI_API_KEY" ""

# DeafAuth API Key
set_secret "DEAF_AUTH_API_KEY" "df_t7zxjxgnnan1ytuvhyoj4e"

# Slack Webhook
read -p "Do you want to set up Slack notifications? (y/n): " setup_slack
if [ "$setup_slack" = "y" ]; then
    set_secret "SLACK_WEBHOOK" ""
fi

# Set environment-specific secrets
echo "🌍 Setting up environment-specific secrets..."

# Development environment
echo "⚙️ Setting up development environment secrets..."
set_secret "GCP_PROJECT_ID" "" "development"
set_secret "REDIS_URL" "redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379" "development"
set_secret "DB_PASSWORD" "" "development"

# Production environment
echo "⚙️ Setting up production environment secrets..."
set_secret "GCP_PROJECT_ID" "" "production"
set_secret "REDIS_URL" "redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379" "production"
set_secret "DB_PASSWORD" "" "production"

echo "✅ GitHub secrets setup completed successfully!"
`

  writeFileSync("scripts/setup-github-secrets.sh", script)
  console.log("✅ Created GitHub secrets setup script")
}

// Generate documentation for GitHub integration
function generateGitHubDocs(): void {
  const docs = `# GitHub Integration for PinkSync Ecosystem

## Overview

This document outlines the GitHub integration for the PinkSync ecosystem, including repository structure, CI/CD workflows, and best practices for development.

## Repository Structure

The PinkSync ecosystem is maintained in a single repository with the following structure:

\`\`\`
pinksync-platform/
├── api/                  # FastAPI backend code
├── app/                  # Next.js frontend code
├── infrastructure/       # Infrastructure as code
│   ├── docker/           # Docker configurations
│   ├── kubernetes/       # Kubernetes manifests
│   ├── terraform/        # Terraform configurations
│   └── github/           # GitHub integration
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── .github/              # GitHub configuration
    ├── workflows/        # GitHub Actions workflows
    └── ISSUE_TEMPLATE/   # Issue templates
\`\`\`

## Branches

- \`main\`: Production-ready code
- \`staging\`: Pre-production testing
- \`develop\`: Integration branch for features
- \`feature/*\`: Feature development branches
- \`hotfix/*\`: Critical bug fixes

## GitHub Actions Workflows

### CI Workflow

The CI workflow runs on every push to \`develop\`, \`staging\`, and \`main\` branches, as well as on pull requests to these branches. It performs the following tasks:

- Lint code
- Type check
- Run tests
- Build Docker images

### Deployment Workflows

#### Development Deployment

Automatically deploys to the development environment when changes are pushed to the \`develop\` branch.

#### Production Deployment

Deploys to production when changes are pushed to the \`main\` branch or manually triggered with confirmation.

### Monitoring Workflows

#### Redis Health Check

Runs every 30 minutes to check the Redis connection and sends notifications if the connection fails.

#### Database Backup

Creates daily backups of the production database and sends notifications about the backup status.

## GitHub Secrets

The following secrets are required for the GitHub Actions workflows:

${githubSecrets
  .map((secret) => `- \`${secret.name}\`: ${secret.description}${secret.required ? " (Required)" : ""}`)
  .join("\n")}

## Development Workflow

1. Create a feature branch from \`develop\`:
   \`\`\`bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   \`\`\`

2. Make your changes and commit them:
   \`\`\`bash
   git add .
   git commit -m "feat: add your feature"
   \`\`\`

3. Push your branch and create a pull request:
   \`\`\`bash
   git push -u origin feature/your-feature-name
   \`\`\`

4. After the pull request is approved and merged, the changes will be automatically deployed to the development environment.

5. To deploy to production, create a pull request from \`develop\` to \`main\`.

## Best Practices

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- \`feat:\`: A new feature
- \`fix:\`: A bug fix
- \`docs:\`: Documentation changes
- \`style:\`: Code style changes (formatting, etc.)
- \`refactor:\`: Code refactoring
- \`test:\`: Adding or updating tests
- \`chore:\`: Maintenance tasks

### Pull Requests

- Keep pull requests small and focused on a single feature or fix
- Include a clear description of the changes
- Reference related issues
- Ensure all CI checks pass
- Request reviews from appropriate team members

### Issues

Use the provided issue templates for bug reports and feature requests.

## Setup Instructions

### Repository Setup

1. Run the repository setup script:
   \`\`\`bash
   ./scripts/setup-github-repo.sh
   \`\`\`

2. Set up GitHub secrets:
   \`\`\`bash
   ./scripts/setup-github-secrets.sh
   \`\`\`

3. Push your code to the repository:
   \`\`\`bash
   git push -u origin main
   git push -u origin develop
   git push -u origin staging
   \`\`\`

4. Configure branch protection rules in GitHub settings.

5. Invite team members to the repository.

## Troubleshooting

### Common Issues

#### Workflow Failures

- Check the workflow logs for detailed error messages
- Verify that all required secrets are set correctly
- Ensure that the service account has the necessary permissions

#### Branch Protection

- If you can't push to a protected branch, create a pull request instead
- If you need to bypass branch protection, use the GitHub web interface to temporarily disable it

#### Deployment Issues

- Check the deployment logs for errors
- Verify that the GCP service account has the necessary permissions
- Ensure that the Kubernetes cluster is running and accessible
`

  writeFileSync("docs/github-integration.md", docs)
  console.log("✅ Created GitHub integration documentation")
}

// Main function
async function main(): Promise<void> {
  // Generate GitHub secrets script
  generateGitHubSecretsScript()

  // Generate GitHub documentation
  generateGitHubDocs()

  console.log("\n✅ GitHub secrets setup completed!")
  console.log("\nNext steps:")
  console.log("1. Run ./scripts/setup-github-secrets.sh to set up GitHub secrets")
  console.log("2. Follow the instructions in docs/github-integration.md")
}

// Run the main function
main().catch(console.error)
