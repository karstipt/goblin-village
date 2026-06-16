# 🏰 Goblin Village

> Fantasy Paper-Style Browser RTS | Hosted on Cloudflare Pages

A real-time strategy browser game with Paper Mario aesthetics. Build your village, spawn goblins, gather resources, and battle other players — all without installing anything.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Start worker locally (http://localhost:8787)
cd worker && npx wrangler dev
```

## 📁 Project Structure

```
goblin-village/
├── src/          # Phaser 3 Game (TypeScript)
├── worker/       # Cloudflare Worker Backend
├── assets/       # Sprites, Tilemaps, Audio
├── .github/      # CI/CD Workflows
└── docs/         # Developer Documentation
```

## 📖 Documentation

See the `/docs` folder and project files:

- `01_GDD_Game_Design_Document.md` — Game Design
- `02_Technical_Architecture.md` — Tech Stack & Architecture
- `03_Roadmap.md` — Development Phases
- `04_Step_by_Step_Getting_Started.md` — Getting Started Guide
- `05_Cloudflare_Deployment_Runbook.md` — Deployment Guide

## 🛠 Tech Stack

- **Frontend:** Phaser 3, TypeScript, Vite
- **Backend:** Cloudflare Workers, Durable Objects, KV
- **Hosting:** Cloudflare Pages

## 📦 Current Phase

**Phase 0: Setup & Tooling** ✅

Next: Phase 1 — Core Game Loop

## 🤝 Contributing

1. Branch from `develop`: `git checkout -b feature/your-feature`
2. Commit with conventional commits: `feat(scope): description`
3. Open PR against `develop`

See `06_GitHub_Workflow.md` for full details.
