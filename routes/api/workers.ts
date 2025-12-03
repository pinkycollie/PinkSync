/**
 * Workers API - Background job management
 */

import { workerSystem } from "@/services/workers/index.ts";

export const handler = {
  async GET(req: Request) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const status = url.searchParams.get('status');

      if (id) {
        const job = workerSystem.getJob(id);
        if (!job) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Job not found' },
          }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: job,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (status) {
        const jobs = workerSystem.getJobsByStatus(status as any);
        return new Response(JSON.stringify({
          success: true,
          data: jobs,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Return all jobs
      const jobs = workerSystem.getAllJobs();
      return new Response(JSON.stringify({
        success: true,
        data: jobs,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'WORKER_ERROR',
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
      const { action, type, payload, priority, jobId } = body;

      if (action === 'queue' && type && payload) {
        const id = await workerSystem.queueJob(type, payload, priority);
        return new Response(JSON.stringify({
          success: true,
          data: { jobId: id },
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (action === 'cancel' && jobId) {
        const success = await workerSystem.cancelJob(jobId);
        return new Response(JSON.stringify({
          success,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (action === 'stats') {
        const stats = workerSystem.getStats();
        return new Response(JSON.stringify({
          success: true,
          data: stats,
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
          code: 'WORKER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
