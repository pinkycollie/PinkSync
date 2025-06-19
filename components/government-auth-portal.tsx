"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Key, Fingerprint, AlertTriangle, CheckCircle } from "lucide-react"
import SignLanguageExplanation from "./sign-language-explanation"

interface AuthenticationProps {
  serviceName: string
  serviceDescription: string
  onAuthenticated: (credentials: any) => void
  authMethods?: Array<"id" | "login" | "biometric">
}

export default function GovernmentAuthPortal({
  serviceName,
  serviceDescription,
  onAuthenticated,
  authMethods = ["login"],
}: AuthenticationProps) {
  const [activeTab, setActiveTab] = useState(authMethods[0])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [showExplanation, setShowExplanation] = useState(false)
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleLogin = async () => {
    setAuthStatus("loading")

    try {
      // In a real implementation, this would connect to the government authentication API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Simulate successful authentication
      setAuthStatus("success")

      // After successful authentication, notify parent component
      setTimeout(() => {
        onAuthenticated({
          method: "login",
          credentials: { username },
        })
      }, 1000)
    } catch (error) {
      setAuthStatus("error")
      setErrorMessage("Authentication failed. Please check your credentials and try again.")
    }
  }

  const handleIdVerification = async () => {
    setAuthStatus("loading")

    try {
      // In a real implementation, this would verify the ID with government systems
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Simulate successful verification
      setAuthStatus("success")

      // After successful verification, notify parent component
      setTimeout(() => {
        onAuthenticated({
          method: "id",
          credentials: { idNumber },
        })
      }, 1000)
    } catch (error) {
      setAuthStatus("error")
      setErrorMessage("ID verification failed. Please ensure your ID number is correct.")
    }
  }

  const handleBiometricAuth = async () => {
    setAuthStatus("loading")

    try {
      // In a real implementation, this would connect to device biometric APIs
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate biometric verification

      // Simulate successful biometric authentication
      setAuthStatus("success")

      // After successful authentication, notify parent component
      setTimeout(() => {
        onAuthenticated({
          method: "biometric",
          credentials: { biometricId: "verified" },
        })
      }, 1000)
    } catch (error) {
      setAuthStatus("error")
      setErrorMessage("Biometric verification failed. Please try again or use another authentication method.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          {serviceName} Authentication
        </CardTitle>
        <CardDescription>{serviceDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-primary"
          >
            {showExplanation ? "Hide explanation" : "Show sign language explanation"}
          </Button>

          {showExplanation && (
            <div className="mt-2 border rounded-lg p-4 bg-muted/50">
              <SignLanguageExplanation
                text={`This is the secure login page for ${serviceName}. You need to verify your identity to access government services. Your information is protected and will only be used for authentication purposes.`}
              />
            </div>
          )}
        </div>

        {authMethods.length > 1 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab as any}>
            <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${authMethods.length}, 1fr)` }}>
              {authMethods.includes("login") && (
                <TabsTrigger value="login">
                  <Key className="h-4 w-4 mr-2" />
                  Login
                </TabsTrigger>
              )}
              {authMethods.includes("id") && (
                <TabsTrigger value="id">
                  <Shield className="h-4 w-4 mr-2" />
                  ID Verification
                </TabsTrigger>
              )}
              {authMethods.includes("biometric") && (
                <TabsTrigger value="biometric">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Biometric
                </TabsTrigger>
              )}
            </TabsList>

            {authMethods.includes("login") && (
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username or Email</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full"
                  disabled={authStatus === "loading" || !username || !password}
                >
                  {authStatus === "loading" ? "Authenticating..." : "Login"}
                </Button>
              </TabsContent>
            )}

            {authMethods.includes("id") && (
              <TabsContent value="id" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="id-number">Government ID Number</Label>
                  <Input
                    id="id-number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter your ID number"
                  />
                </div>
                <Button
                  onClick={handleIdVerification}
                  className="w-full"
                  disabled={authStatus === "loading" || !idNumber}
                >
                  {authStatus === "loading" ? "Verifying..." : "Verify Identity"}
                </Button>
              </TabsContent>
            )}

            {authMethods.includes("biometric") && (
              <TabsContent value="biometric" className="space-y-4 mt-4">
                <div className="flex justify-center p-6">
                  <Fingerprint className="h-24 w-24 text-primary" />
                </div>
                <Button onClick={handleBiometricAuth} className="w-full" disabled={authStatus === "loading"}>
                  {authStatus === "loading" ? "Verifying..." : "Use Biometric Authentication"}
                </Button>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          // If only one auth method is available, don't show tabs
          <div className="space-y-4">
            {authMethods.includes("login") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username or Email</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full"
                  disabled={authStatus === "loading" || !username || !password}
                >
                  {authStatus === "loading" ? "Authenticating..." : "Login"}
                </Button>
              </>
            )}

            {authMethods.includes("id") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="id-number">Government ID Number</Label>
                  <Input
                    id="id-number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter your ID number"
                  />
                </div>
                <Button
                  onClick={handleIdVerification}
                  className="w-full"
                  disabled={authStatus === "loading" || !idNumber}
                >
                  {authStatus === "loading" ? "Verifying..." : "Verify Identity"}
                </Button>
              </>
            )}

            {authMethods.includes("biometric") && (
              <>
                <div className="flex justify-center p-6">
                  <Fingerprint className="h-24 w-24 text-primary" />
                </div>
                <Button onClick={handleBiometricAuth} className="w-full" disabled={authStatus === "loading"}>
                  {authStatus === "loading" ? "Verifying..." : "Use Biometric Authentication"}
                </Button>
              </>
            )}
          </div>
        )}

        {authStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {authStatus === "success" && (
          <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Authentication Successful</AlertTitle>
            <AlertDescription>You have been successfully authenticated. Redirecting to services...</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Secured connection</p>
        <p>Government Official Portal</p>
      </CardFooter>
    </Card>
  )
}
