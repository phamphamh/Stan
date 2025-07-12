"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ArrowLeft, ArrowRight, User, Edit } from 'lucide-react';

interface ProfileStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function ProfileStep({ onNext, onPrevious }: ProfileStepProps) {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: ''
  });
  const [isValid, setIsValid] = useState(false);
  const { updateProfile } = useUserProfile();

  const handleInputChange = (field: string, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);

    // Validation simple
    setIsValid(
      newFormData.username.length >= 3 &&
      newFormData.displayName.length >= 2
    );
  };

  const handleNext = async () => {
    if (isValid) {
      try {
        await updateProfile(formData);
        onNext();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">
          Créez votre profil de fan
        </h2>
        <p className="text-gray-300">
          Personnalisez votre profil pour rejoindre la communauté BLACKPINK
        </p>
      </div>

      {/* Profile Form */}
      <Card className="border-gray-700 bg-[#1a1f2c]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-purple-500/20 rounded-full w-fit">
            <User className="h-8 w-8 text-purple-400" />
          </div>
          <CardTitle className="text-white">Votre profil</CardTitle>
          <CardDescription className="text-gray-300">
            Ces informations seront visibles par les autres fans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Nom d'utilisateur *</Label>
              <Input
                id="username"
                placeholder="Ex: blink_forever"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                className="bg-[#0f1421] border-gray-700 text-white placeholder-gray-400"
              />
              <p className="text-sm text-gray-400">
                Minimum 3 caractères. Sera utilisé pour vous identifier.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">Nom d'affichage *</Label>
              <Input
                id="displayName"
                placeholder="Ex: Sarah Kim"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                required
                className="bg-[#0f1421] border-gray-700 text-white placeholder-gray-400"
              />
              <p className="text-sm text-gray-400">
                Votre nom tel qu'il apparaîtra aux autres fans.
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio (optionnel)</Label>
              <Textarea
                id="bio"
                placeholder="Parlez-nous de vous et de votre passion pour BLACKPINK..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="bg-[#0f1421] border-gray-700 text-white placeholder-gray-400"
              />
              <p className="text-sm text-gray-400">
                Décrivez votre passion pour BLACKPINK (max 200 caractères).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>




    </div>
  );
}