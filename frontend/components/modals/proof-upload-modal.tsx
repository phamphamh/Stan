"use client"

import { useState } from "react"
import { X, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

interface ProofUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  missionTitle: string
}

export default function ProofUploadModal({ isOpen, onClose, onSubmit, missionTitle }: ProofUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    onSubmit()
    onClose()
    setSelectedFile(null)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-[#1a1f2c] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Show the Proof</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            Mission: <span className="font-semibold text-white">{missionTitle}</span>
          </p>
          <p className="text-gray-400 text-xs">
            Upload a photo to prove you completed this mission
          </p>
        </div>

        <div className="mb-6">
          <label className="block">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-white font-medium">Upload Image</p>
                  <p className="text-gray-400 text-sm">JPG, PNG, or other image formats</p>
                </div>
              )}
            </div>
          </label>
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
            disabled={!selectedFile || isSubmitting}
            className="flex-1"
            style={{
              backgroundColor: selectedFile ? config.group.theme.primary : "#333",
              color: "white",
            }}
          >
            {isSubmitting ? "Validating..." : "Validate Mission"}
          </Button>
        </div>
      </div>
    </div>
  )
}