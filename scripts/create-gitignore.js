import { writeFileSync } from "fs"

const gitignoreContent = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/build
/dist
/.next/
/out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.pinksync
.env.dao

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Vercel
.vercel

# Turbo
.turbo

# Database
*.db
*.sqlite

# Temporary folders
tmp/
temp/

# PINKSYNC Platform specific
/uploads
/temp-files
*.backup
/user-content
/generated-content

# Blockchain & DAO specific
/blockchain-cache
/wallet-cache
*.keystore
/smart-contracts/artifacts
/smart-contracts/cache
/hardhat-cache

# Security sensitive
private-keys/
*.pem
*.key
wallet-*.json
mnemonic.txt

# AI/ML models and cache
/models
/ai-cache
*.model
*.weights
`

try {
  writeFileSync(".gitignore", gitignoreContent)
  console.log("✅ .gitignore file created successfully for PINKSYNC platform!")
  console.log("\nThe .gitignore includes exclusions for:")
  console.log("- Standard Next.js and Node.js files")
  console.log("- PINKSYNC platform specific files")
  console.log("- Blockchain and DAO related files")
  console.log("- Security sensitive files (keys, wallets)")
  console.log("- AI/ML models and cache")
  console.log("- User generated content")
} catch (error) {
  console.error("❌ Error creating .gitignore file:", error.message)
}
