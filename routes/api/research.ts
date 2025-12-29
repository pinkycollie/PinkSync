/**
 * Research API - RAG engine for accessibility research
 */

import { ragEngine } from "@/services/rag-engine/index.ts";
import { ResearchType } from "@/types/index.ts";

export const handler = {
  async GET(req: Request) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const type = url.searchParams.get('type');
      const query = url.searchParams.get('query');
      const top = url.searchParams.get('top');

      if (id) {
        const document = await ragEngine.getDocument(id);
        if (!document) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Document not found' },
          }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: document,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (query) {
        const results = await ragEngine.search({
          query,
          topK: top ? parseInt(top) : 10,
          filter: type ? { type: type as ResearchType } : undefined,
          includeMetadata: true,
        });

        return new Response(JSON.stringify({
          success: true,
          data: results,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (type) {
        const documents = await ragEngine.getDocumentsByType(type as ResearchType);
        return new Response(JSON.stringify({
          success: true,
          data: documents,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Return top community documents
      const topDocs = await ragEngine.getTopCommunityDocuments(20);
      return new Response(JSON.stringify({
        success: true,
        data: topDocs,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'RESEARCH_ERROR',
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
      const { action, document, documentId, increment } = body;

      if (action === 'index' && document) {
        const id = await ragEngine.indexDocument(document);
        return new Response(JSON.stringify({
          success: true,
          data: { id },
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (action === 'vote' && documentId) {
        const success = await ragEngine.voteDocument(documentId, increment || 1);
        return new Response(JSON.stringify({
          success,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (action === 'recommend' && body.userId) {
        const recommendations = await ragEngine.getRecommendations(
          body.userId,
          body.preferences
        );
        return new Response(JSON.stringify({
          success: true,
          data: recommendations,
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
          code: 'RESEARCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
