/**
 * Authentication API
 * Supports both web app and browser extension authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { deafAuthService } from '@/services/deafauth';

/**
 * GET /api/auth/preferences - Get user preferences (for extension)
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'Authorization token required' },
      }, { status: 401 });
    }
    
    // Validate token and get user
    const user = await deafAuthService.validateToken(token);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      }, { status: 401 });
    }
    
    // Return user preferences
    return NextResponse.json({
      success: true,
      preferences: user.preferences,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.profile?.displayName,
      },
    });
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

/**
 * POST /api/auth/* - Handle various auth actions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, credentials, verification, preferences } = body;

    switch (action) {
      case 'login': {
        // For extension compatibility, allow login without verification
        const verificationData = verification || {
          pattern: ['1', '2', '3'],
          type: 'pattern-matching',
        };
        
        const result = await deafAuthService.authenticate(credentials, verificationData);
        return NextResponse.json({
          success: result.success,
          data: result.success ? { user: result.user, token: result.token } : undefined,
          // Extension expects different structure
          user: result.user,
          token: result.token,
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
