"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from 'lucide-react';

export function CreateMissionForm() {
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
              Create new missions for fans to complete
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-slate-400">🚧 Feature in development</p>
          <p className="text-sm text-slate-500 mt-2">Mission creation will be available soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
