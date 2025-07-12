"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, User, Copy, Check } from "lucide-react";
import { useBlockchain } from "@/lib/blockchain-context";
import { useState } from "react";

export function PrivyWallet() {
  const { isConnected, address, isAuthenticated, login, logout, ready } = useBlockchain();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!ready) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet
        </CardTitle>
        <CardDescription className="text-gray-400">
          {isConnected ? 'Connecté au réseau Chiliz' : 'Connectez votre wallet pour commencer'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connecté
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnecter
              </Button>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {formatAddress(address)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Réseau: Chiliz Chain (88888)
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <Wallet className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                Connectez votre wallet pour accéder aux fonctionnalités blockchain
              </p>
            </div>

            <Button
              onClick={login}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connecter Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}