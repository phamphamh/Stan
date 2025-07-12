"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useBlockchain } from "@/lib/blockchain-context";

interface WalletStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function WalletStep({ onNext, onPrevious }: WalletStepProps) {
  const { isConnected, address, login, ready } = useBlockchain();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connecter votre wallet
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connectez votre wallet pour accéder aux fonctionnalités blockchain et gagner des tokens BP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected && address ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Wallet connecté</p>
                  <p className="text-sm text-gray-300">{formatAddress(address)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center">
                Votre wallet est connecté au réseau Chiliz Chain
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6">
                <Wallet className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Connectez votre wallet pour continuer
                </p>
                <Button
                  onClick={login}
                  disabled={!ready}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {ready ? 'Connecter Wallet' : 'Chargement...'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>
        <Button
          onClick={onNext}
          disabled={!isConnected}
          className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
        >
          Suivant
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}