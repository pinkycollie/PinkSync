import { writeFileSync } from "fs"
import { execSync } from "child_process"

// GitHub integration for PinkSync ecosystem
interface GitHubIntegrationConfig {
  repository: {
    name: string
    organization?: string
    description: string
    private: boolean
    topics: string[]
  }
  branches: {
    main: string
    development: string
    staging: string
  }
  protection: {
    requireReviews: boolean
    requireStatusChecks: boolean
    enforceAdmins: boolean
  }
  environments: {
    development: {
      url: string
      protection: boolean
    }
    staging: {
      url: string
      protection: boolean
    }
    production: {
      url: string
      protection: boolean
      reviewers: boolean
    }
  }
  authentication: {
    sso: boolean
    twoFactor: boolean
  }
}

// PinkSync GitHub integration configuration
const githubConfig: GitHubIntegrationConfig = {
  repository: {
    name: "pinksync-platform",
    organization: "pinksync",
    description:
      "PinkSync Ecosystem - Deaf-first AI-powered platform for vocational, entrepreneurial, and rehabilitation workflows",
    private: true,
    topics: [
      "deaf-first",
      "accessibility",
      "ai-powered",
      "vocational-rehabilitation",
      "nextjs",
      "fastapi",
      "pinksync",
      "gcp",
      "kubernetes",
    ],
  },
  branches: {
    main: "main",
    development: "develop",
    staging: "staging",
  },
  protection: {
    requireReviews: true,
    requireStatusChecks: true,
    enforceAdmins: false,
  },
  environments: {
    development: {
      url: "https://dev.pinksync.io",
      protection: false,
    },
    staging: {
      url: "https://staging.pinksync.io",
      protection: true,
    },
    production: {
      url: "https://pinksync.io",
      protection: true,
      reviewers: true,
    },
  },
  authentication: {
    sso: true,
    twoFactor: true,
  },
}

// Generate GitHub authentication script
function generateAuthScript(): void {
  const authScript = `#!/bin/bash

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
`

  writeFileSync("scripts/setup-github-auth.sh", authScript)
  execSync("chmod +x scripts/setup-github-auth.sh")
  console.log("✅ Created GitHub authentication setup script")
}

// Generate GitHub integration script
function generateIntegrationScript(): void {
  const integrationScript = `#!/bin/bash

# GitHub Integration Setup for PinkSync
set -e

echo "🚀 Setting up GitHub integration for PinkSync ecosystem..."

# Configuration
REPO_NAME="${githubConfig.repository.name}"
ORG_NAME="${githubConfig.repository.organization || ""}"
DESCRIPTION="${githubConfig.repository.description}"
TOPICS="${githubConfig.repository.topics.join(",")}"
MAIN_BRANCH="${githubConfig.branches.main}"
DEV_BRANCH="${githubConfig.branches.development}"
STAGING_BRANCH="${githubConfig.branches.staging}"

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
    gh api repos/$GITHUB_USER/$REPO_NAME/environments/production --silent || gh api repos/$GITHUB_USER/$REPO_NAME/environments -f environment_name=production
fi

# Set up branch protection
echo "🔒 Setting up branch protection..."
if [ -n "$ORG_NAME" ]; then
    gh api repos/$ORG_NAME/$REPO_NAME/branches/$MAIN_BRANCH/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
    gh api repos/$ORG_NAME/$REPO_NAME/branches/$DEV_BRANCH/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
else
    gh api repos/$GITHUB_USER/$REPO_NAME/branches/$MAIN_BRANCH/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
    gh api repos/$GITHUB_USER/$REPO_NAME/branches/$DEV_BRANCH/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
fi

# Set up GitHub Actions
echo "⚙️ Setting up GitHub Actions..."
mkdir -p .github/workflows

# Push changes
echo "📤 Pushing changes to GitHub..."
git add .
git commit -m "chore: set up GitHub integration"
git push origin $MAIN_BRANCH

echo "✅ GitHub integration setup completed successfully!"
echo ""
echo "🔗 Repository URL: https://github.com/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME"
echo ""
echo "📋 Next steps:\"\
echo "1. Run './scripts/setup-github-secrets.sh' to set up GitHub secrets"
echo "2. Configure GitHub Actions workflows"
echo "3. Invite team members to the repository"
`

  writeFileSync("scripts/setup-github-integration.sh", integrationScript)
  execSync("chmod +x scripts/setup-github-integration.sh")
  console.log("✅ Created GitHub integration setup script")
}

// Generate GitHub Actions workflow for Redis monitoring with Upstash
function generateRedisMonitoringWorkflow(): void {
  const redisMonitoringWorkflow = `name: Redis Monitoring

on:
  schedule:
    - cron: '*/15 * * * *'  # Run every 15 minutes
  workflow_dispatch:  # Allow manual triggering

jobs:
  monitor:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Check Redis connection
      run: |
        node -e "
        const { Redis } = require('@upstash/redis');
        
        const redis = new Redis({
          url: process.env.REDIS_URL,
          token: process.env.REDIS_TOKEN,
        });
        
        async function checkRedis() {
          try {
            const start = Date.now();
            const result = await redis.ping();
            const latency = Date.now() - start;
            
            console.log('Redis connection successful');
            console.log('Response:', result);
            console.log('Latency:', latency, 'ms');
            
            // Check memory usage
            const info = await redis.info('memory');
            console.log('Memory usage:', info);
            
            // Check client connections
            const clients = await redis.info('clients');
            console.log('Client connections:', clients);
            
            process.exit(0);
          } catch (error) {
            console.error('Redis connection failed:', error);
            process.exit(1);
          }
        }
        
        checkRedis();
        "
    
    - name: Notify on failure
      if: failure()
      uses: rtCamp/action-slack-notify@v2
      env:
        SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        SLACK_CHANNEL: alerts\
        SLACK_COLOR: danger
        SLACK_TITLE: Redis Connection Failure
        SLACK_MESSAGE: 'Redis connection check failed. Please investigate immediately.'
        SLACK_FOOTER: 'PinkSync Monitoring'
`

  writeFileSync(".github/workflows/redis-monitoring.yml", redisMonitoringWorkflow)
  console.log("✅ Created Redis monitoring workflow")
}

// Main function
async function main(): Promise<void> {
  console.log("🚀 Setting up GitHub integration for PinkSync ecosystem...")

  // Generate GitHub authentication script
  generateAuthScript()

  // Generate GitHub integration script
  generateIntegrationScript()

  // Generate Redis monitoring workflow
  generateRedisMonitoringWorkflow()

  console.log("\n✅ GitHub integration setup completed!")
  console.log("\nNext steps:")
  console.log("1. Run ./scripts/setup-github-auth.sh to authenticate with GitHub")
  console.log("2. Run ./scripts/setup-github-integration.sh to set up the GitHub repository")
  console.log("3. Run ./scripts/setup-github-secrets.sh to set up GitHub secrets")
  console.log("4. Follow the instructions in docs/github-integration.md")
}

// Run the main function
main().catch(console.error)
