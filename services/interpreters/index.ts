/**
 * Interpreter Service
 * 
 * Comprehensive system for booking, managing, and tracking ASL interpreters.
 * Connects deaf users with certified sign language interpreters.
 */

import { events } from '@/services/event-orchestrator/index.ts';

export interface Interpreter {
  id: string;
  name: string;
  email: string;
  phone: string;
  certifications: Certification[];
  specializations: Specialization[];
  languages: string[]; // ASL, BSL, etc.
  rating: number;
  totalBookings: number;
  yearsExperience: number;
  availability: InterpreterAvailability[];
  hourlyRate: number;
  location: Location;
  bio: string;
  photoUrl?: string;
  verified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Certification = 
  | 'RID-CI' // Registry of Interpreters for the Deaf - Certificate of Interpretation
  | 'RID-CT' // Certificate of Transliteration
  | 'RID-CDI' // Certified Deaf Interpreter
  | 'NAD-IV' // National Association of the Deaf - Level IV
  | 'NAD-V'  // Level V
  | 'BEI'    // Board for Evaluation of Interpreters
  | 'state-licensed'
  | 'other';

export type Specialization = 
  | 'medical'
  | 'legal'
  | 'educational'
  | 'mental-health'
  | 'vocational-rehabilitation'
  | 'business'
  | 'religious'
  | 'performing-arts'
  | 'video-relay'
  | 'deaf-blind'
  | 'tactile'
  | 'general';

export interface InterpreterAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
}

export interface Location {
  address?: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  travelRadius: number; // miles
  remoteAvailable: boolean;
}

export interface InterpreterBooking {
  id: string;
  interpreterId: string;
  userId: string;
  status: BookingStatus;
  type: 'in-person' | 'video' | 'vrs'; // Video Relay Service
  scheduledDate: Date;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  location?: string;
  purpose: string;
  specialization: Specialization;
  notes?: string;
  cost: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  vcodeSessionId?: string; // Link to vCODE session
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface InterpreterSearchCriteria {
  specialization?: Specialization;
  certification?: Certification;
  location?: {
    city?: string;
    state?: string;
    maxDistance?: number;
  };
  date?: Date;
  time?: string;
  duration?: number;
  type?: 'in-person' | 'video';
  minRating?: number;
  maxRate?: number;
}

class InterpreterService {
  private interpreters: Map<string, Interpreter> = new Map();
  private bookings: Map<string, InterpreterBooking> = new Map();

  /**
   * Register a new interpreter
   */
  async registerInterpreter(interpreter: Omit<Interpreter, 'id' | 'rating' | 'totalBookings' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = this.generateId('interp');
    const fullInterpreter: Interpreter = {
      id,
      ...interpreter,
      rating: 0,
      totalBookings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.interpreters.set(id, fullInterpreter);

    await events.providerUpdate('api', {
      action: 'interpreter-registered',
      interpreterId: id,
      name: interpreter.name,
    });

    return id;
  }

  /**
   * Search for interpreters
   */
  async searchInterpreters(criteria: InterpreterSearchCriteria): Promise<Interpreter[]> {
    let results = Array.from(this.interpreters.values()).filter(i => i.active && i.verified);

    // Filter by specialization
    if (criteria.specialization) {
      results = results.filter(i => i.specializations.includes(criteria.specialization!));
    }

    // Filter by certification
    if (criteria.certification) {
      results = results.filter(i => i.certifications.includes(criteria.certification!));
    }

    // Filter by location
    if (criteria.location) {
      if (criteria.location.state) {
        results = results.filter(i => i.location.state === criteria.location!.state);
      }
      if (criteria.location.city) {
        results = results.filter(i => i.location.city === criteria.location!.city);
      }
    }

    // Filter by type
    if (criteria.type === 'video') {
      results = results.filter(i => i.location.remoteAvailable);
    }

    // Filter by rating
    if (criteria.minRating) {
      results = results.filter(i => i.rating >= criteria.minRating!);
    }

    // Filter by rate
    if (criteria.maxRate) {
      results = results.filter(i => i.hourlyRate <= criteria.maxRate!);
    }

    // Check availability if date/time provided
    if (criteria.date && criteria.time) {
      results = await this.filterByAvailability(results, criteria.date, criteria.time, criteria.duration || 60);
    }

    // Sort by rating and experience
    results.sort((a, b) => {
      const scoreA = a.rating * 0.7 + a.yearsExperience * 0.3;
      const scoreB = b.rating * 0.7 + b.yearsExperience * 0.3;
      return scoreB - scoreA;
    });

    return results;
  }

  /**
   * Get interpreter by ID
   */
  async getInterpreter(id: string): Promise<Interpreter | null> {
    return this.interpreters.get(id) || null;
  }

  /**
   * Create booking
   */
  async createBooking(booking: Omit<InterpreterBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const interpreter = this.interpreters.get(booking.interpreterId);
    if (!interpreter) {
      throw new Error('Interpreter not found');
    }

    // Check if interpreter is available
    const isAvailable = await this.checkAvailability(
      booking.interpreterId,
      booking.scheduledDate,
      booking.duration
    );

    if (!isAvailable) {
      throw new Error('Interpreter not available at requested time');
    }

    const id = this.generateId('booking');
    const fullBooking: InterpreterBooking = {
      id,
      ...booking,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookings.set(id, fullBooking);

    // Notify interpreter
    await events.notificationTriggered(booking.interpreterId, 'api', {
      type: 'new-booking',
      bookingId: id,
      userId: booking.userId,
    });

    return id;
  }

  /**
   * Confirm booking
   */
  async confirmBooking(bookingId: string, interpreterId: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking || booking.interpreterId !== interpreterId) return false;

    booking.status = 'confirmed';
    booking.updatedAt = new Date();

    // Notify user
    await events.notificationTriggered(booking.userId, 'api', {
      type: 'booking-confirmed',
      bookingId,
    });

    return true;
  }

  /**
   * Start booking session
   */
  async startBooking(bookingId: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking || booking.status !== 'confirmed') return false;

    booking.status = 'in-progress';
    booking.startTime = new Date();
    booking.updatedAt = new Date();

    return true;
  }

  /**
   * Complete booking
   */
  async completeBooking(bookingId: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking || booking.status !== 'in-progress') return false;

    booking.status = 'completed';
    booking.endTime = new Date();
    booking.updatedAt = new Date();

    // Update interpreter stats
    const interpreter = this.interpreters.get(booking.interpreterId);
    if (interpreter) {
      interpreter.totalBookings++;
      interpreter.updatedAt = new Date();
    }

    return true;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking) return false;

    booking.status = 'cancelled';
    booking.updatedAt = new Date();

    // Notify relevant parties
    await events.notificationTriggered(booking.interpreterId, 'api', {
      type: 'booking-cancelled',
      bookingId,
    });

    return true;
  }

  /**
   * Rate interpreter
   */
  async rateInterpreter(bookingId: string, rating: number, feedback?: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking || booking.status !== 'completed') return false;

    booking.rating = rating;
    booking.feedback = feedback;
    booking.updatedAt = new Date();

    // Update interpreter rating
    const interpreter = this.interpreters.get(booking.interpreterId);
    if (interpreter) {
      const totalRatings = Array.from(this.bookings.values())
        .filter(b => b.interpreterId === interpreter.id && b.rating !== undefined);
      
      const avgRating = totalRatings.reduce((sum, b) => sum + (b.rating || 0), 0) / totalRatings.length;
      interpreter.rating = avgRating;
      interpreter.updatedAt = new Date();
    }

    return true;
  }

  /**
   * Get bookings for interpreter
   */
  async getInterpreterBookings(interpreterId: string): Promise<InterpreterBooking[]> {
    return Array.from(this.bookings.values())
      .filter(b => b.interpreterId === interpreterId)
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  }

  /**
   * Get bookings for user
   */
  async getUserBookings(userId: string): Promise<InterpreterBooking[]> {
    return Array.from(this.bookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<InterpreterBooking | null> {
    return this.bookings.get(bookingId) || null;
  }

  /**
   * Check interpreter availability
   */
  async checkAvailability(interpreterId: string, date: Date, duration: number): Promise<boolean> {
    const interpreter = this.interpreters.get(interpreterId);
    if (!interpreter) return false;

    // Check day of week availability
    const dayOfWeek = date.getDay();
    const hasAvailability = interpreter.availability.some(a => a.dayOfWeek === dayOfWeek);
    if (!hasAvailability) return false;

    // Check for conflicting bookings
    const existingBookings = await this.getInterpreterBookings(interpreterId);
    const endTime = new Date(date.getTime() + duration * 60000);

    for (const booking of existingBookings) {
      if (booking.status === 'cancelled') continue;
      
      const bookingEnd = booking.endTime || new Date(booking.startTime.getTime() + booking.duration * 60000);
      
      // Check for overlap
      if (
        (date >= booking.startTime && date < bookingEnd) ||
        (endTime > booking.startTime && endTime <= bookingEnd) ||
        (date <= booking.startTime && endTime >= bookingEnd)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Filter interpreters by availability
   */
  private async filterByAvailability(
    interpreters: Interpreter[],
    date: Date,
    time: string,
    duration: number
  ): Promise<Interpreter[]> {
    const results: Interpreter[] = [];

    for (const interpreter of interpreters) {
      const available = await this.checkAvailability(interpreter.id, date, duration);
      if (available) {
        results.push(interpreter);
      }
    }

    return results;
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get statistics
   */
  getStats() {
    const interpreters = Array.from(this.interpreters.values());
    const bookings = Array.from(this.bookings.values());

    return {
      totalInterpreters: interpreters.length,
      activeInterpreters: interpreters.filter(i => i.active).length,
      verifiedInterpreters: interpreters.filter(i => i.verified).length,
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      averageRating: interpreters.reduce((sum, i) => sum + i.rating, 0) / interpreters.length,
      averageHourlyRate: interpreters.reduce((sum, i) => sum + i.hourlyRate, 0) / interpreters.length,
    };
  }
}

// Singleton instance
export const interpreterService = new InterpreterService();

// Seed with initial data
async function seedInterpreters() {
  await interpreterService.registerInterpreter({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0101',
    certifications: ['RID-CI', 'RID-CT', 'state-licensed'],
    specializations: ['medical', 'legal', 'general'],
    languages: ['ASL'],
    yearsExperience: 12,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' },
    ],
    hourlyRate: 75,
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      travelRadius: 50,
      remoteAvailable: true,
    },
    bio: 'Certified ASL interpreter with 12 years of experience in medical and legal settings.',
    verified: true,
    active: true,
  });

  await interpreterService.registerInterpreter({
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1-555-0102',
    certifications: ['RID-CI', 'NAD-V'],
    specializations: ['educational', 'vocational-rehabilitation', 'business'],
    languages: ['ASL'],
    yearsExperience: 8,
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', timezone: 'America/Los_Angeles' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00', timezone: 'America/Los_Angeles' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00', timezone: 'America/Los_Angeles' },
    ],
    hourlyRate: 65,
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      travelRadius: 30,
      remoteAvailable: true,
    },
    bio: 'Specializing in educational and vocational rehabilitation interpretation.',
    verified: true,
    active: true,
  });
}

// Initialize with seed data
seedInterpreters();

export default interpreterService;
