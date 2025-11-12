/**
 * Authentication API
 */

import { NextRequest, NextResponse } from 'next/server';
import { deafAuthService } from '@/services/deafauth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, credentials, verification, preferences } = body;

    switch (action) {
      case 'login': {
        const result = await deafAuthService.authenticate(credentials, verification);
        return NextResponse.json({
          success: result.success,
          data: result.success ? { user: result.user, token: result.token } : undefined,
          error: result.error ? { code: 'AUTH_FAILED', message: result.error } : undefined,
        });
      }

      case 'register': {
        const result = await deafAuthService.register(credentials, body.profile);
        return NextResponse.json({
          success: result.success,
          data: result.user,
          error: result.error ? { code: 'REGISTRATION_FAILED', message: result.error } : undefined,
        });
      }

      case 'validate': {
        const user = await deafAuthService.validateToken(body.token);
        return NextResponse.json({
          success: !!user,
          data: user,
        });
      }

      case 'logout': {
        await deafAuthService.logout(body.token);
        return NextResponse.json({
          success: true,
        });
      }

      case 'update-preferences': {
        await deafAuthService.updatePreferences(body.userId, preferences);
        return NextResponse.json({
          success: true,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: { code: 'INVALID_ACTION', message: 'Invalid action' },
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
