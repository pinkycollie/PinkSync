/**
 * PinkSync Platform Configuration
 * 
 * Multi-environment configuration for PinkSync platform
 * Supports: standalone, extension, embedded, api, signal, notificator
 */

export type PlatformEnvironment = 
  | 'standalone'    // Full web application
  | 'extension'     // Browser extension
  | 'embedded'      // Widget for third-party sites
  | 'api'           // Headless API mode
  | 'signal'        // Signal processing system
  | 'notificator';  // Notification engine

export interface PlatformConfig {
  environment: PlatformEnvironment;
  features: {
    deafAuth: boolean;
    eventOrchestrator: boolean;
    ragEngine: boolean;
    backgroundWorkers: boolean;
    apiBroker: boolean;
    pinkFlow: boolean;
    signalSystem: boolean;
    notificator: boolean;
  };
  services: {
    apiBaseUrl: string;
    ragDatabaseUrl?: string;
    vectorDbUrl?: string;
    workerQueueUrl?: string;
    signalServiceUrl?: string;
  };
  mbtqIntegration: {
    enabled: boolean;
    apiUrl?: string;
    sharedAuth: boolean;
  };
  accessibility: {
    simplifyText: boolean;
    visualEnhancements: boolean;
    signLanguage: boolean;
    transcription: boolean;
    customPreferences: boolean;
  };
  deployment: {
    vercelDisabled: boolean;
    standalone: boolean;
  };
}

const defaultConfig: PlatformConfig = {
  environment: 'standalone',
  features: {
    deafAuth: true,
    eventOrchestrator: true,
    ragEngine: true,
    backgroundWorkers: true,
    apiBroker: true,
    pinkFlow: true,
    signalSystem: true,
    notificator: true,
  },
  services: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    ragDatabaseUrl: process.env.RAG_DATABASE_URL,
    vectorDbUrl: process.env.VECTOR_DB_URL,
    workerQueueUrl: process.env.WORKER_QUEUE_URL,
    signalServiceUrl: process.env.SIGNAL_SERVICE_URL,
  },
  mbtqIntegration: {
    enabled: true,
    apiUrl: process.env.MBTQ_API_URL,
    sharedAuth: true,
  },
  accessibility: {
    simplifyText: true,
    visualEnhancements: true,
    signLanguage: true,
    transcription: true,
    customPreferences: true,
  },
  deployment: {
    vercelDisabled: true,
    standalone: true,
  },
};

/**
 * Get configuration for specific environment
 */
export function getPlatformConfig(environment?: PlatformEnvironment): PlatformConfig {
  const env = environment || (process.env.NEXT_PUBLIC_PLATFORM_ENV as PlatformEnvironment) || 'standalone';
  
  // Environment-specific overrides
  const envConfigs: Partial<Record<PlatformEnvironment, Partial<PlatformConfig>>> = {
    extension: {
      features: {
        ...defaultConfig.features,
        signalSystem: true,
        notificator: true,
      },
    },
    embedded: {
      features: {
        ...defaultConfig.features,
        deafAuth: false, // Use parent site auth
        eventOrchestrator: true,
        pinkFlow: true,
      },
    },
    api: {
      features: {
        ...defaultConfig.features,
        eventOrchestrator: true,
        backgroundWorkers: true,
        apiBroker: true,
      },
    },
    signal: {
      features: {
        ...defaultConfig.features,
        signalSystem: true,
        eventOrchestrator: true,
        notificator: true,
      },
    },
    notificator: {
      features: {
        ...defaultConfig.features,
        notificator: true,
        signalSystem: true,
        eventOrchestrator: true,
      },
    },
  };

  return {
    ...defaultConfig,
    environment: env,
    ...(envConfigs[env] || {}),
  };
}

export const platformConfig = getPlatformConfig();

export default platformConfig;
