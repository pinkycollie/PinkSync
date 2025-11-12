/**
 * Research API - RAG engine for accessibility research
 */

import { NextRequest, NextResponse } from 'next/server';
import { ragEngine } from '@/services/rag-engine';
import { ResearchType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const query = searchParams.get('query');
    const top = searchParams.get('top');

    if (id) {
      const document = await ragEngine.getDocument(id);
      if (!document) {
        return NextResponse.json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Document not found' },
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: document,
      });
    }

    if (query) {
      const results = await ragEngine.search({
        query,
        topK: top ? parseInt(top) : 10,
        filter: type ? { type: type as ResearchType } : undefined,
        includeMetadata: true,
      });

      return NextResponse.json({
        success: true,
        data: results,
      });
    }

    if (type) {
      const documents = await ragEngine.getDocumentsByType(type as ResearchType);
      return NextResponse.json({
        success: true,
        data: documents,
      });
    }

    // Return top community documents
    const topDocs = await ragEngine.getTopCommunityDocuments(20);
    return NextResponse.json({
      success: true,
      data: topDocs,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'RESEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, document, documentId, increment } = body;

    if (action === 'index' && document) {
      const id = await ragEngine.indexDocument(document);
      return NextResponse.json({
        success: true,
        data: { id },
      });
    }

    if (action === 'vote' && documentId) {
      const success = await ragEngine.voteDocument(documentId, increment || 1);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'recommend' && body.userId) {
      const recommendations = await ragEngine.getRecommendations(
        body.userId,
        body.preferences
      );
      return NextResponse.json({
        success: true,
        data: recommendations,
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
        code: 'RESEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
