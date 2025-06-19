"use client"
import { Card, CardContent } from "@/components/ui/card"

export default function WorkflowDiagram() {
  return (
    <Card className="w-full overflow-auto">
      <CardContent className="p-6">
        <svg width="900" height="500" viewBox="0 0 900 500">
          {/* Background */}
          <rect x="0" y="0" width="900" height="500" fill="#f8fafc" rx="8" />

          {/* Input Processing Stage */}
          <rect x="50" y="80" width="160" height="100" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" rx="8" />
          <text x="130" y="120" textAnchor="middle" fontWeight="bold">
            Input Processing
          </text>
          <text x="130" y="145" textAnchor="middle" fontSize="12">
            Text/Audio Analysis
          </text>
          <text x="130" y="165" textAnchor="middle" fontSize="12">
            Language Detection
          </text>

          {/* Translation Stage */}
          <rect x="270" y="80" width="160" height="100" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8" />
          <text x="350" y="120" textAnchor="middle" fontWeight="bold">
            Translation Engine
          </text>
          <text x="350" y="145" textAnchor="middle" fontSize="12">
            Text to Sign Language
          </text>
          <text x="350" y="165" textAnchor="middle" fontSize="12">
            Semantic Analysis
          </text>

          {/* Avatar Generation Stage */}
          <rect x="490" y="80" width="160" height="100" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="8" />
          <text x="570" y="120" textAnchor="middle" fontWeight="bold">
            Avatar Generation
          </text>
          <text x="570" y="145" textAnchor="middle" fontSize="12">
            3D Model Animation
          </text>
          <text x="570" y="165" textAnchor="middle" fontSize="12">
            Gesture Synthesis
          </text>

          {/* Video Rendering Stage */}
          <rect x="710" y="80" width="160" height="100" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="8" />
          <text x="790" y="120" textAnchor="middle" fontWeight="bold">
            Video Rendering
          </text>
          <text x="790" y="145" textAnchor="middle" fontSize="12">
            Encoding & Optimization
          </text>
          <text x="790" y="165" textAnchor="middle" fontSize="12">
            Quality Assurance
          </text>

          {/* Cloud Services */}
          <rect x="50" y="240" width="160" height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8" />
          <text x="130" y="270" textAnchor="middle" fontWeight="bold">
            Cloud NLP
          </text>
          <text x="130" y="290" textAnchor="middle" fontSize="12">
            Google/Azure NLP APIs
          </text>

          <rect x="270" y="240" width="160" height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8" />
          <text x="350" y="270" textAnchor="middle" fontWeight="bold">
            Translation AI
          </text>
          <text x="350" y="290" textAnchor="middle" fontSize="12">
            Custom ML Models
          </text>

          <rect x="490" y="240" width="160" height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8" />
          <text x="570" y="270" textAnchor="middle" fontWeight="bold">
            3D Rendering
          </text>
          <text x="570" y="290" textAnchor="middle" fontSize="12">
            SignAll/SignGPT APIs
          </text>

          <rect x="710" y="240" width="160" height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8" />
          <text x="790" y="270" textAnchor="middle" fontWeight="bold">
            Media Services
          </text>
          <text x="790" y="290" textAnchor="middle" fontSize="12">
            Cloud Media APIs
          </text>

          {/* Orchestration Layer */}
          <rect x="50" y="380" width="820" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8" />
          <text x="460" y="415" textAnchor="middle" fontWeight="bold">
            Workflow Orchestration (Cloud Functions / Step Functions)
          </text>

          {/* Arrows */}
          {/* Horizontal flow arrows */}
          <path d="M 210 130 L 270 130" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 430 130 L 490 130" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 650 130 L 710 130" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Vertical connection arrows */}
          <path d="M 130 180 L 130 240" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 350 180 L 350 240" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 570 180 L 570 240" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 790 180 L 790 240" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Orchestration connection arrows */}
          <path d="M 130 320 L 130 380" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 350 320 L 350 380" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 570 320 L 570 380" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 790 320 L 790 380" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </CardContent>
    </Card>
  )
}
