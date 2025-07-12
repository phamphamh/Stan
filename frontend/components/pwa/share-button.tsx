'use client'

import { useState } from 'react'
import { Share2, Copy, Twitter, Facebook, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function ShareButton({ 
  title = 'BLACKPINK Fan App',
  text = 'Check out this amazing BLACKPINK fan app!',
  url = typeof window !== 'undefined' ? window.location.href : '',
  className = '',
  variant = 'outline',
  size = 'sm'
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)

  const canShare = typeof navigator !== 'undefined' && navigator.share

  const handleNativeShare = async () => {
    if (!canShare) return false

    try {
      setIsSharing(true)
      await navigator.share({
        title,
        text,
        url
      })
      return true
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error)
        toast.error('Sharing failed')
      }
      return false
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Failed to copy link')
    }
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  // If native sharing is available, use it directly
  if (canShare) {
    return (
      <Button
        onClick={handleNativeShare}
        variant={variant}
        size={size}
        className={className}
        disabled={isSharing}
      >
        <Share2 className="h-4 w-4 mr-2" />
        {isSharing ? 'Sharing...' : 'Share'}
      </Button>
    )
  }

  // Fallback to custom share menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToTwitter}>
          <Twitter className="h-4 w-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook}>
          <Facebook className="h-4 w-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook for programmatic sharing
export function useWebShare() {
  const [isSharing, setIsSharing] = useState(false)
  const canShare = typeof navigator !== 'undefined' && navigator.share

  const share = async (data: { title?: string; text?: string; url?: string }) => {
    if (!canShare) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(data.url || window.location.href)
        toast.success('Link copied to clipboard!')
        return true
      } catch (error) {
        toast.error('Failed to share')
        return false
      }
    }

    try {
      setIsSharing(true)
      await navigator.share(data)
      return true
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error)
        toast.error('Sharing failed')
      }
      return false
    } finally {
      setIsSharing(false)
    }
  }

  return { share, isSharing, canShare }
}