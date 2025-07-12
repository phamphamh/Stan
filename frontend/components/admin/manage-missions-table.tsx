"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';

export function ManageMissionsTable() {
  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-gray-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Manage Missions</CardTitle>
            <CardDescription className="text-slate-400">
              View and manage existing missions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-slate-400">🚧 Feature in development</p>
          <p className="text-sm text-slate-500 mt-2">Mission management will be available soon</p>
        </div>
      </CardContent>
    </Card>
  );
}