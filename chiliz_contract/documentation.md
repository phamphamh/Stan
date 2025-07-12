# Documentation Smart Contracts Artist & ArtistFactory

## Vue d'ensemble

Ce système permet aux artistes de créer des missions et des récompenses pour leurs fans. Les fans peuvent s'inscrire aux missions, les compléter pour gagner des tokens, puis utiliser ces tokens pour acheter des récompenses.

## Architecture

### Contrats principaux

1. **ArtistFactory** : Factory pour créer des contrats Artist
2. **Artist** : Contrat principal gérant les missions et récompenses d'un artiste
3. **CAP20** : Token ERC20 personnalisé pour les fans

### Flux principal

1. **Création d'artiste** : Via ArtistFactory
2. **Missions** : L'artiste crée des missions → Les fans s'inscrivent → Les fans complètent → Gain de tokens
3. **Récompenses** : L'artiste crée des récompenses → Les fans achètent avec leurs tokens

## Contrat ArtistFactory

### Fonctions

#### `newArtist(string memory _name, string memory _symbole)`
- **Description** : Crée un nouveau contrat Artist pour l'appelant
- **Paramètres** :
  - `_name` : Nom du token (ex: "Artist1 Token")
  - `_symbole` : Symbole du token (ex: "ART1")
- **Retour** : Aucun
- **Permissions** : Public
- **Événements** : Aucun

#### `getArtist(uint256 index_)`
- **Description** : Récupère le contrat Artist à l'index spécifié
- **Paramètres** :
  - `index_` : Index du contrat Artist
- **Retour** : `Artist` - Instance du contrat Artist
- **Permissions** : Public (view)

#### `getArtistAddress(uint256 index_)`
- **Description** : Récupère l'adresse du contrat Artist à l'index spécifié
- **Paramètres** :
  - `index_` : Index du contrat Artist
- **Retour** : `address` - Adresse du contrat Artist
- **Permissions** : Public (view)

## Contrat Artist

### Variables d'état

```solidity
address public artistAddress;        // Adresse de l'artiste propriétaire
CAP20 public FanToken;              // Instance du token ERC20
uint256 private nb_mission;         // Nombre total de missions créées
uint256 private nb_reward;          // Nombre total de récompenses créées
```

### Statuts

#### Missions
- `1` : Ouverte
- `2` : Fermée

#### Récompenses  
- `1` : Ouverte
- `2` : Fermée

#### Fans
- `0` : Non inscrit
- `1` : Inscrit
- `2` : Complété

### Fonctions de création

#### `openMission(string memory name_, string memory description_, uint256 reward_)`
- **Description** : Crée une nouvelle mission
- **Paramètres** :
  - `name_` : Nom de la mission
  - `description_` : Description de la mission
  - `reward_` : Nombre de tokens à gagner
- **Retour** : `uint256` - ID de la mission créée
- **Permissions** : Seulement l'artiste
- **Événements** : `MissionOpen(uint256 missionId, address artist)`

#### `openReward(string memory name_, string memory description_, uint256 price_)`
- **Description** : Crée une nouvelle récompense
- **Paramètres** :
  - `name_` : Nom de la récompense
  - `description_` : Description de la récompense
  - `price_` : Prix en tokens pour acheter la récompense
- **Retour** : `uint256` - ID de la récompense créée
- **Permissions** : Seulement l'artiste
- **Événements** : `RewardOpen(uint256 rewardId)`

### Fonctions de fermeture

#### `closeMission(uint256 nb_mission_, address fanAddress_)`
- **Description** : Ferme une mission
- **Paramètres** :
  - `nb_mission_` : ID de la mission à fermer
  - `fanAddress_` : Adresse du fan (paramètre optionnel)
- **Retour** : Aucun
- **Permissions** : Seulement l'artiste
- **Événements** : `MissionClose(uint256 missionId, address fanAddress)`

#### `closeReward(uint256 nb_reward_)`
- **Description** : Ferme une récompense
- **Paramètres** :
  - `nb_reward_` : ID de la récompense à fermer
- **Retour** : Aucun
- **Permissions** : Seulement l'artiste
- **Événements** : `RewardClose(uint256 rewardId)`

### Fonctions des fans

#### `registerFanOnMission(uint256 nb_mission_, address fanAddress_)`
- **Description** : Inscrit un fan à une mission
- **Paramètres** :
  - `nb_mission_` : ID de la mission
  - `fanAddress_` : Adresse du fan (doit être l'appelant)
- **Retour** : Aucun
- **Permissions** : Seulement le fan pour lui-même
- **Événements** : `Register(uint256 missionId, address fan)`

#### `completeFanMission(uint256 nb_mission_, address fanAddress_)`
- **Description** : Complète une mission et gagne des tokens
- **Paramètres** :
  - `nb_mission_` : ID de la mission
  - `fanAddress_` : Adresse du fan (doit être l'appelant)
- **Retour** : Aucun
- **Permissions** : Seulement le fan pour lui-même
- **Logique** :
  - Vérifie que la mission est ouverte
  - Marque le fan comme complété
  - Ajoute les tokens gagnés au solde "earned" (`addToEarned`)
  - Mint de nouveaux tokens dans le solde normal (`_mint`)
- **Événements** : `Complete(uint256 missionId, address fan)`

#### `claimRewardFan(uint256 nb_reward_, address fanAddress_)`
- **Description** : Achète une récompense avec des tokens "earned"
- **Paramètres** :
  - `nb_reward_` : ID de la récompense
  - `fanAddress_` : Adresse du fan (doit être l'appelant)
- **Retour** : Aucun
- **Permissions** : Seulement le fan pour lui-même
- **Logique** :
  - Vérifie que le fan a assez de tokens "earned" (`balanceOfEarnedToken`)
  - Vérifie que la récompense est ouverte
  - Vérifie que le fan n'a pas déjà réclamé
  - Brûle 40% du prix : `(price * 100) / 40`
  - Transfère 60% à l'artiste : `(price * 100) / 60`
- **Événements** : `RewardClaim(uint256 rewardId, address fan)`

### Fonctions de consultation

#### `getStatuFanOnMission(uint256 nb_mission_, address fanAddress_)`
- **Description** : Récupère le statut d'un fan sur une mission
- **Paramètres** :
  - `nb_mission_` : ID de la mission
  - `fanAddress_` : Adresse du fan
- **Retour** : `uint8` - Statut du fan (0, 1, ou 2)
- **Permissions** : Public (view)

#### `getStatuFanOnReward(uint256 nb_reward_, address fanAddress_)`
- **Description** : Récupère le statut d'un fan sur une récompense
- **Paramètres** :
  - `nb_reward_` : ID de la récompense
  - `fanAddress_` : Adresse du fan
- **Retour** : `uint8` - Statut du fan (0, 1, ou 2)
- **Permissions** : Public (view)

#### `getArtistAddress()`
- **Description** : Récupère l'adresse de l'artiste
- **Retour** : `address` - Adresse de l'artiste
- **Permissions** : Public (view)

#### `getFanToken()`
- **Description** : Récupère l'adresse du token ERC20
- **Retour** : `address` - Adresse du contrat token
- **Permissions** : Public (view)

#### `getMissionName(uint256 nb_mission_)`
- **Description** : Récupère le nom d'une mission
- **Paramètres** :
  - `nb_mission_` : ID de la mission
- **Retour** : `string` - Nom de la mission
- **Permissions** : Public (view)

#### `getMissionDescription(uint256 nb_mission_)`
- **Description** : Récupère la description d'une mission
- **Paramètres** :
  - `nb_mission_` : ID de la mission
- **Retour** : `string` - Description de la mission
- **Permissions** : Public (view)

#### `getMissionStatus(uint256 nb_mission_)`
- **Description** : Récupère le statut d'une mission
- **Paramètres** :
  - `nb_mission_` : ID de la mission
- **Retour** : `uint8` - Statut de la mission (1 = ouvert, 2 = fermé)
- **Permissions** : Public (view)

#### `getRewardName(uint256 nb_reward_)`
- **Description** : Récupère le nom d'une récompense
- **Paramètres** :
  - `nb_reward_` : ID de la récompense
- **Retour** : `string` - Nom de la récompense
- **Permissions** : Public (view)

#### `getRewardDescription(uint256 nb_reward_)`
- **Description** : Récupère la description d'une récompense
- **Paramètres** :
  - `nb_reward_` : ID de la récompense
- **Retour** : `string` - Description de la récompense
- **Permissions** : Public (view)

#### `getRewardStatus(uint256 nb_reward_)`
- **Description** : Récupère le statut d'une récompense
- **Paramètres** :
  - `nb_reward_` : ID de la récompense
- **Retour** : `uint8` - Statut de la récompense (1 = ouvert, 2 = fermé)
- **Permissions** : Public (view)

### Modificateurs

#### `onlyArtist`
- **Description** : Vérifie que l'appelant est l'artiste propriétaire
- **Logique** : Revert si `msg.sender != artistAddress`

## Contrat CAP20 (Token ERC20 modifié)

### Description
Le contrat CAP20 est un token ERC20 standard modifié avec des fonctionnalités supplémentaires pour tracer les tokens "gagnés" vs les tokens "transférés". Cela permet de distinguer les tokens obtenus via les missions des tokens reçus par transfert direct.

### Fonctions spéciales

#### `balanceOfEarnedToken(address owner_)`
- **Description** : Récupère le solde de tokens "gagnés" d'un utilisateur
- **Paramètres** :
  - `owner_` : Adresse de l'utilisateur
- **Retour** : `uint256` - Solde de tokens gagnés
- **Permissions** : Public (view)

#### `addToEarned(address to, uint256 _reward)`
- **Description** : Ajoute des tokens au solde "gagné" d'un utilisateur
- **Paramètres** :
  - `to` : Adresse de l'utilisateur
  - `_reward` : Nombre de tokens à ajouter
- **Retour** : Aucun
- **Permissions** : External (seulement le contrat Artist)

#### `_burn(address account, uint256 amount)`
- **Description** : Brûle des tokens d'un compte
- **Paramètres** :
  - `account` : Adresse du compte
  - `amount` : Nombre de tokens à brûler
- **Retour** : Aucun
- **Permissions** : External (seulement le contrat Artist)

#### `_transfer(address from, address to, uint256 amount)`
- **Description** : Transfère des tokens entre comptes (fonction interne)
- **Paramètres** :
  - `from` : Adresse source
  - `to` : Adresse destination
  - `amount` : Nombre de tokens à transférer
- **Retour** : Aucun
- **Permissions** : External (seulement le contrat Artist)

#### `transfer(address to, uint256 amount)`
- **Description** : Transfère des tokens vers une adresse (fonction ERC20 standard)
- **Paramètres** :
  - `to` : Adresse destination
  - `amount` : Nombre de tokens à transférer
- **Retour** : `bool` - Succès de la transaction
- **Permissions** : Public (fonction ERC20 standard)

#### `_mint(address to, uint256 amount)`
- **Description** : Crée de nouveaux tokens pour une adresse
- **Paramètres** :
  - `to` : Adresse destinataire
  - `amount` : Nombre de tokens à créer
- **Retour** : Aucun
- **Permissions** : External (seulement le contrat Artist)

## Événements à écouter

### ArtistFactory
Aucun événement

### Artist
```solidity
event MissionOpen(uint256 missionId, address artist);
event MissionClose(uint256 missionId, address fanAddress);
event Register(uint256 missionId, address fan);
event Complete(uint256 missionId, address fan);
event RewardOpen(uint256 rewardId);
event RewardClose(uint256 rewardId);
event RewardClaim(uint256 rewardId, address fan);
```

### CAP20
```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```
**Note** : Les événements `Transfer` du token CAP20 sont importants pour tracer les mouvements de tokens, notamment lors des achats de récompenses où 60% va à l'artiste.

## Intégration Backend

### 1. Écoute des événements

Le backend doit écouter tous les événements pour maintenir la synchronisation :

#### Événements critiques à écouter :
- `MissionOpen` : Nouvelle mission créée
- `MissionClose` : Mission fermée
- `Register` : Fan inscrit à une mission
- `Complete` : Mission complétée
- `RewardOpen` : Nouvelle récompense créée
- `RewardClose` : Récompense fermée
- `RewardClaim` : Récompense achetée
- `Transfer` : Transferts de tokens

### 2. Workflow d'intégration avec Wagmi

#### Configuration initiale :
```typescript
// 1. Installer les dépendances
npm install wagmi viem @wagmi/core

// 2. Configurer Wagmi
import { createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygon } from 'wagmi/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})
```

#### Création d'un artiste :
```typescript
const { data, write } = useContractWrite({
  address: factoryAddress,
  abi: artistFactoryABI,
  functionName: 'newArtist',
})

await write({ args: ['Artist Token', 'ART'] })
```

#### Création de missions :
```typescript
const { data, write } = useContractWrite({
  address: artistAddress,
  abi: artistABI,
  functionName: 'openMission',
})

await write({ 
  args: ['Mission Name', 'Description', parseEther('100')] 
})
```

#### Inscription d'un fan :
```typescript
const { data, write } = useContractWrite({
  address: artistAddress,
  abi: artistABI,
  functionName: 'registerFanOnMission',
})

await write({ args: [missionId, userAddress] })
```

#### Complétion de mission :
```typescript
const { data, write } = useContractWrite({
  address: artistAddress,
  abi: artistABI,
  functionName: 'completeFanMission',
})

await write({ args: [missionId, userAddress] })
```

#### Création de récompense :
```typescript
const { data, write } = useContractWrite({
  address: artistAddress,
  abi: artistABI,
  functionName: 'openReward',
})

await write({ 
  args: ['Reward Name', 'Description', parseEther('50')] 
})
```

#### Achat de récompense :
```typescript
const { data, write } = useContractWrite({
  address: artistAddress,
  abi: artistABI,
  functionName: 'claimRewardFan',
})

await write({ args: [rewardId, userAddress] })
```

### 3. Gestion des erreurs

#### Erreurs principales :
- `MissionOutOfBand()` : ID de mission invalide
- `RewardOutOfBand()` : ID de récompense invalide
- `MissionAlreadyComplete()` : Mission déjà complétée ou fermée
- `YouCantAchieveForSomeoneElse()` : Tentative d'action pour quelqu'un d'autre
- `YouAreNotTheArtist()` : Tentative d'action par un non-artiste
- `RewardAlreadyClaim()` : Récompense déjà réclamée
- `RewardClose_()` : Récompense fermée
- `MissionAlreadyClosed()` : Mission fermée
- `"You don't have enough fan token"` : Solde de tokens "earned" insuffisant pour acheter la récompense

### 4. Requêtes de consultation avec Wagmi

#### Pour récupérer les données :
```typescript
// Lecture des données de mission
const { data: missionName } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getMissionName',
  args: [missionId],
})

const { data: missionDescription } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getMissionDescription',
  args: [missionId],
})

const { data: missionStatus } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getMissionStatus',
  args: [missionId],
})

// Lecture des données de récompense
const { data: rewardName } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getRewardName',
  args: [rewardId],
})

const { data: rewardDescription } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getRewardDescription',
  args: [rewardId],
})

const { data: rewardStatus } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getRewardStatus',
  args: [rewardId],
})

// Lecture des statuts des fans
const { data: fanMissionStatus } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getStatuFanOnMission',
  args: [missionId, fanAddress],
})

const { data: fanRewardStatus } = useContractRead({
  address: artistAddress,
  abi: artistABI,
  functionName: 'getStatuFanOnReward',
  args: [rewardId, fanAddress],
})

// Lecture des balances de tokens
const { data: tokenBalance } = useContractRead({
  address: fanTokenAddress,
  abi: erc20ABI,
  functionName: 'balanceOf',
  args: [userAddress],
})

const { data: earnedTokenBalance } = useContractRead({
  address: fanTokenAddress,
  abi: erc20ABI,
  functionName: 'balanceOfEarnedToken',
  args: [userAddress],
})
```

### 5. Exemple d'intégration avec Wagmi

```typescript
// Configuration Wagmi
import { createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygon } from 'wagmi/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

// Hooks pour les contrats
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// Configuration des contrats
const artistFactoryConfig = {
  address: '0x...' as `0x${string}`,
  abi: artistFactoryABI,
}

const artistConfig = {
  address: '0x...' as `0x${string}`,
  abi: artistABI,
}

const fanTokenConfig = {
  address: '0x...' as `0x${string}`,
  abi: erc20ABI,
}

// Hook pour créer un artiste
function useCreateArtist() {
  const { data, write, isLoading, error } = useContractWrite({
    ...artistFactoryConfig,
    functionName: 'newArtist',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    createArtist: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

// Hook pour ouvrir une mission
function useOpenMission() {
  const { data, write, isLoading, error } = useContractWrite({
    ...artistConfig,
    functionName: 'openMission',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    openMission: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

// Hook pour s'inscrire à une mission
function useRegisterFanOnMission() {
  const { data, write, isLoading, error } = useContractWrite({
    ...artistConfig,
    functionName: 'registerFanOnMission',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    registerFanOnMission: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

// Hook pour compléter une mission
function useCompleteFanMission() {
  const { data, write, isLoading, error } = useContractWrite({
    ...artistConfig,
    functionName: 'completeFanMission',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    completeFanMission: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

// Hook pour acheter une récompense
function useClaimRewardFan() {
  const { data, write, isLoading, error } = useContractWrite({
    ...artistConfig,
    functionName: 'claimRewardFan',
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimRewardFan: write,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

// Hook pour lire les données
function useArtistData() {
  const { data: artistAddress } = useContractRead({
    ...artistConfig,
    functionName: 'getArtistAddress',
  })

  const { data: missionName } = useContractRead({
    ...artistConfig,
    functionName: 'getMissionName',
    args: [0n],
  })

  const { data: fanStatus } = useContractRead({
    ...artistConfig,
    functionName: 'getStatuFanOnMission',
    args: [0n, '0x...' as `0x${string}`],
  })

  const { data: tokenBalance } = useContractRead({
    ...fanTokenConfig,
    functionName: 'balanceOfEarnedToken',
    args: ['0x...' as `0x${string}`],
  })

  return {
    artistAddress,
    missionName,
    fanStatus,
    tokenBalance: tokenBalance ? formatEther(tokenBalance) : '0',
  }
}
```

### 6. Workflow complet d'exemple avec Wagmi

```typescript
// Composant React avec Wagmi
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'

function ArtistWorkflow() {
  const { address, isConnected } = useAccount()
  
  // Hooks pour les actions
  const { createArtist, isLoading: isCreating } = useCreateArtist()
  const { openMission, isLoading: isOpening } = useOpenMission()
  const { registerFanOnMission, isLoading: isRegistering } = useRegisterFanOnMission()
  const { completeFanMission, isLoading: isCompleting } = useCompleteFanMission()
  const { claimRewardFan, isLoading: isClaiming } = useClaimRewardFan()

  // Workflow complet
  const handleCompleteWorkflow = async () => {
    if (!isConnected || !address) return

    try {
      // 1. Créer un artiste
      await createArtist({
        args: ['Artist Token', 'ART'],
      })

      // 2. Créer une mission
      await openMission({
        args: ['Première mission', 'Description', parseEther('100')],
      })

      // 3. S'inscrire à la mission
      await registerFanOnMission({
        args: [0n, address],
      })

      // 4. Compléter la mission
      await completeFanMission({
        args: [0n, address],
      })

      // 5. Créer une récompense
      await openMission({
        args: ['Récompense', 'Description', parseEther('50')],
      })

      // 6. Acheter la récompense
      await claimRewardFan({
        args: [0n, address],
      })

    } catch (error) {
      console.error('Erreur dans le workflow:', error)
    }
  }

  return (
    <div>
      <button 
        onClick={handleCompleteWorkflow}
        disabled={!isConnected || isCreating || isOpening || isRegistering || isCompleting || isClaiming}
      >
        {isCreating && 'Création artiste...'}
        {isOpening && 'Ouverture mission...'}
        {isRegistering && 'Inscription...'}
        {isCompleting && 'Complétion...'}
        {isClaiming && 'Achat récompense...'}
        {!isCreating && !isOpening && !isRegistering && !isCompleting && !isClaiming && 'Démarrer workflow'}
      </button>
    </div>
  )
}
```

### 7. Gestion des erreurs avec Wagmi

```typescript
// Hook personnalisé pour la gestion d'erreurs
function useContractError() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (error: any) => {
    if (error?.message?.includes('MissionOutOfBand')) {
      setError('ID de mission invalide')
    } else if (error?.message?.includes('You don\'t have enough fan token')) {
      setError('Solde de tokens insuffisant')
    } else if (error?.message?.includes('YouAreNotTheArtist')) {
      setError('Seul l\'artiste peut effectuer cette action')
    } else if (error?.message?.includes('YouCantAchieveForSomeoneElse')) {
      setError('Vous ne pouvez agir que pour vous-même')
    } else {
      setError('Erreur inconnue')
    }
  }

  return { error, handleError, setError }
}

// Composant avec gestion d'erreurs
function ArtistActions() {
  const { address } = useAccount()
  const { error, handleError, setError } = useContractError()
  
  const { openMission, error: openMissionError } = useOpenMission()
  
  // Gérer les erreurs
  useEffect(() => {
    if (openMissionError) {
      handleError(openMissionError)
    }
  }, [openMissionError])

  const handleOpenMission = async () => {
    setError(null)
    try {
      await openMission({
        args: ['Mission', 'Description', parseEther('100')],
      })
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <button onClick={handleOpenMission}>Créer mission</button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
```

### 8. Écoute d'événements avec Wagmi

```typescript
// Hook pour écouter les événements
import { useContractEvent } from 'wagmi'

function useArtistEvents() {
  // Écouter les nouvelles missions
  useContractEvent({
    ...artistConfig,
    eventName: 'MissionOpen',
    listener: (missionId, artist) => {
      console.log(`Nouvelle mission créée: ${missionId} par ${artist}`)
      // Mettre à jour la base de données
    },
  })

  // Écouter les complétions de mission
  useContractEvent({
    ...artistConfig,
    eventName: 'Complete',
    listener: (missionId, fan) => {
      console.log(`Mission ${missionId} complétée par ${fan}`)
      // Mettre à jour la base de données
    },
  })

  // Écouter les achats de récompenses
  useContractEvent({
    ...artistConfig,
    eventName: 'RewardClaim',
    listener: (rewardId, fan) => {
      console.log(`Récompense ${rewardId} achetée par ${fan}`)
      // Mettre à jour la base de données
    },
  })

  // Écouter les transferts de tokens
  useContractEvent({
    ...fanTokenConfig,
    eventName: 'Transfer',
    listener: (from, to, amount) => {
      console.log(`Transfert: ${formatEther(amount)} tokens de ${from} vers ${to}`)
      // Tracer les mouvements de tokens
    },
  })
}
```

## Notes importantes

1. **Permissions strictes** : Seuls les fans peuvent agir pour eux-mêmes
2. **Tokens gagnés vs balance** : 
   - Les missions donnent des tokens dans `balanceOfEarnedToken` ET `balanceOf`
   - Les récompenses coûtent uniquement des tokens "earned" (`balanceOfEarnedToken`)
3. **Répartition des paiements** : 40% brûlé, 60% à l'artiste (calcul : `(price * 100) / 40` et `(price * 100) / 60`)
4. **Statuts cohérents** : Toujours vérifier les statuts avant les actions
5. **Gestion des erreurs** : Toujours gérer les erreurs côté frontend/backend
6. **Sécurité** : Les fonctions `_mint`, `_burn`, `_transfer` et `addToEarned` ne peuvent être appelées que par le contrat Artist
7. **Wagmi** : Utiliser les hooks `useContractRead` et `useContractWrite` pour une meilleure DX
8. **Types** : Utiliser TypeScript avec les types `0x${string}` pour les adresses
9. **Viem** : Utiliser `parseEther` et `formatEther` pour les conversions de tokens 