/**
 * Authentication API
 */

import { deafAuthService } from "@/services/deafauth/index.ts";

export const handler = {
  async POST(req: Request) {
    try {
      const body = await req.json();
      const { action, credentials, verification, preferences } = body;

      switch (action) {
        case 'login': {
          const result = await deafAuthService.authenticate(credentials, verification);
          return new Response(JSON.stringify({
            success: result.success,
            data: result.success ? { user: result.user, token: result.token } : undefined,
            error: result.error ? { code: 'AUTH_FAILED', message: result.error } : undefined,
          }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        case 'register': {
          const result = await deafAuthService.register(credentials, body.profile);
          return new Response(JSON.stringify({
            success: result.success,
            data: result.user,
            error: result.error ? { code: 'REGISTRATION_FAILED', message: result.error } : undefined,
          }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        case 'validate': {
          const user = await deafAuthService.validateToken(body.token);
          return new Response(JSON.stringify({
            success: !!user,
            data: user,
          }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        case 'logout': {
          await deafAuthService.logout(body.token);
          return new Response(JSON.stringify({
            success: true,
          }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        case 'update-preferences': {
          await deafAuthService.updatePreferences(body.userId, preferences);
          return new Response(JSON.stringify({
            success: true,
          }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        default:
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'INVALID_ACTION', message: 'Invalid action' },
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
