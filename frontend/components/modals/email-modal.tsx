"use client"

import { useState } from "react"
import { X, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function EmailModal({ isOpen, onClose, onSubmit }: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    setIsValidEmail(validateEmail(newEmail))
  }

  const handleSubmit = async () => {
    if (!isValidEmail) return

    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    onSubmit(email)
    setEmail("")
    setIsValidEmail(false)
    setIsSubmitting(false)
    onClose()
  }

  const handleClose = () => {
    setEmail("")
    setIsValidEmail(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-[#1a1f2c] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Contact Information</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-white font-semibold">Reward Claimed Successfully!</span>
          </div>
          <p className="text-gray-400 text-sm">
            Please provide your email address so we can contact you about delivering your exclusive BLACKPINK photocard.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full rounded-lg bg-[#252b3a] border border-gray-700 px-3 py-2 pl-10 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
              placeholder="your.email@example.com"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {email && !isValidEmail && (
            <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidEmail || isSubmitting}
            className="flex-1"
            style={{
              backgroundColor: isValidEmail ? config.group.theme.primary : "#333",
              color: "white",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          We'll contact you within 5-10 business days to arrange delivery.
        </p>
      </div>
    </div>
  )
}