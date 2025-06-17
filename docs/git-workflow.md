# Git Workflow for PINKSYNC Platform

## Initial Setup

### 1. Initialize Repository
\`\`\`bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
\`\`\`

### 2. Connect to Remote Repository
\`\`\`bash
# Add remote origin
git remote add origin https://github.com/yourusername/pinksync-platform.git

# Verify remote
git remote -v

# Push initial commit
git push -u origin main
\`\`\`

## Development Workflow

### Feature Development
\`\`\`bash
# Create and switch to feature branch
git checkout -b feature/user-authentication

# Make your changes...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: implement user authentication system

- Add login/signup forms
- Integrate with Supabase auth
- Add protected routes
- Update navigation for authenticated users"

# Push feature branch
git push origin feature/user-authentication
\`\`\`

### Commit Message Convention
We follow conventional commits for better project history:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes

### Code Review Process
1. Create feature branch
2. Develop and test locally
3. Push branch and create Pull Request
4. Code review and approval
5. Merge to develop/main

## Useful Git Commands

### Status and Information
\`\`\`bash
git status                    # Check working directory status
git log --oneline            # View commit history
git branch -a                # List all branches
git diff                     # Show unstaged changes
\`\`\`

### Branch Management
\`\`\`bash
git checkout -b branch-name  # Create and switch to new branch
git checkout main            # Switch to main branch
git branch -d branch-name    # Delete local branch
git push origin --delete branch-name  # Delete remote branch
\`\`\`

### Undoing Changes
\`\`\`bash
git checkout -- filename    # Discard changes to file
git reset HEAD filename     # Unstage file
git reset --soft HEAD~1     # Undo last commit (keep changes)
git reset --hard HEAD~1     # Undo last commit (discard changes)
\`\`\`

### Syncing with Remote
\`\`\`bash
git fetch origin            # Fetch latest changes
git pull origin main        # Pull and merge changes
git push origin branch-name # Push branch to remote
\`\`\`

## Environment Variables Setup

Create a `.env.local` file for local development:

\`\`\`env
# Database
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# External APIs
OPENAI_API_KEY="your-openai-api-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
\`\`\`

## Deployment with Vercel

### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Every push to main triggers automatic deployment

### Manual Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
\`\`\`

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Use descriptive commit messages
3. **Test Before Committing**: Ensure code works locally
4. **Keep Branches Updated**: Regularly sync with main branch
5. **Use .gitignore**: Never commit sensitive data or build files
6. **Review Code**: Always review changes before committing

## Troubleshooting

### Common Issues
\`\`\`bash
# Merge conflicts
git status                   # Check conflicted files
# Edit files to resolve conflicts
git add .
git commit

# Accidentally committed to wrong branch
git log --oneline           # Find commit hash
git checkout correct-branch
git cherry-pick <commit-hash>

# Reset to remote state
git fetch origin
git reset --hard origin/main
