"use client"

import React, { useState, useEffect } from 'react';
import { Video, Ear, Hand, Eye, MessageSquare, Users, Shield, Zap, Clock, Globe, ChevronRight, Play, BookOpen, Code, Download, Terminal, CheckCircle, XCircle, AlertCircle, Loader, Send } from 'lucide-react';

// Backend API configuration
const API_BASE_URL = 'https://api.pinksync.ai/v1';

export default function PinkSyncAPIHub() {
  const [selectedAPI, setSelectedAPI] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<Record<string, {status: string, latency: number}>>({});
  const [playgroundCode, setPlaygroundCode] = useState('');
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  
  // Simulated API status check (in production, this would hit your backend)
  useEffect(() => {
    checkAPIStatus();
    const interval = setInterval(checkAPIStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkAPIStatus = async () => {
    // In production: await fetch(`${API_BASE_URL}/status`)
    // Simulated response for demo
    setApiStatus({
      'asl-recognition': { status: 'operational', latency: 87 },
      'video-relay': { status: 'operational', latency: 124 },
      'caption-generation': { status: 'operational', latency: 93 },
      'deaf-auth': { status: 'operational', latency: 65 },
      'haptic-feedback': { status: 'degraded', latency: 234 },
      'visual-alerts': { status: 'operational', latency: 78 },
      'deaf-community': { status: 'operational', latency: 102 },
      'sign-translate': { status: 'operational', latency: 156 },
      'accessibility-check': { status: 'operational', latency: 189 }
    });
  };

  const executePlayground = async () => {
    setPlaygroundLoading(true);
    setPlaygroundResult(null);
    
    try {
      // In production, this would make actual API call
      // const response = await fetch(`${API_BASE_URL}${selectedEndpoint.path}`, {
      //   method: selectedEndpoint.method,
      //   headers: {
      //     'Authorization': `Bearer ${userApiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: selectedEndpoint.method !== 'GET' ? playgroundCode : undefined
      // });
      
      // Simulated response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        success: true,
        data: {
          gesture_detected: "send_money",
          confidence: 0.94,
          timestamp: new Date().toISOString(),
          fibonrose_validated: true
        },
        metadata: {
          latency_ms: 87,
          region: "us-west-2",
          processed_by: "360magician-asl-1"
        }
      };
      
      setPlaygroundResult(mockResponse);
    } catch (error: any) {
      setPlaygroundResult({
        success: false,
        error: error.message
      });
    } finally {
      setPlaygroundLoading(false);
    }
  };
  
  const deafAPIs = [
    {
      id: 'asl-recognition',
      name: 'ASL Recognition API',
      icon: Hand,
      description: 'Real-time American Sign Language gesture recognition and interpretation',
      color: 'from-pink-500 to-rose-500',
      endpoints: [
        { method: 'POST', path: '/asl/detect', desc: 'Detect ASL gestures from video stream' },
        { method: 'POST', path: '/asl/interpret', desc: 'Interpret continuous signing' },
        { method: 'GET', path: '/asl/dictionary', desc: 'Get ASL sign vocabulary' }
      ],
      exampleCode: `// ASL Recognition Example
const response = await fetch('${API_BASE_URL}/asl/detect', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    video_base64: videoFrame,
    detect_continuous: true
  })
});

const result = await response.json();
console.log(result.gesture_detected);`
    },
    {
      id: 'video-relay',
      name: 'Video Relay Service API',
      icon: Video,
      description: 'Connect Deaf users with interpreters for real-time video communication',
      color: 'from-purple-500 to-indigo-500',
      endpoints: [
        { method: 'POST', path: '/vrs/connect', desc: 'Initiate video relay call' },
        { method: 'GET', path: '/vrs/interpreters', desc: 'Get available interpreters' },
        { method: 'POST', path: '/vrs/schedule', desc: 'Schedule interpreter session' }
      ],
      exampleCode: `// Video Relay Service Example
const response = await fetch('${API_BASE_URL}/vrs/connect', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 'user_123',
    language: 'ASL',
    priority: 'standard'
  })
});

const { session_id, interpreter } = await response.json();`
    },
    {
      id: 'caption-generation',
      name: 'Real-Time Captioning API',
      icon: MessageSquare,
      description: 'AI-powered live captions and transcript generation for accessibility',
      color: 'from-blue-500 to-cyan-500',
      endpoints: [
        { method: 'POST', path: '/captions/stream', desc: 'Stream real-time captions' },
        { method: 'GET', path: '/captions/transcript', desc: 'Get full transcript' },
        { method: 'POST', path: '/captions/translate', desc: 'Translate captions to sign language' }
      ],
      exampleCode: `// Real-Time Captioning Example
const ws = new WebSocket('wss://api.pinksync.ai/captions/stream');

ws.onopen = () => {
  ws.send(JSON.stringify({
    api_key: 'YOUR_API_KEY',
    audio_format: 'pcm16',
    language: 'en-US'
  }));
};

ws.onmessage = (event) => {
  const { text, confidence } = JSON.parse(event.data);
  console.log('Caption:', text);
};`
    },
    {
      id: 'deaf-auth',
      name: 'DeafAUTH Identity API',
      icon: Shield,
      description: 'Biometric authentication designed for Deaf users with video verification',
      color: 'from-green-500 to-emerald-500',
      endpoints: [
        { method: 'POST', path: '/auth/verify-video', desc: 'Verify identity via video selfie' },
        { method: 'POST', path: '/auth/biometric', desc: 'Biometric authentication' },
        { method: 'GET', path: '/auth/session', desc: 'Get current session info' }
      ],
      exampleCode: `// DeafAUTH Example
const response = await fetch('${API_BASE_URL}/auth/verify-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    video_selfie_base64: videoData,
    challenge_phrase: 'PinkSync Deaf First',
    sign_challenge: true // User signs the phrase
  })
});

const { verified, trust_score, token } = await response.json();`
    },
    {
      id: 'haptic-feedback',
      name: 'Haptic Notification API',
      icon: Zap,
      description: 'Vibration patterns and haptic alerts as audio alternatives',
      color: 'from-orange-500 to-red-500',
      endpoints: [
        { method: 'POST', path: '/haptic/send', desc: 'Send haptic notification' },
        { method: 'GET', path: '/haptic/patterns', desc: 'Get predefined vibration patterns' },
        { method: 'POST', path: '/haptic/custom', desc: 'Create custom haptic pattern' }
      ],
      exampleCode: `// Haptic Feedback Example
const response = await fetch('${API_BASE_URL}/haptic/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 'user_123',
    pattern: 'payment_received',
    intensity: 'strong'
  })
});`
    },
    {
      id: 'visual-alerts',
      name: 'Visual Alert System API',
      icon: Eye,
      description: 'Flash notifications, color-coded urgency, and visual communication',
      color: 'from-yellow-500 to-amber-500',
      endpoints: [
        { method: 'POST', path: '/alerts/visual', desc: 'Send visual alert' },
        { method: 'GET', path: '/alerts/templates', desc: 'Get alert templates' },
        { method: 'POST', path: '/alerts/schedule', desc: 'Schedule visual notification' }
      ],
      exampleCode: `// Visual Alerts Example
const response = await fetch('${API_BASE_URL}/alerts/visual', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 'user_123',
    type: 'urgent',
    color: '#FF0000',
    flash_pattern: [200, 100, 200, 100, 200]
  })
});`
    },
    {
      id: 'deaf-community',
      name: 'Deaf Community Graph API',
      icon: Users,
      description: 'Social connections, trust scores, and Fibonrose reputation system',
      color: 'from-teal-500 to-cyan-500',
      endpoints: [
        { method: 'GET', path: '/community/users', desc: 'Search Deaf community members' },
        { method: 'POST', path: '/community/trust', desc: 'Submit trust rating' },
        { method: 'GET', path: '/community/reputation', desc: 'Get Fibonrose reputation score' }
      ],
      exampleCode: `// Community Graph Example
const response = await fetch('${API_BASE_URL}/community/reputation?user_id=user_123', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const { trust_score, badges, dao_votes } = await response.json();`
    },
    {
      id: 'sign-translate',
      name: 'Sign Language Translation API',
      icon: Globe,
      description: 'Translate between ASL, BSL, LSF and other sign languages',
      color: 'from-indigo-500 to-purple-500',
      endpoints: [
        { method: 'POST', path: '/translate/sign-to-sign', desc: 'Translate between sign languages' },
        { method: 'POST', path: '/translate/sign-to-text', desc: 'Convert signing to text' },
        { method: 'GET', path: '/translate/languages', desc: 'Get supported sign languages' }
      ],
      exampleCode: `// Sign Translation Example
const response = await fetch('${API_BASE_URL}/translate/sign-to-sign', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source_language: 'ASL',
    target_language: 'BSL',
    video_base64: signingVideo
  })
});`
    },
    {
      id: 'accessibility-check',
      name: 'Accessibility Validator API',
      icon: BookOpen,
      description: 'Scan and validate deaf accessibility compliance for websites and apps',
      color: 'from-rose-500 to-pink-500',
      endpoints: [
        { method: 'POST', path: '/validate/url', desc: 'Validate URL for deaf accessibility' },
        { method: 'GET', path: '/validate/report', desc: 'Get detailed accessibility report' },
        { method: 'POST', path: '/validate/fix-suggestions', desc: 'Get AI-powered fix suggestions' }
      ],
      exampleCode: `// Accessibility Validator Example
const response = await fetch('${API_BASE_URL}/validate/url', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    check_captions: true,
    check_sign_language: true
  })
});`
    }
  ];

  const stats = [
    { label: 'API Endpoints', value: '47+', icon: Code },
    { label: 'Deaf Users Served', value: '15,000+', icon: Users },
    { label: 'Average Latency', value: '<100ms', icon: Clock },
    { label: 'Global Regions', value: '12', icon: Globe }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'operational': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'down': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Loader className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Hand className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                PinkSync
              </h1>
              <p className="text-xs text-gray-400">Deaf & Hard of Hearing API Hub</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#apis" className="hover:text-pink-400 transition">APIs</a>
            <a href="#docs" className="hover:text-pink-400 transition">Documentation</a>
            <a href="#playground" className="hover:text-pink-400 transition">Playground</a>
            <a href="#status" className="hover:text-pink-400 transition">Status</a>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition">
              Get API Key
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm">
          🎥 All APIs operational • Avg latency: 95ms
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
          Build Accessible Apps
          <br />
          with Deaf-First APIs
        </h2>
        
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          PinkSync offers best-in-class APIs designed specifically for the Deaf and Hard of Hearing community.
          From ASL recognition to haptic feedback, we&apos;ve got you covered.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition flex items-center gap-2">
            Get Free API Key <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              const playground = document.getElementById('playground');
              playground?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/5 transition flex items-center gap-2"
          >
            <Play className="w-5 h-5" /> Try Playground
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <Icon className="w-8 h-8 mb-3 text-pink-400 mx-auto" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* API Status Dashboard */}
      <section id="status" className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            Real-Time API Status
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {deafAPIs.map((api) => (
              <div key={api.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{api.name}</span>
                  {getStatusIcon(apiStatus[api.id]?.status)}
                </div>
                <div className="text-xs text-gray-400">
                  {apiStatus[api.id]?.latency ? `${apiStatus[api.id].latency}ms avg` : 'Checking...'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Grid */}
      <section id="apis" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">Deaf-First API Collection</h3>
          <p className="text-gray-400 text-lg">
            Comprehensive APIs designed with accessibility and the Deaf experience in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deafAPIs.map((api) => {
            const Icon = api.icon;
            const status = apiStatus[api.id];
            
            return (
              <div
                key={api.id}
                onClick={() => setSelectedAPI(api)}
                className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-pink-500/50 cursor-pointer transition-all hover:shadow-xl hover:shadow-pink-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center group-hover:scale-110 transition`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  {status && getStatusIcon(status.status)}
                </div>
                
                <h4 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition">
                  {api.name}
                </h4>
                
                <p className="text-gray-400 text-sm mb-4">
                  {api.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {api.endpoints.slice(0, 2).map((endpoint, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded">
                      {endpoint.method} {endpoint.path}
                    </span>
                  ))}
                  {api.endpoints.length > 2 && (
                    <span className="text-xs px-2 py-1 text-pink-400">
                      +{api.endpoints.length - 2} more
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="text-gray-400">View Docs & Try</span>
                  <ChevronRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Playground */}
      <section id="playground" className="max-w-7xl mx-auto px-4 py-20">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-3xl font-bold">Interactive API Playground</h3>
              <p className="text-gray-400">Test PinkSync APIs in real-time without writing code</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Request Panel */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">API Key</label>
                <input
                  type="text"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="Enter your API key or use demo key"
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Select Endpoint</label>
                <select
                  onChange={(e) => {
                    const [apiId, endpointIndex] = e.target.value.split('-');
                    const api = deafAPIs.find(a => a.id === apiId);
                    if (api) {
                      setSelectedEndpoint(api.endpoints[parseInt(endpointIndex)]);
                      setPlaygroundCode(api.exampleCode);
                    }
                  }}
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none"
                >
                  <option value="">Choose an endpoint...</option>
                  {deafAPIs.map(api => (
                    <optgroup key={api.id} label={api.name}>
                      {api.endpoints.map((endpoint, i) => (
                        <option key={i} value={`${api.id}-${i}`}>
                          {endpoint.method} {endpoint.path}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Request Body (JSON)</label>
                <textarea
                  value={playgroundCode}
                  onChange={(e) => setPlaygroundCode(e.target.value)}
                  placeholder='{"video_base64": "...", "detect_continuous": true}'
                  className="w-full h-48 px-4 py-3 bg-black/40 border border-white/20 rounded-lg font-mono text-sm focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={executePlayground}
                disabled={!selectedEndpoint || playgroundLoading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {playgroundLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Request
                  </>
                )}
              </button>
            </div>

            {/* Response Panel */}
            <div>
              <label className="block text-sm font-semibold mb-2">Response</label>
              <div className="h-full min-h-[400px] p-4 bg-black/60 border border-white/20 rounded-lg">
                {playgroundResult ? (
                  <pre className="text-sm text-green-400 font-mono overflow-auto">
                    {JSON.stringify(playgroundResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select an endpoint and send a request to see the response
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Example Code */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
            <Code className="w-12 h-12 mb-4 text-blue-400" />
            <h4 className="text-2xl font-bold mb-3">Example Code</h4>
            <p className="text-gray-400 mb-4">
              Get started instantly with code snippets in JavaScript, Python, Go, Ruby, and more. Copy, paste, and run.
            </p>
            <button className="text-pink-400 hover:text-pink-300 transition flex items-center gap-2">
              Browse Examples <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Documentation */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10">
            <BookOpen className="w-12 h-12 mb-4 text-purple-400" />
            <h4 className="text-2xl font-bold mb-3">Full Documentation</h4>
            <p className="text-gray-400 mb-4">
              Comprehensive guides, API references, and best practices for building accessible applications.
            </p>
            <button className="text-pink-400 hover:text-pink-300 transition flex items-center gap-2">
              Read Docs <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* SDKs */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-white/10">
            <Download className="w-12 h-12 mb-4 text-pink-400" />
            <h4 className="text-2xl font-bold mb-3">SDK Downloads</h4>
            <p className="text-gray-400 mb-4">
              Official SDKs for JavaScript, Python, Ruby, Go, and PHP. Install via npm, pip, or your favorite package manager.
            </p>
            <button className="text-pink-400 hover:text-pink-300 transition flex items-center gap-2">
              Download SDKs <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Hand className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">PinkSync</span>
              </div>
              <p className="text-gray-400 text-sm">
                Building the future of deaf accessibility, one API at a time.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#apis" className="hover:text-pink-400 transition">APIs</a></li>
                <li><a href="#docs" className="hover:text-pink-400 transition">Documentation</a></li>
                <li><a href="#playground" className="hover:text-pink-400 transition">Playground</a></li>
                <li><a href="#status" className="hover:text-pink-400 transition">Status</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-pink-400 transition">Home</a></li>
                <li><a href="/docs/architecture.md" className="hover:text-pink-400 transition">Architecture</a></li>
                <li><a href="https://github.com/pinkycollie/PinkSync" className="hover:text-pink-400 transition">GitHub</a></li>
                <li><a href="/pinksync" className="hover:text-pink-400 transition">Demo</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition">Discord</a></li>
                <li><a href="#" className="hover:text-pink-400 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-pink-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-pink-400 transition">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 PinkSync. Built for and with the deaf community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
