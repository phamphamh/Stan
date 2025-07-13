"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlackpinkArtist } from "@/lib/hooks/useContracts";
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { Loader2, Plus, Database, Star, Trophy } from 'lucide-react';
import { parseEther } from 'viem';

export function CreateMissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reward: "100" // Reward en tokens
  });

  const [isLoading, setIsLoading] = useState(false);
  const { authenticated } = usePrivy();
  const { createMission, isArtist } = useBlackpinkArtist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      toast.error("Veuillez connecter votre wallet");
      return;
    }

    if (!isArtist) {
      toast.error("Seul l'artiste peut créer des missions");
      return;
    }

    if (!formData.name || !formData.description || !formData.reward) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      // Convertir le reward en wei (la documentation indique que c'est en tokens)
      const rewardInWei = parseEther(formData.reward);
      
      await createMission(formData.name, formData.description, rewardInWei);
      
      toast.success("Mission créée avec succès!", {
        description: `Mission "${formData.name}" avec récompense de ${formData.reward} tokens`
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        reward: "100"
      });
    } catch (error) {
      console.error("Erreur création mission:", error);
      toast.error("Erreur lors de la création de la mission");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Missions suggérées pour BlackPink
  const missionSuggestions = [
    {
      name: "Stream BLACKPINK Songs",
      description: "Écoutez vos chansons BLACKPINK préférées sur Spotify et montrez votre soutien",
      reward: "75"
    },
    {
      name: "Create BLACKPINK Content",
      description: "Créez du contenu BLACKPINK (TikTok, Instagram, etc.) et partagez votre amour",
      reward: "100"
    },
    {
      name: "Tweet About BLACKPINK",
      description: "Partagez votre amour pour BLACKPINK sur Twitter/X",
      reward: "50"
    },
    {
      name: "Join BLACKPINK Community",
      description: "Rejoignez la communauté officielle BLACKPINK et interagissez avec d'autres fans",
      reward: "150"
    }
  ];

  const applySuggestion = (suggestion: typeof missionSuggestions[0]) => {
    setFormData({
      name: suggestion.name,
      description: suggestion.description,
      reward: suggestion.reward
    });
  };

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-gray-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Create Mission</CardTitle>
            <CardDescription className="text-slate-400">
              Create new missions for BLACKPINK fans to complete
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vérification des permissions */}
        {!authenticated && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              ⚠️ Veuillez connecter votre wallet pour créer des missions
            </p>
          </div>
        )}

        {authenticated && !isArtist && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">
              ⚠️ Seul l'artiste propriétaire peut créer des missions
            </p>
          </div>
        )}

        {/* Suggestions de missions */}
        <div className="space-y-3">
          <Label className="text-slate-300">Mission Suggestions</Label>
          <div className="grid gap-2">
            {missionSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 cursor-pointer hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">{suggestion.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <Trophy className="h-3 w-3" />
                    <span className="text-xs">{suggestion.reward} tokens</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mt-1 ml-6">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de la mission */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Mission Name</Label>
            <Input
              id="name"
              placeholder="Ex: Stream BLACKPINK Songs"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez ce que les fans doivent faire pour compléter cette mission..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
              className="border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-green-500"
            />
          </div>

          {/* Récompense */}
          <div className="space-y-2">
            <Label htmlFor="reward" className="text-slate-300">Reward (tokens)</Label>
            <Input
              id="reward"
              type="number"
              placeholder="100"
              value={formData.reward}
              onChange={(e) => handleInputChange('reward', e.target.value)}
              required
              min="1"
              className="border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-green-500"
            />
            <p className="text-sm text-slate-500">
              Nombre de tokens BP que les fans recevront en complétant cette mission
            </p>
          </div>

          {/* Informations importantes */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-2">📋 Information</h4>
            <ul className="text-sm text-green-300 space-y-1">
              <li>• La mission sera immédiatement disponible pour les fans</li>
              <li>• Les fans peuvent s'inscrire et la compléter pour gagner des tokens</li>
              <li>• Vous pouvez fermer la mission plus tard si nécessaire</li>
            </ul>
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={!authenticated || !isArtist || isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Mission...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Mission
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
