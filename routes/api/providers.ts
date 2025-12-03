/**
 * Providers API - Service provider management and matching
 */

import { apiBroker } from "@/services/api-broker/index.ts";

export const handler = {
  async GET(req: Request) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const type = url.searchParams.get('type');
      const search = url.searchParams.get('search');

      if (id) {
        const provider = apiBroker.getProvider(id);
        if (!provider) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Provider not found' },
          }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: provider,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (search) {
        const results = apiBroker.searchProviders(search, type as any);
        return new Response(JSON.stringify({
          success: true,
          data: results,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (type) {
        const providers = apiBroker.getProvidersByType(type as any);
        return new Response(JSON.stringify({
          success: true,
          data: providers,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Return all providers
      const providers = apiBroker.getAllProviders();
      return new Response(JSON.stringify({
        success: true,
        data: providers,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'PROVIDER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async POST(req: Request) {
    try {
      const body = await req.json();
      const { action, userId, needs } = body;

      if (action === 'match' && userId && needs) {
        const matches = await apiBroker.matchProviders(userId, needs);
        return new Response(JSON.stringify({
          success: true,
          data: matches,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (action === 'call' && body.providerId && body.capability) {
        const result = await apiBroker.callProviderApi(
          body.providerId,
          body.capability,
          body.parameters || {}
        );
        return new Response(JSON.stringify({
          success: true,
          data: result,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_ACTION', message: 'Invalid action' },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'PROVIDER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
