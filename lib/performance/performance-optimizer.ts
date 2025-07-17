export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private cache: Map<string, any> = new Map()
  private preloadQueue: Set<string> = new Set()
  private compressionEnabled = true

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  // Intelligent caching system
  async cacheData(key: string, data: any, ttl = 300000): Promise<void> {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      compressed: this.compressionEnabled ? await this.compressData(data) : null,
    }
    this.cache.set(key, cacheEntry)
  }

  async getCachedData(key: string): Promise<any> {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if cache is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.compressed ? await this.decompressData(entry.compressed) : entry.data
  }

  // Data compression for large datasets
  private async compressData(data: any): Promise<string> {
    const jsonString = JSON.stringify(data)
    if (typeof window !== "undefined" && "CompressionStream" in window) {
      const stream = new CompressionStream("gzip")
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()

      writer.write(new TextEncoder().encode(jsonString))
      writer.close()

      const chunks: Uint8Array[] = []
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) chunks.push(value)
      }

      return btoa(
        String.fromCharCode(...new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[]))),
      )
    }
    return jsonString
  }

  private async decompressData(compressedData: string): Promise<any> {
    if (typeof window !== "undefined" && "DecompressionStream" in window) {
      try {
        const binaryData = Uint8Array.from(atob(compressedData), (c) => c.charCodeAt(0))
        const stream = new DecompressionStream("gzip")
        const writer = stream.writable.getWriter()
        const reader = stream.readable.getReader()

        writer.write(binaryData)
        writer.close()

        const chunks: Uint8Array[] = []
        let done = false

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) chunks.push(value)
        }

        const decompressed = new TextDecoder().decode(
          new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[])),
        )
        return JSON.parse(decompressed)
      } catch (error) {
        console.warn("Decompression failed, returning original data:", error)
        return JSON.parse(compressedData)
      }
    }
    return JSON.parse(compressedData)
  }

  // Preload critical data
  async preloadCriticalData(): Promise<void> {
    const criticalEndpoints = [
      "/api/user/profile",
      "/api/government/status",
      "/api/emergency/contacts",
      "/api/transparency/real-time-data?type=all",
      "/api/federal-programs/data",
    ]

    const preloadPromises = criticalEndpoints.map(async (endpoint) => {
      if (!this.preloadQueue.has(endpoint)) {
        this.preloadQueue.add(endpoint)
        try {
          const response = await fetch(endpoint)
          const data = await response.json()
          await this.cacheData(endpoint, data, 600000) // 10 minute cache
        } catch (error) {
          console.warn(`Preload failed for ${endpoint}:`, error)
        } finally {
          this.preloadQueue.delete(endpoint)
        }
      }
    })

    await Promise.allSettled(preloadPromises)
  }

  // Image optimization
  optimizeImageUrl(url: string, width?: number, height?: number, quality = 80): string {
    if (!url) return url

    const params = new URLSearchParams()
    if (width) params.set("w", width.toString())
    if (height) params.set("h", height.toString())
    params.set("q", quality.toString())
    params.set("f", "webp")

    return `${url}?${params.toString()}`
  }

  // Bundle splitting and lazy loading
  async loadModule(moduleName: string): Promise<any> {
    const cacheKey = `module_${moduleName}`
    const cached = await this.getCachedData(cacheKey)
    if (cached) return cached

    let module
    switch (moduleName) {
      case "government":
        module = await import("../government-apis/government-integration")
        break
      case "emergency":
        module = await import("../emergency/emergency-communication-system")
        break
      case "transparency":
        module = await import("../transparency/deaf-impact-tracker")
        break
      case "federal-programs":
        module = await import("../federal-programs/federal-programs-manager")
        break
      case "naturalization":
        module = await import("../naturalization/naturalization-tracker")
        break
      default:
        throw new Error(`Unknown module: ${moduleName}`)
    }

    await this.cacheData(cacheKey, module, 1800000) // 30 minute cache
    return module
  }

  // Performance monitoring
  measurePerformance(name: string, fn: () => Promise<any>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const startTime = performance.now()

      try {
        const result = await fn()
        const endTime = performance.now()
        const duration = endTime - startTime

        // Log performance metrics
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)

        // Send to analytics if available
        if (typeof window !== "undefined" && "gtag" in window) {
          ;(window as any).gtag("event", "timing_complete", {
            name: name,
            value: Math.round(duration),
          })
        }

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Clear cache when needed
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[]; totalMemory: number } {
    const keys = Array.from(this.cache.keys())
    const totalMemory = keys.reduce((total, key) => {
      const entry = this.cache.get(key)
      return total + (entry ? JSON.stringify(entry).length : 0)
    }, 0)

    return {
      size: this.cache.size,
      keys,
      totalMemory,
    }
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance()
