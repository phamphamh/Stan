"use client"

import { useState } from "react"
import { Coins, Ticket, Mic, Gift, Check, Vote, Users, Clock, Sparkles, Lock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"

const availableRewards = [
  {
    id: "3",
    name: "Exclusive Photocard",
    description: "Receive an unreleased and signed photocard.",
    cost: 500,
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
  const [selectedReward, setSelectedReward] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showLotteryModal, setShowLotteryModal] = useState(false)
  const [selectedVote, setSelectedVote] = useState(null)
  const [participatedRewards, setParticipatedRewards] = useState(new Set())
  const [votedRewards, setVotedRewards] = useState(new Set())

  const handleRedeem = (reward) => {
    if (reward.type === "vote") {
      setSelectedReward(reward)
      setShowVoteModal(true)
    } else if (reward.type === "lottery") {
      setSelectedReward(reward)
      setShowLotteryModal(true)
    } else {
      // Instant reward
      setSelectedReward(reward)
      setIsProcessing(true)
      setTimeout(() => {
        setShowResult(true)
      }, 2000)
    }
  }

  const handleVoteSubmit = (voteOption) => {
    setSelectedVote(voteOption)
    setShowVoteModal(false)
    setIsProcessing(true)

    setTimeout(() => {
      setVotedRewards((prev) => new Set([...prev, selectedReward.id]))
      setShowResult(true)
    }, 1800)
  }

  const handleLotteryJoin = () => {
    setShowLotteryModal(false)
    setIsProcessing(true)

    setTimeout(() => {
      setParticipatedRewards((prev) => new Set([...prev, selectedReward.id]))
      setShowResult(true)
    }, 1800)
  }

  const closeAllModals = () => {
    setIsProcessing(false)
    setShowVoteModal(false)
    setShowLotteryModal(false)
    setShowResult(false)
    setSelectedReward(null)
    setSelectedVote(null)
  }

  const isRewardCompleted = (reward) => {
    if (reward.type === "vote") return votedRewards.has(reward.id)
    if (reward.type === "lottery") return participatedRewards.has(reward.id)
    return false
  }

  const RewardCard = ({ reward, isAvailable = true }) => {
    const isCompleted = isRewardCompleted(reward)

    return (
      <motion.div
        key={reward.id}
        whileHover={{ scale: isAvailable ? 1.02 : 1 }}
        whileTap={{ scale: isAvailable ? 0.98 : 1 }}
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
          {reward.type === "lottery" && (
            <div className="absolute top-1 right-1 rounded bg-blue-500 px-1 py-0.5 text-xs text-white">
              {reward.participants} participants
            </div>
          )}
          {isCompleted && (
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
          disabled={!isAvailable || isCompleted}
          style={{
            backgroundColor: !isAvailable ? "#444" : isCompleted ? "#333" : config.group.theme.primary,
            color: "white",
          }}
          onClick={() => isAvailable && handleRedeem(reward)}
        >
          {!isAvailable ? (
            <>
              <Lock className="mr-1 h-3 w-3" />
              Soon
            </>
          ) : isCompleted ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              {reward.type === "vote" ? "Voted" : reward.type === "lottery" ? "Entered" : "Claimed"}
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

      {/* Vote Modal */}
      <AnimatePresence>
        {showVoteModal && selectedReward && (
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
              className="relative max-w-sm w-full mx-4 rounded-xl p-6 text-center scrollable max-h-[80vh]"
              style={{
                background: `linear-gradient(135deg, ${config.group.theme.primary} 0%, ${config.group.theme.secondary} 100%)`,
              }}
            >
              <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ delay: 0.2 }}>
                <Vote className="h-12 w-12 text-white mx-auto mb-4" />
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">{selectedReward.name}</h3>
              <p className="text-white/80 text-sm mb-6">{selectedReward.description}</p>

              <div className="space-y-3 mb-6">
                <p className="text-white font-semibold text-sm">Choose your option:</p>
                {selectedReward.voteOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVoteSubmit(option)}
                    className="w-full p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-left border border-white/10"
                  >
                    <div className="font-semibold text-white mb-1">{option.name}</div>
                    <div className="text-xs text-white/70">{option.description}</div>
                  </motion.button>
                ))}
              </div>

              <Button
                onClick={closeAllModals}
                variant="ghost"
                className="w-full text-white hover:bg-white/20 border border-white/30"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lottery Modal */}
      <AnimatePresence>
        {showLotteryModal && selectedReward && (
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
              className="relative max-w-sm w-full mx-4 rounded-xl p-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${config.group.theme.primary} 0%, ${config.group.theme.secondary} 100%)`,
              }}
            >
              <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ delay: 0.2 }}>
                <Ticket className="h-12 w-12 text-white mx-auto mb-4" />
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">{selectedReward.name}</h3>
              <p className="text-white/80 text-sm mb-6">{selectedReward.description}</p>

              <div className="space-y-4 mb-6">
                <div className="text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift className="h-5 w-5" />
                    <span className="font-semibold">Prize:</span>
                  </div>
                  <p className="text-sm text-white/90">{selectedReward.prize}</p>
                </div>

                <div className="text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Participants:</span>
                  </div>
                  <p className="text-sm text-white/90">{selectedReward.participants}</p>
                </div>

                <div className="text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Ends:</span>
                  </div>
                  <p className="text-sm text-white/90">{selectedReward.endDate}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleLotteryJoin}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Join Lottery ({selectedReward.cost} tokens)
                </Button>

                <Button
                  onClick={closeAllModals}
                  variant="ghost"
                  className="w-full text-white hover:bg-white/20 border border-white/30"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-white/80 text-sm mb-6">
                {selectedReward.type === "vote" && selectedVote
                  ? `You voted for "${selectedVote.name}"`
                  : selectedReward.type === "lottery"
                  ? `You entered the lottery for "${selectedReward.name}"`
                  : `You claimed "${selectedReward.name}"`}
              </p>

              <Button
                onClick={closeAllModals}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                Great!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
