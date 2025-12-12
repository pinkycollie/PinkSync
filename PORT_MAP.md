# MBTQ Platform - Port Allocation

## External Ports (Exposed to Host)
- **80** - HTTP (nginx master)
- **443** - HTTPS (nginx master)

## Internal Ports (Container Network Only)
| Service | Internal Port | Path Route | Description |
|---------|--------------|------------|-------------|
| PinkSync | 3000 | / | Main platform (Next.js) |
| DeafAuth | 8001 | /auth/ | Authentication (Deno) |
| PinkFlow | 8002 | /pinkflow/ | Accessibility testing (FastAPI) |
| PinkFlowAI | 5000 | /ai/ | AI processing (Flask) |
| PinkyAI | 8003 | /pinkyai/ | AI API (Uvicorn) |
| Business Magician | 8080 | /magician/ | Business tools (Node.js) |

## Access Examples
- PinkSync: https://localhost/
- DeafAuth: https://localhost/auth/login
- PinkFlow API: https://localhost/pinkflow/v1/test
- AI Processing: https://localhost/ai/process
- PinkyAI: https://localhost/pinkyai/chat
- Business Magician: https://localhost/magician/tools

## Development Mode
For local development WITHOUT Docker:
- PinkSync: http://localhost:3000
- DeafAuth: http://localhost:8001
- PinkFlow: http://localhost:8002
- PinkFlowAI: http://localhost:5000
- PinkyAI: http://localhost:8003
- Business Magician: http://localhost:8080

## Port Conflict Resolution
This configuration resolves conflicts where multiple services were attempting to use port 8000:
- **DeafAuth**: Changed from 8000 → 8001
- **PinkFlow**: Changed from 8000 → 8002
- **PinkyAI**: Changed from 8000 → 8003

All services now use unique ports internally, and nginx provides a single entry point on ports 80/443.

## Migration Notes
- The old `nginx.conf` has been backed up to `nginx.conf.old`
- Use `nginx-master.conf` for the master configuration
- Use `docker-compose.master.yml` for the complete stack
- Individual services can still be run standalone for development
