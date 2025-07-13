# Stan Project

## Description
Stan is a project combining a Next.js frontend and Solidity smart contracts on the Chiliz blockchain. It includes features like missions, leaderboard, shop, etc.

## Project Structure
- **chiliz_contract/**: Smart contracts (using Foundry).
- **frontend/**: Next.js web application with React components, hooks, etc.
- **script_mission.js**: Script for missions.

## Prerequisites
- Node.js (v18+)
- npm or pnpm
- Foundry (for contracts)
- Vercel account for deployment

## Installation
1. Clone the repo: `git clone <repo-url>`
2. Install root dependencies: `npm install`
3. For frontend: `cd frontend && npm install`
4. For contracts: `cd chiliz_contract && forge install`

## Development
- Frontend: `cd frontend && npm run dev`
- Contract tests: `cd chiliz_contract && forge test`

## Deployment
- Frontend on Vercel: Push to GitHub, Vercel deploys automatically.
- Contracts: Use scripts in `chiliz_contract/script/`.

## Environment
Configure `.env` in frontend with variables like NEXT_PUBLIC_RPC_URL, etc.

For more info, contact the development team.