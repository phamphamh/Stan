"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarCheck2, Gift, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import Image from "next/image"
import type { EventItem } from "@/lib/types"

const blackpinkEvent: EventItem = {
  id: "1",
  title: "BORN PINK Encore",
  description: "Participez aux missions pour gagner des tickets !",
  progress: 4,
  maxProgress: 7,
  reward: "Tickets pour le concert",
  endDate: "2025-08-26",
}

export default function EventCard() {
  const { group } = config
  const event = blackpinkEvent
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-xl p-6 relative min-h-[160px]" // 🎯 TAILLE DE LA BOX - Changez min-h-[160px] pour ajuster la hauteur
      style={{
        background: `linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #be185d 100%)`,
      }}
    >
      {/* Sunburst Pattern Background */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 75% 25%, 
              transparent 20%, 
              rgba(255,255,255,0.1) 20.5%, 
              rgba(255,255,255,0.1) 21%, 
              transparent 21.5%),
            conic-gradient(from 0deg at 75% 25%, 
              transparent 0deg, 
              rgba(255,255,255,0.08) 10deg, 
              transparent 20deg, 
              rgba(255,255,255,0.08) 30deg, 
              transparent 40deg, 
              rgba(255,255,255,0.08) 50deg, 
              transparent 60deg, 
              rgba(255,255,255,0.08) 70deg, 
              transparent 80deg, 
              rgba(255,255,255,0.08) 90deg, 
              transparent 100deg, 
              rgba(255,255,255,0.08) 110deg, 
              transparent 120deg)`,
          }}
        />
      </div>

      {/* 🖼️ LISA IMAGE - CONTRÔLES DE TAILLE ICI */}
      <div
        className="absolute right-0 top-0 bottom-0 w-52 overflow-hidden" // 🎯 LARGEUR CONTAINER - Changez w-52 (208px) pour ajuster la largeur
      >
        <div className="relative h-full">
          {/* Glow effect behind Lisa */}
          <div
            className="absolute inset-0 rounded-lg blur-sm"
            style={{
              background: `radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%)`,
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={showDetails ? "duo" : "solo"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-10 h-full w-full"
            >
              <Image
                src={showDetails ? "/images/lisa-duo.png" : "/images/lisa-new.png"}
                alt="Lisa BLACKPINK"
                width={240}
                height={300}
                className="h-full w-full object-contain object-bottom drop-shadow-lg scale-[1.7]"
                style={{
                  filter: "brightness(1.1) contrast(1.1) saturate(1.2)",
                  transform: "translateX(10px) translateY(5px)",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Title Overlay - Spans full width over both content and image */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <CalendarCheck2 className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-sm mb-1 truncate flex-1">{event.title}</h3>
        </div>
      </div>

      {/* Content - Left side with space adjusted for larger image */}
      <div className="relative z-10 pr-52">
        {" "}
        {/* 🎯 PADDING CONTENU - Ajustez pr-52 selon la largeur de l'image */}
        <div className="mb-2 mt-12">
          <p className="text-xs text-white/90 drop-shadow-sm leading-relaxed">{event.description}</p>
        </div>
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="ghost"
          className="w-full text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg font-medium"
        >
          {showDetails ? "Masquer les détails" : "Voir les détails"}
        </Button>
        <motion.div
          initial={false}
          animate={{ height: showDetails ? "auto" : 0, opacity: showDetails ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="mt-4 space-y-3 border-t border-white/30 pt-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-1.5 rounded bg-white/20">
                <Gift className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium drop-shadow-sm">Récompense: {event.reward}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-1.5 rounded bg-white/20">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium drop-shadow-sm">Se termine le: {event.endDate}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
