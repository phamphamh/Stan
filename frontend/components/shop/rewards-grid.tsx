"use client"

import { useState } from "react"
import { Coins, Ticket, Mic, Gift, Check, Vote, Users, Clock, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"

const rewards = [
  {
    id: "1",
    name: "Vote: Prochain Titre",
    description: "Votez pour la chanson titre du prochain comeback.",
    cost: 100,
    image: "/placeholder.svg?height=200&width=200&text=Vote",
    icon: Mic,
    type: "vote",
    voteOptions: [
      { id: "song1", name: "Pink Dreams", description: "Une ballade émotionnelle avec des mélodies douces" },
      { id: "song2", name: "Fire Crown", description: "Un titre puissant et énergique qui fait danser" },
      { id: "song3", name: "Midnight Rose", description: "Un concept sombre et mystérieux très stylé" },
      { id: "song4", name: "Diamond Heart", description: "Un hymne d'amour moderne et touchant" },
    ],
  },
  {
    id: "2",
    name: "Loterie Fan Call",
    description: "Tentez de gagner un appel vidéo avec un membre.",
    cost: 250,
    image: "/placeholder.svg?height=200&width=200&text=Fan+Call",
    icon: Ticket,
    type: "lottery",
    participants: 1247,
    endDate: "15 Décembre 2024",
    prize: "Appel vidéo de 5 minutes avec un membre de BLACKPINK",
  },
  {
    id: "3",
    name: "Photocard Exclusive",
    description: "Recevez une photocard inédite et signée.",
    cost: 500,
    image: "/placeholder.svg?height=200&width=200&text=Photocard",
    icon: Gift,
    type: "instant",
  },
  {
    id: "4",
    name: "Vote: Concept Visuel",
    description: "Choisissez le concept du prochain photoshoot.",
    cost: 75,
    image: "/placeholder.svg?height=200&width=200&text=Concept+Vote",
    icon: Vote,
    type: "vote",
    voteOptions: [
      {
        id: "concept1",
        name: "Elegant Royal",
        description: "Concept royal et sophistiqué avec des robes de princesse",
      },
      { id: "concept2", name: "Street Fashion", description: "Style urbain et moderne avec des tenues décontractées" },
      { id: "concept3", name: "Vintage Glam", description: "Glamour rétro des années 90 avec des looks iconiques" },
    ],
  },
  {
    id: "5",
    name: "Loterie Merchandise",
    description: "Gagnez un pack exclusif de goodies BLACKPINK.",
    cost: 150,
    image: "/placeholder.svg?height=200&width=200&text=Merch+Pack",
    icon: Gift,
    type: "lottery",
    participants: 892,
    endDate: "20 Décembre 2024",
    prize: "Pack complet : lightstick, album signé, photocards et poster",
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Récompenses Exclusives</h2>
      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const isCompleted = isRewardCompleted(reward)

          return (
            <motion.div
              key={reward.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-[#1a1f2c] p-3 text-center"
            >
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
                disabled={isCompleted}
                style={{
                  backgroundColor: isCompleted ? "#333" : config.group.theme.primary,
                  color: "white",
                }}
                onClick={() => handleRedeem(reward)}
              >
                {isCompleted ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    {reward.type === "vote" ? "Voté" : reward.type === "lottery" ? "Inscrit" : "Obtenu"}
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
        })}
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
                <p className="text-white font-semibold text-sm">Choisissez votre option :</p>
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

              <Button onClick={closeAllModals} size="sm" className="bg-white/20 hover:bg-white/30">
                Annuler
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
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-sm w-full mx-4 rounded-xl p-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${config.group.theme.primary} 0%, ${config.group.theme.secondary} 100%)`,
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Ticket className="h-16 w-16 text-white mx-auto mb-4" />
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">{selectedReward.name}</h3>
              <p className="text-white/80 text-sm mb-4">{selectedReward.description}</p>

              <div className="bg-white/20 rounded-lg p-4 mb-6 border border-white/10">
                <div className="text-white font-semibold mb-2">🎁 Prix à gagner :</div>
                <div className="text-white/90 text-sm mb-3">{selectedReward.prize}</div>

                <div className="flex items-center justify-between text-white text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{selectedReward.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Fin: {selectedReward.endDate}</span>
                  </div>
                </div>
                <div className="text-xs text-white/70">
                  🍀 Vos chances actuelles : {((1 / selectedReward.participants) * 100).toFixed(2)}%
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleLotteryJoin}
                  className="flex-1 bg-white/20 hover:bg-white/30 border border-white/20"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Participer ({selectedReward.cost} tokens)
                </Button>
                <Button onClick={closeAllModals} size="sm" className="bg-white/10 hover:bg-white/20">
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing & Result Animation */}
      <AnimatePresence>
        {(isProcessing || showResult) && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-80 h-80 rounded-xl p-8 text-center flex flex-col items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${config.group.theme.primary} 0%, ${config.group.theme.secondary} 100%)`,
              }}
            >
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key="processing"
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        scale: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                      }}
                    >
                      {selectedReward.type === "vote" ? (
                        <Vote className="h-20 w-20 text-white" />
                      ) : selectedReward.type === "lottery" ? (
                        <Ticket className="h-20 w-20 text-white" />
                      ) : (
                        <Gift className="h-20 w-20 text-white" />
                      )}
                    </motion.div>
                    <motion.p
                      className="mt-6 font-bold text-white text-lg"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {selectedReward.type === "vote"
                        ? "Enregistrement du vote..."
                        : selectedReward.type === "lottery"
                          ? "Inscription en cours..."
                          : "Traitement en cours..."}
                    </motion.p>
                    <div className="flex gap-1 mt-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    >
                      <Check className="h-20 w-20 text-green-300" />
                    </motion.div>

                    <motion.p
                      className="mt-4 font-bold text-white text-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {selectedReward.type === "vote"
                        ? "Vote enregistré !"
                        : selectedReward.type === "lottery"
                          ? "Inscription réussie !"
                          : "Félicitations !"}
                    </motion.p>

                    <motion.p
                      className="text-sm text-white/90 mt-3 px-4 text-center leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {selectedReward.type === "vote"
                        ? `Votre vote pour "${selectedVote?.name}" a été pris en compte. Merci pour votre participation !`
                        : selectedReward.type === "lottery"
                          ? "Vous participez maintenant à la loterie ! Le tirage aura lieu bientôt. Bonne chance ! 🍀"
                          : "Vous avez obtenu la récompense ! Vérifiez votre inventaire."}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button
                        onClick={closeAllModals}
                        className="mt-6 bg-white/20 hover:bg-white/30 border border-white/20"
                      >
                        Parfait ! ✨
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
