import { Wifi, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Offline - BLACKPINK Fan App',
  description: 'You are currently offline'
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f1b] to-[#02040a] p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Offline Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-600">
            <Wifi className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">×</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          No internet connection detected. Some features may not be available, 
          but you can still browse cached content.
        </p>

        {/* Available Features */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-8 text-left">
          <h3 className="text-white font-semibold mb-3 text-center">Available Offline</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Browse cached pages
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              View downloaded content
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Access wallet (read-only)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Limited functionality
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Link href="/" className="block">
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
        </div>

        {/* Connection Status */}
        <div className="mt-8 p-3 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-500">
            Connection will be restored automatically when back online
          </p>
        </div>
      </div>
    </div>
  )
}