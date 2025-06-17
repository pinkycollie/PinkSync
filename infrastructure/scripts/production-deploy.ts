import { execSync } from "child_process"
import { writeFileSync } from "fs"

interface DeploymentConfig {
  projectId: string
  environment: "dev" | "staging" | "prod"
  region: string
  domains: {
    main: string
    auth: string
    trust: string
    app: string
    api: string
    docs: string
  }
  database: {
    instance: string
    name: string
    user: string
  }
  apiKeys: {
    deafAuthKey: string
    openaiKey: string
    supabaseUrl?: string
    supabaseKey?: string
  }
}

class PinkSyncDeployment {
  constructor(private config: DeploymentConfig) {}

  async deployToGCP(): Promise<void> {
    console.log("🚀 Starting PinkSync ecosystem deployment to GCP...")

    try {
      // 1. Set up GCP project
      await this.setupGCPProject()

      // 2. Deploy infrastructure
      await this.deployInfrastructure()

      // 3. Build and push images
      await this.buildAndPushImages()

      // 4. Deploy to Kubernetes
      await this.deployToKubernetes()

      // 5. Configure domains and SSL
      await this.configureDomains()

      // 6. Run health checks
      await this.runHealthChecks()

      console.log("✅ Deployment completed successfully!")
    } catch (error) {
      console.error("❌ Deployment failed:", error)
      throw error
    }
  }

  private async setupGCPProject(): Promise<void> {
    console.log("📋 Setting up GCP project...")

    // Set project
    execSync(`gcloud config set project ${this.config.projectId}`)

    // Enable required APIs
    const apis = [
      "compute.googleapis.com",
      "container.googleapis.com",
      "sql.googleapis.com",
      "redis.googleapis.com",
      "storage.googleapis.com",
      "dns.googleapis.com",
      "certificatemanager.googleapis.com",
    ]

    for (const api of apis) {
      console.log(`Enabling ${api}...`)
      execSync(`gcloud services enable ${api}`)
    }
  }

  private async deployInfrastructure(): Promise<void> {
    console.log("🏗️ Deploying infrastructure with Terraform...")

    // Create terraform variables file
    const tfVars = `
project_id = "${this.config.projectId}"
environment = "${this.config.environment}"
region = "${this.config.region}"
db_password = "${process.env.DB_PASSWORD || "secure_password_123"}"
`

    writeFileSync("infrastructure/terraform/terraform.tfvars", tfVars)

    // Deploy infrastructure
    process.chdir("infrastructure/terraform")
    execSync("terraform init")
    execSync("terraform plan")
    execSync("terraform apply -auto-approve")
    process.chdir("../..")
  }

  private async buildAndPushImages(): Promise<void> {
    console.log("📦 Building and pushing Docker images...")

    const images = [
      { name: "deafauth", dockerfile: "infrastructure/docker/Dockerfile.deafauth" },
      { name: "pinksync-frontend", dockerfile: "infrastructure/docker/Dockerfile.frontend" },
      { name: "pinksync-api", dockerfile: "infrastructure/docker/Dockerfile.api" },
      { name: "fibonrose", dockerfile: "infrastructure/docker/Dockerfile.fibonrose" },
      { name: "pinksync-docs", dockerfile: "infrastructure/docker/Dockerfile.docs" },
    ]

    for (const image of images) {
      const tag = `gcr.io/${this.config.projectId}/${image.name}:latest`
      console.log(`Building ${image.name}...`)
      execSync(`docker build -t ${tag} -f ${image.dockerfile} .`)
      console.log(`Pushing ${image.name}...`)
      execSync(`docker push ${tag}`)
    }
  }

  private async deployToKubernetes(): Promise<void> {
    console.log("☸️ Deploying to Kubernetes...")

    // Get cluster credentials
    execSync(
      `gcloud container clusters get-credentials pinksync-cluster-${this.config.environment} --region=${this.config.region}`,
    )

    // Create secrets
    await this.createKubernetesSecrets()

    // Replace placeholders in manifests
    const manifests = [
      "infrastructure/kubernetes/namespace.yaml",
      "infrastructure/kubernetes/deafauth-deployment.yaml",
      "infrastructure/kubernetes/pinksync-deployment.yaml",
      "infrastructure/kubernetes/fibonrose-deployment.yaml",
      "infrastructure/kubernetes/ingress.yaml",
    ]

    for (const manifest of manifests) {
      let content = require("fs").readFileSync(manifest, "utf8")
      content = content.replace(/PROJECT_ID/g, this.config.projectId)
      content = content.replace(/\${ENVIRONMENT}/g, this.config.environment)
      writeFileSync(manifest, content)
    }

    // Apply manifests
    for (const manifest of manifests) {
      console.log(`Applying ${manifest}...`)
      execSync(`kubectl apply -f ${manifest}`)
    }

    // Wait for deployments
    console.log("⏳ Waiting for deployments to be ready...")
    execSync("kubectl wait --for=condition=available --timeout=300s deployment/deafauth-deployment -n pinksync")
    execSync("kubectl wait --for=condition=available --timeout=300s deployment/pinksync-deployment -n pinksync")
    execSync("kubectl wait --for=condition=available --timeout=300s deployment/fibonrose-deployment -n pinksync")
  }

  private async createKubernetesSecrets(): Promise<void> {
    console.log("🔐 Creating Kubernetes secrets...")

    const secrets = {
      DATABASE_URL: `postgresql://${this.config.database.user}:${process.env.DB_PASSWORD}@${this.config.database.instance}/${this.config.database.name}`,
      JWT_SECRET: process.env.JWT_SECRET || "secure_jwt_secret_key",
      OPENAI_API_KEY: this.config.apiKeys.openaiKey,
      DEAF_AUTH_API_KEY: this.config.apiKeys.deafAuthKey,
      SUPABASE_URL: this.config.apiKeys.supabaseUrl || "",
      SUPABASE_ANON_KEY: this.config.apiKeys.supabaseKey || "",
    }

    // Create secret
    let secretCmd = "kubectl create secret generic pinksync-secrets -n pinksync"
    for (const [key, value] of Object.entries(secrets)) {
      if (value) {
        secretCmd += ` --from-literal=${key}="${value}"`
      }
    }

    try {
      execSync(secretCmd)
    } catch (error) {
      // Secret might already exist, update it
      console.log("Secret already exists, updating...")
      execSync("kubectl delete secret pinksync-secrets -n pinksync --ignore-not-found")
      execSync(secretCmd)
    }
  }

  private async configureDomains(): Promise<void> {
    console.log("🌐 Configuring domains and SSL...")

    // Get the global IP address
    const ipOutput = execSync("terraform output -raw global_ip_address", {
      cwd: "infrastructure/terraform",
    })
      .toString()
      .trim()

    console.log(`Global IP Address: ${ipOutput}`)

    // Get DNS name servers
    const nameServersOutput = execSync("terraform output -json dns_name_servers", {
      cwd: "infrastructure/terraform",
    })
      .toString()
      .trim()

    const nameServers = JSON.parse(nameServersOutput)

    console.log("📋 DNS Configuration Required:")
    console.log("Update your domain registrar with these name servers:")
    nameServers.forEach((ns: string, index: number) => {
      console.log(`  NS${index + 1}: ${ns}`)
    })

    console.log("\n🔗 Your domains will be available at:")
    console.log(`  Main Site: https://${this.config.domains.main}`)
    console.log(`  App: https://${this.config.domains.app}`)
    console.log(`  Auth: https://${this.config.domains.auth}`)
    console.log(`  Trust: https://${this.config.domains.trust}`)
    console.log(`  API: https://${this.config.domains.api}`)
    console.log(`  Docs: https://${this.config.domains.docs}`)
  }

  private async runHealthChecks(): Promise<void> {
    console.log("🏥 Running health checks...")

    // Wait for SSL certificates to be ready
    console.log("Waiting for SSL certificates...")
    let sslReady = false
    let attempts = 0
    const maxAttempts = 30

    while (!sslReady && attempts < maxAttempts) {
      try {
        const sslStatus = execSync("terraform output -raw ssl_certificate_status", {
          cwd: "infrastructure/terraform",
        })
          .toString()
          .trim()

        if (sslStatus === "ACTIVE") {
          sslReady = true
          console.log("✅ SSL certificates are active")
        } else {
          console.log(`SSL status: ${sslStatus}, waiting...`)
          await new Promise((resolve) => setTimeout(resolve, 30000)) // Wait 30 seconds
          attempts++
        }
      } catch (error) {
        console.log("Waiting for SSL certificate status...")
        await new Promise((resolve) => setTimeout(resolve, 30000))
        attempts++
      }
    }

    // Check service health
    const services = ["deafauth", "pinksync", "fibonrose"]
    for (const service of services) {
      try {
        execSync(`kubectl get deployment ${service}-deployment -n pinksync`)
        console.log(`✅ ${service} deployment is running`)
      } catch (error) {
        console.log(`❌ ${service} deployment check failed`)
      }
    }
  }
}

// Export for use in deployment script
export { PinkSyncDeployment, type DeploymentConfig }

// CLI usage
if (require.main === module) {
  const config: DeploymentConfig = {
    projectId: process.argv[2] || "pinksync-ecosystem-prod",
    environment: (process.argv[3] as any) || "prod",
    region: process.argv[4] || "us-central1",
    domains: {
      main: "pinksync.io",
      auth: "auth.pinksync.io",
      trust: "trust.pinksync.io",
      app: "app.pinksync.io",
      api: "api.pinksync.io",
      docs: "docs.pinksync.io",
    },
    database: {
      instance: `pinksync-db-${process.argv[3] || "prod"}`,
      name: "pinksync",
      user: "pinksync",
    },
    apiKeys: {
      deafAuthKey: process.env.DEAF_AUTH_API_KEY || "df_t7zxjxgnnan1ytuvhyoj4e",
      openaiKey: process.env.OPENAI_API_KEY || "",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  }

  const deployment = new PinkSyncDeployment(config)
  deployment.deployToGCP().catch(console.error)
}
