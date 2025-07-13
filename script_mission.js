require('dotenv').config({ path: './frontend/.env.local' });
const { ethers } = require('ethers');

// Configuration
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const PRIVATE_KEY = process.env.PROD_PRIVATE_KEY.replace(';', ''); // Supprimer le point-virgule
const CONTRACT_ADDRESS = process.env.ARTIST_CONTRACT_ADDRESS.replace(';', ''); // Supprimer le point-virgule

// ABI du contrat Artist (fonctions nécessaires)
const ARTIST_ABI = [
    "function getMissionName(uint256 nb_mission_) public view returns(string memory)",
    "function getMissionDescription(uint256 nb_mission_) public view returns(string memory)",
    "function getMissionStatus(uint256 nb_mission_) public view returns(uint8)",
    "function getMissionReward(uint256 nb_mission_) public view returns(uint256)"
];

async function getAllMissions() {
    try {
        // Configuration du provider et wallet
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        // Connexion au contrat
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ARTIST_ABI, wallet);
        
        console.log('🎯 Récupération de toutes les missions du contrat...\n');
        
        let missionIndex = 0;
        let foundMissions = [];
        
        // Boucle pour récupérer toutes les missions
        while (true) {
            try {
                const missionName = await contract.getMissionName(missionIndex);
                const missionDescription = await contract.getMissionDescription(missionIndex);
                const missionStatus = await contract.getMissionStatus(missionIndex);
                const missionReward = await contract.getMissionReward(missionIndex);
                
                foundMissions.push({
                    index: missionIndex,
                    name: missionName,
                    description: missionDescription,
                    reward: missionReward.toString(),
                    status: missionStatus.toString()
                });
                
                missionIndex++;
            } catch (error) {
                if (error.message.includes('MissionOutOfBand') || error.code === 'CALL_EXCEPTION') {
                    // Plus de missions à récupérer
                    break;
                } else {
                    console.error(`Erreur pour la mission ${missionIndex}:`, error.message);
                    break;
                }
            }
        }
        
        // Affichage des résultats
        if (foundMissions.length === 0) {
            console.log('ℹ️  Aucune mission trouvée dans ce contrat.');
        } else {
            console.log(`📋 ${foundMissions.length} mission(s) trouvée(s):\n`);
            
            foundMissions.forEach((mission, i) => {
                const isLast = i === foundMissions.length - 1;
                const prefix = isLast ? '└──' : '├──';
                
                console.log(`${prefix} Mission ${mission.index}:`);
                console.log(`${isLast ? '    ' : '│   '}├── Nom: ${mission.name}`);
                console.log(`${isLast ? '    ' : '│   '}├── Description: ${mission.description}`);
                console.log(`${isLast ? '    ' : '│   '}├── Reward: ${mission.reward}`);
                console.log(`${isLast ? '    ' : '│   '}└── Statut: ${mission.status}`);
                if (!isLast) console.log('│');
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération:', error.message);
    }
}

// Exécution du script
getAllMissions();