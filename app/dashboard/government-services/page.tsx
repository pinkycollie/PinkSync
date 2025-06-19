"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Building, Fingerprint } from "lucide-react"
import GovernmentAuthPortal from "@/components/government-auth-portal"

export default function GovernmentServicesPage() {
  const { data: session } = useSession()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState<Record<string, boolean>>({})

  const handleServiceSelect = (service: string) => {
    setSelectedService(service)
  }

  const handleAuthenticated = (service: string, credentials: any) => {
    setAuthenticated((prev) => ({
      ...prev,
      [service]: true,
    }))
    console.log(`Authenticated with ${service}`, credentials)
  }

  const renderServiceContent = () => {
    if (!selectedService) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Select a Government Service</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a government service from the options above to access deaf-friendly services and information.
          </p>
        </div>
      )
    }

    if (!authenticated[selectedService]) {
      return (
        <GovernmentAuthPortal
          serviceName={
            selectedService === "ssa"
              ? "Social Security Administration"
              : selectedService === "irs"
                ? "Internal Revenue Service"
                : selectedService === "medicare"
                  ? "Medicare Services"
                  : selectedService === "immigration"
                    ? "Immigration Services"
                    : "Voter Registration"
          }
          serviceDescription={
            selectedService === "ssa"
              ? "Access your Social Security benefits and information"
              : selectedService === "irs"
                ? "Manage your tax information and filings"
                : selectedService === "medicare"
                  ? "Access your Medicare benefits and claims"
                  : selectedService === "immigration"
                    ? "Check immigration application status and information"
                    : "Register to vote and access voting information"
          }
          authMethods={
            selectedService === "ssa" || selectedService === "medicare"
              ? ["login", "id"]
              : selectedService === "irs"
                ? ["login", "id", "biometric"]
                : ["login", "id"]
          }
          onAuthenticated={(credentials) => handleAuthenticated(selectedService, credentials)}
        />
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedService === "ssa"
              ? "Social Security Administration"
              : selectedService === "irs"
                ? "Internal Revenue Service"
                : selectedService === "medicare"
                  ? "Medicare Services"
                  : selectedService === "immigration"
                    ? "Immigration Services"
                    : "Voter Registration"}
          </CardTitle>
          <CardDescription>You are now connected to the government service</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Successfully Connected</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            You are now authenticated with this government service. You can access your information and services.
          </p>
          <Button>Access Services</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Government Services</h2>
        <p className="text-muted-foreground">
          Access government services with deaf-friendly interfaces and sign language support
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Available Services</TabsTrigger>
          <TabsTrigger value="connected">Connected Services</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              title="Social Security"
              description="Access Social Security benefits and information"
              icon={<Shield className="h-5 w-5" />}
              onClick={() => handleServiceSelect("ssa")}
              isSelected={selectedService === "ssa"}
              isConnected={authenticated["ssa"]}
            />

            <ServiceCard
              title="Tax Services"
              description="File taxes and access tax information"
              icon={<FileText className="h-5 w-5" />}
              onClick={() => handleServiceSelect("irs")}
              isSelected={selectedService === "irs"}
              isConnected={authenticated["irs"]}
            />

            <ServiceCard
              title="Medicare"
              description="Access healthcare benefits and claims"
              icon={<Building className="h-5 w-5" />}
              onClick={() => handleServiceSelect("medicare")}
              isSelected={selectedService === "medicare"}
              isConnected={authenticated["medicare"]}
            />

            <ServiceCard
              title="Immigration"
              description="Check application status and information"
              icon={<Fingerprint className="h-5 w-5" />}
              onClick={() => handleServiceSelect("immigration")}
              isSelected={selectedService === "immigration"}
              isConnected={authenticated["immigration"]}
            />

            <ServiceCard
              title="Voter Registration"
              description="Register to vote and access voting information"
              icon={<VoteIcon className="h-5 w-5" />}
              onClick={() => handleServiceSelect("voting")}
              isSelected={selectedService === "voting"}
              isConnected={authenticated["voting"]}
            />
          </div>

          <div className="mt-6">{renderServiceContent()}</div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          {Object.keys(authenticated).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Connected Services</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  You haven't connected to any government services yet. Connect to services to see them here.
                </p>
                <Button onClick={() => document.querySelector('[value="services"]')?.click()}>
                  Browse Available Services
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(authenticated).map(
                ([service, isConnected]) =>
                  isConnected && (
                    <ServiceCard
                      key={service}
                      title={
                        service === "ssa"
                          ? "Social Security"
                          : service === "irs"
                            ? "Tax Services"
                            : service === "medicare"
                              ? "Medicare"
                              : service === "immigration"
                                ? "Immigration"
                                : "Voter Registration"
                      }
                      description="Connected and authenticated"
                      icon={
                        service === "ssa" ? (
                          <Shield className="h-5 w-5" />
                        ) : service === "irs" ? (
                          <FileText className="h-5 w-5" />
                        ) : service === "medicare" ? (
                          <Building className="h-5 w-5" />
                        ) : service === "immigration" ? (
                          <Fingerprint className="h-5 w-5" />
                        ) : (
                          <VoteIcon className="h-5 w-5" />
                        )
                      }
                      onClick={() => handleServiceSelect(service)}
                      isSelected={selectedService === service}
                      isConnected={true}
                    />
                  ),
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  isSelected: boolean
  isConnected: boolean
}

function ServiceCard({ title, description, icon, onClick, isSelected, isConnected }: ServiceCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary" : isConnected ? "ring-1 ring-green-500" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">{description}</div>
        {isConnected && (
          <div className="mt-2 flex items-center text-xs text-green-600">
            <CheckCircleIcon className="mr-1 h-3 w-3" /> Connected
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function VoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </svg>
  )
}
