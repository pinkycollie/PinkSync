/**
 * Content Transformation API
 */

import { pinkFlowEngine } from "@/services/pinkflow/index.ts";
import { workerSystem } from "@/services/workers/index.ts";
import { TransformationType } from "@/types/index.ts";

export const handler = {
  async POST(req: Request) {
    try {
      const body = await req.json();
      const { content, type, userId, preferences, async = false } = body;

      if (!content || !type) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Content and type are required' },
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Validate transformation type
      const validTypes: TransformationType[] = ['simplify', 'visualize', 'transcribe', 'sign-language', 'structure'];
      if (!validTypes.includes(type)) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'INVALID_TYPE', message: 'Invalid transformation type' },
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (async) {
        // Queue as background job
        const jobId = await workerSystem.queueJob('content.simplify', {
          content,
          userId,
          preferences,
        });

        return new Response(JSON.stringify({
          success: true,
          data: {
            jobId,
            status: 'queued',
          },
        }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Process synchronously
        const result = await pinkFlowEngine.transform(content, type, userId, preferences);

        return new Response(JSON.stringify({
          success: true,
          data: result,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'TRANSFORM_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async GET(req: Request) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const userId = url.searchParams.get('userId');

      if (id) {
        const transformation = pinkFlowEngine.getTransformation(id);
        if (!transformation) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Transformation not found' },
          }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: transformation,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (userId) {
        const transformations = pinkFlowEngine.getUserTransformations(userId);
        return new Response(JSON.stringify({
          success: true,
          data: transformations,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_QUERY', message: 'ID or userId required' },
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'QUERY_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
