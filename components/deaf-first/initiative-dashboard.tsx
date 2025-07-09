"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Mock addresses for demonstration
const FACTORY_ADDRESS = "0x1234567890123456789012345678901234567890"
const GLOBAL_COLLECTION_ADDRESS = "0x0987654321098765432109876543210987654321"

// Mock data for demonstration
const MOCK_COLLECTIONS = [
  {
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "DEAF FIRST NYC",
    city: "New York",
    state: "NY",
    tokenCount: 12,
  },
  {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    name: "DEAF FIRST SF",
    city: "San Francisco",
    state: "CA",
    tokenCount: 8,
  },
  {
    address: "0x7890abcdef1234567890abcdef1234567890abcd",
    name: "DEAF FIRST CHI",
    city: "Chicago",
    state: "IL",
    tokenCount: 5,
  },
]

const MOCK_NFTS = [
  {
    id: 1,
    name: "DEAF FIRST NYC - Education Initiative",
    image: "https://example.com/nft1.png",
    collection: "DEAF FIRST NYC",
    owner: "0xabcd...1234",
    city: {
      name: "New York",
      state: "NY",
      country: "USA",
    },
    initiative: "Education Access Program",
    sector: "Education",
    dateCreated: "2023-05-15T12:00:00Z",
  },
  {
    id: 2,
    name: "DEAF FIRST SF - Healthcare Access",
    image: "https://example.com/nft2.png",
    collection: "DEAF FIRST SF",
    owner: "0xefgh...5678",
    city: {
      name: "San Francisco",
      state: "CA",
      country: "USA",
    },
    initiative: "Hospital Accessibility Project",
    sector: "Healthcare",
    dateCreated: "2023-06-22T15:30:00Z",
  },
]

export function InitiativeDashboard() {
  const [activeTab, setActiveTab] = useState("collections")
  const [collections, setCollections] = useState(MOCK_COLLECTIONS)
  const [nfts, setNfts] = useState(MOCK_NFTS)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Mock function to simulate connecting wallet
  const connectWallet = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, you would connect to the user's wallet
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConnected(true)
      setWalletAddress("0xabcd...1234")
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock function to load collections
  const loadCollections = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, you would fetch from the blockchain
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Data is already set from mock data
    } catch (error) {
      console.error("Error loading collections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock function to load NFTs
  const loadNFTs = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, you would fetch from the blockchain
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Data is already set from mock data
    } catch (error) {
      console.error("Error loading NFTs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      if (activeTab === "collections") {
        loadCollections()
      } else if (activeTab === "nfts") {
        loadNFTs()
      }
    }
  }, [isConnected, activeTab])

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-teal-400 text-white">
        <CardTitle className="text-2xl">DEAF FIRST Initiatives Dashboard</CardTitle>
        <CardDescription className="text-white/80">
          Explore DEAF FIRST initiatives across cities and sectors
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-4">Connect your wallet to view initiatives</h3>
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500"
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Connected: {walletAddress}</p>
              <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                Disconnect
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="collections">City Collections</TabsTrigger>
                <TabsTrigger value="nfts">My Initiatives</TabsTrigger>
              </TabsList>

              <TabsContent value="collections" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((collection, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-pink-500 to-teal-400"></div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{collection.name}</h3>
                        <p className="text-sm text-gray-500">
                          {collection.city}, {collection.state}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm">{collection.tokenCount} initiatives</span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="nfts" className="pt-4">
                <div className="space-y-4">
                  {nfts.map((nft, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 bg-gray-100 flex items-center justify-center p-4">
                          <div className="aspect-square w-full max-w-[150px] bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                            NFT Image
                          </div>
                        </div>
                        <div className="p-4 w-full md:w-3/4">
                          <h3 className="font-medium text-lg">{nft.name}</h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">City</p>
                              <p className="text-sm">
                                {nft.city.name}, {nft.city.state}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Sector</p>
                              <p className="text-sm">{nft.sector}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Initiative</p>
                              <p className="text-sm">{nft.initiative}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Created</p>
                              <p className="text-sm">{new Date(nft.dateCreated).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" className="mr-2">
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500"
                            >
                              View on Chain
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
