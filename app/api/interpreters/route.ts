/**
 * Interpreter Services API
 */

import { NextRequest, NextResponse } from 'next/server';
import { interpreterService } from '@/services/interpreters';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const interpreterId = searchParams.get('interpreterId');

    if (action === 'stats') {
      const stats = interpreterService.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    if (id) {
      if (searchParams.get('type') === 'booking') {
        const booking = await interpreterService.getBooking(id);
        return NextResponse.json({
          success: !!booking,
          data: booking,
        });
      } else {
        const interpreter = await interpreterService.getInterpreter(id);
        return NextResponse.json({
          success: !!interpreter,
          data: interpreter,
        });
      }
    }

    if (userId) {
      const bookings = await interpreterService.getUserBookings(userId);
      return NextResponse.json({
        success: true,
        data: bookings,
      });
    }

    if (interpreterId) {
      const bookings = await interpreterService.getInterpreterBookings(interpreterId);
      return NextResponse.json({
        success: true,
        data: bookings,
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
        code: 'INTERPRETER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'register') {
      const id = await interpreterService.registerInterpreter(body.interpreter);
      return NextResponse.json({
        success: true,
        data: { interpreterId: id },
      });
    }

    if (action === 'search') {
      const interpreters = await interpreterService.searchInterpreters(body.criteria);
      return NextResponse.json({
        success: true,
        data: interpreters,
      });
    }

    if (action === 'check-availability') {
      const available = await interpreterService.checkAvailability(
        body.interpreterId,
        new Date(body.date),
        body.duration
      );
      return NextResponse.json({
        success: true,
        data: { available },
      });
    }

    if (action === 'book') {
      const bookingId = await interpreterService.createBooking({
        ...body.booking,
        scheduledDate: new Date(body.booking.scheduledDate),
        startTime: new Date(body.booking.startTime),
      });
      return NextResponse.json({
        success: true,
        data: { bookingId },
      });
    }

    if (action === 'confirm') {
      const success = await interpreterService.confirmBooking(body.bookingId, body.interpreterId);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'start') {
      const success = await interpreterService.startBooking(body.bookingId);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'complete') {
      const success = await interpreterService.completeBooking(body.bookingId);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'cancel') {
      const success = await interpreterService.cancelBooking(body.bookingId, body.userId);
      return NextResponse.json({
        success,
      });
    }

    if (action === 'rate') {
      const success = await interpreterService.rateInterpreter(
        body.bookingId,
        body.rating,
        body.feedback
      );
      return NextResponse.json({
        success,
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
        code: 'INTERPRETER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  }
}
