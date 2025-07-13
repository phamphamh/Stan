"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateArtistForm } from "@/components/admin/create-artist-form";
import { CreateMissionForm } from "@/components/admin/create-mission-form";
import { ManageMissionsTable } from "@/components/admin/manage-missions-table";
import { WithdrawTokensForm } from "@/components/admin/withdraw-tokens-form";
import { TestConnection } from "@/components/admin/test-connection";
import { PrivyWallet } from "@/components/wallet/privy-wallet";
import { usePrivy } from '@privy-io/react-auth';
import { Terminal, Code, Zap, Database, Settings, Coins, Users, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

const ADMIN_PASSWORD = "88888"; // Code d'accès admin

export default function AdminArtistPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { ready, authenticated, connectWallet } = usePrivy();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading system...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-700 bg-gradient-to-br from-slate-800 to-gray-900 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                <Terminal className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              🔧 Developer Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Blockchain Admin Interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Access Key</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <Code className="h-4 w-4 mr-2" />
              Access Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Header Admin - Style Tech */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-slate-700 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-2">🔧</span>
                    Blockchain Admin Portal
                  </h1>
                  <p className="text-slate-400">Smart Contract Management Interface</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated && (
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Wallet Connected</span>
                </div>
              )}
              <Button
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Zap className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
                 {/* Wallet Connection - Style Tech */}
         {!authenticated && (
           <div className="mb-8">
                             <PrivyWallet />
           </div>
         )}

        {/* Admin Tabs - Style Tech */}
        <Tabs defaultValue="test-connection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="test-connection"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-slate-300 hover:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Test Connection
            </TabsTrigger>
            <TabsTrigger
              value="create-artist"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Deploy Artist
            </TabsTrigger>
            <TabsTrigger
              value="create-mission"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Create Mission
            </TabsTrigger>
            <TabsTrigger
              value="manage-missions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Missions
            </TabsTrigger>
            <TabsTrigger
              value="withdraw-tokens"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-white"
            >
              <Coins className="h-4 w-4 mr-2" />
              Withdraw Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test-connection" className="space-y-6">
            <TestConnection />
          </TabsContent>

          <TabsContent value="create-artist" className="space-y-6">
            <CreateArtistForm />
          </TabsContent>

          <TabsContent value="create-mission" className="space-y-6">
            <CreateMissionForm />
          </TabsContent>

          <TabsContent value="manage-missions" className="space-y-6">
            <ManageMissionsTable />
          </TabsContent>

          <TabsContent value="withdraw-tokens" className="space-y-6">
            <WithdrawTokensForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}