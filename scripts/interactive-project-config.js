import { createInterface } from "readline"
import { writeFileSync, existsSync, mkdirSync } from "fs"
import { execSync } from "child_process"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

function askYesNo(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes")
    })
  })
}

async function interactiveProjectConfig() {
  try {
    console.log("🚀 VCode + Groq AI Project Configuration Tool")
    console.log("==============================================\n")

    // Basic Project Configuration
    console.log("📋 Basic Project Configuration")
    console.log("------------------------------")
    const projectId = await askQuestion("Enter your GCP project ID: ")
    const projectName = (await askQuestion("Enter project name (default: VCode Platform): ")) || "VCode Platform"
    const environment = (await askQuestion("Enter environment (dev/staging/prod) [dev]: ")) || "dev"
    const region = (await askQuestion("Enter GCP region [us-central1]: ")) || "us-central1"

    // Domain Configuration
    console.log("\n🌐 Domain Configuration")
    console.log("------------------------")
    const mainDomain = await askQuestion("Enter main domain (e.g., pinksync.io): ")
    const useSubdomains = await askYesNo("Configure subdomains for services?")

    const domains = { main: mainDomain }
    if (useSubdomains) {
      domains.vcode = (await askQuestion(`VCode subdomain [vcode.${mainDomain}]: `)) || `vcode.${mainDomain}`
      domains.api = (await askQuestion(`API subdomain [api.${mainDomain}]: `)) || `api.${mainDomain}`
      domains.auth = (await askQuestion(`Auth subdomain [auth.${mainDomain}]: `)) || `auth.${mainDomain}`
      domains.docs = (await askQuestion(`Docs subdomain [docs.${mainDomain}]: `)) || `docs.${mainDomain}`
    }

    // Groq AI Configuration
    console.log("\n🧠 Groq AI Configuration")
    console.log("-------------------------")
    const groqApiKey = await askQuestion("Enter Groq API key: ")
    const enableWhisper = await askYesNo("Enable Whisper for transcription?")
    const enableLlama = await askYesNo("Enable Llama for analysis?")
    const enableMixtral = await askYesNo("Enable Mixtral for technical discussions?")

    // Database Configuration
    console.log("\n🗄️ Database Configuration")
    console.log("-------------------------")
    const dbPassword = await askQuestion("Enter database password: ")
    const useSupabase = await askYesNo("Use Supabase for additional features?")

    const supabaseConfig = {}
    if (useSupabase) {
      supabaseConfig.url = await askQuestion("Enter Supabase URL: ")
      supabaseConfig.anonKey = await askQuestion("Enter Supabase anon key: ")
      supabaseConfig.serviceKey = await askQuestion("Enter Supabase service role key: ")
    }

    // Redis Configuration
    console.log("\n🔄 Redis Configuration")
    console.log("----------------------")
    const useUpstash = await askYesNo("Use Upstash Redis?")

    const redisConfig = {}
    if (useUpstash) {
      redisConfig.url = await askQuestion("Enter Upstash Redis URL: ")
      redisConfig.token = await askQuestion("Enter Upstash Redis token: ")
    }

    // Security Configuration
    console.log("\n🔐 Security Configuration")
    console.log("-------------------------")
    const jwtSecret =
      (await askQuestion("Enter JWT secret (or press Enter to generate): ")) ||
      require("crypto").randomBytes(32).toString("hex")
    const evidenceSigningKey =
      (await askQuestion("Enter evidence signing key (or press Enter to generate): ")) ||
      require("crypto").randomBytes(32).toString("hex")

    // Accessibility Configuration
    console.log("\n♿ Accessibility Configuration")
    console.log("------------------------------")
    const enableASL = await askYesNo("Enable ASL interpretation features?")
    const wcagLevel = (await askQuestion("WCAG compliance level (AA/AAA) [AAA]: ")) || "AAA"
    const enableVibration = await askYesNo("Enable vibration feedback for mobile?")
    const highContrast = await askYesNo("Enable high contrast mode by default?")

    // Browser Extension Configuration
    console.log("\n🌐 Browser Extension Configuration")
    console.log("-----------------------------------")
    const buildExtension = await askYesNo("Build browser extension?")

    const extensionConfig = {}
    if (buildExtension) {
      extensionConfig.platforms = []
      if (await askYesNo("Support Google Meet?")) extensionConfig.platforms.push("meet")
      if (await askYesNo("Support Zoom?")) extensionConfig.platforms.push("zoom")
      if (await askYesNo("Support Microsoft Teams?")) extensionConfig.platforms.push("teams")
      if (await askYesNo("Support WebEx?")) extensionConfig.platforms.push("webex")

      extensionConfig.permissions = []
      if (await askYesNo("Request microphone access?")) extensionConfig.permissions.push("microphone")
      if (await askYesNo("Request camera access?")) extensionConfig.permissions.push("camera")
      if (await askYesNo("Request storage access?")) extensionConfig.permissions.push("storage")
    }

    // Legal Compliance Configuration
    console.log("\n⚖️ Legal Compliance Configuration")
    console.log("---------------------------------")
    const enableHIPAA = await askYesNo("Enable HIPAA compliance for medical meetings?")
    const enableFRE = await askYesNo("Enable Federal Rules of Evidence compliance?")
    const enableADA = await askYesNo("Enable ADA compliance features?")

    // Deployment Configuration
    console.log("\n🚀 Deployment Configuration")
    console.log("---------------------------")
    const deployToGCP = await askYesNo("Deploy to Google Cloud Platform?")
    const enableMonitoring = await askYesNo("Enable monitoring and alerting?")
    const enableAutoScaling = await askYesNo("Enable auto-scaling?")
    const enableSSL = await askYesNo("Enable SSL certificates?")

    // Generate Configuration Files
    console.log("\n📝 Generating Configuration Files...")
    console.log("------------------------------------")

    // Create directories
    const configDirs = ["config", "config/environments", "config/deployment", "config/accessibility", "config/legal"]

    configDirs.forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    })

    // Main configuration
    const mainConfig = {
      project: {
        id: projectId,
        name: projectName,
        environment,
        region,
      },
      domains,
      groq: {
        apiKey: groqApiKey,
        models: {
          whisper: enableWhisper,
          llama: enableLlama,
          mixtral: enableMixtral,
        },
      },
      database: {
        password: dbPassword,
        supabase: useSupabase ? supabaseConfig : null,
      },
      redis: useUpstash ? redisConfig : null,
      security: {
        jwtSecret,
        evidenceSigningKey,
      },
      accessibility: {
        asl: enableASL,
        wcagLevel,
        vibration: enableVibration,
        highContrast,
      },
      extension: buildExtension ? extensionConfig : null,
      legal: {
        hipaa: enableHIPAA,
        fre: enableFRE,
        ada: enableADA,
      },
      deployment: {
        gcp: deployToGCP,
        monitoring: enableMonitoring,
        autoScaling: enableAutoScaling,
        ssl: enableSSL,
      },
    }

    writeFileSync("config/main-config.json", JSON.stringify(mainConfig, null, 2))

    // Environment variables file
    const envVars = `# VCode + Groq AI Environment Variables
# Generated by Interactive Project Configuration Tool

# Project Configuration
PROJECT_ID=${projectId}
PROJECT_NAME="${projectName}"
ENVIRONMENT=${environment}
GCP_REGION=${region}

# Domain Configuration
MAIN_DOMAIN=${mainDomain}
${
  useSubdomains
    ? `VCODE_DOMAIN=${domains.vcode}
API_DOMAIN=${domains.api}
AUTH_DOMAIN=${domains.auth}
DOCS_DOMAIN=${domains.docs}`
    : ""
}

# Groq AI Configuration
GROQ_API_KEY=${groqApiKey}
ENABLE_WHISPER=${enableWhisper}
ENABLE_LLAMA=${enableLlama}
ENABLE_MIXTRAL=${enableMixtral}

# Database Configuration
DB_PASSWORD=${dbPassword}
${
  useSupabase
    ? `SUPABASE_URL=${supabaseConfig.url}
SUPABASE_ANON_KEY=${supabaseConfig.anonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseConfig.serviceKey}`
    : ""
}

# Redis Configuration
${
  useUpstash
    ? `UPSTASH_REDIS_REST_URL=${redisConfig.url}
UPSTASH_REDIS_REST_TOKEN=${redisConfig.token}`
    : ""
}

# Security Configuration
JWT_SECRET=${jwtSecret}
EVIDENCE_SIGNING_KEY=${evidenceSigningKey}

# Accessibility Configuration
ENABLE_ASL=${enableASL}
WCAG_LEVEL=${wcagLevel}
ENABLE_VIBRATION=${enableVibration}
HIGH_CONTRAST_DEFAULT=${highContrast}

# Legal Compliance
HIPAA_COMPLIANCE=${enableHIPAA}
FRE_COMPLIANCE=${enableFRE}
ADA_COMPLIANCE=${enableADA}

# Deployment Configuration
DEPLOY_TO_GCP=${deployToGCP}
ENABLE_MONITORING=${enableMonitoring}
ENABLE_AUTO_SCALING=${enableAutoScaling}
ENABLE_SSL=${enableSSL}
`

    writeFileSync(".env.production", envVars)
    writeFileSync(".env.example", envVars.replace(/=.*/g, "="))

    // Terraform variables
    if (deployToGCP) {
      const tfVars = `project_id = "${projectId}"
environment = "${environment}"
region = "${region}"
db_password = "${dbPassword}"
main_domain = "${mainDomain}"
enable_monitoring = ${enableMonitoring}
enable_auto_scaling = ${enableAutoScaling}
enable_ssl = ${enableSSL}
`
      writeFileSync("infrastructure/terraform/terraform.tfvars", tfVars)
    }

    // Browser extension manifest
    if (buildExtension) {
      const manifest = {
        manifest_version: 3,
        name: "VCode Assistant",
        version: "1.0.0",
        description: "Deaf-first meeting assistant with AI-powered transcription and evidence generation",
        permissions: ["activeTab", "storage", ...extensionConfig.permissions],
        host_permissions: [
          "*://meet.google.com/*",
          "*://zoom.us/*",
          "*://teams.microsoft.com/*",
          "*://webex.com/*",
          `*://${domains.vcode || mainDomain}/*`,
        ],
        content_scripts: [
          {
            matches: extensionConfig.platforms.map((platform) => {
              switch (platform) {
                case "meet":
                  return "*://meet.google.com/*"
                case "zoom":
                  return "*://zoom.us/*"
                case "teams":
                  return "*://teams.microsoft.com/*"
                case "webex":
                  return "*://webex.com/*"
                default:
                  return "*://*/*"
              }
            }),
            js: ["content.js"],
          },
        ],
        action: {
          default_popup: "popup.html",
          default_title: "VCode Assistant",
        },
        icons: {
          16: "icons/icon16.png",
          48: "icons/icon48.png",
          128: "icons/icon128.png",
        },
      }

      writeFileSync("browser-extension/manifest.json", JSON.stringify(manifest, null, 2))
    }

    // Accessibility configuration
    const accessibilityConfig = {
      wcag: {
        level: wcagLevel,
        guidelines: {
          perceivable: true,
          operable: true,
          understandable: true,
          robust: true,
        },
      },
      asl: {
        enabled: enableASL,
        realTimeInterpretation: true,
        recordingCapture: true,
        culturalCompetency: true,
      },
      visual: {
        highContrast: highContrast,
        largeText: true,
        colorBlindFriendly: true,
        reducedMotion: true,
      },
      interaction: {
        keyboardNavigation: true,
        vibrationFeedback: enableVibration,
        visualFeedback: true,
        alternativeInputs: true,
      },
    }

    writeFileSync("config/accessibility/accessibility-config.json", JSON.stringify(accessibilityConfig, null, 2))

    // Legal compliance configuration
    const legalConfig = {
      hipaa: {
        enabled: enableHIPAA,
        encryption: true,
        auditLogging: true,
        accessControls: true,
      },
      fre: {
        enabled: enableFRE,
        authentication: true,
        chainOfCustody: true,
        admissibilityStandards: true,
      },
      ada: {
        enabled: enableADA,
        accessibilityCompliance: true,
        reasonableAccommodations: true,
        equalAccess: true,
      },
    }

    writeFileSync("config/legal/legal-compliance.json", JSON.stringify(legalConfig, null, 2))

    // Generate deployment script
    const deploymentScript = `#!/bin/bash
# VCode + Groq AI Deployment Script
# Generated by Interactive Project Configuration Tool

set -e

echo "🚀 Deploying VCode + Groq AI Platform..."
echo "Project: ${projectName}"
echo "Environment: ${environment}"
echo "Region: ${region}"

# Load environment variables
source .env.production

# Set GCP project
gcloud config set project ${projectId}

${
  deployToGCP
    ? `
# Deploy infrastructure
echo "🏗️ Deploying infrastructure..."
cd infrastructure/terraform
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars" -auto-approve
cd ../..
`
    : ""
}

${
  buildExtension
    ? `
# Build browser extension
echo "📦 Building browser extension..."
cd browser-extension
npm install
npm run build
cd ..
`
    : ""
}

# Deploy services
echo "☸️ Deploying services..."
${
  deployToGCP
    ? `
# Get cluster credentials
gcloud container clusters get-credentials vcode-cluster-${environment} --region=${region}

# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/
`
    : `
# Start local development
docker-compose -f infrastructure/docker/docker-compose.yml up -d
`
}

echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 Access your services:"
echo "VCode Platform: https://${domains.vcode || mainDomain}"
${
  useSubdomains
    ? `echo "API Gateway: https://${domains.api}"
echo "Documentation: https://${domains.docs}"`
    : ""
}
`

    writeFileSync("scripts/deploy-configured.sh", deploymentScript)
    execSync("chmod +x scripts/deploy-configured.sh")

    // Summary
    console.log("\n✅ Configuration Complete!")
    console.log("==========================")
    console.log(`Project: ${projectName}`)
    console.log(`Environment: ${environment}`)
    console.log(`Main Domain: ${mainDomain}`)
    console.log(`Groq AI: ${groqApiKey ? "Configured" : "Not configured"}`)
    console.log(`Database: ${dbPassword ? "Configured" : "Not configured"}`)
    console.log(`Accessibility: WCAG ${wcagLevel}, ASL ${enableASL ? "Enabled" : "Disabled"}`)
    console.log(`Browser Extension: ${buildExtension ? "Enabled" : "Disabled"}`)
    console.log(`Legal Compliance: HIPAA ${enableHIPAA}, FRE ${enableFRE}, ADA ${enableADA}`)

    console.log("\n📁 Generated Files:")
    console.log("- config/main-config.json")
    console.log("- .env.production")
    console.log("- .env.example")
    if (deployToGCP) console.log("- infrastructure/terraform/terraform.tfvars")
    if (buildExtension) console.log("- browser-extension/manifest.json")
    console.log("- config/accessibility/accessibility-config.json")
    console.log("- config/legal/legal-compliance.json")
    console.log("- scripts/deploy-configured.sh")

    console.log("\n🚀 Next Steps:")
    console.log("1. Review generated configuration files")
    console.log("2. Run: ./scripts/deploy-configured.sh")
    console.log("3. Test accessibility features")
    console.log("4. Configure domain DNS settings")
    console.log("5. Launch beta testing")

    const deployNow = await askYesNo("\nDeploy now?")
    if (deployNow) {
      console.log("\n🚀 Starting deployment...")
      execSync("./scripts/deploy-configured.sh", { stdio: "inherit" })
    }

    rl.close()
  } catch (error) {
    console.error("❌ Error:", error.message)
    rl.close()
    process.exit(1)
  }
}

interactiveProjectConfig()
