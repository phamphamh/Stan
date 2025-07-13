"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlackpinkArtist, useBlackpinkToken, useMissionData } from "@/lib/hooks/useContracts";
import { usePrivy } from '@privy-io/react-auth';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';
import { CONTRACTS } from '@/lib/contracts/addresses';

export function TestConnection() {
  const { authenticated } = usePrivy();
  const { fanTokenAddress, artistOwner, isArtist } = useBlackpinkArtist();
  const { tokenName, tokenSymbol, balance, earnedBalance } = useBlackpinkToken();
  const mission0 = useMissionData(0n);

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-gray-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Contract Connection Test</CardTitle>
            <CardDescription className="text-slate-400">
              Test the connection to BlackPink smart contracts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Connection */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Wallet Connected</span>
          <div className="flex items-center space-x-2">
            {authenticated ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">Not Connected</span>
              </>
            )}
          </div>
        </div>

        {/* Contract Address */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Artist Contract</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-mono text-sm">
              {CONTRACTS.BLACKPINK_ARTIST.slice(0, 6)}...{CONTRACTS.BLACKPINK_ARTIST.slice(-4)}
            </span>
          </div>
        </div>

        {/* Token Address */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Token Address</span>
          <div className="flex items-center space-x-2">
            {fanTokenAddress ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  {fanTokenAddress.slice(0, 6)}...{fanTokenAddress.slice(-4)}
                </span>
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                <span className="text-yellow-400">Loading...</span>
              </>
            )}
          </div>
        </div>

        {/* Token Info */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Token Info</span>
          <div className="flex items-center space-x-2">
            {tokenName && tokenSymbol ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400">{tokenName} ({tokenSymbol})</span>
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                <span className="text-yellow-400">Loading...</span>
              </>
            )}
          </div>
        </div>

        {/* Artist Owner */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Artist Owner</span>
          <div className="flex items-center space-x-2">
            {artistOwner ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  {artistOwner.slice(0, 6)}...{artistOwner.slice(-4)}
                </span>
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                <span className="text-yellow-400">Loading...</span>
              </>
            )}
          </div>
        </div>

        {/* Artist Permission */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Artist Permission</span>
          <div className="flex items-center space-x-2">
            {isArtist ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400">✅ You are the artist</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">❌ You are not the artist</span>
              </>
            )}
          </div>
        </div>

        {/* Mission 0 Test */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300">Mission 0 Read</span>
          <div className="flex items-center space-x-2">
            {mission0.name !== undefined ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400">
                  {mission0.name || "Empty mission"}
                </span>
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                <span className="text-yellow-400">Loading...</span>
              </>
            )}
          </div>
        </div>

        {/* Token Balances */}
        {authenticated && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Token Balance</span>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">
                  {balance ? (balance / BigInt(10**18)).toString() : "0"} BP
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Earned Balance</span>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">
                  {earnedBalance ? (earnedBalance / BigInt(10**18)).toString() : "0"} BP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Configuration Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Network:</p>
              <p className="text-white">Chiliz Mainnet (88888)</p>
            </div>
            <div>
              <p className="text-slate-400">RPC:</p>
              <p className="text-white">ankr.com/chiliz</p>
            </div>
            <div>
              <p className="text-slate-400">Factory:</p>
              <p className="text-white font-mono text-xs">
                {CONTRACTS.ARTIST_FACTORY.slice(0, 10)}...
              </p>
            </div>
            <div>
              <p className="text-slate-400">Artist:</p>
              <p className="text-white font-mono text-xs">
                {CONTRACTS.BLACKPINK_ARTIST.slice(0, 10)}...
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 