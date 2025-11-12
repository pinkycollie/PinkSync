/**
 * ASL Glosser API - Text Simplification
 */

import { NextRequest, NextResponse } from 'next/server';
import { aslGlosser } from '@/services/asl-glosser';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const word = searchParams.get('word');

    if (action === 'stats') {
      const stats = aslGlosser.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    if (id) {
      const simplification = await aslGlosser.getSimplification(id);
      return NextResponse.json({
        success: !!simplification,
        data: simplification,
      });
    }

    if (userId) {
      const simplifications = await aslGlosser.getUserSimplifications(userId);
      return NextResponse.json({
        success: true,
        data: simplifications,
      });
    }

    if (word) {
      const wordSimplification = await aslGlosser.getWordSimplification(word);
      return NextResponse.json({
        success: !!wordSimplification,
        data: wordSimplification,
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
        code: 'GLOSSER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'simplify') {
      const result = await aslGlosser.simplify(body.text, body.userId, {
        targetLevel: body.targetLevel,
        context: body.context,
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
        code: 'GLOSSER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
