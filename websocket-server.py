import asyncio
import websockets
import json
import random
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Store connected clients
connected_clients = set()

async def generate_sample_events():
    """Generate sample events to send to connected clients"""
    event_types = [
        "trust_score_event",
        "gesture_recognition", 
        "api_request_log",
        "user_login",
        "deaf_auth_verification",
        "fibonrose_feedback"
    ]
    
    while True:
        if connected_clients:
            event_type = random.choice(event_types)
            
            event = {
                "type": event_type,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "userId": random.randint(1, 1000),
                "server": "pinksync-gcp-api"
            }
            
            # Add type-specific data
            if event_type == "trust_score_event":
                event["scoreChange"] = random.randint(-5, 5)
                event["newScore"] = random.randint(60, 100)
            elif event_type == "gesture_recognition":
                event["gestureId"] = random.randint(1, 50)
                event["confidence"] = round(random.uniform(0.7, 1.0), 2)
                event["language"] = random.choice(["ASL", "BSL", "LSF"])
            elif event_type == "deaf_auth_verification":
                event["method"] = random.choice(["gesture", "biometric", "token"])
                event["success"] = random.choice([True, False])
            elif event_type == "fibonrose_feedback":
                event["rating"] = random.randint(1, 5)
                event["category"] = random.choice(["interpreter", "service", "accessibility"])
            
            # Send to all connected clients
            message = json.dumps(event)
            disconnected_clients = set()
            
            for client in connected_clients:
                try:
                    await client.send(message)
                    logger.info(f"Sent {event_type} to client")
                except websockets.exceptions.ConnectionClosed:
                    disconnected_clients.add(client)
                except Exception as e:
                    logger.error(f"Error sending to client: {e}")
                    disconnected_clients.add(client)
            
            # Remove disconnected clients
            connected_clients -= disconnected_clients
        
        # Wait before sending next event
        await asyncio.sleep(random.uniform(1, 4))

async def handle_client(websocket, path):
    """Handle individual client connections"""
    client_address = websocket.remote_address
    logger.info(f"Client connected from {client_address}")
    
    # Add client to connected set
    connected_clients.add(websocket)
    
    try:
        # Send welcome message
        welcome_message = {
            "type": "connection_established",
            "message": "Connected to PinkSync WebSocket Server",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "server": "pinksync-gcp-websocket"
        }
        await websocket.send(json.dumps(welcome_message))
        
        # Listen for messages from client
        async for message in websocket:
            try:
                data = json.loads(message)
                logger.info(f"Received from {client_address}: {data}")
                
                # Echo back or handle specific message types
                if data.get("type") == "connection_init":
                    response = {
                        "type": "connection_ack",
                        "message": f"Welcome {data.get('client', 'unknown')}",
                        "timestamp": datetime.utcnow().isoformat() + "Z"
                    }
                    await websocket.send(json.dumps(response))
                    
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON from {client_address}: {message}")
            except Exception as e:
                logger.error(f"Error handling message from {client_address}: {e}")
                
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client {client_address} disconnected")
    except Exception as e:
        logger.error(f"Error with client {client_address}: {e}")
    finally:
        # Remove client from connected set
        connected_clients.discard(websocket)

async def main():
    """Start the WebSocket server"""
    logger.info("Starting PinkSync WebSocket Server...")
    
    # Start the event generator
    asyncio.create_task(generate_sample_events())
    
    # Start the WebSocket server
    server = await websockets.serve(
        handle_client,
        "0.0.0.0",  # Listen on all interfaces
        8765,       # Port
        ping_interval=20,
        ping_timeout=10
    )
    
    logger.info("WebSocket server started on ws://0.0.0.0:8765")
    logger.info("Ready to accept connections...")
    
    # Keep the server running
    await server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")

# To run this server:
# 1. Install websockets: pip install websockets
# 2. Run: python websocket-server.py
# 3. The server will start on ws://localhost:8765
# 4. Update the WS_URL in your React app to point to this server
