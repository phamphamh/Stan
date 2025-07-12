"use client"

import { useState } from "react"
import { Coins, Ticket, Mic, Gift, Check, Vote, Users, Clock, Sparkles, Lock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"
import { useTokens } from "@/lib/tokens-context"
import EmailModal from "@/components/modals/email-modal"

const availableRewards = [
  {
    id: "3",
    name: "Exclusive Photocard",
    description: "Receive an unreleased and signed photocard.",
    cost: 150,
    image: "/placeholder.svg?height=200&width=200&text=Photocard",
    icon: Gift,
    type: "instant",
  },
]

const unavailableRewards = [
  {
    id: "1",
    name: "Vote: Next Title Song",
    description: "Vote for the title song of the next comeback.",
    cost: 100,
    image: "/placeholder.svg?height=200&width=200&text=Vote",
    icon: Mic,
    type: "vote",
    voteOptions: [
      { id: "song1", name: "Pink Dreams", description: "An emotional ballad with sweet melodies" },
      { id: "song2", name: "Fire Crown", description: "A powerful and energetic dance track" },
      { id: "song3", name: "Midnight Rose", description: "A dark and mysterious concept that's very stylish" },
      { id: "song4", name: "Diamond Heart", description: "A modern and touching love anthem" },
    ],
  },
  {
    id: "2",
    name: "Fan Call Lottery",
    description: "Try to win a video call with a member.",
    cost: 250,
    image: "/placeholder.svg?height=200&width=200&text=Fan+Call",
    icon: Ticket,
    type: "lottery",
    participants: 1247,
    endDate: "December 15, 2024",
    prize: "5-minute video call with a BLACKPINK member",
  },
  {
    id: "4",
    name: "Vote: Visual Concept",
    description: "Choose the concept for the next photoshoot.",
    cost: 75,
    image: "/placeholder.svg?height=200&width=200&text=Concept+Vote",
    icon: Vote,
    type: "vote",
    voteOptions: [
      {
        id: "concept1",
        name: "Elegant Royal",
        description: "Royal and sophisticated concept with princess gowns",
      },
      { id: "concept2", name: "Street Fashion", description: "Urban and modern style with casual outfits" },
      { id: "concept3", name: "Vintage Glam", description: "Retro 90s glamour with iconic looks" },
    ],
  },
  {
    id: "5",
    name: "Merchandise Lottery",
    description: "Win an exclusive BLACKPINK goodies pack.",
    cost: 150,
    image: "/placeholder.svg?height=200&width=200&text=Merch+Pack",
    icon: Gift,
    type: "lottery",
    participants: 892,
    endDate: "December 20, 2024",
    prize: "Complete pack: lightstick, signed album, photocards and poster",
  },
]

export default function RewardsGrid() {
  const { tokens, addTokens, addTransaction } = useTokens()
  const [selectedReward, setSelectedReward] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [claimedRewards, setClaimedRewards] = useState(new Set())

  const handleRedeem = (reward) => {
    if (reward.type === "instant" && reward.cost <= tokens) {
      setSelectedReward(reward)
      setIsProcessing(true)

      // Deduct tokens
      addTokens(-reward.cost)

      // Add transaction
      addTransaction({
        type: "Purchase",
        amount: -reward.cost,
        description: `Purchased: ${reward.name}`,
        timestamp: new Date(),
      })

      setTimeout(() => {
        setIsProcessing(false)
        setShowEmailModal(true)
      }, 2000)
    }
  }

  const handleEmailSubmit = (email) => {
    setClaimedRewards(prev => new Set([...prev, selectedReward.id]))
    setShowEmailModal(false)
    setShowResult(true)
  }

  const closeAllModals = () => {
    setIsProcessing(false)
    setShowEmailModal(false)
    setShowResult(false)
    setSelectedReward(null)
  }

  const isRewardClaimed = (reward) => {
    return claimedRewards.has(reward.id)
  }

  const RewardCard = ({ reward, isAvailable = true }) => {
    const isClaimed = isRewardClaimed(reward)
    const canAfford = tokens >= reward.cost
    const isClickable = isAvailable && !isClaimed && canAfford

    return (
      <motion.div
        key={reward.id}
        whileHover={{ scale: isClickable ? 1.02 : 1 }}
        whileTap={{ scale: isClickable ? 0.98 : 1 }}
        className={`rounded-lg bg-[#1a1f2c] p-3 text-center relative ${!isAvailable ? 'opacity-60' : ''}`}
      >
        {!isAvailable && (
          <div className="absolute top-2 right-2 z-10">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
        )}

        <div className="relative mb-2">
          <Image
            src={reward.image || "/placeholder.svg"}
            alt={reward.name}
            width={200}
            height={200}
            className="h-24 w-full rounded object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
            <reward.icon className="h-8 w-8 text-white" />
          </div>
          {isClaimed && (
            <div className="absolute top-1 left-1 rounded-full bg-green-500 p-1">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <h3 className="mb-1 text-sm font-semibold text-white">{reward.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{reward.description}</p>
        <Button
          size="sm"
          className="w-full"
          disabled={!isClickable}
          style={{
            backgroundColor: !isAvailable ? "#444" : isClaimed ? "#333" : !canAfford ? "#666" : config.group.theme.primary,
            color: "white",
          }}
          onClick={() => isClickable && handleRedeem(reward)}
        >
          {!isAvailable ? (
            <>
              <Lock className="mr-1 h-3 w-3" />
              Soon
            </>
          ) : isClaimed ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              Claimed
            </>
          ) : !canAfford ? (
            <>
              <Coins className="mr-1 h-3 w-3" />
              Need {reward.cost - tokens} more
            </>
          ) : (
            <>
              <Coins className="mr-1 h-3 w-3" />
              {reward.cost}
            </>
          )}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Available Rewards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Available Rewards</h2>
        <div className="grid grid-cols-2 gap-4">
          {availableRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} isAvailable={true} />
          ))}
        </div>
      </div>

      {/* Unavailable Rewards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Unavailable Rewards</h2>
        <div className="grid grid-cols-2 gap-4">
          {unavailableRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} isAvailable={false} />
          ))}
        </div>
      </div>

      {/* Processing Modal */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-sm w-full mx-4 rounded-xl p-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${config.group.theme.primary} 0%, ${config.group.theme.secondary} 100%)`,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Sparkles className="h-12 w-12 text-white mx-auto" />
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">Processing...</h3>
              <p className="text-white/80 text-sm">Please wait while we process your reward</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={closeAllModals}
        onSubmit={handleEmailSubmit}
      />

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-sm w-full mx-4 rounded-xl p-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${config.group.theme.primary} 0%, ${config.group.theme.secondary} 100%)`,
              }}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">Perfect!</h3>
              <p className="text-white/80 text-sm mb-6">
                Your exclusive BLACKPINK photocard has been reserved! We'll contact you soon to arrange delivery.
              </p>

              <Button
                onClick={closeAllModals}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                Amazing!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
