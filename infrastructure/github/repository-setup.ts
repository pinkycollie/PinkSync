import { writeFileSync } from "fs"
import { execSync } from "child_process"
import { ORG_NAME } from "./config" // Declare ORG_NAME variable

// GitHub repository configuration for PinkSync ecosystem
interface GitHubRepoConfig {
  name: string
  description: string
  private: boolean
  organization?: string
  topics: string[]
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
  workflows: {
    ci: boolean
    deployDev: boolean
    deployStaging: boolean
    deployProd: boolean
  }
}

// PinkSync GitHub repository configuration
const pinkSyncRepoConfig: GitHubRepoConfig = {
  name: "pinksync-platform",
  description:
    "PinkSync Ecosystem - Deaf-first AI-powered platform for vocational, entrepreneurial, and rehabilitation workflows",
  private: true,
  organization: ORG_NAME, // Use ORG_NAME variable
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
  workflows: {
    ci: true,
    deployDev: true,
    deployStaging: true,
    deployProd: true,
  },
}

// Generate GitHub workflow files
function generateGitHubWorkflows(config: GitHubRepoConfig): void {
  // Create .github/workflows directory
  execSync("mkdir -p .github/workflows")

  // CI workflow
  if (config.workflows.ci) {
    const ciWorkflow = `name: CI

on:
  push:
    branches: [ ${config.branches.development}, ${config.branches.staging}, ${config.branches.main} ]
  pull_request:
    branches: [ ${config.branches.development}, ${config.branches.staging}, ${config.branches.main} ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: pinksync
          POSTGRES_PASSWORD: pinksync_test
          POSTGRES_DB: pinksync_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        cache: 'pip'
    
    - name: Install dependencies
      run: |
        npm ci
        pip install -r requirements.txt
    
    - name: Lint
      run: |
        npm run lint
        black --check api/
    
    - name: Type check
      run: npm run type-check
    
    - name: Run tests
      run: |
        npm test
        pytest api/tests/
      env:
        DATABASE_URL: postgresql://pinksync:pinksync_test@localhost:5432/pinksync_test
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test_jwt_secret
        ENVIRONMENT: test
`
    writeFileSync(".github/workflows/ci.yml", ciWorkflow)
    console.log("✅ Created CI workflow")
  }

  // Development deployment workflow
  if (config.workflows.deployDev) {
    const devDeployWorkflow = `name: Deploy to Development

on:
  push:
    branches: [ ${config.branches.development} ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: development
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Google Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: \${{ secrets.GCP_PROJECT_ID }}
        service_account_key: \${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    
    - name: Configure Docker for GCR
      run: gcloud auth configure-docker
    
    - name: Build and push Docker images
      run: |
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/deafauth:dev -f infrastructure/docker/Dockerfile.deafauth .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-frontend:dev -f infrastructure/docker/Dockerfile.frontend .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-api:dev -f infrastructure/docker/Dockerfile.api .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/fibonrose:dev -f infrastructure/docker/Dockerfile.fibonrose .
        
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/deafauth:dev
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-frontend:dev
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-api:dev
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/fibonrose:dev
    
    - name: Deploy to GKE
      run: |
        gcloud container clusters get-credentials pinksync-cluster-dev --region=\${{ secrets.GCP_REGION }}
        
        # Update Kubernetes manifests with new image tags
        sed -i 's|gcr.io/PROJECT_ID/deafauth:latest|gcr.io/\${{ secrets.GCP_PROJECT_ID }}/deafauth:dev|g' infrastructure/kubernetes/deafauth-deployment.yaml
        sed -i 's|gcr.io/PROJECT_ID/pinksync-frontend:latest|gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-frontend:dev|g' infrastructure/kubernetes/pinksync-deployment.yaml
        sed -i 's|gcr.io/PROJECT_ID/pinksync-api:latest|gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-api:dev|g' infrastructure/kubernetes/pinksync-deployment.yaml
        sed -i 's|gcr.io/PROJECT_ID/fibonrose:latest|gcr.io/\${{ secrets.GCP_PROJECT_ID }}/fibonrose:dev|g' infrastructure/kubernetes/fibonrose-deployment.yaml
        
        # Apply Kubernetes manifests
        kubectl apply -f infrastructure/kubernetes/namespace.yaml
        kubectl apply -f infrastructure/kubernetes/deafauth-deployment.yaml
        kubectl apply -f infrastructure/kubernetes/pinksync-deployment.yaml
        kubectl apply -f infrastructure/kubernetes/fibonrose-deployment.yaml
        kubectl apply -f infrastructure/kubernetes/ingress.yaml
        
        # Wait for deployments to be ready
        kubectl rollout status deployment/deafauth-deployment -n pinksync
        kubectl rollout status deployment/pinksync-deployment -n pinksync
        kubectl rollout status deployment/fibonrose-deployment -n pinksync
      env:
        KUBECONFIG: /tmp/kubeconfig
    
    - name: Run health checks
      run: |
        # Wait for services to be fully available
        sleep 30
        
        # Run health checks
        FRONTEND_IP=$(kubectl get service pinksync-frontend-service -n pinksync -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        DEAFAUTH_IP=$(kubectl get service deafauth-service -n pinksync -o jsonpath='{.spec.clusterIP}')
        FIBONROSE_IP=$(kubectl get service fibonrose-service -n pinksync -o jsonpath='{.spec.clusterIP}')
        
        # Check frontend
        curl -f http://$FRONTEND_IP/api/health || exit 1
        
        # Check DeafAuth
        kubectl exec -it $(kubectl get pod -l app=deafauth -n pinksync -o jsonpath='{.items[0].metadata.name}') -n pinksync -- curl -f http://localhost:8000/health || exit 1
        
        # Check FibonRose
        kubectl exec -it $(kubectl get pod -l app=fibonrose -n pinksync -o jsonpath='{.items[0].metadata.name}') -n pinksync -- curl -f http://localhost:8000/health || exit 1
        
        echo "✅ All services are healthy"
      env:
        KUBECONFIG: /tmp/kubeconfig
`
    writeFileSync(".github/workflows/deploy-dev.yml", devDeployWorkflow)
    console.log("✅ Created Development deployment workflow")
  }

  // Production deployment workflow
  if (config.workflows.deployProd) {
    const prodDeployWorkflow = `name: Deploy to Production

on:
  push:
    branches: [ ${config.branches.main} ]
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "yes" to confirm production deployment'
        required: true
        default: 'no'

jobs:
  validate:
    runs-on: ubuntu-latest
    if: github.event_name == 'workflow_dispatch'
    steps:
      - name: Validate confirmation
        if: github.event.inputs.confirm != 'yes'
        run: |
          echo "You must type 'yes' to confirm production deployment"
          exit 1

  deploy:
    runs-on: ubuntu-latest
    needs: [validate]
    if: github.event_name == 'push' || (github.event_name == 'workflow_dispatch' && github.event.inputs.confirm == 'yes')
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Google Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: \${{ secrets.GCP_PROJECT_ID }}
        service_account_key: \${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    
    - name: Configure Docker for GCR
      run: gcloud auth configure-docker
    
    - name: Build and push Docker images
      run: |
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/deafauth:prod -f infrastructure/docker/Dockerfile.deafauth .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-frontend:prod -f infrastructure/docker/Dockerfile.frontend .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-api:prod -f infrastructure/docker/Dockerfile.api .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/fibonrose:prod -f infrastructure/docker/Dockerfile.fibonrose .
        docker build -t gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-docs:prod -f infrastructure/docker/Dockerfile.docs .
        
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/deafauth:prod
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-frontend:prod
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-api:prod
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/fibonrose:prod
        docker push gcr.io/\${{ secrets.GCP_PROJECT_ID }}/pinksync-docs:prod
    
    - name: Set up environment
      run: |
        echo "REDIS_URL=\${{ secrets.REDIS_URL }}" >> .env.production
        echo "REDIS_TOKEN=\${{ secrets.REDIS_TOKEN }}" >> .env.production
        echo "DB_PASSWORD=\${{ secrets.DB_PASSWORD }}" >> .env.production
        echo "JWT_SECRET=\${{ secrets.JWT_SECRET }}" >> .env.production
        echo "OPENAI_API_KEY=\${{ secrets.OPENAI_API_KEY }}" >> .env.production
    
    - name: Deploy with monitoring
      run: |
        chmod +x scripts/deploy-with-monitoring.sh
        ./scripts/deploy-with-monitoring.sh \${{ secrets.GCP_PROJECT_ID }} prod \${{ secrets.GCP_REGION }}
      env:
        REDIS_URL: \${{ secrets.REDIS_URL }}
        REDIS_TOKEN: \${{ secrets.REDIS_TOKEN }}
        DB_PASSWORD: \${{ secrets.DB_PASSWORD }}
        JWT_SECRET: \${{ secrets.JWT_SECRET }}
        OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
        KUBECONFIG: /tmp/kubeconfig
    
    - name: Run health checks
      run: |
        # Wait for services to be fully available
        sleep 60
        
        # Run health checks
        kubectl get services -n pinksync
        kubectl get pods -n pinksync
        
        # Check Redis connection
        kubectl run redis-test --image=redis:7-alpine --rm -i --restart=Never -- redis-cli -h \${{ secrets.REDIS_HOST }} -p \${{ secrets.REDIS_PORT }} -a \${{ secrets.REDIS_PASSWORD }} ping
        
        echo "✅ Production deployment completed successfully"
      env:
        KUBECONFIG: /tmp/kubeconfig
    
    - name: Notify deployment status
      if: always()
      uses: rtCamp/action-slack-notify@v2
      env:
        SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}
        SLACK_CHANNEL: deployments
        SLACK_COLOR: \${{ job.status }}
        SLACK_TITLE: Production Deployment \${{ job.status }}
        SLACK_MESSAGE: 'PinkSync Platform has been deployed to production'
        SLACK_FOOTER: 'PinkSync DevOps'
`
    writeFileSync(".github/workflows/deploy-prod.yml", prodDeployWorkflow)
    console.log("✅ Created Production deployment workflow")
  }
}

// Generate GitHub issue templates
function generateIssueTemplates(): void {
  // Create .github/ISSUE_TEMPLATE directory
  execSync("mkdir -p .github/ISSUE_TEMPLATE")

  // Bug report template
  const bugReportTemplate = `---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
- Service: [e.g. DeafAuth, PinkSync, FibonRose]
- Environment: [e.g. production, staging, development]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
`
  writeFileSync(".github/ISSUE_TEMPLATE/bug_report.md", bugReportTemplate)

  // Feature request template
  const featureRequestTemplate = `---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Which service would this feature impact?**
- [ ] DeafAuth
- [ ] PinkSync Core
- [ ] FibonRose
- [ ] Infrastructure/DevOps
- [ ] Documentation
- [ ] Other (please specify)

**Additional context**
Add any other context or screenshots about the feature request here.
`
  writeFileSync(".github/ISSUE_TEMPLATE/feature_request.md", featureRequestTemplate)

  console.log("✅ Created GitHub issue templates")
}

// Generate GitHub pull request template
function generatePRTemplate(): void {
  const prTemplate = `## Description
Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context.

Fixes # (issue)

## Type of change
Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
`
  writeFileSync(".github/pull_request_template.md", prTemplate)
  console.log("✅ Created GitHub pull request template")
}

// Generate GitHub Actions workflow for Redis health checks
function generateRedisHealthCheckWorkflow(): void {
  const redisHealthCheckWorkflow = `name: Redis Health Check

on:
  schedule:
    - cron: '*/30 * * * *'  # Run every 30 minutes
  workflow_dispatch:  # Allow manual triggering

jobs:
  health-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: Check Redis connection
      uses: docker://redis:7-alpine
      with:
        entrypoint: redis-cli
        args: -h bright-shiner-48489.upstash.io -p 6379 -a \${{ secrets.REDIS_PASSWORD }} ping
    
    - name: Notify if Redis is down
      if: failure()
      uses: rtCamp/action-slack-notify@v2
      env:
        SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}
        SLACK_CHANNEL: alerts
        SLACK_COLOR: danger
        SLACK_TITLE: Redis Connection Failure
        SLACK_MESSAGE: 'Redis connection check failed. Please investigate immediately.'
        SLACK_FOOTER: 'PinkSync Monitoring'
`
  writeFileSync(".github/workflows/redis-health-check.yml", redisHealthCheckWorkflow)
  console.log("✅ Created Redis health check workflow")
}

// Generate GitHub Actions workflow for database backups
function generateDatabaseBackupWorkflow(): void {
  const databaseBackupWorkflow = `name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM UTC
  workflow_dispatch:  # Allow manual triggering

jobs:
  backup:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Google Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: \${{ secrets.GCP_PROJECT_ID }}
        service_account_key: \${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    
    - name: Create database backup
      run: |
        # Create backup using gcloud
        BACKUP_ID=$(date +%Y%m%d%H%M%S)
        gcloud sql backups create --instance=pinksync-db-prod --description="Automated backup $BACKUP_ID"
        
        # Verify backup was created
        gcloud sql backups list --instance=pinksync-db-prod --limit=1
    
    - name: Notify backup status
      if: always()
      uses: rtCamp/action-slack-notify@v2
      env:
        SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}
        SLACK_CHANNEL: backups
        SLACK_COLOR: \${{ job.status }}
        SLACK_TITLE: Database Backup \${{ job.status }}
        SLACK_MESSAGE: 'PinkSync database backup completed with status: \${{ job.status }}'
        SLACK_FOOTER: 'PinkSync DevOps'
`
  writeFileSync(".github/workflows/database-backup.yml", databaseBackupWorkflow)
  console.log("✅ Created database backup workflow")
}

// Generate GitHub repository setup script
function generateRepositorySetupScript(): void {
  const setupScript = `#!/bin/bash

# GitHub Repository Setup Script for PinkSync
set -e

echo "🚀 Setting up GitHub repository for PinkSync..."

# Configuration
REPO_NAME="pinksync-platform"
ORG_NAME="${ORG_NAME}"
DESCRIPTION="PinkSync Ecosystem - Deaf-first AI-powered platform for vocational, entrepreneurial, and rehabilitation workflows"
TOPICS="deaf-first,accessibility,ai-powered,vocational-rehabilitation,nextjs,fastapi,pinksync,gcp,kubernetes"

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

# Create repository
echo "📦 Creating repository..."
if [ -n "$ORG_NAME" ]; then
    gh repo create "$ORG_NAME/$REPO_NAME" --description "$DESCRIPTION" --private --confirm
else
    gh repo create "$REPO_NAME" --description "$DESCRIPTION" --private --confirm
fi

# Add topics
echo "🏷️ Adding topics..."
if [ -n "$ORG_NAME" ]; then
    gh repo edit "$ORG_NAME/$REPO_NAME" --add-topic $TOPICS
else
    gh repo edit "$REPO_NAME" --add-topic $TOPICS
fi

# Create branches
echo "🌿 Creating branches..."
git checkout -b develop
git push -u origin develop

git checkout -b staging
git push -u origin staging

git checkout main

# Set up branch protection
echo "🔒 Setting up branch protection..."
if [ -n "$ORG_NAME" ]; then
    gh api repos/$ORG_NAME/$REPO_NAME/branches/main/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
    gh api repos/$ORG_NAME/$REPO_NAME/branches/develop/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
else
    gh api repos/$GITHUB_USER/$REPO_NAME/branches/main/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
    gh api repos/$GITHUB_USER/$REPO_NAME/branches/develop/protection -X PUT -F required_status_checks='{"strict":true,"contexts":["test"]}' -F enforce_admins=false -F required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' -F restrictions=null
fi

echo "✅ GitHub repository setup completed successfully!"
echo ""
echo "🔗 Repository URL: https://github.com/${ORG_NAME:-$GITHUB_USER}/$REPO_NAME"
echo ""\
echo "📋 Next steps:"
echo "1. Set up GitHub Actions secrets for CI/CD"
echo "2. Configure Slack notifications"
echo "3. Set up branch protection rules in GitHub settings"
echo "4. Invite team members to the repository"
`
  writeFileSync("scripts/setup-github-repo.sh", setupScript)
  execSync("chmod +x scripts/setup-github-repo.sh")
  console.log("✅ Created GitHub repository setup script")
}

// Main function to set up GitHub integration
async function setupGitHubIntegration(): Promise<void> {
  console.log("🚀 Setting up GitHub integration for PinkSync ecosystem...")

  // Generate GitHub workflows
  generateGitHubWorkflows(pinkSyncRepoConfig)

  // Generate issue templates
  generateIssueTemplates()

  // Generate PR template
  generatePRTemplate()

  // Generate Redis health check workflow
  generateRedisHealthCheckWorkflow()

  // Generate database backup workflow
  generateDatabaseBackupWorkflow()

  // Generate repository setup script
  generateRepositorySetupScript()

  console.log("\n✅ GitHub integration setup completed!")
  console.log("\nNext steps:")
  console.log("1. Run ./scripts/setup-github-repo.sh to create the GitHub repository")
  console.log("2. Set up GitHub Actions secrets for CI/CD")
  console.log("3. Push your code to the repository")
  console.log("4. Set up branch protection rules")
}

// Run the setup
setupGitHubIntegration().catch(console.error)
