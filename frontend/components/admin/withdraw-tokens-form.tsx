"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from 'lucide-react';

export function WithdrawTokensForm() {
  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-gray-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Withdraw Tokens</CardTitle>
            <CardDescription className="text-slate-400">
              Withdraw tokens from smart contracts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-slate-400">🚧 Feature in development</p>
          <p className="text-sm text-slate-500 mt-2">Token withdrawal will be available soon</p>
        </div>
      </CardContent>
    </Card>
  );
}