"use client"

import { useState } from "react"
import { Hand, Send, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AssistantDemo() {
  const [activeTab, setActiveTab] = useState("asl")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your MBTQ virtual assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])

      // Simulate assistant response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I understand you're looking for information. As a deaf-first virtual assistant, I can help you navigate the MBTQ ecosystem. Would you like me to explain our financial services, insurance options, tax assistance, or development services?",
          },
        ])
      }, 1000)

      setInput("")
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="h-5 w-5" />
          Virtual Assistants (Coming Soon)</CardTitle>
        <CardDescription>
          Experience how our deaf-first virtual assistants works across the MBTQ ecosystem</CardDescription>
      </CardHeader>
      <Tabs defaultValue="asl" onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="asl">ASL Video Interface</TabsTrigger>
            <TabsTrigger value="text">Text Chat</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="asl" className="p-6">
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <div className="flex h-full flex-col items-center justify-center">
              {activeTab === "asl" && (
                <>
                  <Video className="h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-center text-muted-foreground">
                    ASL video interface would appear here, showing a virtual assistant communicating in American Sign
                    Language
                  </p>
                  <Button variant="outline" className="mt-4">
                    Start ASL Conversation
                  </Button>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="text">
          <CardContent className="p-6">
            <div className="h-[300px] space-y-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-3">
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarImage src="/mbtq-abstract.png" alt="Assistant" />
                        <AvatarFallback>VA</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend()
                  }
                }}
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
