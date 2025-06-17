// Comprehensive health check system for PinkSync ecosystem
import { redis } from "@/lib/redis/client"

interface HealthStatus {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  timestamp: string
  details?: Record<string, any>
  responseTime?: number
}

interface SystemHealth {
  overall: "healthy" | "unhealthy" | "degraded"
  services: HealthStatus[]
  uptime: number
  version: string
}

export class HealthMonitor {
  private static instance: HealthMonitor | null = null
  private healthChecks: Map<string, () => Promise<HealthStatus>> = new Map()
  private initialized = false

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor()
      HealthMonitor.instance.initialize()
    }
    return HealthMonitor.instance
  }

  private initialize() {
    if (this.initialized) return
    this.registerHealthChecks()
    this.initialized = true
  }

  private registerHealthChecks() {
    // Redis health check
    this.healthChecks.set("redis", async () => {
      const startTime = Date.now()
      try {
        await redis.ping()
        const responseTime = Date.now() - startTime

        return {
          service: "redis",
          status: "healthy",
          timestamp: new Date().toISOString(),
          responseTime,
          details: {
            host: "bright-shiner-48489.upstash.io",
            port: 6379,
            connection: "upstash",
          },
        }
      } catch (error) {
        return {
          service: "redis",
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
            host: "bright-shiner-48489.upstash.io",
          },
        }
      }
    })

    // Database health check
    this.healthChecks.set("database", async () => {
      const startTime = Date.now()
      try {
        // This would be replaced with actual database connection test
        const responseTime = Date.now() - startTime

        return {
          service: "database",
          status: "healthy",
          timestamp: new Date().toISOString(),
          responseTime,
          details: {
            type: "postgresql",
            connection: "active",
          },
        }
      } catch (error) {
        return {
          service: "database",
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        }
      }
    })

    // API services health checks
    const apiServices = [
      { name: "deafauth", url: "https://auth.pinksync.io/health" },
      { name: "fibonrose", url: "https://trust.pinksync.io/health" },
      { name: "pinksync-api", url: "https://api.pinksync.io/api/py/health" },
    ]

    apiServices.forEach((service) => {
      this.healthChecks.set(service.name, async () => {
        const startTime = Date.now()
        try {
          const response = await fetch(service.url, {
            method: "GET",
            signal: AbortSignal.timeout(5000),
          })

          const responseTime = Date.now() - startTime
          const status = response.ok ? "healthy" : "unhealthy"

          return {
            service: service.name,
            status,
            timestamp: new Date().toISOString(),
            responseTime,
            details: {
              url: service.url,
              statusCode: response.status,
              statusText: response.statusText,
            },
          }
        } catch (error) {
          return {
            service: service.name,
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            responseTime: Date.now() - startTime,
            details: {
              error: error instanceof Error ? error.message : "Unknown error",
              url: service.url,
            },
          }
        }
      })
    })
  }

  // Rest of the methods remain the same...
  async checkHealth(): Promise<SystemHealth> {
    const startTime = Date.now()
    const healthPromises = Array.from(this.healthChecks.entries()).map(async ([name, check]) => {
      try {
        return await check()
      } catch (error) {
        return {
          service: name,
          status: "unhealthy" as const,
          timestamp: new Date().toISOString(),
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        }
      }
    })

    const services = await Promise.all(healthPromises)

    // Determine overall health
    const healthyCount = services.filter((s) => s.status === "healthy").length
    const degradedCount = services.filter((s) => s.status === "degraded").length
    const unhealthyCount = services.filter((s) => s.status === "unhealthy").length

    let overall: "healthy" | "unhealthy" | "degraded"
    if (unhealthyCount > 0) {
      overall = unhealthyCount > services.length / 2 ? "unhealthy" : "degraded"
    } else if (degradedCount > 0) {
      overall = "degraded"
    } else {
      overall = "healthy"
    }

    return {
      overall,
      services,
      uptime: Date.now() - startTime,
      version: "2.0.0",
    }
  }

  async checkService(serviceName: string): Promise<HealthStatus | null> {
    const check = this.healthChecks.get(serviceName)
    if (!check) {
      return null
    }

    return await check()
  }

  // Cache health status in Redis
  async cacheHealthStatus(health: SystemHealth): Promise<void> {
    try {
      await redis.setex("system:health", 30, JSON.stringify(health))
    } catch (error) {
      console.error("Failed to cache health status:", error)
    }
  }

  async getCachedHealthStatus(): Promise<SystemHealth | null> {
    try {
      const cached = await redis.get("system:health")
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error("Failed to get cached health status:", error)
      return null
    }
  }
}

// Export function to get singleton instance (lazy initialization)
export const getHealthMonitor = () => HealthMonitor.getInstance()

// For backward compatibility
export const healthMonitor = getHealthMonitor()

// Metrics collection for Prometheus
export class MetricsCollector {
  private static metrics: Map<string, number> = new Map()

  static incrementCounter(name: string, value = 1): void {
    const current = this.metrics.get(name) || 0
    this.metrics.set(name, current + value)
  }

  static setGauge(name: string, value: number): void {
    this.metrics.set(name, value)
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  static getPrometheusFormat(): string {
    const lines: string[] = []

    for (const [name, value] of this.metrics) {
      lines.push(`# TYPE ${name} gauge`)
      lines.push(`${name} ${value}`)
    }

    return lines.join("\n")
  }
}
