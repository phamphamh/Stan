"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useOpenMission } from "@/lib/contracts/artist"
import { parseEther } from "viem"
import { Plus, Loader2 } from "lucide-react"

export default function MissionCreator() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reward: ''
  })

  const { openMission, isLoading, isSuccess, error } = useOpenMission()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.reward) {
      alert('Tous les champs sont requis')
      return
    }

    try {
      const rewardInWei = parseEther(formData.reward)
      openMission({
        args: [formData.name, formData.description, rewardInWei]
      })
    } catch (err) {
      console.error('Erreur lors de la création de mission:', err)
      alert('Erreur: Vérifiez le montant de la récompense')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', reward: '' })
    setIsOpen(false)
  }

  // Réinitialiser le formulaire en cas de succès
  if (isSuccess && isOpen) {
    setTimeout(() => {
      resetForm()
      alert('Mission créée avec succès!')
    }, 1000)
  }

  if (!isOpen) {
    return (
      <div className="mb-4">
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer une nouvelle mission
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
      <CardHeader>
        <CardTitle className="text-white">Créer une nouvelle mission</CardTitle>
        <CardDescription className="text-gray-400">
          Définissez une mission pour vos fans avec une récompense en tokens
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nom de la mission</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Créer un contenu BLACKPINK"
              className="bg-gray-800 border-gray-600 text-white"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez ce que les fans doivent faire pour compléter cette mission"
              className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="reward" className="text-white">Récompense (en tokens)</Label>
            <Input
              id="reward"
              type="number"
              value={formData.reward}
              onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
              placeholder="Ex: 100"
              className="bg-gray-800 border-gray-600 text-white"
              disabled={isLoading}
              min="1"
              step="1"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
              Erreur: {error.message}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Créer la mission'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}