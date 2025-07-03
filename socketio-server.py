import asyncio
import socketio
import json
import random
import os
import logging
from datetime import datetime
from aiohttp import web
import aioredis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Socket.IO server with CORS support
sio = socketio.AsyncServer(
    cors_allowed_origins=[
        "https://pinksync.io",
        "https://deafauth.pinksync.io", 
        "https://app.pinksync.io",
        "https://trust.pinksync.io",
        "https://docs.pinksync.io",
        "http://localhost:3000"  # For development
    ],
    async_mode='aiohttp',
    logger=True,
    engineio_logger=True
)

# Create aiohttp app
app = web.Application()
sio.attach(app)

# Server identification
server_id = os.environ.get("K_REVISION", f"pinksync-{random.randint(1000, 9999)}")

# Redis adapter for load balancing (optional but recommended for production)
redis_url = os.environ.get("REDIS_URL")
if redis_url:
    # For load balancing across multiple instances
    redis_manager = socketio.AsyncRedisManager(redis_url)
    sio.manager = redis_manager
    logger.info(f"[{server_id}] Redis adapter configured for load balancing")

# Store connected clients and their metadata
connected_clients = {}

@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    client_ip = environ.get('REMOTE_ADDR', 'unknown')
    user_agent = environ.get('HTTP_USER_AGENT', 'unknown')
    
    # Optional: Authenticate client
    api_key = auth.get('api_key') if auth else None
    user_id = auth.get('user_id') if auth else None
    
    # Store client metadata
    connected_clients[sid] = {
        'connected_at': datetime.utcnow().isoformat(),
        'ip': client_ip,
        'user_agent': user_agent,
        'user_id': user_id,
        'api_key': api_key,
        'server_id': server_id
    }
    
    logger.info(f"[{server_id}] Client {sid} connected from {client_ip} (User: {user_id})")
    
    # Send welcome message
    await sio.emit('connection_established', {
        'message': 'Connected to PinkSync Real-time Engine',
        'server_id': server_id,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'features': ['trust_scoring', 'gesture_recognition', 'deaf_auth', 'fibonrose']
    }, room=sid)
    
    # Join user to appropriate rooms based on their profile
    if user_id:
        await sio.enter_room(sid, f"user_{user_id}")
        
    # Join general PinkSync room
    await sio.enter_room(sid, "pinksync_general")

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    client_info = connected_clients.pop(sid, {})
    logger.info(f"[{server_id}] Client {sid} disconnected (User: {client_info.get('user_id', 'unknown')})")

@sio.event
async def subscribe_to_events(sid, data):
    """Subscribe client to specific event types"""
    event_types = data.get('event_types', [])
    user_id = connected_clients.get(sid, {}).get('user_id')
    
    for event_type in event_types:
        room_name = f"events_{event_type}"
        await sio.enter_room(sid, room_name)
        logger.info(f"[{server_id}] User {user_id} subscribed to {event_type}")
    
    await sio.emit('subscription_confirmed', {
        'subscribed_events': event_types,
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }, room=sid)

@sio.event
async def ping(sid, data):
    """Handle ping from client"""
    await sio.emit('pong', {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'server_id': server_id,
        'latency': data.get('timestamp') if data else None
    }, room=sid)

@sio.event
async def gesture_data(sid, data):
    """Handle incoming gesture data from clients"""
    user_id = connected_clients.get(sid, {}).get('user_id')
    
    # Process gesture data (this would integrate with your AI models)
    processed_gesture = {
        'type': 'gesture_processed',
        'user_id': user_id,
        'gesture_id': data.get('gesture_id'),
        'confidence': random.uniform(0.7, 1.0),
        'recognized_sign': data.get('sign_data', 'unknown'),
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'server_id': server_id
    }
    
    # Emit to gesture recognition subscribers
    await sio.emit('gesture_recognition', processed_gesture, room='events_gesture_recognition')
    
    logger.info(f"[{server_id}] Processed gesture from user {user_id}")

async def generate_pinksync_events():
    """Generate sample PinkSync events"""
    event_types = [
        'trust_score_event',
        'gesture_recognition', 
        'deaf_auth_verification',
        'fibonrose_feedback',
        'api_request_log',
        'user_activity'
    ]
    
    while True:
        try:
            event_type = random.choice(event_types)
            
            event_data = {
                'type': event_type,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'user_id': random.randint(1, 1000),
                'server_id': server_id
            }
            
            # Add type-specific data
            if event_type == 'trust_score_event':
                event_data.update({
                    'score_change': random.randint(-5, 5),
                    'new_score': random.randint(60, 100),
                    'reason': random.choice(['interpreter_rating', 'community_feedback', 'verification'])
                })
            elif event_type == 'gesture_recognition':
                event_data.update({
                    'gesture_id': random.randint(1, 50),
                    'confidence': round(random.uniform(0.7, 1.0), 2),
                    'language': random.choice(['ASL', 'BSL', 'LSF']),
                    'duration_ms': random.randint(500, 3000)
                })
            elif event_type == 'deaf_auth_verification':
                event_data.update({
                    'method': random.choice(['gesture', 'biometric', 'token']),
                    'success': random.choice([True, False]),
                    'attempt_count': random.randint(1, 3)
                })
            elif event_type == 'fibonrose_feedback':
                event_data.update({
                    'rating': random.randint(1, 5),
                    'category': random.choice(['interpreter', 'service', 'accessibility']),
                    'feedback_text': 'Sample feedback text'
                })
            
            # Emit to appropriate rooms
            await sio.emit(event_type, event_data, room=f'events_{event_type}')
            await sio.emit('general_event', event_data, room='pinksync_general')
            
            logger.info(f"[{server_id}] Generated {event_type} event")
            
        except Exception as e:
            logger.error(f"[{server_id}] Error generating events: {e}")
        
        # Wait before next event
        await asyncio.sleep(random.uniform(2, 5))

# Health check endpoint
async def health_check(request):
    """Health check for load balancer"""
    return web.json_response({
        'status': 'healthy',
        'server_id': server_id,
        'connected_clients': len(connected_clients),
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })

# Metrics endpoint
async def metrics(request):
    """Metrics endpoint"""
    return web.json_response({
        'server_id': server_id,
        'connected_clients': len(connected_clients),
        'rooms': list(sio.manager.rooms.keys()) if hasattr(sio.manager, 'rooms') else [],
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })

# Add routes
app.router.add_get('/health', health_check)
app.router.add_get('/metrics', metrics)

# Serve static files (optional)
app.router.add_static('/', path='.', name='static')

async def init_app():
    """Initialize the application"""
    logger.info(f"[{server_id}] Starting PinkSync Socket.IO Server...")
    
    # Start event generator
    asyncio.create_task(generate_pinksync_events())
    
    return app

if __name__ == '__main__':
    # For local development
    web.run_app(init_app(), host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

# For production deployment, use:
# gunicorn --worker-class aiohttp.GunicornWebWorker --workers 1 --bind 0.0.0.0:8080 socketio-server:init_app
