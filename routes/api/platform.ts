/**
 * Platform API - Get platform configuration and status
 */

import { platformConfig } from "@/config/platform.config.ts";
import { eventOrchestrator } from "@/services/event-orchestrator/index.ts";
import { ragEngine } from "@/services/rag-engine/index.ts";
import { apiBroker } from "@/services/api-broker/index.ts";
import { pinkFlowEngine } from "@/services/pinkflow/index.ts";
import { workerSystem } from "@/services/workers/index.ts";
import { aslGlosser } from "@/services/asl-glosser/index.ts";
import { vcodeService } from "@/services/vcode/index.ts";
import { interpreterService } from "@/services/interpreters/index.ts";
import { signSpeakService } from "@/services/sign-speak/index.ts";

export const handler = {
  async GET(_req: Request) {
    try {
      const stats = {
        environment: platformConfig.environment,
        features: platformConfig.features,
        services: {
          eventOrchestrator: eventOrchestrator.getStats(),
          ragEngine: ragEngine.getStats(),
          apiBroker: apiBroker.getStats(),
          pinkFlow: pinkFlowEngine.getStats(),
          workers: workerSystem.getStats(),
          aslGlosser: aslGlosser.getStats(),
          vcode: vcodeService.getStats(),
          interpreters: interpreterService.getStats(),
          signSpeak: signSpeakService.getStats(),
        },
        deployment: platformConfig.deployment,
        timestamp: new Date().toISOString(),
      };

      return new Response(JSON.stringify({
        success: true,
        data: stats,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: "PLATFORM_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
