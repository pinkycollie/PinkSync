"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Palette, Type, Clock, Users, Volume2 } from "lucide-react"

export default function AccessibilityGuidelines() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Accessibility Guidelines</h1>
        <p className="text-lg text-gray-600">
          Comprehensive standards for creating accessible content for deaf clients
        </p>
      </div>

      <Tabs defaultValue="visual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="visual">Visual Design</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="asl">ASL Integration</TabsTrigger>
          <TabsTrigger value="captions">Captions</TabsTrigger>
          <TabsTrigger value="pacing">Pacing</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color and Contrast Guidelines
              </CardTitle>
              <CardDescription>
                Ensuring optimal visual accessibility for deaf and hard-of-hearing users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">WCAG AA+ Compliance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black text-white rounded">
                      <span>Primary Text</span>
                      <Badge variant="secondary">21:1 Contrast</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded">
                      <span>Secondary Text</span>
                      <Badge variant="secondary">15:1 Contrast</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-700 text-white rounded">
                      <span>Interactive Elements</span>
                      <Badge variant="secondary">12:1 Contrast</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Color Palette Recommendations</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-16 bg-blue-700 rounded flex items-end p-2">
                      <span className="text-white text-xs">Primary</span>
                    </div>
                    <div className="h-16 bg-green-600 rounded flex items-end p-2">
                      <span className="text-white text-xs">Success</span>
                    </div>
                    <div className="h-16 bg-orange-600 rounded flex items-end p-2">
                      <span className="text-white text-xs">Warning</span>
                    </div>
                    <div className="h-16 bg-red-600 rounded flex items-end p-2">
                      <span className="text-white text-xs">Error</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Avoid using color alone to convey information. Always pair with icons or text.
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Avoid These Color Combinations</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="p-2 bg-red-500 text-green-400 rounded mb-1">Red background + Green text</div>
                    <div className="p-2 bg-blue-400 text-blue-700 rounded">Light blue + Dark blue</div>
                  </div>
                  <div>
                    <div className="p-2 bg-gray-400 text-gray-600 rounded mb-1">Gray on gray combinations</div>
                    <div className="p-2 bg-yellow-300 text-white rounded">Yellow + White text</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography Standards
              </CardTitle>
              <CardDescription>Clear, readable text that supports visual communication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Font Size Requirements</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <div className="text-3xl font-bold mb-1">Headlines</div>
                      <p className="text-sm text-gray-600">Minimum 28px (1.75rem)</p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-xl mb-1">Subheadings</div>
                      <p className="text-sm text-gray-600">Minimum 20px (1.25rem)</p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-base mb-1">Body Text</div>
                      <p className="text-sm text-gray-600">Minimum 16px (1rem)</p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm mb-1">Captions</div>
                      <p className="text-sm text-gray-600">Minimum 14px (0.875rem)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Font Family Guidelines</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="font-sans font-semibold mb-1">✓ Recommended Sans-Serif</div>
                      <p className="text-sm">Arial, Helvetica, Open Sans, Roboto</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <div className="font-serif font-semibold mb-1">✗ Avoid Serif Fonts</div>
                      <p className="text-sm">Times New Roman, Georgia (harder to read)</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <div className="font-mono font-semibold mb-1">✗ Avoid Decorative Fonts</div>
                      <p className="text-sm">Script, cursive, or stylized fonts</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Text Spacing Guidelines</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Line Height:</strong> 1.5x font size minimum
                    <br />
                    <strong>Letter Spacing:</strong> 0.05em for improved readability
                  </div>
                  <div>
                    <strong>Paragraph Spacing:</strong> 1.5x line height
                    <br />
                    <strong>Word Spacing:</strong> Default (avoid condensed text)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asl" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                ASL Integration Standards
              </CardTitle>
              <CardDescription>Best practices for incorporating sign language interpretation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Interpreter Placement Options</h3>
                  <div className="space-y-3">
                    <div className="relative bg-gray-200 h-32 rounded-lg">
                      <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded text-xs">
                        ASL Interpreter
                      </div>
                      <div className="absolute top-2 left-2 text-xs">Bottom Right (Recommended)</div>
                    </div>
                    <div className="relative bg-gray-200 h-32 rounded-lg">
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white p-2 rounded text-xs">
                        ASL Interpreter
                      </div>
                      <div className="absolute top-2 right-2 text-xs">Bottom Left (Alternative)</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Size and Visibility Requirements</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <strong>Minimum Size:</strong> 25% of screen width
                      <br />
                      <strong>Recommended:</strong> 30-35% for optimal visibility
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Background:</strong> High contrast solid color
                      <br />
                      <strong>Border:</strong> 2-3px contrasting border
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Lighting:</strong> Even, front-facing illumination
                      <br />
                      <strong>Clothing:</strong> Solid, contrasting colors
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✓ ASL Quality Checklist</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div>• Interpreter clearly visible throughout video</div>
                    <div>• Hands and facial expressions unobstructed</div>
                    <div>• Consistent lighting on interpreter</div>
                  </div>
                  <div className="space-y-1">
                    <div>• Synchronized with spoken content</div>
                    <div>• Appropriate signing space maintained</div>
                    <div>• Professional, certified interpreter used</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Caption and Transcript Standards
              </CardTitle>
              <CardDescription>Comprehensive captioning for maximum accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Caption Formatting</h3>
                  <div className="bg-black p-4 rounded-lg text-white space-y-2">
                    <div className="bg-black bg-opacity-75 p-2 rounded text-center">
                      [Speaker: Welcome to our training session]
                    </div>
                    <div className="bg-black bg-opacity-75 p-2 rounded text-center">
                      Today we'll learn about workplace rights.
                    </div>
                    <div className="bg-black bg-opacity-75 p-2 rounded text-center">[Sound effect: Phone ringing]</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Font:</strong> Sans-serif, minimum 16px
                    <br />
                    <strong>Background:</strong> Semi-transparent black
                    <br />
                    <strong>Position:</strong> Bottom center, above ASL interpreter
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Content Guidelines</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <strong>✓ Include:</strong>
                      <br />• All spoken words
                      <br />• Speaker identification
                      <br />• Sound effects and music
                      <br />• Emotional context when relevant
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>Timing:</strong>
                      <br />• Maximum 2 lines per caption
                      <br />• 3-7 seconds display time
                      <br />• 1-second gap between captions
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Caption Accuracy Standards</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99%</div>
                    <div>Accuracy Target</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">160</div>
                    <div>Max WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">42</div>
                    <div>Max Characters/Line</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pacing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pacing and Timing Guidelines
              </CardTitle>
              <CardDescription>Optimal timing for visual processing and comprehension</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Content Pacing</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <strong>Introduction:</strong>
                      <br />
                      <span className="text-sm text-gray-600">30-45 seconds for context setting</span>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Main Content:</strong>
                      <br />
                      <span className="text-sm text-gray-600">2-3 minutes per major concept</span>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Conclusion:</strong>
                      <br />
                      <span className="text-sm text-gray-600">30 seconds for summary</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Visual Transitions</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>Scene Changes:</strong>
                      <br />
                      <span className="text-sm">1-2 second fade transitions</span>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <strong>Concept Shifts:</strong>
                      <br />
                      <span className="text-sm">3-5 second pause with visual cue</span>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <strong>Text Appearance:</strong>
                      <br />
                      <span className="text-sm">Gradual fade-in over 0.5 seconds</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Processing Time</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <strong>New Information:</strong>
                      <br />
                      <span className="text-sm text-gray-600">5-7 seconds to process</span>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Complex Concepts:</strong>
                      <br />
                      <span className="text-sm text-gray-600">10-15 seconds with visuals</span>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Action Items:</strong>
                      <br />
                      <span className="text-sm text-gray-600">3-5 seconds per step</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⏱️ Recommended Video Length by Content Type</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Concept Introduction:</strong> 2-3 minutes
                    <br />
                    <strong>Skill Demonstration:</strong> 4-6 minutes
                    <br />
                    <strong>Process Explanation:</strong> 5-8 minutes
                  </div>
                  <div>
                    <strong>Legal Information:</strong> 6-10 minutes
                    <br />
                    <strong>Technology Tutorial:</strong> 8-12 minutes
                    <br />
                    <strong>Complete Training Module:</strong> 15-20 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Accessibility Testing Protocol
              </CardTitle>
              <CardDescription>Comprehensive testing with deaf and hard-of-hearing users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Pre-Release Testing</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <strong>Technical Review:</strong>
                      <br />
                      <span className="text-sm text-gray-600">Caption sync, ASL visibility, contrast ratios</span>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Content Review:</strong>
                      <br />
                      <span className="text-sm text-gray-600">Accuracy, clarity, cultural sensitivity</span>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>User Testing:</strong>
                      <br />
                      <span className="text-sm text-gray-600">5-8 deaf/HoH participants minimum</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Testing Metrics</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <strong>Comprehension Rate:</strong>
                      <br />
                      <span className="text-sm">Target: 90%+ understanding</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>Completion Rate:</strong>
                      <br />
                      <span className="text-sm">Target: 95%+ watch to end</span>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <strong>Satisfaction Score:</strong>
                      <br />
                      <span className="text-sm">Target: 4.5/5 average rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Testing Checklist</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>ASL interpreter clearly visible</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Captions accurately synchronized</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>High contrast maintained throughout</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Visual transitions clear and smooth</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Content comprehensible without audio</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Pacing appropriate for visual processing</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Transcript provided and accurate</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>User feedback incorporated</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
