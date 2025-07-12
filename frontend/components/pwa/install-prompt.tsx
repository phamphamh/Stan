'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isIOSStandalone = isIOS && (window.navigator as any).standalone
      
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    checkInstalled()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(beforeInstallPromptEvent)
      
      // Show prompt after a delay (better UX)
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Error during installation:', error)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true')
  }

  // Don't show if already installed or dismissed
  if (isInstalled || sessionStorage.getItem('installPromptDismissed')) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 p-4 shadow-2xl border border-pink-500/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">
                    Install BLACKPINK App
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    Get quick access from your home screen
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 bg-white text-pink-600 hover:bg-gray-100 font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// iOS Safari specific install instructions
export function IOSInstallPrompt() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isIOSStandalone = isIOS && (window.navigator as any).standalone
    const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(navigator.userAgent)
    
    if (isIOSSafari && !isIOSStandalone && !sessionStorage.getItem('iosInstallPromptDismissed')) {
      setTimeout(() => setShowIOSPrompt(true), 5000)
    }
  }, [])

  if (!showIOSPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
      >
        <div className="rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 p-4 shadow-2xl border border-pink-500/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  Add to Home Screen
                </h3>
                <p className="text-xs text-white/80">
                  Install BLACKPINK App
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowIOSPrompt(false)
                sessionStorage.setItem('iosInstallPromptDismissed', 'true')
              }}
              className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-white/90 space-y-2">
            <p>To install this app:</p>
            <ol className="list-decimal list-inside space-y-1 text-white/80">
              <li>Tap the Share button in Safari</li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
          
          <Button
            onClick={() => {
              setShowIOSPrompt(false)
              sessionStorage.setItem('iosInstallPromptDismissed', 'true')
            }}
            size="sm"
            className="w-full mt-4 bg-white text-pink-600 hover:bg-gray-100 font-medium"
          >
            Got it!
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}