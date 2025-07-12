"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { useArtistFactory } from "@/lib/hooks/useContracts";
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { Loader2, Plus, Palette } from 'lucide-react';

export function CreateArtistForm() {
  const [formData, setFormData] = useState({
    name: "BLACKPINK",
    symbol: "BP",
    description: "Token officiel des fans de BLACKPINK",
    imageUrl: "https://example.com/blackpink-logo.png",
    initialSupply: "1000000" // 1M tokens
  });

  const [isLoading, setIsLoading] = useState(false);
  const { authenticated } = usePrivy();
  // const { createArtist, isCreating } = useArtistFactory();
  const createArtist = null;
  const isCreating = false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      toast.error("Veuillez connecter votre wallet");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implémenter la création d'artiste
      console.log("Création d'artiste:", formData);

      toast.info("Fonctionnalité en développement", {
        description: "La création d'artiste sera bientôt disponible"
      });
    } catch (error) {
      console.error("Erreur création artiste:", error);
      toast.error("Erreur lors de la création de l'artiste");
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

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-gray-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Deploy Artist Contract</CardTitle>
            <CardDescription className="text-slate-400">
              Deploy a new Artist contract with its ERC-20 token
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de l'artiste */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Artist Name</Label>
              <Input
                id="name"
                placeholder="Ex: BLACKPINK"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>

            {/* Symbole du token */}
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-slate-300">Token Symbol</Label>
              <Input
                id="symbol"
                placeholder="Ex: BP"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                required
                className="border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de l'artiste et du token..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* URL de l'image */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.png"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              required
            />
          </div>

          {/* Supply initial */}
          <div className="space-y-2">
            <Label htmlFor="initialSupply">Supply initial (en tokens)</Label>
            <Input
              id="initialSupply"
              type="number"
              placeholder="1000000"
              value={formData.initialSupply}
              onChange={(e) => handleInputChange('initialSupply', e.target.value)}
              required
              min="1"
            />
            <p className="text-sm text-gray-500">
              Nombre de tokens qui seront créés initialement
            </p>
          </div>

          {/* Informations importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">ℹ️ Informations importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cette action va créer 2 contrats : Artist + Token ERC-20</li>
              <li>• Le token sera automatiquement lié au contrat Artist</li>
              <li>• Les tokens initiaux seront envoyés à votre wallet</li>
              <li>• L'opération coûte environ 0.1 CHZ en gas</li>
            </ul>
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={!authenticated || isLoading || isCreating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {isLoading || isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying Contract...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Deploy Artist Contract
              </>
            )}
          </Button>

          {!authenticated && (
            <p className="text-sm text-red-400 text-center">
              Connect your wallet to deploy artist contract
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}