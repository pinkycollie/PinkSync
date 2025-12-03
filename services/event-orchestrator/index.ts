/**
 * Event Orchestrator
 * 
 * Central event handling system for PinkSync platform.
 * Manages event routing, processing, and distribution across all services.
 */

import { PlatformEvent, EventType, EventSource } from '@/types/index.ts';

type EventHandler = (event: PlatformEvent) => void | Promise<void>;

class EventOrchestrator {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private globalHandlers: Set<EventHandler> = new Set();
  private eventQueue: PlatformEvent[] = [];
  private processing = false;
  private middleware: ((event: PlatformEvent) => Promise<boolean>)[] = [];

  /**
   * Subscribe to specific event type
   */
  public on(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Subscribe to all events
   */
  public onAll(handler: EventHandler): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  /**
   * Emit an event
   */
  public async emit(
    type: EventType,
    source: EventSource,
    payload: any,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: PlatformEvent = {
      id: this.generateEventId(),
      type,
      source,
      timestamp: new Date(),
      payload,
      userId,
      metadata,
    };

    this.eventQueue.push(event);
    
    if (!this.processing) {
      await this.processQueue();
    }
  }

  /**
   * Add middleware to process events before handlers
   */
  public use(middleware: (event: PlatformEvent) => Promise<boolean>): void {
    this.middleware.push(middleware);
  }

  /**
   * Process event queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.eventQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      
      try {
        // Run middleware
        let shouldContinue = true;
        for (const mw of this.middleware) {
          shouldContinue = await mw(event);
          if (!shouldContinue) break;
        }

        if (!shouldContinue) continue;

        // Dispatch to specific handlers
        const typeHandlers = this.handlers.get(event.type);
        if (typeHandlers) {
          for (const handler of typeHandlers) {
            try {
              await handler(event);
            } catch (error) {
              console.error(`Error in event handler for ${event.type}:`, error);
            }
          }
        }

        // Dispatch to global handlers
        for (const handler of this.globalHandlers) {
          try {
            await handler(event);
          } catch (error) {
            console.error('Error in global event handler:', error);
          }
        }
      } catch (error) {
        console.error('Error processing event:', error);
      }
    }

    this.processing = false;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all handlers (useful for testing)
   */
  public clear(): void {
    this.handlers.clear();
    this.globalHandlers.clear();
    this.eventQueue = [];
    this.middleware = [];
  }

  /**
   * Get event statistics
   */
  public getStats() {
    return {
      handlerCount: Array.from(this.handlers.values()).reduce((sum, set) => sum + set.size, 0),
      globalHandlerCount: this.globalHandlers.size,
      queueLength: this.eventQueue.length,
      middlewareCount: this.middleware.length,
      processing: this.processing,
    };
  }
}

// Singleton instance
export const eventOrchestrator = new EventOrchestrator();

// Convenience functions for common events
export const events = {
  userAuth: (userId: string, source: EventSource, data: any) =>
    eventOrchestrator.emit('user.auth', source, data, userId),

  preferenceUpdate: (userId: string, source: EventSource, preferences: any) =>
    eventOrchestrator.emit('user.preference.update', source, preferences, userId),

  contentTransform: (userId: string | undefined, source: EventSource, content: any) =>
    eventOrchestrator.emit('content.transform', source, content, userId),

  serviceRequest: (userId: string | undefined, source: EventSource, request: any) =>
    eventOrchestrator.emit('service.request', source, request, userId),

  signalReceived: (userId: string | undefined, source: EventSource, signal: any) =>
    eventOrchestrator.emit('signal.received', source, signal, userId),

  notificationTriggered: (userId: string, source: EventSource, notification: any) =>
    eventOrchestrator.emit('notification.triggered', source, notification, userId),

  providerUpdate: (source: EventSource, update: any) =>
    eventOrchestrator.emit('provider.update', source, update),

  communityFeedback: (userId: string | undefined, source: EventSource, feedback: any) =>
    eventOrchestrator.emit('community.feedback', source, feedback, userId),

  researchIndexed: (source: EventSource, research: any) =>
    eventOrchestrator.emit('research.indexed', source, research),

  workerCompleted: (source: EventSource, result: any) =>
    eventOrchestrator.emit('worker.completed', source, result),
};

export default eventOrchestrator;
