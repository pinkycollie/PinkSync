/**
 * DeafAUTH API Routes for Deno Fresh
 * 
 * Example implementation showing how to use DeafAUTH with Deno Fresh
 */

import { HandlerContext } from "$fresh/server.ts";
import { deafAuthService } from "../mod.ts";
import type { AuthCredentials, VisualVerification } from "../types.ts";

/**
 * POST /api/auth/login
 * Authenticate user
 */
export const loginHandler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    const body = await req.json();
    const { credentials, verification } = body as {
      credentials: AuthCredentials;
      verification?: VisualVerification;
    };

    // Use default verification if not provided (for extension compatibility)
    const verificationData = verification || {
      pattern: ['1', '2', '3'],
      type: 'pattern-matching' as const,
    };

    const result = await deafAuthService.authenticate(
      credentials,
      verificationData
    );

    return new Response(
      JSON.stringify({
        success: result.success,
        user: result.user,
        token: result.token,
        error: result.error
          ? { code: 'AUTH_FAILED', message: result.error }
          : undefined,
      }),
      {
        status: result.success ? 200 : 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Configure for your domain
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * GET /api/auth/preferences
 * Get user preferences (for extension)
 */
export const preferencesHandler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'NO_TOKEN', message: 'Authorization token required' },
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate token and get user
    const user = await deafAuthService.validateToken(token);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
          },
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return user preferences
    return new Response(
      JSON.stringify({
        success: true,
        preferences: user.preferences,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.profile?.displayName,
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Configure for your domain
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * POST /api/auth/logout
 * Logout user
 */
export const logoutHandler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    const body = await req.json();
    const { token } = body as { token: string };

    await deafAuthService.logout(token);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * POST /api/auth/register
 * Register new user
 */
export const registerHandler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    const body = await req.json();
    const { credentials, profile } = body;

    const result = await deafAuthService.register(credentials, profile);

    return new Response(
      JSON.stringify({
        success: result.success,
        user: result.user,
        error: result.error
          ? { code: 'REGISTRATION_FAILED', message: result.error }
          : undefined,
      }),
      {
        status: result.success ? 201 : 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * POST /api/auth/update-preferences
 * Update user preferences
 */
export const updatePreferencesHandler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    const body = await req.json();
    const { userId, preferences } = body;

    await deafAuthService.updatePreferences(userId, preferences);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
