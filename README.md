# 🎶 Stan

A project developed in **48 hours during the CHILIZ hackathon at the Parc des Princes**
The goal: build a **blockchain for K-pop fans** that rewards their engagement (streams, album purchases, community actions) with **decentralized tokens**.  
These tokens allow **super fans** to unlock **exclusive rewards** offered directly by the artists.

---

## 🚀 Features

- 📊 **Fan engagement tracking**: streams, purchases, community activities.
- 💎 **Token rewards**: every action generates decentralized tokens.
- 🎁 **Exclusive rewards**: tokens can be redeemed for unique artist experiences.
- 🌐 **Next.js web app**: simple and fast fan interface.
- ⛓ **Foundry smart contracts**: transparency and on-chain security.

---

## 🏗 Project Structure

- **`chiliz_contract/`**: smart contracts (built with [Foundry](https://book.getfoundry.sh/)).
- **`frontend/`**: [Next.js](https://nextjs.org/) web application with React hooks and UI components.
- **`script_mission.js`**: script for defining and executing fan missions.

---

## 📦 Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v18+)
- npm or [pnpm](https://pnpm.io/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) for smart contracts
- A [Vercel](https://vercel.com/) account for frontend deployment

---

## ⚡️ Installation

```bash
# Clone the repo
git clone https://github.com/username/k-fanchain.git
cd k-fanchain

# Install frontend dependencies
cd frontend
pnpm install

# Run the dev server
pnpm dev
