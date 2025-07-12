"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Trophy, Users, Coins } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Missions Exclusives",
      description: "Complétez des défis et gagnez des tokens BP"
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: "Tokens BP",
      description: "Collectez des tokens pour débloquer des récompenses"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Communauté",
      description: "Rejoignez des milliers de fans BLACKPINK"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Récompenses",
      description: "Échangez vos tokens contre des objets exclusifs"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-gray-700 bg-[#1a1f2c]">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-yellow-400 text-yellow-900 border-yellow-300">
                Nouveau !
              </Badge>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-4">
            Bienvenue dans l'univers BLACKPINK
          </CardTitle>
          <CardDescription className="text-gray-300 max-w-2xl mx-auto">
            Rejoignez la communauté officielle des fans BLACKPINK. Complétez des missions,
            gagnez des tokens BP et débloquez des récompenses exclusives !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-[#0f1421] rounded-lg border border-gray-700">
                <div className="flex-shrink-0 p-2 bg-pink-500/20 rounded-lg">
                  <div className="text-pink-500">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* Call to Action */}
      <div className="text-center">
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 w-full"
        >
          Commencer l'aventure
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <p className="text-sm text-gray-400 mt-3">
          Cela ne prend que quelques minutes
        </p>
      </div>
    </div>
  );
}