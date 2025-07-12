"use client"

import { useState, useEffect } from "react"
import { Camera, Check, X, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfileEditForm() {
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=120&width=120&text=User")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"available" | "taken" | "checking" | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState({ username: "", bio: "", profileImage: "" })

  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('blackpink-profile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      const userData = {
        username: profile.username || "BLINK_Fan_01",
        bio: profile.bio || "BLACKPINK forever 💖 Stan since 2016",
        profileImage: profile.profileImage || "/placeholder.svg?height=120&width=120&text=User&bg=e91e63&color=white"
      }
      setUsername(userData.username)
      setBio(userData.bio)
      setProfileImage(userData.profileImage)
      setOriginalData(userData)
    } else {
      const defaultData = {
        username: "BLINK_Fan_01",
        bio: "BLACKPINK forever 💖 Stan since 2016",
        profileImage: "/placeholder.svg?height=120&width=120&text=User&bg=e91e63&color=white"
      }
      setUsername(defaultData.username)
      setBio(defaultData.bio)
      setProfileImage(defaultData.profileImage)
      setOriginalData(defaultData)
    }
  }, [])

  // Check if data has changed
  useEffect(() => {
    const currentData = { username, bio, profileImage }
    const hasChanged = JSON.stringify(currentData) !== JSON.stringify(originalData)
    setHasChanges(hasChanged)
  }, [username, bio, profileImage, originalData])

  // Simulated username availability check
  const checkUsernameAvailability = async (newUsername: string) => {
    if (newUsername === originalData.username) {
      setUsernameStatus(null)
      return
    }

    setIsCheckingUsername(true)
    setUsernameStatus("checking")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate some usernames being taken
    const takenUsernames = ["BlinkQueen", "LisaLover", "RoseFan", "JennieStAN", "admin", "blackpink"]
    const isAvailable = !takenUsernames.includes(newUsername)

    setUsernameStatus(isAvailable ? "available" : "taken")
    setIsCheckingUsername(false)
  }

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername)

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
  }

  const handleImageUpload = () => {
    // Simulate image upload with different avatar styles
    const newImages = [
      "/placeholder.svg?height=120&width=120&text=ME&bg=e91e63&color=white",
      "/placeholder.svg?height=120&width=120&text=🖤&bg=000000&color=white",
      "/placeholder.svg?height=120&width=120&text=💗&bg=ff69b4&color=white",
      "/placeholder.svg?height=120&width=120&text=BP&bg=8b5cf6&color=white",
      "/placeholder.svg?height=120&width=120&text=✨&bg=fbbf24&color=white",
    ]
    const randomImage = newImages[Math.floor(Math.random() * newImages.length)]
    setProfileImage(randomImage)
  }

  const handleSave = () => {
    // Save to localStorage
    const profileData = {
      username,
      bio,
      profileImage,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('blackpink-profile', JSON.stringify(profileData))

    // Update original data
    setOriginalData({ username, bio, profileImage })
    setHasChanges(false)
    setUsernameStatus(null)

    // Show success feedback
    alert("Profile updated successfully! 🎉")
  }

  const handleCancel = () => {
    // Reset to original data
    setUsername(originalData.username)
    setBio(originalData.bio)
    setProfileImage(originalData.profileImage)
    setHasChanges(false)
    setUsernameStatus(null)
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
        return "Checking availability..."
      case "available":
        return "Username available"
      case "taken":
        return "Username already taken"
      default:
        return ""
    }
  }

  const canSave = () => {
    return hasChanges && username.length >= 3 && usernameStatus !== "taken" && !isCheckingUsername
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
            className="rounded-full mx-auto border-4 border-pink-500"
          />
          <button
            onClick={handleImageUpload}
            className="absolute bottom-0 right-0 rounded-full p-2 text-white transition-all hover:scale-110"
            style={{ backgroundColor: config.group.theme.primary }}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">Click the camera icon to change your photo</p>
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
          <span>Describe yourself as a BLACKPINK fan</span>
          <span>{bio.length}/150</span>
        </div>
      </div>

      {/* Save/Cancel buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!canSave()}
          className="flex-1"
          style={{
            backgroundColor: canSave() ? config.group.theme.primary : "#374151",
            color: "white",
          }}
        >
          {isCheckingUsername ? "Checking..." : "Save Changes"}
        </Button>
        {hasChanges && (
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="rounded-lg bg-[#1a1f2c] p-3">
        <p className="text-xs text-gray-400">
          💡 <strong>Tip:</strong> Changes will be saved to your local profile. Your updated information will be visible across the app.
        </p>
      </div>
    </div>
  )
}
