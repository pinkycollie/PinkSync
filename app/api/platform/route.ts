/**
 * Platform API - Get platform configuration and status
 */

import { NextResponse } from 'next/server';
import { platformConfig } from '@/config/platform.config';
import { eventOrchestrator } from '@/services/event-orchestrator';
import { deafAuthService } from '@/services/deafauth';
import { ragEngine } from '@/services/rag-engine';
import { apiBroker } from '@/services/api-broker';
import { pinkFlowEngine } from '@/services/pinkflow';
import { workerSystem } from '@/services/workers';

export async function GET() {
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
      },
      deployment: platformConfig.deployment,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'PLATFORM_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
