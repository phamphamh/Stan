'use client'

import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Periodic connectivity check
    const checkConnection = async () => {
      try {
        await fetch('/api/ping', { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        if (!isOnline) {
          setIsOnline(true)
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 3000)
        }
      } catch {
        if (isOnline) {
          setIsOnline(false)
          setShowNotification(true)
        }
      }
    }

    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [isOnline])

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className={`rounded-lg p-3 shadow-lg border ${
            isOnline 
              ? 'bg-green-600 border-green-500' 
              : 'bg-red-600 border-red-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-white" />
                ) : (
                  <WifiOff className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {isOnline ? 'Back Online!' : 'You\'re Offline'}
                </p>
                <p className="text-xs text-white/80">
                  {isOnline 
                    ? 'All features are now available' 
                    : 'Some features may be limited'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to use offline status in components
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}