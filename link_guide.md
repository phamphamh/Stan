# Context du projet.

C'est un projet de Hackaton.
Le projet est une plateforme web3 qui fait le lien entre artiste et fan de k-pop. Les smarts contracts permettent aux artiste de creer, un contract artiste qui va gerer les trasaction on-chain de leur fan. cf : ./chiliz_contract/documentation_smart_contract.md
Le site fonctionne un peu comme un reseau social avec des post d'artiste etc.

# Details technique

Notre solution embarque le systeme de wallet de "privy". Nous utilisons la blockchain chiliz. Le front tourne avec next.js , react et typescript.

# Mission Overview

Ta mission est de faire le lien entre notre front-end situe dans le dossier front-end et l'application web3. 

Nous allons construire une demo simple. Pour cela un contrat artiste a deja etait deploye. Tu trouveras l'addresse dans ./front-end/.env.exemple. 

L'app integrera un seul artiste : " Black Pink ".

La page artiste dois pouvoir publier des missions et des rewards qui apparaitrons au front. L'acces a la page admin se fera par l'intermediaire d'un code

Un profil fan doit pouvoir register et claim au mission publie par l'artiste. 

On ne va uniquement s'interesser a l'integration des fonctionnalite web3.

Le lien entre les deux parties va se faire avec Wagmi, une aide a l'integration est dans la doc smart_contract.

