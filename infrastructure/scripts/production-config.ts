import { writeFileSync } from "fs"

// Production environment configuration with your Redis setup
const productionConfig = {
  redis: {
    url: "redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379",
    token: process.env.REDIS_TOKEN || "your_upstash_rest_token_if_using_rest_api",
    host: "bright-shiner-48489.upstash.io",
    port: 6379,
    password: "Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA",
  },
  domains: {
    main: "pinksync.io",
    auth: "auth.pinksync.io",
    trust: "trust.pinksync.io",
    app: "app.pinksync.io",
    api: "api.pinksync.io",
    docs: "docs.pinksync.io",
  },
  monitoring: {
    prometheus: true,
    grafana: true,
    alertmanager: true,
    healthChecks: true,
  },
}

// Generate production environment file
const generateProductionEnv = () => {
  const envContent = `# PINKSYNC Production Environment Configuration
# Generated: ${new Date().toISOString()}

# === CORE CONFIGURATION ===
NODE_ENV=production
VERCEL_ENV=production
ENVIRONMENT=production

# === DOMAINS ===
NEXT_PUBLIC_DOMAIN_MAIN="pinksync.io"
NEXT_PUBLIC_DOMAIN_AUTH="auth.pinksync.io"
NEXT_PUBLIC_DOMAIN_TRUST="trust.pinksync.io"
NEXT_PUBLIC_DOMAIN_APP="app.pinksync.io"
NEXT_PUBLIC_DOMAIN_API="api.pinksync.io"
NEXT_PUBLIC_DOMAIN_DOCS="docs.pinksync.io"

# === API CONFIGURATION ===
NEXT_PUBLIC_API_URL="https://api.pinksync.io"
NEXT_PUBLIC_DEAFAUTH_URL="https://auth.pinksync.io"
NEXT_PUBLIC_FIBONROSE_URL="https://trust.pinksync.io"

# === REDIS CACHE (Upstash) ===
REDIS_URL="redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379"
UPSTASH_REDIS_REST_URL="https://bright-shiner-48489.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token_if_using_rest_api"
REDIS_TOKEN="your_upstash_rest_token_if_using_rest_api"

# === DATABASE ===
DATABASE_URL="postgresql://pinksync:SECURE_PASSWORD@pinksync-db-prod:5432/pinksync"
DIRECT_URL="postgresql://pinksync:SECURE_PASSWORD@pinksync-db-prod:5432/pinksync"

# === AUTHENTICATION ===
NEXTAUTH_SECRET="SECURE_JWT_SECRET_KEY_FOR_PRODUCTION"
NEXTAUTH_URL="https://pinksync.io"
JWT_SECRET="SECURE_JWT_SECRET_KEY_FOR_PRODUCTION"

# === API KEYS ===
DEAF_AUTH_API_KEY="df_t7zxjxgnnan1ytuvhyoj4e"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# === SUPABASE (Optional) ===
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"

# === STORAGE ===
NEXT_PUBLIC_MAX_FILE_SIZE="10485760"
NEXT_PUBLIC_ALLOWED_FILE_TYPES="image/*,video/*,audio/*"
STORAGE_BUCKET="pinksync-storage-prod"
VIDEOS_BUCKET="pinksync-videos-prod"

# === MONITORING ===
ENABLE_METRICS=true
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
LOG_LEVEL=info

# === SECURITY ===
CORS_ORIGINS="https://pinksync.io,https://app.pinksync.io,https://auth.pinksync.io,https://trust.pinksync.io,https://api.pinksync.io,https://docs.pinksync.io"
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# === CACHE CONFIGURATION ===
REDIS_DEFAULT_TTL=3600
ENABLE_CACHE=true
CACHE_DEBUG=false

# === GCP CONFIGURATION ===
GOOGLE_CLOUD_PROJECT="pinksync-ecosystem-prod"
GCP_REGION="us-central1"
GCP_ZONE="us-central1-a"

# === BLOCKCHAIN & DAO (Optional) ===
BLOCKCHAIN_NETWORK="ethereum"
DAO_CONTRACT_ADDRESS="YOUR_DAO_CONTRACT"
GOVERNANCE_TOKEN_ADDRESS="YOUR_TOKEN_CONTRACT"
WALLET_CONNECT_PROJECT_ID="YOUR_WALLETCONNECT_ID"
`

  return envContent
}

// Write production environment file
writeFileSync(".env.production", generateProductionEnv())
console.log("✅ Production environment configuration created")

export { productionConfig, generateProductionEnv }
