import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export interface UserProfile {
  id: string;
  walletAddress: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  favoriteMembers: string[];
  fanLevel: number;
  totalTokensEarned: number;
  badges: string[];
  joinedAt: number;
  lastActiveAt: number;
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    shareProgress: boolean;
    favoriteGenres: string[];
  };
  stats: {
    missionsCompleted: number;
    tokensEarned: number;
    daysActive: number;
    streakDays: number;
  };
}

const DEFAULT_PROFILE: Partial<UserProfile> = {
  username: '',
  displayName: '',
  bio: '',
  avatar: '',
  favoriteMembers: [],
  fanLevel: 1,
  totalTokensEarned: 0,
  badges: [],
  preferences: {
    notifications: true,
    publicProfile: true,
    shareProgress: true,
    favoriteGenres: []
  },
  stats: {
    missionsCompleted: 0,
    tokensEarned: 0,
    daysActive: 0,
    streakDays: 0
  }
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const { ready, authenticated, user } = usePrivy();

  // Load profile from localStorage
  useEffect(() => {
    if (ready) {
      // Si l'utilisateur est connecté avec Privy, utiliser son adresse wallet
      if (authenticated && user?.wallet?.address) {
        const savedProfile = localStorage.getItem(`profile_${user.wallet.address}`);
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfile(parsedProfile);
            setHasProfile(true);
          } catch (error) {
            console.error('Error parsing saved profile:', error);
          }
        }
      } else {
        // Sinon, chercher un profil local générique
        const savedProfile = localStorage.getItem('profile_local');
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfile(parsedProfile);
            setHasProfile(true);
          } catch (error) {
            console.error('Error parsing saved profile:', error);
          }
        }
      }
      setIsLoading(false);
    } else {
      // Si Privy n'est pas prêt, chercher quand même un profil local
      const savedProfile = localStorage.getItem('profile_local');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setHasProfile(true);
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      }
      setIsLoading(false);
    }
  }, [ready, authenticated, user]);

  // Save profile to localStorage
  const saveProfile = (profileData: UserProfile) => {
    const key = user?.wallet?.address ? `profile_${user.wallet.address}` : 'profile_local';
    localStorage.setItem(key, JSON.stringify(profileData));
    setProfile(profileData);
    setHasProfile(true);
  };

  // Create new profile
  const createProfile = async (profileData?: Partial<UserProfile>) => {
    const profileId = user?.wallet?.address || `local_${Date.now()}`;
    const walletAddress = user?.wallet?.address || '';

    const newProfile: UserProfile = {
      id: profileId,
      walletAddress: walletAddress,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      ...DEFAULT_PROFILE,
      ...profileData
    } as UserProfile;

    saveProfile(newProfile);
    return newProfile;
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) {
      throw new Error('No profile to update');
    }

    const updatedProfile = {
      ...profile,
      ...updates,
      lastActiveAt: Date.now()
    };

    saveProfile(updatedProfile);
    return updatedProfile;
  };

  // Add badge
  const addBadge = async (badgeId: string) => {
    if (!profile) return;

    if (!profile.badges.includes(badgeId)) {
      const updatedProfile = {
        ...profile,
        badges: [...profile.badges, badgeId],
        lastActiveAt: Date.now()
      };
      saveProfile(updatedProfile);
    }
  };

  // Update stats
  const updateStats = async (stats: Partial<UserProfile['stats']>) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      stats: {
        ...profile.stats,
        ...stats
      },
      lastActiveAt: Date.now()
    };

    saveProfile(updatedProfile);
  };

  // Add tokens earned
  const addTokensEarned = async (amount: number) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      totalTokensEarned: profile.totalTokensEarned + amount,
      stats: {
        ...profile.stats,
        tokensEarned: profile.stats.tokensEarned + amount
      },
      lastActiveAt: Date.now()
    };

    saveProfile(updatedProfile);
  };

  // Complete mission
  const completeMission = async (tokensEarned: number) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      totalTokensEarned: profile.totalTokensEarned + tokensEarned,
      stats: {
        ...profile.stats,
        missionsCompleted: profile.stats.missionsCompleted + 1,
        tokensEarned: profile.stats.tokensEarned + tokensEarned
      },
      lastActiveAt: Date.now()
    };

    // Level up logic
    const newLevel = Math.floor(updatedProfile.stats.missionsCompleted / 5) + 1;
    if (newLevel > updatedProfile.fanLevel) {
      updatedProfile.fanLevel = newLevel;
      // Could add level-up badge here
    }

    saveProfile(updatedProfile);
  };

  // Get user's fan level info
  const getFanLevelInfo = () => {
    if (!profile) return null;

    const currentLevel = profile.fanLevel;
    const missionsForNextLevel = currentLevel * 5;
    const currentMissions = profile.stats.missionsCompleted;
    const progressToNextLevel = (currentMissions % 5) / 5;

    return {
      currentLevel,
      missionsForNextLevel,
      currentMissions,
      progressToNextLevel,
      missionsNeeded: missionsForNextLevel - (currentMissions % 5)
    };
  };

  // Check if user has specific badge
  const hasBadge = (badgeId: string) => {
    return profile?.badges.includes(badgeId) || false;
  };

  // Get profile completion percentage
  const getProfileCompletion = () => {
    if (!profile) return 0;

    const fields = [
      profile.username,
      profile.displayName,
      profile.bio,
      profile.avatar,
      profile.favoriteMembers.length > 0
    ];

    const completedFields = fields.filter(Boolean).length;
    return (completedFields / fields.length) * 100;
  };

  // Check if profile is complete (has minimum required fields)
  const isProfileComplete = profile &&
    profile.username &&
    profile.displayName &&
    profile.favoriteMembers.length > 0;

  return {
    profile,
    isLoading,
    hasProfile,
    isProfileComplete: Boolean(isProfileComplete),
    createProfile,
    updateProfile,
    addBadge,
    updateStats,
    addTokensEarned,
    completeMission,
    getFanLevelInfo,
    hasBadge,
    getProfileCompletion
  };
}