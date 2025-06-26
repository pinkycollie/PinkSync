import Link from "next/link"

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-6 md:px-20 border-b border-gray-100">
      <Link href="/" className="text-purple-600 text-xl font-bold">
        VR4Deaf
      </Link>
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/services" className="text-sm text-gray-800 hover:text-purple-600">
          Services
        </Link>
        <Link href="/vr-funding" className="text-sm text-gray-800 hover:text-purple-600">
          VR Funding
        </Link>
        <Link href="/vr-request-guide" className="text-sm text-gray-800 hover:text-purple-600">
          VR Request Guide
        </Link>
        <Link href="/asl-translator" className="text-sm text-gray-800 hover:text-purple-600">
          ASL Translator
        </Link>
        <Link href="/vr-dictionary" className="text-sm text-gray-800 hover:text-purple-600">
          VR Dictionary
        </Link>
        <Link href="/ipe-assistant" className="text-sm text-gray-800 hover:text-purple-600">
          IPE Assistant
        </Link>
        <Link href="/pinksync" className="text-sm text-gray-800 hover:text-purple-600">
          PinkSync AI
        </Link>
        <Link
          href="/get-started"
          className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Get Started
        </Link>
      </nav>
      <div className="md:hidden">{/* Mobile menu button would go here */}</div>
    </header>
  )
}
