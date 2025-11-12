/**
 * Sign-Speak API - Sign Language Services
 */

import { NextRequest, NextResponse } from 'next/server';
import { signSpeakService } from '@/services/sign-speak';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (action === 'stats') {
      const stats = signSpeakService.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    if (id) {
      const request = await signSpeakService.getRequest(id);
      return NextResponse.json({
        success: !!request,
        data: request,
      });
    }

    if (userId) {
      const requests = await signSpeakService.getUserRequests(userId);
      return NextResponse.json({
        success: true,
        data: requests,
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
        code: 'SIGN_SPEAK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'sign-to-text') {
      const result = await signSpeakService.signToText(body.videoUrl, body.userId, {
        language: body.language,
      });
      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    if (action === 'text-to-sign') {
      const result = await signSpeakService.textToSign(body.text, body.userId, {
        language: body.language,
        context: body.context,
        speed: body.speed,
      });
      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    if (action === 'voice-to-sign') {
      const result = await signSpeakService.voiceToSign(body.audioUrl, body.userId, {
        language: body.language,
        realtime: body.realtime,
      });
      return NextResponse.json({
        success: true,
        data: result,
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
        code: 'SIGN_SPEAK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
