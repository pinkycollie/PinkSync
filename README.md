# PinkSync - Accessibility Orchestration Platform

PinkSync is a comprehensive Layer 1 accessibility orchestration platform designed specifically for deaf users. It acts as a unified gateway connecting deaf communities with accessible services, products, and programs while providing real-time accessibility enhancements across multiple environments.

## 🎯 Core Concept

PinkSync consists of two primary components working together:

### **DeafAUTH Backend (The Brain)**
- Centralized authentication and preference management
- User profile and accessibility settings storage
- API gateway for service integrations
- Real-time content transformation engine

### **PinkSync Browser Extension (The Hands)**
- Chrome extension that runs on every website
- Automatically applies accessibility preferences
- Enables captions on all video platforms
- Converts audio alerts to visual notifications
- Auto-fills accessibility forms

Together, they provide seamless accessibility:
- **Listens** to events across platforms (web, extension, mobile)
- **Transforms** complex interfaces into deaf-friendly experiences
- **Connects** users with relevant services and providers
- **Learns** from deaf communities to improve accessibility continuously

## 🏗️ Architecture

### Multi-Environment Support
- **Browser Extension**: Popup and content injection
- **Web Application**: Embedded and standalone modes
- **Signal System**: Real-time notifications and alerts
- **Notificator**: Visual notification engine

### Core Systems
1. **Event Orchestrator**: Node-based event listener architecture
2. **DeafAuth**: Visual-first authentication system
3. **RAG Research Center**: Vector database of accessibility research
4. **Background Workers**: AI-powered automation and bots
5. **API Broker**: Unified gateway to partner services
6. **PinkFlow Engine**: Real-time accessibility adjustments

## 🚀 Getting Started

### Backend Setup

#### Prerequisites
- Node.js 18+
- npm or pnpm

#### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Browser Extension Setup

#### For Users

1. Visit Chrome Web Store (coming soon)
2. Search for "PinkSync"
3. Click "Add to Chrome"
4. Sign in with DeafAUTH credentials
5. Enjoy automatic accessibility everywhere!

#### For Developers

```bash
# Extension files are in /extension directory
cd extension

# Load in Chrome
1. Open chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension directory
```

See [extension/README.md](extension/README.md) for detailed instructions.

## 🔧 Configuration

PinkSync supports multiple deployment environments:

- **Standalone**: Full web application
- **Extension**: Browser extension mode
- **Embedded**: Widget integration for third-party sites
- **API**: Headless API mode

See `config/` directory for environment-specific configurations.

## 🌐 Integration with mbtq.dev

PinkSync is designed to work seamlessly with the mbtq.dev ecosystem, providing:
- Unified accessibility layer
- Shared user profiles and preferences
- Cross-platform accessibility enhancements

## 🤝 Partner & Provider Integration

PinkSync connects with various service providers to enhance deaf users' livelihood:
- Vocational rehabilitation services
- Educational resources
- Employment opportunities
- Community services
- Healthcare providers

## 📚 Research & Community

PinkSync maintains a RAG (Retrieval-Augmented Generation) system that:
- Collects research on deaf accessibility
- Aggregates feedback from deaf communities
- Learns from real-world usage patterns
- Improves recommendations over time

## 🔐 Security & Privacy

- Visual-first authentication (deafAuth)
- End-to-end encryption for sensitive data
- Privacy-first data collection
- User-controlled data sharing

## 📖 Documentation

- [Complete Architecture](./docs/architecture-complete.md) - **NEW!** Full system architecture
- [API Gateway](./docs/api-gateway.md) - **NEW!** Extension API documentation
- [Browser Extension](./extension/README.md) - **NEW!** Extension setup and usage
- [Architecture Guide](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing](./docs/contributing.md)

## 🛠️ Development

### Project Structure

```
/app                    - Next.js application pages
/components             - React components
/config                 - Environment configurations
/extension              - Browser extension (NEW!)
  /scripts              - Background worker, content scripts
  /styles               - Extension CSS
  /icons                - Extension icons
  manifest.json         - Extension configuration
/lib                    - Utility libraries
/services               - Business logic and services
  /event-orchestrator   - Event handling system
  /deafauth            - Authentication services
  /rag-engine          - Research and learning system
  /workers             - Background job processors
  /api-broker          - Partner API integrations
  /pinkflow            - Accessibility engine
/public                 - Static assets
/docs                   - Documentation
  architecture-complete.md - Complete system architecture
  api-gateway.md       - API documentation for extension
```

## 🤖 Background Workers

PinkSync uses background workers for:
- Content transformation
- Real-time accessibility analysis
- Provider service matching
- Research data processing
- Community voice aggregation

## 📡 Event System

The event listener architecture processes:
- User interactions
- Content changes
- Provider updates
- Community feedback
- System notifications

## 🎨 Accessibility Features

- Text simplification
- Visual enhancements
- Sign language integration
- Transcription services
- Custom user preferences
- Persistent profiles

## 📄 License

[License information to be added]

## 🙏 Acknowledgments

Built for and with the deaf community to enhance digital accessibility and independence.
