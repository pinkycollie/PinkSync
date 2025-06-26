"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ethers } from "ethers"
import {
  DeafFirstSDK,
  createDeafFirstCity,
  createDeafFirstInitiative,
  type DeafFirstSector,
} from "@/lib/deaf-first-sdk"
import type { SignLanguageType } from "@/types/developer-sign-language"

// Mock addresses for demonstration
const FACTORY_ADDRESS = "0x1234567890123456789012345678901234567890"
const GLOBAL_COLLECTION_ADDRESS = "0x0987654321098765432109876543210987654321"

export function CityInitiativeForm() {
  // Initiative details
  const [initiativeName, setInitiativeName] = useState("")
  const [description, setDescription] = useState("")
  const [sector, setSector] = useState<DeafFirstSector>("Education")

  // City details
  const [cityName, setCityName] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("United States")

  // Partners
  const [partners, setPartners] = useState<{ address: string; role: string }[]>([{ address: "", role: "Founder" }])

  // Sign languages
  const [signLanguages, setSignLanguages] = useState<SignLanguageType[]>(["ASL"])

  // Deployment options
  const [useGlobalCollection, setUseGlobalCollection] = useState(true)

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    collectionAddress?: string
    tokenIds?: number[]
  } | null>(null)

  const addPartner = () => {
    setPartners([...partners, { address: "", role: "Member" }])
  }

  const updatePartner = (index: number, field: "address" | "role", value: string) => {
    const updatedPartners = [...partners]
    updatedPartners[index][field] = value
    setPartners(updatedPartners)
  }

  const removePartner = (index: number) => {
    if (partners.length > 1) {
      const updatedPartners = [...partners]
      updatedPartners.splice(index, 1)
      setPartners(updatedPartners)
    }
  }

  const toggleSignLanguage = (language: SignLanguageType) => {
    if (signLanguages.includes(language)) {
      setSignLanguages(signLanguages.filter((lang) => lang !== language))
    } else {
      setSignLanguages([...signLanguages, language])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      // In a real implementation, you would connect to the user's wallet
      // For this example, we'll use a mock provider and signer
      const provider = new ethers.providers.JsonRpcProvider()
      const signer = provider.getSigner()

      const sdk = new DeafFirstSDK(provider, FACTORY_ADDRESS, GLOBAL_COLLECTION_ADDRESS, signer)

      // Create city and initiative objects
      const city = createDeafFirstCity(cityName, state, country)
      const initiative = createDeafFirstInitiative(
        initiativeName,
        description,
        sector,
        city,
        partners.map((p) => p.role),
        signLanguages,
      )

      // Launch the initiative
      const result = await sdk.launchCityInitiative(
        initiative,
        partners.map((p) => p.address),
        partners.map((p) => p.role),
        useGlobalCollection,
      )

      setResult({
        success: true,
        message: `Successfully launched ${initiativeName} in ${cityName}!`,
        collectionAddress: result.collectionAddress,
        tokenIds: result.tokenIds,
      })
    } catch (error) {
      console.error("Error launching initiative:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-teal-400 text-white">
        <CardTitle className="text-2xl">Launch DEAF FIRST Initiative</CardTitle>
        <CardDescription className="text-white/80">
          Create a new DEAF FIRST initiative for your city or project
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Initiative Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initiativeName">Initiative Name</Label>
                <Input
                  id="initiativeName"
                  value={initiativeName}
                  onChange={(e) => setInitiativeName(e.target.value)}
                  placeholder="DEAF FIRST Education Initiative"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={sector} onValueChange={(value) => setSector(value as DeafFirstSector)}>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Workplace">Workplace</SelectItem>
                    <SelectItem value="Governance">Governance</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the goals and impact of this initiative..."
                rows={3}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">City/Location</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cityName">City Name</Label>
                <Input
                  id="cityName"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sign Languages</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="asl"
                  checked={signLanguages.includes("ASL")}
                  onCheckedChange={() => toggleSignLanguage("ASL")}
                />
                <Label htmlFor="asl">American Sign Language (ASL)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bsl"
                  checked={signLanguages.includes("BSL")}
                  onCheckedChange={() => toggleSignLanguage("BSL")}
                />
                <Label htmlFor="bsl">British Sign Language (BSL)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isl"
                  checked={signLanguages.includes("ISL")}
                  onCheckedChange={() => toggleSignLanguage("ISL")}
                />
                <Label htmlFor="isl">International Sign Language (ISL)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={signLanguages.includes("Other")}
                  onCheckedChange={() => toggleSignLanguage("Other")}
                />
                <Label htmlFor="other">Other Sign Language</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Partners & Stakeholders</h3>
              <Button type="button" variant="outline" size="sm" onClick={addPartner}>
                Add Partner
              </Button>
            </div>

            {partners.map((partner, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 items-end">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`partnerAddress${index}`}>Wallet Address</Label>
                  <Input
                    id={`partnerAddress${index}`}
                    value={partner.address}
                    onChange={(e) => updatePartner(index, "address", e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`partnerRole${index}`}>Role</Label>
                  <Select value={partner.role} onValueChange={(value) => updatePartner(index, "role", value)}>
                    <SelectTrigger id={`partnerRole${index}`}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Founder">Founder</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Advisor">Advisor</SelectItem>
                      <SelectItem value="Community Member">Community Member</SelectItem>
                      <SelectItem value="Sponsor">Sponsor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePartner(index)}
                  disabled={partners.length <= 1}
                  className="h-10 w-10"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Deployment Options</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="useGlobalCollection"
                checked={useGlobalCollection}
                onCheckedChange={(checked) => setUseGlobalCollection(!!checked)}
              />
              <Label htmlFor="useGlobalCollection">
                Use global DEAF FIRST collection (recommended for most initiatives)
              </Label>
            </div>

            {!useGlobalCollection && (
              <div className="pl-6 text-sm text-gray-500">
                A new NFT collection will be deployed specifically for this city/initiative. This requires additional
                gas fees but provides more customization options.
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Launching Initiative..." : "Launch DEAF FIRST Initiative"}
          </Button>
        </form>
      </CardContent>

      {result && (
        <CardFooter className={`bg-${result.success ? "green" : "red"}-50 p-4 rounded-b-lg`}>
          <div className="w-full">
            <h4 className={`font-medium text-${result.success ? "green" : "red"}-700 mb-2`}>
              {result.success ? "Success!" : "Error"}
            </h4>
            <p className="text-gray-700">{result.message}</p>

            {result.success && result.collectionAddress && (
              <div className="mt-2 text-sm">
                <p>
                  <strong>Collection Address:</strong> {result.collectionAddress}
                </p>
                <p>
                  <strong>Token IDs:</strong> {result.tokenIds?.join(", ")}
                </p>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
