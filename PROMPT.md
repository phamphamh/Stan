# Intégration Web3 - Connexion Smart Contracts + Frontend

## Contexte du projet
Je développe une application web3 avec une architecture séparée :
- **Smart contracts** : Implémentés dans `@chiliz_contract/` 
- **Frontend** : Développé dans `@frontend/`
- **Documentation** : Disponible dans `@chiliz_contract/documentation.md` et `@CONTEXT.md`

## Stack technique existante
- **Wallet & Auth** : Privy déjà intégré
- **Web3 interactions** : Utilise Wagmi pour les appels de contrats
- **Blockchain** : Mainnet Chiliz

## Contexte spécifique du hackathon
- L'app est actuellement orientée **BlackPink** (pas de fonctionnalité de création de tokens)
- Nous avons déployé un **token test** sur le mainnet Chiliz
- L'objectif est une **démo fonctionnelle** pour le hackathon
- **Version complète** : Un utilisateur peut créer des missions ET participer aux missions
- **Contrat unique** : Nous utilisons seulement `@chiliz_contract/out/Artist.sol/` (pas ArtistFactory)
- **Démo simplifiée** : Missions avec validation automatique pour pouvoir claim facilement

## Objectif principal
Connecter mon frontend aux smart contracts déployés sur le mainnet Chiliz en remplaçant toutes les données mockées par de vraies interactions blockchain. **Je veux un site qui fonctionne**, je testerai les transactions après.

## Étapes demandées

### 1. Analyse du contexte
- Lis attentivement `@CONTEXT.md` pour comprendre l'architecture globale
- Étudie `@chiliz_contract/documentation.md` pour maîtriser l'API des smart contracts
- Identifie dans `@frontend/` toutes les fonctionnalités qui utilisent des données mockées

### 2. Configuration Web3 avec Wagmi
- Configure Wagmi pour fonctionner avec Privy (déjà intégré)
- Ajoute la configuration réseau Chiliz mainnet
- Prépare les hooks Wagmi pour les interactions de contrats
- Configure les ABIs des smart contracts déployés

### 3. Remplacement des mocks - Fonctionnalités spécifiques
- **Création de missions** : Implémente l'appel à `openMission(name, description, reward)` 
- **Interface utilisateur** : Permets aux utilisateurs de choisir les paramètres des missions (nom, description, récompense)
- **Participation aux missions** : Système pour que les utilisateurs puissent participer
- **Claim de récompenses** : Implémente le claim avec validation automatique (pas d'objectifs complexes)
- **Gestion des tokens** : Assure-toi que les tokens claimés arrivent dans le wallet Privy connecté
- **Contrat unique** : Toutes les interactions se font via le contrat Artist.sol déployé (pas ArtistFactory)

### 4. Gestion UX minimale
- Implémente une gestion d'erreurs simple mais fonctionnelle
- Ajoute des feedbacks utilisateur basiques (pending, success, error)
- Assure-toi que l'app reste utilisable même si certaines transactions échouent

### 5. Configuration des adresses de contrats
- Prépare la structure pour recevoir les adresses des contrats déployés
- Documente clairement quelles adresses je devrai fournir

## Format de réponse souhaité
1. **Plan d'intégration** : Liste des modifications nécessaires par ordre de priorité
2. **Code d'implémentation** : Fonctions Wagmi concrètes pour remplacer les mocks
3. **Configuration** : Setup nécessaire (env vars, providers, config Wagmi)
4. **Checklist finale** : Ce que je devrai compléter après (adresses de contrats, etc.)

## Contraintes importantes
- **Utilise Wagmi** avec la configuration Privy existante
- **Pas de tests** - focus sur un site fonctionnel
- **Demo BlackPink** - pas d'implémentation de création de tokens
- **Contrat unique** - Seulement Artist.sol, pas ArtistFactory
- **Missions simplifiées** - Validation automatique pour faciliter la démo
- **Claim fonctionnel** - Les tokens doivent arriver dans le wallet connecté via Privy

## Ce que je fournirai après
- **Adresse du contrat Artist.sol** déployé sur Chiliz mainnet
- **ABI du contrat** si nécessaire
- Toute configuration spécifique nécessaire

## Fonctionnalités attendues
1. **Création de mission** : Interface pour saisir nom, description, récompense + appel à `openMission()`
2. **Liste des missions** : Affichage des missions disponibles
3. **Participation** : Système pour rejoindre une mission
4. **Claim simplifié** : Bouton pour claim la récompense (validation automatique)
5. **Balance wallet** : Affichage des tokens dans le wallet connecté

Commence par analyser mes fichiers de contexte et documentation, puis donne-moi un plan d'intégration prêt à implémenter.