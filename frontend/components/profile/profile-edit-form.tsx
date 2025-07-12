"use client"

import { useState } from "react"
import { Camera, Check, X, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfileEditForm() {
  const [username, setUsername] = useState(config.user.name)
  const [bio, setBio] = useState("BLINK since 2016 💖 Stan BLACKPINK forever")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=120&width=120&text=User")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"available" | "taken" | "checking" | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Simulated username availability check
  const checkUsernameAvailability = async (newUsername: string) => {
    if (newUsername === config.user.name) {
      setUsernameStatus(null)
      return
    }

    setIsCheckingUsername(true)
    setUsernameStatus("checking")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate some usernames being taken
    const takenUsernames = ["BLINK_Queen", "Jennie_Stan", "Lisa_Lover", "Rose_Fan"]
    const isAvailable = !takenUsernames.includes(newUsername)

    setUsernameStatus(isAvailable ? "available" : "taken")
    setIsCheckingUsername(false)
  }

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername)
    setHasChanges(true)

    // Debounce username check
    const timeoutId = setTimeout(() => {
      if (newUsername.length >= 3) {
        checkUsernameAvailability(newUsername)
      } else {
        setUsernameStatus(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleBioChange = (newBio: string) => {
    setBio(newBio)
    setHasChanges(true)
  }

  const handleImageUpload = () => {
    // Simulate image upload
    const newImages = [
      "/placeholder.svg?height=120&width=120&text=New+1",
      "/placeholder.svg?height=120&width=120&text=New+2",
      "/placeholder.svg?height=120&width=120&text=New+3",
    ]
    const randomImage = newImages[Math.floor(Math.random() * newImages.length)]
    setProfileImage(randomImage)
    setHasChanges(true)
  }

  const handleSave = () => {
    // Simulate save
    setHasChanges(false)
    // Show success message or redirect
  }

  const getUsernameStatusIcon = () => {
    switch (usernameStatus) {
      case "checking":
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
      case "available":
        return <Check className="h-4 w-4 text-green-400" />
      case "taken":
        return <X className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getUsernameStatusText = () => {
    switch (usernameStatus) {
      case "checking":
        return "Checking..."
      case "available":
        return "Username available"
      case "taken":
        return "Username already taken"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="text-center">
        <div className="relative inline-block">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full mx-auto"
          />
          <button
            onClick={handleImageUpload}
            className="absolute bottom-0 right-0 rounded-full p-2 text-white"
            style={{ backgroundColor: config.group.theme.primary }}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">Click the icon to change your photo</p>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Username</label>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className="w-full rounded-lg bg-[#1a1f2c] border border-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
            placeholder="Your username"
            maxLength={20}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{getUsernameStatusIcon()}</div>
        </div>
        <AnimatePresence>
          {usernameStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 text-xs ${
                usernameStatus === "available"
                  ? "text-green-400"
                  : usernameStatus === "taken"
                    ? "text-red-400"
                    : "text-blue-400"
              }`}
            >
              {usernameStatus === "taken" && <AlertCircle className="h-3 w-3" />}
              <span>{getUsernameStatusText()}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-xs text-gray-500">3-20 characters, letters and numbers only</p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => handleBioChange(e.target.value)}
          className="w-full rounded-lg bg-[#1a1f2c] border border-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none resize-none"
          placeholder="Tell us about yourself..."
          rows={3}
          maxLength={150}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Describe your passion for BLACKPINK</span>
          <span>{bio.length}/150</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || usernameStatus === "taken" || isCheckingUsername}
          className="flex-1"
          style={{
            backgroundColor: hasChanges && usernameStatus !== "taken" ? config.group.theme.primary : "#333",
          }}
        >
          {isCheckingUsername ? "Checking..." : "Save"}
        </Button>
        <Button variant="outline" className="px-6 bg-transparent" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
