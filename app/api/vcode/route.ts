/**
 * vCODE API - Video Digital Proof System
 */

import { NextRequest, NextResponse } from 'next/server';
import { vcodeService } from '@/services/vcode';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (action === 'stats') {
      const stats = vcodeService.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    if (sessionId) {
      if (action === 'verify') {
        const verification = await vcodeService.verifySession(sessionId);
        return NextResponse.json({
          success: true,
          data: verification,
        });
      } else if (action === 'proof') {
        const proof = await vcodeService.getProof(sessionId);
        return NextResponse.json({
          success: !!proof,
          data: proof,
        });
      } else {
        const session = await vcodeService.getSession(sessionId);
        return NextResponse.json({
          success: !!session,
          data: session,
        });
      }
    }

    if (userId) {
      const sessions = await vcodeService.getUserSessions(userId);
      return NextResponse.json({
        success: true,
        data: sessions,
      });
    }

    return NextResponse.json({
      success: false,
      error: { code: 'INVALID_REQUEST', message: 'Missing required parameters' },
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VCODE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'schedule') {
      const sessionId = await vcodeService.scheduleSession(body.session);
      return NextResponse.json({
        success: true,
        data: { sessionId },
      });
    }

    if (action === 'start') {
      const success = await vcodeService.startSession(body.sessionId, body.hostId);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'add-participant') {
      const success = await vcodeService.addParticipant(body.sessionId, body.participant);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'assign-interpreter') {
      const success = await vcodeService.assignInterpreter(body.sessionId, body.interpreter);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'sign') {
      const success = await vcodeService.signSession(body.sessionId, body.userId);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'end') {
      const proof = await vcodeService.endSession(body.sessionId, body.hostId);
      return NextResponse.json({
        success: !!proof,
        data: proof,
      });
    }

    return NextResponse.json({
      success: false,
      error: { code: 'INVALID_ACTION', message: 'Invalid action' },
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VCODE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
